import { useEffect, useState } from 'react';
import { useGetBicicletas } from '@hooks/bicicletas/useGetBicicletas';
import '@styles/bicicleta.css';

export default function Bicicletas() {
    const [bicicletas, setBicicletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchBicicletas: getBicicletas } = useGetBicicletas();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getBicicletas();
                setBicicletas(data || []);
                setError(null);
            } catch (err) {
                setError('Error al cargar las bicicletas');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="bicicleta-container">Cargando...</div>;
    if (error) return <div className="bicicleta-container error">{error}</div>;

    return (
        <div className="bicicleta-container">
            <h1>Gestión de Bicicletas</h1>
            <div className="bicicleta-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Número de Serie</th>
                            <th>Propietario (RUT)</th>
                            <th>Estado</th>
                            <th>Cupo ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bicicletas.length > 0 ? (
                            bicicletas.map((bici) => (
                                <tr key={bici.id}>
                                    <td>{bici.id}</td>
                                    <td>{bici.numeroSerie}</td>
                                    <td>{bici.rutPropietario}</td>
                                    <td>
                                        <span className={`status ${bici.estado.toLowerCase()}`}>
                                            {bici.estado}
                                        </span>
                                    </td>
                                    <td>{bici.cupoId}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No hay bicicletas registradas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
