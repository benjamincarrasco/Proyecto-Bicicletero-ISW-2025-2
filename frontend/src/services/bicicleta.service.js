import axios from '@services/root.service.js';

export async function buscarBicicletaService(query) {
    const response = await axios.get('/bicis/buscar', { params: query });
    return response.data.data;
}

export async function registerBicycleService(bicycleData) {
    const response = await axios.post('/bicis/registrar', bicycleData);
    return response.data.data;
}

export async function obtenerBicicletasService() {
    const response = await axios.get('/bicis');
    return response.data.data;
}

export async function actualizarBicicletaService(bicycleId, bicycleData) {
    const response = await axios.put(`/bicis/${bicycleId}`, bicycleData);
    return response.data.data;
}

export async function eliminarBicicletaService(bicycleId) {
    const response = await axios.delete(`/bicis/${bicycleId}`);
    return response.data.data;
}
