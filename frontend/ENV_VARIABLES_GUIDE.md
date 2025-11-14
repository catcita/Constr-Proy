# Guía de Variables de Entorno - Frontend

## Resumen
Todas las URLs de APIs del backend están centralizadas en archivos `.env` y `.env.example`.

## Archivos de Configuración

### `.env` y `.env.example`
Ubicación: `/frontend/.env` y `/frontend/.env.example`

```bash
# ============================================
# CONFIGURACIÓN DE APIs - BACKEND
# ============================================
# Estas variables definen las URLs base completas para cada servicio.
# Importante: NO incluir slash (/) al final de las URLs

# URL base global (opcional - para override general)
REACT_APP_API_BASE_URL=https://petscloud.cl

# APIs individuales por servicio
REACT_APP_API_USERS=https://petscloud.cl/api/users
REACT_APP_API_PETS=https://petscloud.cl/api/pets
REACT_APP_API_ADOPTIONS=https://petscloud.cl/api/adoptions
REACT_APP_API_CHATS=https://petscloud.cl/api/chats
REACT_APP_API_NOTIFICACIONES=https://petscloud.cl/api/notificaciones
REACT_APP_API_DONATIONS=https://petscloud.cl/api/donaciones
REACT_APP_API_REFUGIOS=https://petscloud.cl/api/users
```

## Archivos Actualizados

### 1. `/src/api/authApi.js`
**Antes:**
```javascript
const API_BASE = 'https://petscloud.cl/api/users';
```

**Después:**
```javascript
const API_BASE = process.env.REACT_APP_API_USERS || 'https://petscloud.cl/api/users';
```

### 2. `/src/api/adoptionsApi.js`
**Antes:**
```javascript
const API_BASE = process.env.REACT_APP_API_ADOPTIONS;
```

**Después:**
```javascript
const API_BASE = process.env.REACT_APP_API_ADOPTIONS || 'https://petscloud.cl/api/adoptions';
```

### 3. `/src/api/chatsApi.js`
**Antes:**
```javascript
const API_BASE = process.env.REACT_APP_API_CHATS;
```

**Después:**
```javascript
const API_BASE = process.env.REACT_APP_API_CHATS || 'https://petscloud.cl/api/chats';
```

### 4. `/src/api/donationsApi.js`
**Antes:**
```javascript
const API_BASE = process.env.REACT_APP_API_DONATIONS;
```

**Después:**
```javascript
const API_BASE = process.env.REACT_APP_API_DONATIONS || 'https://petscloud.cl/api/donaciones';
```

### 5. `/src/components/DonacionFormModal.jsx`
**Antes:**
```javascript
const res = await fetch('https://localhost/api/users/all');
```

**Después:**
```javascript
const API_USERS = process.env.REACT_APP_API_USERS || 'https://petscloud.cl/api/users';
const res = await fetch(`${API_USERS}/all`);
```

### 6. `/src/pages/AdopcionesPage.jsx`
**Antes:**
```javascript
const API_BASE = PETS_API_BASE || (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082');
```

**Después:**
```javascript
const API_BASE = PETS_API_BASE || process.env.REACT_APP_API_PETS || 'https://petscloud.cl/api/pets';
```

### 7. `/src/context/NotificationContext.jsx`
Ya estaba usando variables de entorno correctamente:
```javascript
const base = (process.env.REACT_APP_API_NOTIFICACIONES || 'https://petscloud.cl/api/notificaciones').replace(/\/$/, '');
```

## Archivos que Usan `getApiBase()` (Ya Correctos)

Los siguientes archivos usan la función utilitaria `getApiBase()` de `/src/api/apiBase.js` que maneja automáticamente las variables de entorno:

- `/src/api/petsApi.js` - Usa `getApiBase('PETS')`
- `/src/api/usersApi.js` - Usa `getApiBase('USERS')`
- `/src/api/refugiosApi.js` - Usa `getApiBase('REFUGIOS')`

## Cómo Cambiar el Dominio

### Para Desarrollo Local:
```bash
REACT_APP_API_BASE_URL=https://localhost
```

### Para Producción:
```bash
REACT_APP_API_BASE_URL=https://petscloud.cl
```

### Para Testing en Red Local:
```bash
REACT_APP_API_BASE_URL=http://192.168.1.100
```

## IMPORTANTE: Después de Cambiar Variables

1. **Detener el contenedor:**
   ```bash
   docker compose stop frontend
   ```

2. **Reconstruir SIN caché:**
   ```bash
   docker compose build --no-cache frontend
   ```

3. **Iniciar:**
   ```bash
   docker compose up -d frontend
   ```

4. **Limpiar caché del navegador:**
   - Chrome: Cmd+Shift+Delete o Ctrl+Shift+Delete
   - Marcar "Cached images and files"
   - Click "Clear data"

## Estructura de Fallbacks

Todos los archivos ahora tienen la siguiente estructura de fallback:

```javascript
const API_BASE = process.env.REACT_APP_API_[SERVICE] || 'https://petscloud.cl/api/[service]';
```

Esto asegura que:
1. Si la variable de entorno existe, se usa
2. Si no existe, usa el fallback a petscloud.cl
3. Nunca queda sin una URL válida

## Verificación

Para verificar que las variables están cargadas correctamente, abrir la consola del navegador y ejecutar:

```javascript
console.log('ENV Variables:', {
  BASE_URL: process.env.REACT_APP_API_BASE_URL,
  USERS: process.env.REACT_APP_API_USERS,
  PETS: process.env.REACT_APP_API_PETS,
  ADOPTIONS: process.env.REACT_APP_API_ADOPTIONS,
  CHATS: process.env.REACT_APP_API_CHATS,
  NOTIFICACIONES: process.env.REACT_APP_API_NOTIFICACIONES,
  DONATIONS: process.env.REACT_APP_API_DONATIONS,
  REFUGIOS: process.env.REACT_APP_API_REFUGIOS
});
```

**Nota:** En React, `process.env` solo funciona durante el build time. Las variables deben estar presentes cuando se ejecuta `npm start` o `npm run build`.
