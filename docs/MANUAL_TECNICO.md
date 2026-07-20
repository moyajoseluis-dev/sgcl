⚙️ Manual Técnico: SGCL (Instalación y Puesta en Marcha)
Este manual describe los pasos necesarios para configurar, instalar y ejecutar el entorno de desarrollo y producción del sistema SGCL.

1. Requisitos Previos
Antes de comenzar, asegúrate de tener instalado el siguiente software en tu computadora:

Node.js: Versión 20 LTS o superior (Descargar aquí)
Docker Desktop: Para levantar la base de datos PostgreSQL (Descargar aquí)
Git: Para clonar el repositorio (Descargar aquí)
Editor de código: Recomendado Visual Studio Code con las extensiones de Volar (Vue), ESLint y Prisma.
2. Estructura del Repositorio
El proyecto utiliza un monorepo estructurado de la siguiente manera:

text

sgcl/
├── backend/      # API REST construida con NestJS
├── frontend/     # SPA construida con Vue 3
├── docker-compose.yml # Configuración de la base de datos
└── docs/         # Documentación del proyecto
3. Puesta en Marcha (Entorno de Desarrollo)
Sigue estos pasos en orden para levantar la aplicación completa.

Paso 3.1: Clonar el Repositorio
bash

git clone <url-del-repositorio>
cd sgcl
Paso 3.2: Levantar la Base de Datos
Asegúrate de que Docker Desktop esté corriendo. Luego, desde la raíz del proyecto (sgcl/), ejecuta:

bash

docker-compose up -d
Esto descargará la imagen de PostgreSQL 16 y la dejará corriendo en el puerto 5432 con un usuario y base de datos preconfigurados.

Paso 3.3: Configuración del Backend
Entra a la carpeta del backend:
bash

cd backend
Instala las dependencias:
bash

npm install
Crea el archivo de variables de entorno copiando el ejemplo:
bash

cp .env.example .env
Edita el archivo .env y asegúrate de configurar las credenciales reales de Laudus y el secreto JWT:
env

JWT_SECRET="un_secreto_muy_largo_y_dificil_de_adivinar"
LAUDUS_USERNAME="tu_usuario_laudus"
LAUDUS_PASSWORD="tu_password_laudus"
LAUDUS_COMPANY_VAT_ID="76xxxxxx-x" # RUT de tu empresa en Laudus
Ejecuta las migraciones de la base de datos para crear las tablas:
bash

npx prisma migrate dev --name init
Carga el usuario administrador inicial:
bash

npx prisma db seed
Levanta el servidor de NestJS en modo desarrollo:
bash

npm run start:dev
El backend estará corriendo en http://localhost:3001 y la documentación Swagger en http://localhost:3001/swagger.
Paso 3.4: Configuración del Frontend
Abre una nueva terminal y entra a la carpeta del frontend:
bash

cd frontend
Instala las dependencias:
bash

npm install
Levanta el servidor de desarrollo de Vue:
bash

npm run dev
Abre tu navegador en http://localhost:5173.
Inicia sesión con el usuario administrador:
Email: admin@sgcl.cl
Contraseña: admin123
4. Comandos Útiles
Backend
npm run start:dev: Inicia el servidor en modo observador (recompila al guardar).
npm run lint: Corrige problemas de formato y sintaxis con ESLint.
npx prisma studio: Abre una interfaz visual en el navegador para ver y editar la base de datos local.
npx prisma migrate reset: ¡Peligro! Borra toda la base de datos y la recrea desde cero (ejecuta el seed automáticamente).
Frontend
npm run dev: Inicia el servidor de Vite.
npm run build: Compila la aplicación para producción (genera la carpeta dist/).
5. Notas de Despliegue (Producción)
Para llevar la aplicación a un servidor real (ej. AWS, DigitalOcean, On-Premise):

Base de Datos: Usar una instancia administrada de PostgreSQL en lugar del Docker local.
Backend: Ejecutar npm run build y luego npm run start:prod. Se recomienda usar un gestor de procesos como PM2 para mantener la app viva.
Frontend: Ejecutar npm run build. Tomar los archivos estáticos de la carpeta dist/ y servirlos con un servidor web como Nginx o Vercel.
Variables de Entorno: Asegurar que .env en el backend tenga NODE_ENV=production y un JWT_SECRET robusto.
CORS: Configurar correctamente el CORS en backend/src/main.ts para permitir solo el dominio del frontend en producción.
