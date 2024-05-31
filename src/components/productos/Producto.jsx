import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const Producto = ({ producto }) => {
  const { _id, imagen, nombre, precio } = producto;

  //Elimina un producto
  const eliminarProducto = (idProducto) => {
    Swal.fire({
      title: "¿Estás segruo?",
      text: "Un producto eliminado no se puede recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        clienteAxios.delete(`/productos/${idProducto}`).then((res) => {
          Swal.fire("Eliminado", res.data.message, "success");
        });
      }
    });
  };

  return (
    <li className="producto">
      <div className="info-producto">
        <p className="nombre">{nombre}</p>
        <p className="precio">$ {precio}</p>
        {imagen ? <img src={`http://localhost:9000/${imagen}`} /> : null}
      </div>
      <div className="acciones">
        <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Producto
        </Link>

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarProducto(_id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Cliente
        </button>
      </div>
    </li>
  );
};

export default Producto;
