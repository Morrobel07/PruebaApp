

# 1. ETAPA DE CONSTRUCCIÓN (BUILD)
#FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 AS build
#WORKDIR /app
FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2019
#FROM microsoft/aspnet:4.7.1-windowsservercore-10.0.14393.1884

# Copiar los archivos de la aplicación publicada de .NET 4.8
# Asumimos que los archivos publicados están en una carpeta 'publish' relativa a este Dockerfile
WORKDIR /inetpub/wwwroot
COPY bin/app.publish/ .

# Exponer el puerto por defecto de IIS
EXPOSE 80
