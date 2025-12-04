import axios from '@services/root.service.js';

export async function createReservaService(reservaData) {
    const response = await axios.post('/reservas', reservaData);
    return response.data.data;
}

export async function getReservasService() {
    const response = await axios.get('/reservas');
    return response.data.data;
}

export async function getReservaByIdService(reservaId) {
    const response = await axios.get(`/reservas/${reservaId}`);
    return response.data.data;
}

export async function updateReservaService(reservaId, reservaData) {
    const response = await axios.put(`/reservas/${reservaId}`, reservaData);
    return response.data.data;
}

export async function deleteReservaService(reservaId) {
    const response = await axios.delete(`/reservas/${reservaId}`);
    return response.data.data;
}
