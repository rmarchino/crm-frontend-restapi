import React, { useContext, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import Cliente from "./Cliente";
import Spinner from "../layout/Spinner";

import { Link, useNavigate } from "react-router-dom";

/**Imortar el Context */
import { CRMContext } from "../../context/CRMContext";

const Clientes = () => {
  const navigate = useNavigate();

  const [clientes, guardarClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  useEffect(() => {
    if (auth.token !== "") {
      //Query a las API
      const consultarApi = async () => {
        try {
          const clientesConsulta = await clienteAxios.get("/clientes", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });

          //colocar el resultado en el state
          guardarClientes(clientesConsulta.data);
          setIsLoading(false);

        } catch (error) {
          if ((error.response.status = 500)) {
            navigate("/iniciar-sesion");
          }
        }
      };
      setTimeout(() => {
        consultarApi();
      }, 3000);

    } else {
      navigate("/iniciar-sesion");
    }
  }, [auth.token]);

  // Si el state esta como false
  if(!auth.auth) {
    navigate("/iniciar-sesion");
  }

  //Espinner de carga
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Clientes</h2>
      <Link to={"clientes/nuevo"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          <Cliente key={cliente._id} cliente={cliente} />
        ))}
      </ul>
    </>
  );
};

export default Clientes;
