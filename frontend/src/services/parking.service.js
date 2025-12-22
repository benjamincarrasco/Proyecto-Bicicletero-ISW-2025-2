import axios from '@services/root.service.js';

export async function getParkingConfigService() {
    const response = await axios.get('/parking/config');
    return response.data.data;
}

export async function updateParkingConfigService(configData) {
    const response = await axios.patch('/parking/config', configData);
    return response.data.data;
}
