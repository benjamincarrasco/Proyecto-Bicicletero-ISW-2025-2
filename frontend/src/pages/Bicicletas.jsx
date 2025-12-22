import { useEffect, useState } from 'react';
import { useGetBicicletas } from '@hooks/bicicletas/useGetBicicletas';
import { useAuth } from '@context/AuthContext';
import '@styles/bicicleta.css';

export default function Bicicletas() {
    const [bicicletas, setBicicletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchBicicletas: getBicicletas } = useGetBicicletas();
    const { user } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === 'administrador';

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
                            {isAdmin && <th>ID</th>}
                            <th>Número de Serie</th>
                            <th>Propietario (RUT)</th>
                            <th>Cupo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bicicletas.length > 0 ? (
                            bicicletas.map((bici) => (
                                <tr key={bici.id || bici.numeroSerie}>
                                    {isAdmin && <td>{bici.id}</td>}
                                    <td>{bici.numeroSerie}</td>
                                    <td>{bici.rutPropietario}</td>
                                    <td>{bici.cupoId}</td>
                                    <td>
                                        <span className={`status ${bici.estado.toLowerCase()}`}>
                                            {bici.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? "5" : "4"}>No hay bicicletas registradas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
