import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import clienteAxios from "../../config/axios";
import Spinner from "../layout/Spinner";
import Producto from "./Producto";

/**Context */
import { CRMContext } from "../../context/CRMContext";

const Productos = () => {
  const navigate = useNavigate();

  const [productos, guardarProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [auth, guardarAuth] = useContext(CRMContext);

  useEffect(() => {
    if (auth.auth !== "") {
      //consulta API
      const consultarAPI = async () => {
        try {
          const productosConsulta = await clienteAxios.get("/productos", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });

          //colocar el resultado en el state
          guardarProductos(productosConsulta.data);
          setIsLoading(false);

        } catch (error) {
          if ((error.response.status = 500)) {
            navigate("/iniciar-sesion");
          }
        }
      };

      //ejecutar API
      setTimeout(() => {
        consultarAPI();
      }, 3000);

    } else {
      navigate("/iniciar-sesion");
    }
  }, [auth.token]);
  
  // Si el state esta como false
  if (!auth.auth) {
    navigate("/iniciar-sesion");
  }

  //Espinner de carga
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Productos</h2>

      <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Producto
      </Link>

      <ul className="listado-productos">
        {productos.map((producto) => (
          <Producto key={producto._id} producto={producto} />
        ))}
      </ul>
    </>
  );
};

export default Productos;
