import axios from '@services/root.service.js';

export async function obtenerDashboardService() {
    const response = await axios.get('/dashboard');
    return response.data.data;
}
