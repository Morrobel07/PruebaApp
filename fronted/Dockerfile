# 1. ETAPA DE CONSTRUCCIÓN (BUILD)
FROM node:18

WORKDIR /app
COPY package.json .
COPY package-lock.json .

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación (generará la carpeta 'dist' o 'build')
RUN npm run build 

# ----------------------------------------------------
# 2. ETAPA DE EJECUCIÓN (RUNTIME)
# Servir el contenido estático usando Nginx
# ----------------------------------------------------
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa 'build'
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración custom de Nginx (Opcional: si necesitas un archivo nginx.conf)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# El puerto por defecto de Nginx es 80
EXPOSE 80