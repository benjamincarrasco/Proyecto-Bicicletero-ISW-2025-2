import axios from '@services/root.service.js';

export async function getUsers() {
    try {
        const response = await axios.get('/user');
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
}

export async function editUser(userId, userData) { 
    try {
        const response = await axios.put(`/user/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al editar usuario:", error);
    }
}

export async function deleteUser(userId) {
    try {
        const response = await axios.delete(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
    }
}

export async function getProfile() { 
    try {
        const response = await axios.get('/user/profile');
        return response.data;
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        throw error;
    }
}