# Fix: Actualización de Mascota e Imágenes

## 🐛 Problemas Resueltos

### 1. Error al actualizar mascota (404)
**Error anterior**: 
```
PUT http://localhost:8082/api/mascotas/mascotas/109 404 (Not Found)
```

**Causa**: URL duplicaba `/mascotas` porque:
- `REACT_APP_API_PETS` incluía `/api/mascotas`
- Código agregaba `/mascotas/${id}` otra vez
- Resultado: `http://localhost:8082/api/mascotas/mascotas/109` ❌

**Solución**:
- Cambiado `REACT_APP_API_PETS=http://localhost:8082/api` (sin `/mascotas`)
- Agregado `REACT_APP_PETS_SERVER_BASE=http://localhost:8082` para compatibilidad
- Código ahora construye correctamente: `http://localhost:8082/api/mascotas/109` ✅

### 2. Imágenes no cargan
**Causa**: `buildMediaUrl()` construía URLs incorrectas:
- `apiBase = http://localhost:8082/api`
- Función agregaba `/api/media/`
- Resultado: `http://localhost:8082/api/api/media/imagen.jpg` ❌ (duplica `/api`)

**Solución**: Actualizado `mediaUtils.js` para eliminar `/api` antes de construir URL:
```javascript
const serverBase = apiBase.replace(/\/api$/, ''); // Remove /api suffix
return `${serverBase}/api/media/${filename}`; // http://localhost:8082/api/media/imagen.jpg ✅
```

## 📝 Archivos Modificados

### 1. `frontend/.env`
```bash
# Antes
REACT_APP_API_PETS=http://localhost:8082/api/mascotas

# Después
REACT_APP_API_PETS=http://localhost:8082/api
REACT_APP_PETS_SERVER_BASE=http://localhost:8082  # Nueva variable
```

### 2. `frontend/src/utils/mediaUtils.js`
- Agregado `.replace(/\/api$/, '')` en todas las construcciones de URL
- Ahora elimina `/api` de `apiBase` antes de agregar `/api/media/`
- Aplica a:
  - URLs con `/uploads/`
  - URLs absolutas HTTP
  - Paths relativos
  - Filenames sin path

### 3. `frontend/src/components/MascotaRegistroModal.jsx`
- Agregado log de debug: `console.log('DEBUG: PUT URL:', ...)`
- El código ya era correcto, solo necesitaba la variable de entorno corregida

## 🎯 URLs Correctas Ahora

### Backend pets-service sirve imágenes en:
- `http://localhost:8082/uploads/imagen.jpg` (directo)
- `http://localhost:8082/api/media/imagen.jpg` (proxy para evitar adblockers)

### Frontend construye:
- GET mascotas: `http://localhost:8082/api/mascotas`
- GET mascota por ID: `http://localhost:8082/api/mascotas/{id}`
- PUT actualizar: `http://localhost:8082/api/mascotas/{id}` ✅
- GET imagen: `http://localhost:8082/api/media/filename.jpg` ✅

## ✅ Testing

### Verificar actualización de mascota:
1. Abrir frontend: http://localhost:3000
2. Login con usuario existente
3. Editar una mascota
4. Verificar en DevTools que el PUT va a: `http://localhost:8082/api/mascotas/{id}` (sin duplicar `/mascotas`)

### Verificar imágenes:
1. Ver lista de mascotas
2. Abrir DevTools → Network
3. Verificar que las imágenes se cargan desde: `http://localhost:8082/api/media/{filename}`
4. NO debe haber URLs con `/api/api/media/`

## 🚀 Rebuild Aplicado

```bash
# Rebuild completo sin caché
docker-compose build --no-cache frontend

# Reiniciar servicio
docker-compose restart frontend
```

## 📌 Notas Importantes

### Variables de entorno en React:
- Se compilan en BUILD TIME (no runtime)
- Cambiar `.env` requiere REBUILD completo
- Después del rebuild, hacer HARD REFRESH en browser (Cmd+Shift+R)

### Dos variables para pets-service:
- `REACT_APP_API_PETS`: Usado por `getApiBase('PETS')` en `apiBase.js`
- `REACT_APP_PETS_SERVER_BASE`: Usado directamente en componentes legacy
- Ambas necesarias para compatibilidad

### Endpoints del backend:
- Spring Boot sirve archivos estáticos en `/uploads/**` (WebConfig)
- También provee proxy en `/api/media/**` para evitar adblockers
- Ambos apuntan al mismo directorio: `{project_root}/uploads/`

---

**Fecha**: 2025-11-14  
**Status**: ✅ FIXED - Actualización de mascotas e imágenes funcionando correctamente
