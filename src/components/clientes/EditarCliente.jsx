import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";

//Función para guardar el state
const EditarCliente = (props) => {

  const navigate = useNavigate();

  //Obtener el ID
  const { id } = useParams();

  const [cliente, datosCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });

  //Query a la api
  const consultarApi = async () => {
    const clientesConsulta = await clienteAxios.get(`/clientes/${id}`);

    //colocar en el state
    datosCliente(clientesConsulta.data);
  };

  //useEffect, cuando el componente carga
  useEffect(() => {
    consultarApi();
  }, []);

  // leer los datos del formulario
  const actualizarState = (e) => {
    //Almacenar lo que el usuario escribe en el state
    datosCliente({
      //obtener copia del stae actual
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  // Actualizar el cliente
  const actualizarCliente = (e) => {
    e.preventDefault();

    //envía petición por axios
    clienteAxios
      .put(`/clientes/${cliente._id}`, cliente)
      .then((res) => {
        
        Swal.fire("Correcto", "Se actualizó correctamente", "success");
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage =
            error.response.data.error ||
            "Hubo un error al actualizar el cliente";

          Swal.fire({
            type: "error",
            title: "Error",
            text: errorMessage,
          });
        } else if (error.request) {
          Swal.fire({
            type: "error",
            title: "Error",
            text: "No se recibió respuesta del servidor",
          });
        } else {
          Swal.fire({
            type: "error",
            title: "Error",
            text: "Error al configurar la solicitud",
          });
        }
      });
  };

  //Validar el formulario
  const validarCliente = () => {
    const { nombre, apellido, empresa, email, telefono } = cliente;

    //Revisar que las propiedades del state tengan contenido
    let valido =
      !nombre.length ||
      !apellido.length ||
      !email.length ||
      !empresa.length ||
      !telefono.length;

    return valido;
  };

  return (
    <>
      <h2>Editar Cliente</h2>
      <form onSubmit={actualizarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            value={cliente.nombre}
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            value={cliente.apellido}
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            value={cliente.empresa}
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            value={cliente.email}
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            value={cliente.telefono}
            onChange={actualizarState}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar cambios"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
};

export default EditarCliente;
