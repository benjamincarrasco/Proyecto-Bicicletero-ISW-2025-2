import { useState } from 'react';
import { useBuscarBicicleta } from '@hooks/bicicletas/useBuscarBicicleta';
import { useAuth } from '@context/AuthContext';
import '@styles/bicicleta.css';

export default function BicicletasGuardia() {
    const [searchType, setSearchType] = useState('rut');
    const [searchValue, setSearchValue] = useState('');
    const [bicicletas, setBicicletas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const { buscar } = useBuscarBicicleta();
    const { user } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === 'administrador';

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            setError('Por favor ingresa un valor para buscar');
            return;
        }

        await performSearch();
    };

    const performSearch = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let query = {};
            if (searchType === 'rut') {
                query = { rut: searchValue };
            } else if (searchType === 'cupoId') {
                query = { cupoId: searchValue };
            }
            
            const data = await buscar(query);
            setBicicletas(data || []);
            setSearched(true);
        } catch {
            setError('No se encontraron resultados');
            setBicicletas([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bicicleta-container">
            <h1>Búsqueda de Bicicletas</h1>
            
            <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                    <label>Buscar por:</label>
                    <select 
                        value={searchType} 
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="rut">RUT del Propietario</option>
                        <option value="cupoId">Número de Cupo</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Valor:</label>
                    <input 
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={searchType === 'rut' ? 'Ej: 12.345.678-9' : 'Ej: 1'}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>

                {searched && (
                    <button 
                        type="button" 
                        onClick={performSearch} 
                        disabled={loading}
                        style={{ marginLeft: '10px' }}
                    >
                        🔄 Actualizar
                    </button>
                )}
            </form>

            {error && <div className="error-message">{error}</div>}

            {searched && (
                <div className="search-results-wrapper">
                    {loading && <div>Cargando...</div>}
                    {!loading && (
                        <>
                            {searchType === 'cupoId' && bicicletas.bicicletas ? (
                                // Búsqueda por cupoId - mostrar bicicleta actual + historial del cupo
                                <>
                                    {bicicletas.bicicletas.length > 0 && (
                                        <div className="bicicleta-results">
                                            {bicicletas.bicicletas.map((bicicleta) => (
                                                <div key={bicicleta.numeroSerie} className="bicicleta-card">
                                                    {isAdmin && <h3>Bicicleta #{bicicleta.id}</h3>}
                                                    <p><strong>Número de Serie:</strong> {bicicleta.numeroSerie}</p>
                                                    <p><strong>Propietario:</strong> {bicicleta.rutPropietario}</p>
                                                    <p><strong>Cupo:</strong> {bicicleta.cupoId}</p>
                                                    <p><strong>Estado:</strong> {bicicleta.estado}</p>
                                                    
                                                    {bicicleta.jornadas && bicicleta.jornadas.length > 0 && (
                                                        <div className="historial">
                                                            <h4>Historial de Entradas y Salidas</h4>
                                                            <table className="historial-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Fecha Entrada</th>
                                                                        <th>Fecha Salida</th>
                                                                        <th>Estado</th>
                                                                        <th>Documento</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {bicicleta.jornadas.map((jornada) => (
                                                                        <tr key={jornada.id}>
                                                                            <td>{new Date(jornada.fechaIngreso).toLocaleString('es-CL')}</td>
                                                                            <td>{jornada.fechaSalida ? new Date(jornada.fechaSalida).toLocaleString('es-CL') : 'N/A'}</td>
                                                                            <td>{jornada.estado}</td>
                                                                            <td>{jornada.tipoDocumento || 'N/A'}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Historial completo del cupo */}
                                    {bicicletas.historialdCupo && bicicletas.historialdCupo.length > 0 && (
                                        <div className="historial-cupo">
                                            <h4>Historial Completo del Cupo</h4>
                                            <table className="historial-table">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha Entrada</th>
                                                        <th>Fecha Salida</th>
                                                        <th>Estudiante</th>
                                                        <th>RUT</th>
                                                        <th>Tipo Documento</th>
                                                        <th>Estado</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bicicletas.historialdCupo.map((jornada) => (
                                                        <tr key={jornada.id}>
                                                            <td>{new Date(jornada.fechaIngreso).toLocaleString('es-CL')}</td>
                                                            <td>{jornada.fechaSalida ? new Date(jornada.fechaSalida).toLocaleString('es-CL') : 'N/A'}</td>
                                                            <td>{jornada.nombreEstudiante}</td>
                                                            <td>{jornada.rutEstudiante}</td>
                                                            <td>{jornada.tipoDocumento || 'N/A'}</td>
                                                            <td>{jornada.estado}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Búsqueda por RUT o ID - mostrar como antes
                                <div className="bicicleta-results">
                                    {Array.isArray(bicicletas) && bicicletas.length > 0 ? (
                                        bicicletas.map((bicicleta) => (
                                            <div key={bicicleta.numeroSerie} className="bicicleta-card">
                                                {isAdmin && <h3>Bicicleta #{bicicleta.id}</h3>}
                                                <p><strong>Número de Serie:</strong> {bicicleta.numeroSerie}</p>
                                                <p><strong>Propietario:</strong> {bicicleta.rutPropietario}</p>
                                                <p><strong>Cupo:</strong> {bicicleta.cupoId}</p>
                                                <p><strong>Estado:</strong> {bicicleta.estado}</p>
                                                
                                                {bicicleta.jornadas && bicicleta.jornadas.length > 0 && (
                                                    <div className="historial">
                                                        <h4>Historial de Entradas y Salidas</h4>
                                                        <table className="historial-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Fecha Entrada</th>
                                                                    <th>Fecha Salida</th>
                                                                    <th>Estado</th>
                                                                    <th>Documento</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {bicicleta.jornadas.map((jornada) => (
                                                                    <tr key={jornada.id}>
                                                                        <td>{new Date(jornada.fechaIngreso).toLocaleString('es-CL')}</td>
                                                                        <td>{jornada.fechaSalida ? new Date(jornada.fechaSalida).toLocaleString('es-CL') : 'N/A'}</td>
                                                                        <td>{jornada.estado}</td>
                                                                        <td>{jornada.tipoDocumento || 'N/A'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div>No se encontraron bicicletas</div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
