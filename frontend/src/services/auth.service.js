import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export async function registerService(datauser) {
    const response = await axios.post("/auth/register", {
        nombreCompleto: datauser.nombreCompleto,
        email: datauser.email,
        rut: datauser.rut,
        password: datauser.password,
    });
    return response;
}

export async function loginService(datauser) {
    const response = await axios.post('/auth/login', {
        email: datauser.email,
        password: datauser.password
    });

    const { status, data } = response;
    const token = data?.data?.token || data?.token;
    
    if (status === 200 && token) {
        const decodedToken = jwtDecode(token);
        const { nombreCompleto, email, rut, rol } = decodedToken;
        const userData = { nombreCompleto, email, rut, role: rol };
        
        sessionStorage.setItem('usuario', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        cookies.set('jwt', token, { path: '/' });
    }
    return response;
}

export async function logout() {
    await axios.post('/auth/logout');
    sessionStorage.removeItem('usuario');
    cookies.remove('jwt');
    cookies.remove('jwt-auth');
}
