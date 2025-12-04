import { useEffect, useState } from 'react';
import { getReservasService } from '@services/reserva.service';
import '@styles/reservas.css';

export default function Reservas() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                setLoading(true);
                const data = await getReservasService();
                setReservas(data || []);
                setError(null);
            } catch (err) {
                setError('Error al cargar las reservas');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, []);

    if (loading) return <div className="reservas-container">Cargando...</div>;
    if (error) return <div className="reservas-container error">{error}</div>;

    return (
        <div className="reservas-container">
            <h1>Gestión de Reservas</h1>
            <div className="reservas-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario ID</th>
                            <th>Fecha</th>
                            <th>Bloque Horario</th>
                            <th>Espacio ID</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.length > 0 ? (
                            reservas.map((reserva) => (
                                <tr key={reserva.id}>
                                    <td>{reserva.id}</td>
                                    <td>{reserva.userId}</td>
                                    <td>{new Date(reserva.fecha).toLocaleDateString()}</td>
                                    <td>{reserva.bloqueHorario}</td>
                                    <td>{reserva.espacioId}</td>
                                    <td>
                                        <span className={`status ${reserva.estado.toLowerCase()}`}>
                                            {reserva.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No hay reservas registradas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
