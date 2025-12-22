import { useState } from 'react';
import useRegistrarEntradaBicicleta from '@hooks/bicicletas/useRegistrarEntradaBicicleta';
import useRegistrarSalidaBicicleta from '@hooks/bicicletas/useRegistrarSalidaBicicleta';
import '@styles/bicicleta.css';

// Función para limpiar RUT (quitar puntos)
const limpiarRut = (rut) => {
    return rut.replace(/\./g, '');
};

export default function RegistroEntradaSalida() {
    const [tipoRegistro, setTipoRegistro] = useState('entrada'); // 'entrada' o 'salida'
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    
    const { registrarEntrada } = useRegistrarEntradaBicicleta();
    const { registrarSalida } = useRegistrarSalidaBicicleta();

    // Formulario de Entrada
    const [formEntrada, setFormEntrada] = useState({
        marca: '',
        modelo: '',
        color: '',
        numeroSerie: '',
        rutPropietario: '',
        nombrePropietario: '',
        emailPropietario: '',
        cupoId: ''
    });

    // Formulario de Salida
    const [formSalida, setFormSalida] = useState({
        bicicletaId: '',
        rutEstudiante: '',
        tipoDocumento: '',
        observaciones: ''
    });

    const handleChangeEntrada = (e) => {
        const { name, value } = e.target;
        setFormEntrada(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeSalida = (e) => {
        const { name, value } = e.target;
        setFormSalida(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitEntrada = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMensaje(null);

        try {
            const datosEntrada = {
                marca: formEntrada.marca,
                modelo: formEntrada.modelo,
                color: formEntrada.color,
                numeroSerie: formEntrada.numeroSerie,
                rutPropietario: limpiarRut(formEntrada.rutPropietario),
                nombrePropietario: formEntrada.nombrePropietario,
                emailPropietario: formEntrada.emailPropietario
            };

            // Agregar cupoId solo si tiene valor
            if (formEntrada.cupoId) {
                datosEntrada.cupoId = parseInt(formEntrada.cupoId);
            }

            const resultado = await registrarEntrada(datosEntrada);
            setMensaje(`✓ Entrada registrada exitosamente. ID: ${resultado.id}`);
            
            // Limpiar formulario
            setFormEntrada({
                marca: '',
                modelo: '',
                color: '',
                numeroSerie: '',
                rutPropietario: '',
                nombrePropietario: '',
                emailPropietario: '',
                cupoId: ''
            });
        } catch (err) {
            setError(`Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitSalida = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMensaje(null);

        try {
            const datosSalida = {
                bicicletaId: parseInt(formSalida.bicicletaId),
                rutEstudiante: limpiarRut(formSalida.rutEstudiante),
                tipoDocumento: formSalida.tipoDocumento,
                observaciones: formSalida.observaciones || undefined
            };

            await registrarSalida(datosSalida);
            setMensaje(`✓ Salida registrada exitosamente`);
            
            // Limpiar formulario
            setFormSalida({
                bicicletaId: '',
                rutEstudiante: '',
                tipoDocumento: '',
                observaciones: ''
            });
        } catch (err) {
            setError(`Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bicicleta-container">
            <h1>Registro de Entrada y Salida de Bicicletas</h1>
            
            <div className="registro-tabs">
                <button 
                    className={`tab-btn ${tipoRegistro === 'entrada' ? 'active' : ''}`}
                    onClick={() => setTipoRegistro('entrada')}
                >
                    📥 Registrar Entrada
                </button>
                <button 
                    className={`tab-btn ${tipoRegistro === 'salida' ? 'active' : ''}`}
                    onClick={() => setTipoRegistro('salida')}
                >
                    📤 Registrar Salida
                </button>
            </div>

            {mensaje && <div className="alert success-message">{mensaje}</div>}
            {error && <div className="alert error-message">{error}</div>}

            {tipoRegistro === 'entrada' ? (
                <form onSubmit={handleSubmitEntrada} className="registro-form">
                    <h2>Entrada de Bicicleta</h2>
                    
                    <div className="form-group">
                        <label htmlFor="marca">Marca *</label>
                        <input
                            type="text"
                            id="marca"
                            name="marca"
                            value={formEntrada.marca}
                            onChange={handleChangeEntrada}
                            required
                            placeholder="Ej: Trek, Specialized, etc."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="modelo">Modelo *</label>
                        <input
                            type="text"
                            id="modelo"
                            name="modelo"
                            value={formEntrada.modelo}
                            onChange={handleChangeEntrada}
                            required
                            placeholder="Ej: FX3, Allez, etc."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="color">Color *</label>
                        <input
                            type="text"
                            id="color"
                            name="color"
                            value={formEntrada.color}
                            onChange={handleChangeEntrada}
                            required
                            placeholder="Ej: Rojo, Azul, Negro"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numeroSerie">Número de Serie *</label>
                        <input
                            type="text"
                            id="numeroSerie"
                            name="numeroSerie"
                            value={formEntrada.numeroSerie}
                            onChange={handleChangeEntrada}
                            required
                            placeholder="Número de serie único"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rutPropietario">RUT del Propietario *</label>
                        <input
                            type="text"
                            id="rutPropietario"
                            name="rutPropietario"
                            value={formEntrada.rutPropietario}
                            onChange={handleChangeEntrada}
                            required
                            placeholder="Ej: 12345678-9"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombrePropietario">Nombre del Propietario *</label>
                        <input
                            type="text"
                            id="nombrePropietario"
                            name="nombrePropietario"
                            value={formEntrada.nombrePropietario}
                            onChange={handleChangeEntrada}
                            required
                            placeholder="Nombre completo"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="emailPropietario">Email del Propietario *</label>
                        <input
                            type="email"
                            id="emailPropietario"
                            name="emailPropietario"
                            value={formEntrada.emailPropietario}
                            onChange={handleChangeEntrada}
                            required
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cupoId">Cupo ID (Opcional)</label>
                        <input
                            type="number"
                            id="cupoId"
                            name="cupoId"
                            value={formEntrada.cupoId}
                            onChange={handleChangeEntrada}
                            placeholder="ID del cupo de estacionamiento"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Registrando...' : '📥 Registrar Entrada'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmitSalida} className="registro-form">
                    <h2>Salida de Bicicleta</h2>
                    
                    <div className="form-group">
                        <label htmlFor="bicicletaId">ID de la Bicicleta *</label>
                        <input
                            type="number"
                            id="bicicletaId"
                            name="bicicletaId"
                            value={formSalida.bicicletaId}
                            onChange={handleChangeSalida}
                            required
                            placeholder="ID de la bicicleta a retirar"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rutEstudiante">RUT del Estudiante *</label>
                        <input
                            type="text"
                            id="rutEstudiante"
                            name="rutEstudiante"
                            value={formSalida.rutEstudiante}
                            onChange={handleChangeSalida}
                            required
                            placeholder="Ej: 12345678-9"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipoDocumento">Tipo de Documento *</label>
                        <select
                            id="tipoDocumento"
                            name="tipoDocumento"
                            value={formSalida.tipoDocumento}
                            onChange={handleChangeSalida}
                            required
                        >
                            <option value="">Seleccione tipo de documento</option>
                            <option value="DNI">DNI</option>
                            <option value="TNE">TNE</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="Carnet de Identidad">Carnet de Identidad</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="observaciones">Observaciones (Opcional)</label>
                        <textarea
                            id="observaciones"
                            name="observaciones"
                            value={formSalida.observaciones}
                            onChange={handleChangeSalida}
                            placeholder="Notas adicionales sobre la salida"
                            rows="4"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Registrando...' : '📤 Registrar Salida'}
                    </button>
                </form>
            )}
        </div>
    );
}
