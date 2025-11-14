# Configuración de Nginx Proxy Manager

## ✅ Instalación Completada

Nginx Proxy Manager está corriendo y reemplazó al nginx anterior.

## 📋 Acceso a la Interfaz Web

1. **Abrir en el navegador:** http://localhost:81

2. **Credenciales por defecto:**
   - Email: `admin@example.com`
   - Contraseña: `changeme`

3. **⚠️ IMPORTANTE:** Al primer login te pedirá cambiar el email y contraseña.

---

## 🔧 Configurar Proxy Hosts (Routing)

Debes crear **5 Proxy Hosts** para cada servicio:

### 1️⃣ Frontend
- **Domain Names:** `localhost` o tu dominio
- **Scheme:** `http`
- **Forward Hostname / IP:** `frontend`
- **Forward Port:** `3000`
- **Cache Assets:** ✅
- **Block Common Exploits:** ✅
- **Websockets Support:** ✅

### 2️⃣ Users Service
- **Domain Names:** `localhost` o tu dominio
- **Scheme:** `http`
- **Forward Hostname / IP:** `users-service`
- **Forward Port:** `8081`
- **Custom locations:**
  - Location: `/api/users`
  - Forward Hostname: `users-service`
  - Forward Port: `8081`

### 3️⃣ Pets Service
- **Domain Names:** `localhost` o tu dominio
- **Scheme:** `http`
- **Forward Hostname / IP:** `pets-service`
- **Forward Port:** `8082`
- **Custom locations:**
  - Location: `/api/pets`
  - Forward Hostname: `pets-service`
  - Forward Port: `8082`

### 4️⃣ Adoptions Service (incluye /api/chats y /api/notificaciones)
- **Domain Names:** `localhost` o tu dominio
- **Scheme:** `http`
- **Forward Hostname / IP:** `adoptions-service`
- **Forward Port:** `8083`
- **Custom locations:**
  - Location: `/api/adoptions`
  - Location: `/api/chats`
  - Location: `/api/notificaciones`
  - Forward Hostname: `adoptions-service`
  - Forward Port: `8083`

### 5️⃣ Donations Service
- **Domain Names:** `localhost` o tu dominio
- **Scheme:** `http`
- **Forward Hostname / IP:** `donations-service`
- **Forward Port:** `8084`
- **Custom locations:**
  - Location: `/api/donaciones`
  - Forward Hostname: `donations-service`
  - Forward Port: `8084`

---

## 🔒 Habilitar HTTPS con Let's Encrypt

### Para desarrollo local (localhost):
1. En cada Proxy Host, ve a la pestaña **SSL**
2. Selecciona **"Self-signed SSL"** (certificado auto-firmado)
3. Guarda los cambios

### Para producción (con dominio real):
1. **Requisitos:**
   - Dominio registrado apuntando a tu IP pública
   - Puertos 80 y 443 abiertos en el firewall
   - Puerto 80 NO puede estar bloqueado (Let's Encrypt lo necesita)

2. **Pasos:**
   - En cada Proxy Host, ve a la pestaña **SSL**
   - Selecciona **"Request a new SSL Certificate"**
   - Marca: ✅ Force SSL
   - Marca: ✅ HTTP/2 Support
   - Marca: ✅ HSTS Enabled
   - Email: tu email válido
   - Acepta los términos de Let's Encrypt
   - Click en **Save**

3. **Renovación automática:**
   - Let's Encrypt renueva automáticamente cada 60 días

---

## 🌐 Configuración Simplificada (Alternativa)

Si quieres una configuración más simple, puedes crear UN SOLO Proxy Host con todas las rutas:

1. **Crear Proxy Host Principal:**
   - Domain: `localhost` o tu dominio
   - Forward a: `frontend:3000`

2. **Agregar Custom Locations en "Advanced":**
```nginx
location /api/users {
    proxy_pass http://users-service:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location /api/pets {
    proxy_pass http://pets-service:8082;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location ~ ^/api/(adoptions|chats|notificaciones) {
    proxy_pass http://adoptions-service:8083;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location ~ ^/api/donaciones {
    proxy_pass http://donations-service:8084;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 🔍 Verificación

Después de configurar, verifica que todo funciona:

1. ✅ Frontend: http://localhost o https://localhost
2. ✅ API Users: https://localhost/api/users/all
3. ✅ API Pets: https://localhost/api/pets/mascotas
4. ✅ API Adoptions: https://localhost/api/adoptions
5. ✅ API Donations: https://localhost/api/donaciones

---

## 📝 Notas Importantes

- **Puerto 81:** Solo para administración, NO debe ser público en producción
- **Backup:** Los datos están en `./nginx-proxy-manager/data`
- **Certificados:** Se guardan en `./nginx-proxy-manager/letsencrypt`
- **Logs:** Visible en la interfaz web de NPM
- **Base de datos:** NPM usa SQLite internamente (en ./data)

---

## 🚨 Troubleshooting

### Error "502 Bad Gateway":
- Verifica que los servicios backend estén corriendo: `docker ps`
- Verifica los logs: `docker logs nginx-proxy-manager`
- Asegúrate que los nombres de host coincidan con los nombres de contenedores

### No puedo acceder al puerto 81:
- Verifica que no haya otro servicio usando el puerto: `lsof -i :81`
- Reinicia el contenedor: `docker restart nginx-proxy-manager`

### Certificado SSL no se genera:
- Verifica que tu dominio apunte correctamente a tu IP
- Verifica que el puerto 80 esté accesible desde internet
- Revisa los logs de NPM para ver el error específico

---

## 📦 Comandos Útiles

```bash
# Ver logs en tiempo real
docker logs -f nginx-proxy-manager

# Reiniciar el servicio
docker restart nginx-proxy-manager

# Detener todo y reconstruir
docker compose down
docker compose up -d --build

# Ver todos los contenedores
docker ps -a
```

---

## 🔄 Para tu compañero en el otro PC

1. Hacer pull del repositorio actualizado
2. Copiar el archivo `.env` a `frontend/.env`
3. Ejecutar: `docker compose up -d --build`
4. Acceder a http://localhost:81 y configurar los Proxy Hosts
5. ¡Listo! Todo debería funcionar con HTTPS

---

**¡Configuración completada!** Accede a http://localhost:81 para empezar a configurar tus proxy hosts y certificados SSL.
