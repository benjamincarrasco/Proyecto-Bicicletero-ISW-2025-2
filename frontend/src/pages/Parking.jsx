import { useEffect, useState } from 'react';
import { useGetParkingConfig } from '@hooks/parking/useGetParkingConfig';
import '@styles/parking.css';

export default function Parking() {
    const [parkingConfig, setParkingConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchParkingConfig: getParkingConfig } = useGetParkingConfig();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getParkingConfig();
                setParkingConfig(data);
                setError(null);
            } catch (err) {
                setError('Error al cargar la configuración del parking');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    },[]);

    if (loading) return <div className="parking-container">Cargando...</div>;
    if (error) return <div className="parking-container error">{error}</div>;

    return (
        <div className="parking-container">
            <h1>Configuración del Bicicletero</h1>
            {parkingConfig ? (
                <div className="parking-config">
                    <div className="config-card">
                        <h2>Estado del Bicicletero</h2>
                        <div className="config-details">
                            <div className="config-item">
                                <label>Descripción:</label>
                                <p>{parkingConfig.descripcion}</p>
                            </div>
                            <div className="config-item">
                                <label>Cupos Totales:</label>
                                <p>{parkingConfig.totalCupos}</p>
                            </div>
                            <div className="config-item">
                                <label>Cupos Ocupados:</label>
                                <p>{parkingConfig.cuposOcupados}</p>
                            </div>
                            <div className="config-item">
                                <label>Cupos Disponibles:</label>
                                <p className="available">{parkingConfig.cuposDisponibles}</p>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{
                                        width: `${(parkingConfig.cuposOcupados / parkingConfig.totalCupos) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No se encontró configuración del parking</p>
            )}
        </div>
    );
}
