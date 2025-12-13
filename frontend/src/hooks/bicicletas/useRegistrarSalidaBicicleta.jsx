import { registrarSalidaBicicletaService } from "@services/bicicleta.service";

export const useRegistrarSalidaBicicleta = () => {
    const registrarSalida = async (datos) => {
        try {
            const response = await registrarSalidaBicicletaService(datos);
            return response;
        } catch (error) {
            console.error("Error registrando salida de bicicleta:", error);
            throw error;
        }
    }
    return { registrarSalida };
}

export default useRegistrarSalidaBicicleta;
