import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import Spinner from "../layout/Spinner";
import { useNavigate, useParams } from "react-router-dom";

const EditarProducto = (props) => {
  //Obtener el ID del producto
  const navigate = useNavigate();
  const { id } = useParams();

  //producto = state, y función para actualizar
  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
    imagen: "",
  });

  //archivo = state, guardarArchivo = setState
  const [archivo, guardarArchivo] = useState("");

  //consultar API para traer el producto y editar
  const consultarAPI = async () => {
    const productoConsulta = await clienteAxios.get(`/productos/${id}`);
    guardarProducto(productoConsulta.data);
  };

  useEffect(() => {
    consultarAPI();
  }, []);

  //Edita un producto en la bd
  const editarProducto = async (e) => {
    e.preventDefault();

    //crear un formdata
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);

    //almacenar en la bd
    try {
      const res = await clienteAxios.put(`/productos/${id}`, formData, {
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
      [e.target.name]: e.target.value,
    });
  };

  //coloca la imagen en el state
  const leerArchino = (e) => {
    guardarArchivo(e.target.files[0]);
  };

  //extraer los valores del state
  const { nombre, precio, imagen } = producto;
  if (!nombre) {
    return <Spinner />;
  }


  return (
    <>
      <h2>Editar Producto</h2>

      <form onSubmit={editarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
            defaultValue={nombre}
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
            defaultValue={precio}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {imagen ? (
            <img src={`http://localhost:9000/${imagen}`} alt={imagen}  width={200}/> 
          ) : null}
          <input 
            type="file"
            name="imagen"
            onChange={leerArchino}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Editar Producto"
          />
        </div>
      </form>
    </>
  );
};

export default EditarProducto;
