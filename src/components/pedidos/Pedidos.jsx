import React, { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import DetallesPedido from "./DetallesPedido";


const Pedidos = () => {
  const [pedidos, guardarPedidos] = useState([]);
  //obtener los pedidos
  const consultarAPI = async () => {
    const resultado = await clienteAxios.get("/pedidos");
    guardarPedidos(resultado.data);
  };
  useEffect(() => {
    consultarAPI();
  }, []);

  //Elimina un pedido
  const eliminarPedido = (id) => {
    const nuevosPedidos = pedidos.filter((pedido) => pedido.id !== id);
    guardarPedidos(nuevosPedidos);
  };

  return (
    <>
      <h2>Pedidos</h2>

      <ul className="listado-pedidos">
        {pedidos.map(pedido => (
          <DetallesPedido 
            key={pedido._id}
            pedido={pedido}
            eliminarPedido={eliminarPedido}
          />
        ))}
      </ul>
    </>
  );
};

export default Pedidos;
