import axios from "axios";

const clienteAxios = axios.create({
    baseURL: 'http://localhost:9000'
});

export default clienteAxios;