import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";

/**Context */
import {CRMContext} from '../../context/CRMContext';

//Función para guardar el state
const NuevoCliente = () => {
  const navigate = useNavigate();
  const [auth, guardarAuth] = useContext(CRMContext);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });

  // leer los datos del formulario
  const handleChange = (e) => {
    //Almacenar lo que el usuario escribe en el state
    setFormData({
      //obtener copia del stae actual
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //Añade en el REST API un nuevo cliente
  const handleSubmit = (e) => {
    e.preventDefault();

    // enviar petición
    clienteAxios
      .post("/clientes", formData)
      .then((res) => {
        Swal.fire("Se agregó el cliente", res.data.message, "success");

        //Redireccionar al usuario
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.error.message;
          Swal.fire({
            type: "error",
            title: "Hubo un error",
            text: errorMessage,
          });
        } else if(error.request) {
          console.error("No se recibió respuesta del servidor.");
        } else {
          console.error("Error al configurar la solicitud:", error.message);
        }
      });
  };

  //Validar el formulario
  const validarCliente = () => {
    const { nombre, apellido, empresa, email, telefono } = formData;

    //Revisar que las propiedades del state tengan contenido
    let valido =
      !nombre.length ||
      !apellido.length ||
      !email.length ||
      !empresa.length ||
      !telefono.length;

      //true o false
    return valido;
  };

  // verificar si el usuario está autenticado o no ?
  if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
    navigate("/iniciar-sesion");
  }

  return (
    <>
      <h2>NuevoCliente</h2>
      <form onSubmit={handleSubmit}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
};

export default NuevoCliente;
