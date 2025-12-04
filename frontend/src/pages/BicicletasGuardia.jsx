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
                        <option value="id">ID del Cupo</option>
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
                        <div className="bicicleta-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Número de Serie</th>
                                        <th>Propietario (RUT)</th>
                                        <th>Cupo ID</th>
                                        <th>Estado</th>
                                        <th>Fecha de Entrada</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bicicletas.map((bicicleta) => (
                                        <tr key={bicicleta.id}>
                                            <td>{bicicleta.numeroSerie}</td>
                                            <td>{bicicleta.rutPropietario}</td>
                                            <td>{bicicleta.cupoId}</td>
                                            <td>{bicicleta.estado}</td>
                                            <td>{new Date(bicicleta.fechaEntrada).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
