import { registrarEntradaBicicletaService } from "@services/bicicleta.service";

export const useRegistrarEntradaBicicleta = () => {
    const registrarEntrada = async (datos) => {
        try {
            console.log("Datos a enviar:", datos);
            const response = await registrarEntradaBicicletaService(datos);
            return response;
        } catch (error) {
            console.error("Error registrando entrada de bicicleta:", error.response?.data || error);
            throw error;
        }
    }
    return { registrarEntrada };
}

export default useRegistrarEntradaBicicleta;
