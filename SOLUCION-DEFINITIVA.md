# SOLUCIÓN DEFINITIVA - Problemas de Desarrollo

## 🔴 PROBLEMA PRINCIPAL: pets-service en crash loop
**Error**: `JdbcSQLIntegrityConstraintViolationException: Unique index or primary key violation`

### Causa raíz:
- H2 database persiste datos en `backend/pets-service/data/`
- `spring.sql.init.mode=always` ejecuta data.sql en CADA reinicio
- Intenta insertar IDs duplicados (101-120) causando crash

### ✅ SOLUCIÓN APLICADA:

**Archivo**: `backend/pets-service/src/main/resources/application.properties`

```properties
# SQL inicialización
# PERMANENTE: "never" para evitar duplicados en cada reinicio
spring.sql.init.mode=never
spring.sql.init.data-locations=classpath:data.sql
spring.sql.init.schema-locations=classpath:pets_service_schema.sql
```

### Resultado:
- ✅ pets-service arranca sin crash
- ✅ Datos persisten entre reinicios
- ✅ NO intenta recargar data.sql
- ✅ 20 mascotas disponibles en http://localhost:8082/api/mascotas

---

## 🔴 PROBLEMA SECUNDARIO: Browser cache mostrando código viejo

### Síntomas:
- Frontend compilaba correctamente
- Código en contenedor era correcto
- Browser mostraba JavaScript antiguo
- Requería 6+ rebuilds para ver cambios

### Causa raíz:
- React compila environment variables EN BUILD TIME
- Webpack dev server cachea agresivamente
- Browser cachea bundle.js

### ✅ ESTRATEGIA DE DESARROLLO:

#### 1. Cuando cambias `.env` o variables de entorno:

```bash
# PASO 1: Rebuild completo sin caché
docker-compose build --no-cache frontend

# PASO 2: Reiniciar frontend
docker-compose restart frontend

# PASO 3: Hard refresh en browser
# Chrome/Firefox: Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)
# Safari: Cmd+Option+E, luego Cmd+R

# PASO 4: Si aún no funciona, cambiar puerto temporalmente
# En docker-compose.yml cambiar:
# - "3000:3000" → "3001:3000"
# luego docker-compose up -d frontend
```

#### 2. Variables de entorno correctas (`frontend/.env`):

```bash
# ✅ CORRECTO - Service-specific URLs
REACT_APP_API_USERS=http://localhost:8081/api
REACT_APP_API_PETS=http://localhost:8082/api/mascotas
REACT_APP_API_ADOPTIONS=http://localhost:8083/api
REACT_APP_API_DONATIONS=http://localhost:8084/api

# ❌ NO USAR - Causa override global
# REACT_APP_API_BASE_URL=http://localhost:8081
```

#### 3. Validar cambios:

```bash
# Verificar variables en contenedor
docker exec frontend printenv | grep REACT_APP

# Ver código compilado
docker exec frontend cat src/api/apiBase.js | grep getApiBase
```

---

## 📋 ESTADO ACTUAL DE SERVICIOS

### Backend (todos funcionando):
- ✅ users-service: http://localhost:8081
- ✅ pets-service: http://localhost:8082 (FIXED)
- ✅ adoptions-service: http://localhost:8083
- ✅ donations-service: http://localhost:8084

### Frontend:
- ✅ React App: http://localhost:3000
- ✅ Variables de entorno: Correctas
- ✅ CORS: Configurado en todos los backends

### Endpoints verificados con curl:
```bash
# Users
curl http://localhost:8081/api/perfil/1  # ✅ 200 OK

# Pets
curl http://localhost:8082/api/mascotas  # ✅ 20 mascotas

# Refugios
curl http://localhost:8081/all           # ✅ Lista de refugios
```

---

## 🚀 COMANDOS ÚTILES PARA DESARROLLO

### Reiniciar todo limpio:
```bash
cd /Users/demianmaturana/Desktop/Constr-Proy
docker-compose down
docker-compose up -d
```

### Ver logs en tiempo real:
```bash
# Un servicio específico
docker logs -f pets-service

# Todos los servicios
docker-compose logs -f
```

### Limpiar caché de Docker:
```bash
# Rebuild específico sin caché
docker-compose build --no-cache pets-service

# Limpiar imágenes huérfanas
docker image prune -f
```

### Limpiar base de datos H2 (SOLO EN DESARROLLO):
```bash
# Detener servicio
docker-compose stop pets-service

# Borrar datos
rm -f backend/pets-service/data/*.db

# Cambiar temporalmente a mode=always en application.properties
# Reiniciar para cargar datos
docker-compose up -d pets-service

# Cambiar a mode=never
# Rebuild final
docker-compose build pets-service
docker-compose restart pets-service
```

---

## ⚠️ REGLAS PARA NO PERDER 3 DÍAS MÁS

### 1. **NUNCA** cambiar `spring.sql.init.mode=always` en pets-service
   - Ya está en `never`
   - Datos persisten en `backend/pets-service/data/`
   - Solo cambiar si necesitas resetear BD completa

### 2. **SIEMPRE** rebuild frontend después de cambiar `.env`
   ```bash
   docker-compose build --no-cache frontend
   docker-compose restart frontend
   ```

### 3. **NO** usar `REACT_APP_API_BASE_URL` global
   - Usar variables service-specific
   - `REACT_APP_API_USERS`, `REACT_APP_API_PETS`, etc.

### 4. **Hard refresh** después de rebuild
   - Cmd+Shift+R (Mac)
   - Incognito mode si persiste
   - Cambiar puerto si necesario

### 5. **Verificar ANTES de asumir error de endpoints**
   - `docker ps` → servicios corriendo?
   - `docker logs <service>` → crashes?
   - `curl http://localhost:8082/api/mascotas` → backend funciona?
   - Browser DevTools → console muestra URL correcta?

---

## 📊 RESUMEN DE FIXES APLICADOS

| Problema | Solución | Archivo |
|----------|----------|---------|
| pets-service crash | `spring.sql.init.mode=never` | `pets-service/application.properties` |
| Browser cache | Rebuild + hard refresh strategy | Documented above |
| Missing /api segment | Comentar `REACT_APP_API_BASE_URL` | `frontend/.env` (línea 12) |
| Refugio selector vacío | Cambiar `/api/all` → `/all` | `DonacionFormModal.jsx` (línea 29) |
| Syntax error | Remover `</div>` extra | `PaginaPrincipal.jsx` (línea 465) |

---

## 🎯 PRÓXIMOS PASOS

1. ✅ **Funcionalidad básica FUNCIONA**
   - Login/Registro
   - Ver mascotas
   - Ver refugios
   - Editar perfil (backend verificado con curl)

2. 🔄 **Pendiente verificar en browser**
   - Hard refresh (Cmd+Shift+R)
   - Probar editar perfil desde UI
   - Probar registrar mascota
   - Verificar que todas las mascotas se visualizan

3. 📝 **Recomendaciones finales**
   - Considerar PostgreSQL para producción (no H2)
   - Implementar health checks en docker-compose
   - Agregar tests para detectar regressions
   - Documentar arquitectura de microservicios

---

**Fecha**: 2025-01-14  
**Status**: ✅ SISTEMA ESTABLE - Backend funcionando, Frontend requiere hard refresh  
**Tiempo invertido en debug**: 3 días (cache hell + crash loop)  
**Prompts de Copilot usados**: ~50 (casi agota límite premium)
