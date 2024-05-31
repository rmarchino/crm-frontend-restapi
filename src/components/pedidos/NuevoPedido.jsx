import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import BuscarProducto from "./BuscarProducto";
import Swal from "sweetalert2";
import FormCantidadProducto from "./FormCantidadProducto";

const NuevoPedido = (props) => {
  //Extraer el ID del cliente
  const { id } = useParams();
  const navigate = useNavigate();

  //state
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState("");
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);


  //Obtener el cliente
  const consultarAPI = async () => {
    const resultado = await clienteAxios.get(`/clientes/${id}`);
    guardarCliente(resultado.data);
  };

  useEffect(() => {

    //Ejecutar función
    consultarAPI();

    //actualizar el total a pagar
    actualizarTotal();

  }, [productos]);

  //Busqueda de producto
  const buscarProducto = async (e) => {
    e.preventDefault();

    //obtener los productos de la búsqueda
    const resultadoBusqueda = await clienteAxios.post(
      `/productos/busqueda/${busqueda}`
    );

    //si no hay resultado alerta
    if (resultadoBusqueda.data[0]) {
      let productoResultado = resultadoBusqueda.data[0];

      //agregar la llave 'producto' copia de id
      productoResultado.producto = resultadoBusqueda.data[0]._id;
      productoResultado.cantidad = 0;

      //ponerlo en el state
      guardarProductos([...productos, productoResultado]);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No hay resulatdos!",
      });
    }
  };

  //almacenar una búsqueda en el state
  const leerDatosBusqueda = (e) => {
    guardarBusqueda(e.target.value);
  };

  //actualizar la cantidad de productos
  const restarProductos = (i) => {
    //copiar el arreglo original
    const todosProductos = [...productos];

    //validar si esta en 0 no puede ir mas alla
    if (todosProductos[i].cantidad === 0) return;

    //decremento
    todosProductos[i].cantidad--;

    //almacenar en el state
    guardarProductos(todosProductos);
  };

  const aumentarProdutos = (i) => {
    //copiar el arreglo
    const todosProductos = [...productos];

    //incremento
    todosProductos[i].cantidad++;

    //almacenar en state
    guardarProductos(todosProductos);
  };

  //Elimina un producto del state
  const eliminarProductoPedido = (id) => {
    const todosProductos = productos.filter(producto => producto.producto !== id);
    guardarProductos(todosProductos);
  }

  //Actualizar el total a pagar
  const actualizarTotal = () => {
    if (productos.length === 0) {
      guardarTotal(0);
      return;
    }

    //calcular el nuevo total
    let nuevoTotal = 0;

    //recorrer todo los productos, sus cantidades y precios
    productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));

    //almacenar total
    guardarTotal(nuevoTotal)
  }

  //almacena el pedido en la bd
  const realizarPedido = async (e) => {
    e.preventDefault();

    //construir el objeto
    const pedido = {
      "cliente": id,
      "pedido": productos,
      "total": total
    }
    
    //almacenar en la bd
    const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

    //leer resultado
    if (resultado.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Correcto",
        text: resultado.data.message,
      })
    }else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Vuelva a intentarlo!",
      });
    }
    //redirecionar
    navigate('/pedidos')

  }

  return (
    <>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>
          Nombre: {cliente.nombre} {cliente.apellido}
        </p>
        <p>Tel: {cliente.telefono}</p>
      </div>

      <BuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        {productos.map((producto, index) => (
          <FormCantidadProducto
            key={producto.producto}
            producto={producto}
            restarProductos={restarProductos}
            aumentarProdutos={aumentarProdutos}
            eliminarProductoPedido={eliminarProductoPedido}
            index={index}
          />
        ))}
      </ul>

      <p className="total">Total a pagar: <span>$ {total}</span></p>

      {
        total > 0 ? (
          <form onSubmit={realizarPedido}>
            <input type="submit" 
              className="btn btn-verde btn-block"
              value={"Realizar pedido"}
            />
          </form>
        ) : (null)
      }
    </>
  );
};

export default NuevoPedido;
