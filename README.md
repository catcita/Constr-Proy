# PetCloud - Guía de Desarrollo

## 🚀 Inicio Rápido para Desarrollo Local

### Requisitos Previos
- Docker y Docker Compose instalados
- Puerto 3000, 8081, 8082, 8083, 8084 disponibles

### Levantar el Proyecto

```bash
# 1. Clonar el repositorio
git clone <tu-repo>
cd Constr-Proy

# 2. Levantar todos los servicios
docker compose up -d

# 3. Esperar ~30 segundos a que todos los servicios arranquen

# 4. Ver logs para confirmar que todo está funcionando
docker compose logs -f
```

### Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Users Service**: http://localhost:8081/api
- **Pets Service**: http://localhost:8082/api
- **Adoptions Service**: http://localhost:8083/api
- **Donations Service**: http://localhost:8084/api

### Verificar que todo funciona

```bash
# Verificar que todos los contenedores están corriendo
docker ps

# Deberías ver:
# - frontend
# - users-service
# - pets-service  
# - adoptions-service
# - donations-service
# - nginx-proxy-manager
```

### Detener el Proyecto

```bash
# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (limpia las bases de datos)
docker compose down -v
```

## 🔧 Desarrollo

### Hacer Cambios en el Código

**Frontend:**
```bash
# Los cambios en React requieren rebuild
docker compose restart frontend

# Para cambios más complejos
docker compose stop frontend
docker compose build frontend
docker compose up -d frontend
```

**Backend (Java):**
```bash
# Rebuild del servicio específico
docker compose stop users-service
docker compose build users-service
docker compose up -d users-service
```

### Ver Logs

```bash
# Todos los servicios
docker compose logs -f

# Un servicio específico
docker logs frontend -f
docker logs users-service -f
```

## 📁 Estructura del Proyecto

```
Constr-Proy/
├── frontend/               # React App
│   ├── .env               # Configuración localhost (desarrollo)
│   ├── .env.production    # Configuración producción
│   └── src/
├── backend/
│   ├── users-service/     # Puerto 8081
│   ├── pets-service/      # Puerto 8082
│   ├── adoptions-service/ # Puerto 8083
│   └── donations-service/ # Puerto 8084
└── docker-compose.yml
```

## 🌐 Deploy a Producción

### Preparación

1. **Actualizar variables de entorno**:
   ```bash
   # En frontend/
   cp .env.production .env
   # Editar .env con las URLs de producción
   ```

2. **Rebuild con configuración de producción**:
   ```bash
   docker compose down
   docker compose build
   docker compose up -d
   ```

3. **Configurar nginx-proxy-manager** para enrutar el tráfico desde tu dominio

### Consideraciones de Producción

- Usar SSL/TLS (HTTPS)
- Configurar CORS correctamente en cada servicio backend
- Considerar usar Docker secrets para información sensible
- Configurar backups de las bases de datos H2

## 🐛 Solución de Problemas

### El frontend no se conecta al backend

1. Verificar que `.env` tiene las URLs correctas:
   ```bash
   cat frontend/.env | grep REACT_APP
   ```

2. Verificar que los puertos están expuestos:
   ```bash
   docker ps
   ```

3. Rebuild del frontend para aplicar cambios de `.env`:
   ```bash
   docker compose stop frontend
   docker compose build frontend
   docker compose up -d frontend
   ```

### Error de CORS

Los servicios backend ya están configurados para permitir localhost. Si tienes problemas:

1. Verifica que el servicio backend está corriendo
2. Revisa los logs del servicio: `docker logs <servicio> -f`
3. Los archivos de configuración CORS están en `backend/*/src/main/java/**/config/`

### Bases de datos vacías

Las bases de datos H2 se inicializan con `data.sql` en cada servicio. Si no hay datos:

```bash
# Recrear con datos frescos
docker compose down -v
docker compose up -d
```

## 📝 Notas Importantes

- **NO commitear** archivos `.env` con credenciales reales
- El archivo `.env.example` es la referencia para crear tu `.env` local
- Los puertos 3000, 8081-8084 deben estar libres en tu máquina
- Las bases de datos H2 persisten en `backend/*/data/`

## 👥 Equipo

Si tienes problemas, contacta al equipo o revisa los issues en GitHub.
