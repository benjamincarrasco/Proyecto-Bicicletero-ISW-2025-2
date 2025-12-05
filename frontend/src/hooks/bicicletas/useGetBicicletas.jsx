import { obtenerBicicletasService } from "@services/bicicleta.service";

export const useGetBicicletas = () => {
    const fetchBicicletas = async () => {
        try {
            const bicicletasData = await obtenerBicicletasService();
            return bicicletasData;
        } catch (error) {
            console.error("Error obteniendo bicicletas:", error);
        }
    }
    return { fetchBicicletas };
}

export default useGetBicicletas;
