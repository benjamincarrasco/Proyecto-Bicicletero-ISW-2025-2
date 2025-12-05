import { useState } from 'react';
import { buscarBicicletaService } from '@services/bicicleta.service';
import '@styles/bicicleta.css';

export default function BicicletasGuardia() {
    const [searchType, setSearchType] = useState('rut');
    const [searchValue, setSearchValue] = useState('');
    const [bicicletas, setBicicletas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            setError('Por favor ingresa un valor para buscar');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const query = searchType === 'rut' 
                ? { rut: searchValue }
                : { cupoId: searchValue };
            
            const data = await buscarBicicletaService(query);
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
                        <option value="cupoId">ID del Cupo</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Valor:</label>
                    <input 
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={searchType === 'rut' ? 'Ej: 12.345.678-9' : 'Ej: 5'}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {searched && (
                <>
                    {loading && <div>Cargando...</div>}
                    {!loading && bicicletas.length > 0 && (
                        <div className="bicicleta-results">
                            {bicicletas.map((bicicleta) => (
                                <div key={bicicleta.id} className="bicicleta-card">
                                    <h3>Bicicleta #{bicicleta.id}</h3>
                                    <p><strong>Número de Serie:</strong> {bicicleta.numeroSerie}</p>
                                    <p><strong>Propietario:</strong> {bicicleta.rutPropietario}</p>
                                    <p><strong>Cupo ID:</strong> {bicicleta.cupoId}</p>
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
                    {!loading && bicicletas.length === 0 && (
                        <div>No se encontraron bicicletas</div>
                    )}
                </>
            )}
        </div>
    );
}
