import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";

/**Context */
import { CRMContext } from "../../context/CRMContext";

const NuevoProducto = () => {
  
  const navigate = useNavigate();
  const [auth, guardarAuth] = useContext(CRMContext);

  const [producto, guardarProducto] = useState({
    nombre: '',
    precio: ''
  });

  const [archivo, guardarArchivo] = useState('');

   //almacena el nuevo producto en la bd
   const agregarProducto = async (e) => {
    e.preventDefault();

    //crear un formdata
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);

    //almacenar en la bd
    try {
      const res = await clienteAxios.post('/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      //lanzar una alerta
      if (res.status === 200) {
        Swal.fire(
          'Agregado correctamente',
          res.data.message,
          'success'
        );
      }

      //redireccionar
      navigate('/productos');
      
    } catch (error) {
      Swal.fire({
        type: 'error',
        title: 'Hubo un error',
        text: 'Vuelva a intentarlo'
      })
    }
   }

  //leer los datos del formulario
  const leerInformacionProducto = (e) => {
    guardarProducto({
      //obtener copia del state y agregar nuevo
      ...producto,
      [e.target.name] : e.target.value
    })
  }

  //coloca la imagen en el state
  const leerArchino = (e) => {
    guardarArchivo(e.target.files[0]);
  }

  // verificar si el usuario está autenticado o no ?
  if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
    navigate("/iniciar-sesion");
  }

  return (
    <>
      <h2>Nuevo Producto</h2>

      <form onSubmit={agregarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input 
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.00"
            step="0.01"
            placeholder="Precio"
            onChange={leerInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          <input 
            type="file"
            name="imagen"
            onChange={leerArchino}
          />
        </div>

        <div className="enviar">
          <input type="submit" className="btn btn-azul" value="Agregar Producto" />
        </div>
      </form>
    </>
  );
};

export default NuevoProducto;
