const baseUrl = (window.__BICICLETERO_BASE_URL__ && window.__BICICLETERO_BASE_URL__) || 'http://localhost:3000';

// Helpers
function showMsg(text, ok = true) {
  const el = document.getElementById('msg');
  el.textContent = text;
  el.className = ok ? 'msg ok' : 'msg error';
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 5000);
}

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

// Navigation
function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

// Event listeners for nav
document.getElementById('nav-login').addEventListener('click', () => showSection('login-section'));
document.getElementById('nav-register-bici').addEventListener('click', () => showSection('register-bici-section'));
document.getElementById('nav-salida').addEventListener('click', () => showSection('salida-section'));
document.getElementById('nav-buscar').addEventListener('click', () => showSection('buscar-section'));
document.getElementById('nav-datos').addEventListener('click', () => showSection('datos-section'));

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(baseUrl + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      showMsg(data.message || 'Error en login', false);
      return;
    }

    const token = data.data?.token;
    if (token) {
      localStorage.setItem('token', token);
      showMsg('Login correcto');
      showSection('register-bici-section');
    } else {
      showMsg('No se recibió token', false);
    }
  } catch (err) {
    showMsg(err.message, false);
  }
});

// Register bicycle (entrada)
document.getElementById('register-bici-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    marca: document.getElementById('b-marca').value,
    modelo: document.getElementById('b-modelo').value,
    color: document.getElementById('b-color').value,
    numeroSerie: document.getElementById('b-numeroSerie').value,
    rutPropietario: document.getElementById('b-rutPropietario').value,
    nombrePropietario: document.getElementById('b-nombrePropietario').value,
    emailPropietario: document.getElementById('b-emailPropietario').value,
  };
  const cupoIdVal = document.getElementById('b-cupoId').value;
  if (cupoIdVal) body.cupoId = parseInt(cupoIdVal, 10);

  try {
    const res = await fetch(baseUrl + '/api/bicis/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return showMsg(data.message || 'Error al registrar bicicleta', false);

    showMsg('Bicicleta registrada. ID: ' + (data.data?.id ?? 'n/a'));
    if (data.data?.id) localStorage.setItem('lastBiciId', data.data.id);
  } catch (err) {
    showMsg(err.message, false);
  }
});

// Registrar salida
document.getElementById('salida-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    bicicletaId: parseInt(document.getElementById('s-bicicletaId').value, 10),
    rutEstudiante: document.getElementById('s-rutEstudiante').value,
    tipoDocumento: document.getElementById('s-tipoDocumento').value,
    observaciones: document.getElementById('s-observaciones').value || undefined
  };
  try {
    const res = await fetch(baseUrl + '/api/bicis/salida', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return showMsg(data.message || 'Error al registrar salida', false);
    showMsg('Salida registrada. Jornada completada');
  } catch (err) {
    showMsg(err.message, false);
  }
});

// Buscar
document.getElementById('buscar-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const rut = document.getElementById('q-rut').value;
  const cupoId = document.getElementById('q-cupoId').value;
  const estado = document.getElementById('q-estado').value;
  const params = new URLSearchParams();
  if (rut) params.append('rut', rut);
  if (cupoId) params.append('cupoId', cupoId);
  if (estado) params.append('estado', estado);

  try {
    const res = await fetch(baseUrl + '/api/bicis/buscar?' + params.toString(), {
      headers: { ...authHeader() }
    });
    const data = await res.json();
    if (!res.ok) return showMsg(data.message || 'Error al buscar', false);
    const out = document.getElementById('buscar-result');
    out.textContent = JSON.stringify(data.data, null, 2);
  } catch (err) {
    showMsg(err.message, false);
  }
});

// Stats
async function loadStats() {
  try {
    const res = await fetch(baseUrl + '/api/bicis/datos', { headers: { ...authHeader() } });
    const data = await res.json();
    if (!res.ok) return showMsg(data.message || 'Error al obtener datos', false);
    document.getElementById('datos-result').textContent = JSON.stringify(data.data, null, 2);
  } catch (err) {
    showMsg(err.message, false);
  }
}

document.getElementById('nav-datos').addEventListener('click', loadStats);

// Inicialización
(function init() {
  showSection('login-section');
  const token = localStorage.getItem('token');
  if (token) {
    // si ya hay token mostrar registro
    showSection('register-bici-section');
  }
})();

// Reservas
document.getElementById('nav-reservas').addEventListener('click', () => showSection('reservas-section'));

//para crear reserva (POST)
document.getElementById('reservas-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const body = {
    fecha: document.getElementById('r-fecha').value,
    bloqueHorario: document.getElementById('r-bloque').value,
    espacioId: document.getElementById('r-espacioId').value,
  };

  try {
    const res = await fetch(baseUrl + '/api/reservas', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    if (!res.ok) {
        return showMsg(data.message || 'Error al crear la reserva', false);
    }

    showMsg('Reserva creada exitosamente. ID: ' + (data.data?.id ?? 'n/a'));
    
    // Limpiamos el formulario
    document.getElementById('reservas-form').reset();
    
  } catch (err) {
    showMsg(err.message, false);
  }
});


//ver todas las reservas (GET)
async function loadMisReservas() {
  try {
    const res = await fetch(baseUrl + '/api/reservas', { 
        headers: { ...authHeader() } 
    });
    const data = await res.json();
    if (!res.ok) {
        return showMsg(data.message || 'Error al obtener reservas', false);
    }
    document.getElementById('reservas-result').textContent = JSON.stringify(data.data, null, 2);
  } catch (err) {
    showMsg(err.message, false);
  }
}

document.getElementById('ver-reservas-btn').addEventListener('click', loadMisReservas);
