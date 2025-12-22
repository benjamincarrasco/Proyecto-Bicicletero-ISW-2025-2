import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useGetParkingConfig } from '@hooks/parking/useGetParkingConfig';
import { useUpdateParkingConfig } from '@hooks/parking/useUpdateParkingConfig';
import '@styles/parking.css';

export default function Parking() {
    const [parkingConfig, setParkingConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ totalCupos: '', descripcion: '' });
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const { fetchParkingConfig: getParkingConfig } = useGetParkingConfig();
    const { updateParkingConfig } = useUpdateParkingConfig();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getParkingConfig();
                setParkingConfig(data);
                setEditForm({ totalCupos: data.totalCupos, descripcion: data.descripcion || '' });
                setError(null);
            } catch (err) {
                setError('Error al cargar la configuración del parking');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === 'totalCupos') {
            setEditForm({ ...editForm, [name]: value === '' ? '' : parseInt(value) || 0 });
        } else {
            setEditForm({ ...editForm, [name]: value });
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        
        if (!editForm.totalCupos || editForm.totalCupos <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El total de cupos debe ser un número positivo',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (editForm.totalCupos < parkingConfig.cuposOcupados) {
            Swal.fire({
                icon: 'warning',
                title: 'No se puede reducir',
                text: `No puedes reducir a ${editForm.totalCupos} cupos.\nHay ${parkingConfig.cuposOcupados} bicicletas actualmente en uso.`,
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        try {
            setUpdating(true);
            setError(null);
            const updatedConfig = await updateParkingConfig(editForm);
            setParkingConfig(updatedConfig);
            setIsEditing(false);
            setSuccessMessage('Configuración actualizada correctamente');
            setTimeout(() => setSuccessMessage(null), 3000);
            
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Configuración actualizada correctamente',
                confirmButtonText: 'Aceptar'
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Error al actualizar la configuración',
                confirmButtonText: 'Aceptar'
            });
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({ totalCupos: parkingConfig.totalCupos, descripcion: parkingConfig.descripcion || '' });
        setError(null);
    };

    if (loading) return <div className="parking-container">Cargando...</div>;
    if (error) return <div className="parking-container error">{error}</div>;

    return (
        <div className="parking-container">
            <h1>Configuración del Bicicletero</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}
            
            {parkingConfig ? (
                <div className="parking-config">
                    {!isEditing ? (
                        <div className="config-card">
                            <div className="card-header">
                                <h2>Estado del Bicicletero</h2>
                                <button 
                                    className="btn-edit" 
                                    onClick={() => setIsEditing(true)}
                                >
                                    Editar Configuración
                                </button>
                            </div>
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
                    ) : (
                        <div className="config-card edit-mode">
                            <h2>Editar Configuración del Bicicletero</h2>
                            <form onSubmit={handleSaveChanges} className="edit-form">
                                <div className="form-group">
                                    <label htmlFor="totalCupos">
                                        Cupos Totales: <span className="required">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        id="totalCupos"
                                        name="totalCupos"
                                        value={editForm.totalCupos}
                                        onChange={handleEditChange}
                                        min="1"
                                        required
                                    />
                                    <small className="help-text">
                                        Cupos actualmente en uso: {parkingConfig.cuposOcupados}. 
                                        No puedes reducir por debajo de este número.
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripción:</label>
                                    <textarea 
                                        id="descripcion"
                                        name="descripcion"
                                        value={editForm.descripcion}
                                        onChange={handleEditChange}
                                        rows="3"
                                        maxLength="500"
                                    />
                                    <small className="help-text">
                                        {editForm.descripcion.length}/500 caracteres
                                    </small>
                                </div>

                                <div className="form-actions">
                                    <button 
                                        type="submit" 
                                        className="btn-save"
                                        disabled={updating}
                                    >
                                        {updating ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-cancel"
                                        onClick={handleCancel}
                                        disabled={updating}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>

                            <div className="info-box">
                                <h4>Información Actual:</h4>
                                <ul>
                                    <li>Cupos Totales: {parkingConfig.totalCupos}</li>
                                    <li>Cupos Ocupados: {parkingConfig.cuposOcupados}</li>
                                    <li>Cupos Disponibles: {parkingConfig.cuposDisponibles}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>No se encontró configuración del parking</p>
            )}
        </div>
    );
}
