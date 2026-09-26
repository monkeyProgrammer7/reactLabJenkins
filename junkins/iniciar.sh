#!/usr/bin/env bash
# Descarga las imágenes y levanta Jenkins + frontend
set -e
cd "$(dirname "$0")"

# Imagen de Jenkins
docker pull jenkins/jenkins:lts # Versión LTS (recomendada para producción)
# (la imagen de Jenkins se construye desde esa base con Node.js, ver Dockerfile)

# Construye el frontend y levanta los servicios.
# Compose solo recrea los contenedores cuya configuración o imagen cambió.
docker compose up -d --build

docker compose ps
echo
echo "Jenkins:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
