import { getParkingConfigService } from "@services/parking.service";

export const useGetParkingConfig = () => {
    const fetchParkingConfig = async () => {
        try {
            const configData = await getParkingConfigService();
            return configData;
        } catch (error) {
            console.error("Error obteniendo configuración del parking:", error);
        }
    }
    return { fetchParkingConfig };
}

export default useGetParkingConfig;
