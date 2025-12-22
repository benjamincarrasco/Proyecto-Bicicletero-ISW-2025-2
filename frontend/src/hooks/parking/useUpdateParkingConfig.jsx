import { updateParkingConfigService } from "@services/parking.service";

export const useUpdateParkingConfig = () => {
    const updateParkingConfig = async (configData) => {
        try {
            const response = await updateParkingConfigService(configData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar la configuración');
        }
    };

    return { updateParkingConfig };
};

export default useUpdateParkingConfig;
