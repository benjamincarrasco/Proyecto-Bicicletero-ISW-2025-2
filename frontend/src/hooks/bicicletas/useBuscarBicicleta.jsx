import { buscarBicicletaService } from "@services/bicicleta.service";

export const useBuscarBicicleta = () => {
    const buscar = async (query) => {
        try {
            const resultados = await buscarBicicletaService(query);
            return resultados;
        } catch (error) {
            console.error("Error buscando bicicleta:", error);
        }
    }
    return { buscar };
}

export default useBuscarBicicleta;
