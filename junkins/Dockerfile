FROM jenkins/jenkins:lts

# Instala Node.js 22 (incluye npm) para poder ejecutar pipelines de JavaScript
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Librerías del sistema que necesitan Chromium y Firefox para las pruebas en navegador (Vitest + Playwright).
# Los navegadores en sí los descarga el pipeline con `npx playwright install`, en la versión del package-lock.json.
RUN npx --yes playwright@1.63.0 install-deps chromium firefox \
    && rm -rf /var/lib/apt/lists/* /root/.npm
USER jenkins
