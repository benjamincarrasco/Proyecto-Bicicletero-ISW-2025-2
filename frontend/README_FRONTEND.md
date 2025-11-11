Frontend mínimo para probar la API del bicicletero

Archivos:
- index.html: UI (login, registrar bicicleta, salida, buscar, datos)
- app.js: lógica JS y llamadas a la API
- styles.css: estilos mínimos

Cómo usarlo:
1. Asegúrate que el backend está corriendo en http://localhost:3000
2. Abre `frontend/index.html` en tu navegador (puedes abrirlo directamente o servirlo con un servidor estático)
   - Recomendado: instalar `http-server` y servir la carpeta:
     - npm i -g http-server
     - cd frontend
     - http-server -c-1
     - luego abrir http://localhost:8080 (u otro puerto que muestre)
3. Login con un usuario guardia (creado en el backend o que registraste)
4. Usa las secciones para registrar entradas, salidas, buscar bicicletas y ver estadísticas

Notas:
- Si tu backend corre en otro host/puerto, edita `app.js` y cambia `baseUrl` al endpoint correspondiente.
- El token se guarda en localStorage automáticamente tras login.
- Este frontend es una herramienta de pruebas, no una app de producción.

Siguientes mejoras posibles:
- Usar un framework (React/Vue) para mejor UX
- Validaciones de formulario más robustas
- Mostrar datos de jornadas en tablas con paginación
