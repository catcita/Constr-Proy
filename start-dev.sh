#!/bin/bash

# Script para iniciar el proyecto PetCloud en modo desarrollo

echo "🐾 Iniciando PetCloud en modo desarrollo..."
echo ""

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "Por favor inicia Docker Desktop y vuelve a ejecutar este script"
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Detener servicios anteriores si existen
echo "🛑 Deteniendo servicios previos..."
docker compose down

# Levantar servicios
echo ""
echo "🚀 Levantando servicios..."
docker compose up -d

# Esperar a que los servicios arranquen
echo ""
echo "⏳ Esperando a que los servicios arranquen (esto puede tardar ~40 segundos)..."
sleep 40

# Verificar estado
echo ""
echo "📊 Estado de los servicios:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "✅ PetCloud está corriendo!"
echo ""
echo "📍 Accede a:"
echo "   Frontend:    http://localhost:3000"
echo "   Users API:   http://localhost:8081/api"
echo "   Pets API:    http://localhost:8082/api"
echo "   Adoptions:   http://localhost:8083/api"
echo "   Donations:   http://localhost:8084/api"
echo ""
echo "📝 Para ver logs: docker compose logs -f"
echo "🛑 Para detener:  docker compose down"
