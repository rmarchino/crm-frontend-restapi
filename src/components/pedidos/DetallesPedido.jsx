import React from "react";

const DetallesPedido = ({ pedido, eliminarPedido }) => {
  const { cliente } = pedido;
  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: {cliente._id}</p>
        <p className="nombre">
          Cliente: {cliente.nombre} {cliente.apellido}
        </p>

        <div className="articulos-pedido">
          <p className="productos">Artículos Pedido: </p>
          <ul>
            {pedido.pedido.map((articulo) => (
              <li key={pedido._id + articulo.producto._id}>
                <p>{articulo.producto.nombre}</p>
                <p>Precio: ${articulo.producto.precio}</p>
                <p>Cantidad: {articulo.cantidad}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="total">Total: ${pedido.total} </p>
      </div>
      <div className="acciones">

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarPedido(pedido.id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Pedido
        </button>
      </div>
    </li>
  );
};

export default DetallesPedido;
