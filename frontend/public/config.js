// Runtime configuration - se carga directamente en el navegador
// Este archivo NO pasa por webpack, así que NO se cachea
window.APP_CONFIG = {
  API_USERS: 'http://localhost:8081/api',
  API_PETS: 'http://localhost:8082/api/mascotas',
  API_ADOPTIONS: 'http://localhost:8083/api/adoptions',
  API_CHATS: 'http://localhost:8083/api/chats',
  API_NOTIFICACIONES: 'http://localhost:8083/api/notificaciones',
  API_DONATIONS: 'http://localhost:8084/api/donaciones',
  PETS_SERVER_BASE: 'http://localhost:8082',
  // Timestamp para forzar recarga: CAMBIAR ESTE VALOR FUERZA ACTUALIZACIÓN
  BUILD_TIME: '2025-11-14T05:55:00Z'
};
