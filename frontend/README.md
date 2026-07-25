# Sistema de Gestión de Rutinas de Gimnasio - Frontend

## 1. Descripción del proyecto

Este proyecto corresponde al frontend del Sistema de Gestión de Rutinas de Gimnasio.

La aplicación permite gestionar rutinas de entrenamiento desde una interfaz web. Desde el frontend se pueden listar rutinas, crear nuevas rutinas, buscar rutinas por nombre, ver el detalle de una rutina, editar rutinas, eliminarlas y administrar los ejercicios asociados a cada una.

Los ejercicios se muestran agrupados por día de la semana y ordenados mediante el campo `orden`.

El frontend se comunica con el backend mediante una API REST desarrollada con FastAPI.

## 2. Tecnologías utilizadas

Las principales tecnologías utilizadas en este frontend son:

- React
- Vite
- Material UI
- Axios
- React Router
- JavaScript

## 3. Requisitos previos

Antes de ejecutar el frontend, se debe contar con:

- Node.js instalado.
- npm instalado.
- Backend del proyecto ejecutándose.
- PostgreSQL configurado y funcionando desde el backend.

Versión recomendada de Node.js:

```text
Node.js 20 o superior
```

Versión recomendada de npm:

```text
npm 10 o superior
```

Para verificar las versiones instaladas:

```bash
node -v
npm -v
```

## 4. Entregables del frontend

El frontend incluye los siguientes archivos principales como parte de la entrega:

- `package.json`: contiene los scripts y todas las dependencias necesarias para instalar y ejecutar el frontend.
- `README.md`: contiene las instrucciones completas de instalación, configuración, ejecución y uso de la aplicación.
- `src/`: contiene el código fuente principal del frontend.
- `.env.example`: contiene un ejemplo de configuración para la URL del backend.

El archivo `.env` debe ser creado localmente por cada persona que ejecute el proyecto, ya que depende de la URL donde se encuentre ejecutándose el backend.

## 5. Estructura del proyecto frontend

La estructura principal del frontend es la siguiente:

```text
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── services/
│   │   ├── rutinaService.js
│   │   └── ejercicioService.js
│   ├── components/
│   │   ├── RutinaForm.jsx
│   │   ├── EjercicioForm.jsx
│   │   └── ConfirmDialog.jsx
│   ├── pages/
│   │   ├── RutinasList.jsx
│   │   └── RutinaDetail.jsx
│   ├── routes/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── package-lock.json
├── .env.example
├── index.html
├── vite.config.js
└── README.md
```

Descripción de las carpetas y archivos principales:

- `src/api/`: contiene la configuración base de Axios.
- `src/services/`: contiene las funciones que centralizan la comunicación con el backend.
- `src/components/`: contiene componentes reutilizables como formularios y diálogos de confirmación.
- `src/pages/`: contiene las pantallas principales de la aplicación.
- `src/routes/`: carpeta reservada para organización de rutas si se amplía el proyecto.
- `src/utils/`: carpeta reservada para utilidades generales.
- `src/App.jsx`: componente principal donde se define la navegación de la aplicación.
- `src/main.jsx`: punto de entrada de React.
- `package.json`: archivo de configuración, scripts y dependencias del frontend.
- `package-lock.json`: archivo generado por npm para registrar las versiones instaladas.
- `.env.example`: plantilla de variables de entorno.

## 6. Configuración de variables de entorno

El frontend necesita conocer la URL del backend para consumir la API REST.

Dentro de la carpeta `frontend`, se debe crear un archivo llamado `.env`.

El archivo `.env` debe contener la variable `VITE_API_URL`.

Formato:

```env
VITE_API_URL=http://localhost:8000/api
```

Ejemplo de archivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

El archivo `.env.example` sirve como referencia para crear el archivo `.env`.

Importante: el backend debe estar ejecutándose en la URL configurada para que el frontend pueda cargar, crear, editar y eliminar datos correctamente.

## 7. Instalación

Desde la raíz del proyecto, ingresar a la carpeta del frontend:

```bash
cd frontend
```

Instalar las dependencias definidas en `package.json`:

```bash
npm install
```

Este comando instala las dependencias necesarias para ejecutar la aplicación, incluyendo React, Vite, Material UI, Axios y React Router.

## 8. Ejecución en modo desarrollo

Para iniciar el frontend en modo desarrollo:

```bash
npm run dev
```

Por defecto, Vite ejecuta la aplicación en:

```text
http://localhost:5173
```

Si ese puerto estuviera ocupado, Vite puede ofrecer otro puerto disponible. En ese caso, se debe usar la URL indicada por la terminal.

## 9. Compilación para producción

Para generar una versión optimizada para producción:

```bash
npm run build
```

Este comando genera los archivos finales dentro de la carpeta:

```text
dist/
```

## 10. Vista previa de producción

Para probar localmente la versión generada para producción:

```bash
npm run preview
```

Este comando sirve para revisar el resultado del build antes de publicarlo en un servidor.

## 11. Revisión de código

El proyecto incluye un script de revisión con ESLint.

Para ejecutarlo:

```bash
npm run lint
```

Este comando revisa el código fuente del frontend y ayuda a detectar posibles problemas de estilo o errores comunes.

## 12. Funcionalidades implementadas

El frontend implementa las siguientes funcionalidades:

- Listado de rutinas.
- Creación de rutinas.
- Búsqueda de rutinas por nombre en tiempo real.
- Visualización del detalle de una rutina.
- Edición de nombre y descripción de una rutina.
- Eliminación de rutina con confirmación.
- Agregar ejercicios a una rutina.
- Editar ejercicios existentes.
- Eliminar ejercicios con confirmación.
- Visualización de ejercicios agrupados por día de la semana.
- Ordenamiento de ejercicios mediante el campo `orden`.
- Validaciones de formularios.
- Mensajes de éxito.
- Mensajes de error.
- Estados de carga.
- Manejo de estados vacíos, por ejemplo rutinas sin ejercicios.

## 13. Comunicación con el backend

La comunicación con el backend se realiza mediante Axios.

La configuración base de Axios se encuentra en:

```text
src/api/axiosConfig.js
```

Los servicios que consumen la API están centralizados en:

```text
src/services/
```

Servicios principales:

```text
src/services/rutinaService.js
src/services/ejercicioService.js
```

Esta organización evita usar URLs completas directamente dentro de los componentes. Los componentes consumen funciones de servicio, y los servicios se encargan de llamar a los endpoints correspondientes.

## 14. Endpoints consumidos

### Rutinas

Listar todas las rutinas:

```http
GET /api/rutinas
```

Obtener detalle de una rutina:

```http
GET /api/rutinas/{id}
```

Buscar rutinas por nombre:

```http
GET /api/rutinas/buscar?nombre=texto
```

Crear una rutina:

```http
POST /api/rutinas
```

Actualizar una rutina:

```http
PUT /api/rutinas/{id}
```

Eliminar una rutina:

```http
DELETE /api/rutinas/{id}
```

### Ejercicios

Agregar un ejercicio a una rutina:

```http
POST /api/rutinas/{id}/ejercicios
```

Actualizar un ejercicio:

```http
PUT /api/ejercicios/{id}
```

Eliminar un ejercicio:

```http
DELETE /api/ejercicios/{id}
```

## 15. Validaciones principales en el frontend

La aplicación valida los formularios antes de enviar datos al backend.

Validaciones de rutinas:

- El nombre de la rutina es obligatorio.
- No se permite un nombre compuesto solo por espacios.
- Se muestra error si el backend informa que el nombre ya existe.

Validaciones de ejercicios:

- El nombre del ejercicio es obligatorio.
- El día de la semana es obligatorio.
- Las series deben ser mayores a cero.
- Las repeticiones deben ser mayores a cero.
- El peso es opcional, pero si se informa debe ser mayor a cero.
- El orden debe ser mayor a cero.
- No se permiten caracteres inválidos en campos numéricos.

Las validaciones del frontend mejoran la experiencia del usuario, pero el backend también valida los datos para garantizar la integridad del sistema.

## 16. Notas de uso

Para usar correctamente la aplicación:

- El backend debe estar ejecutándose antes de iniciar o usar el frontend.
- PostgreSQL debe estar configurado desde el backend.
- El archivo `.env` del frontend debe tener correctamente configurada la variable `VITE_API_URL`.
- La búsqueda de rutinas funciona en tiempo real.
- Los ejercicios se organizan por día de la semana.
- El orden de ejercicios se gestiona mediante el campo `orden`.
- No se utiliza drag and drop.

## 17. Solución de problemas comunes

### El frontend no carga datos

Verificar que el backend esté ejecutándose:

```text
http://localhost:8000/docs
```

También verificar que el archivo `.env` del frontend tenga:

```env
VITE_API_URL=http://localhost:8000/api
```

### Aparece un error de conexión

Puede ocurrir si el backend está apagado o si la URL configurada en `VITE_API_URL` es incorrecta.

Solución:

1. Iniciar el backend.
2. Revisar la variable `VITE_API_URL`.
3. Reiniciar el frontend.

### No se reconoce el comando npm

Verificar que Node.js y npm estén instalados:

```bash
node -v
npm -v
```

Si no aparecen versiones, se debe instalar Node.js.

### Faltan dependencias

Ejecutar nuevamente:

```bash
npm install
```

### El puerto 5173 está ocupado

Vite puede ofrecer otro puerto disponible. Se debe abrir la URL indicada por la terminal.

### No se aplican cambios del archivo .env

Luego de modificar el archivo `.env`, se debe reiniciar el servidor de desarrollo del frontend:

```bash
npm run dev
```

## 18. Prueba rápida de funcionamiento

1. Iniciar el backend desde la carpeta `backend`.

2. Verificar que Swagger abra en:

```text
http://localhost:8000/docs
```

3. Ingresar a la carpeta `frontend`:

```bash
cd frontend
```

4. Instalar dependencias:

```bash
npm install
```

5. Crear el archivo `.env` con:

```env
VITE_API_URL=http://localhost:8000/api
```

6. Ejecutar el frontend:

```bash
npm run dev
```

7. Abrir la aplicación en:

```text
http://localhost:5173
```

8. Verificar que se pueda listar, crear, buscar, editar y eliminar rutinas.

9. Verificar que se pueda agregar, editar y eliminar ejercicios desde el detalle de una rutina.