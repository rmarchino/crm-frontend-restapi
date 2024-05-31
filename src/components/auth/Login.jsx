import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";

/**Context */
import { CRMContext } from "../../context/CRMContext";



const Login = () => {
  
    //Auth y token
    const [ auth, guardarAuth ] = useContext(CRMContext);

    //Ruta
    const navigate = useNavigate();

    //state con los datos del formulario
    const [credenciales, guardarCredenciales] = useState({});

    //Iniciar sesión en el servidor
    const iniciarSesion = async (e) => {
        e.preventDefault();

        //authenticar al usuario

        try {

            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);
            
            //Extraer el TOKEN y colocarlo en localstorage
            const {token} = respuesta.data;
            localStorage.setItem('token', token);

            //colocarlo en el state
            guardarAuth({
              token,
              auth: true
            })

            //alerta
            Swal.fire(
                'Login Correcto',
                'Has iniciado Sesión',
                'success'
            )
            //redireccionar
            navigate('/');

            
        } catch (error) {
            
            if (error.response) {
              Swal.fire({
                  type: 'error',
                  title: 'Hubo un error',
                  text: error.response.data.message
              })
            } else {
              Swal.fire({
                  type: 'error',
                  title: 'Hubo un error',
                  text: 'Hubo un error'
              })
            }
        }
    }

    //Almacenar en state lo que el usuario escribe
    const leeDatos  = (e) => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        });
    }

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>

      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email para iniciar sesión"
              required
              onChange={leeDatos}
            />
          </div>
          <div className="campo">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password para iniciar sesión"
              required
              onChange={leeDatos}
            />
          </div>
          <input type="submit" value={"Iniciar Sesión"} className="btn btn-verde btn-block" />
        </form>
      </div>
    </div>
  );
};

export default Login;
