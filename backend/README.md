# Sistema de Gestión de Rutinas de Gimnasio - Backend

## 1. Descripción del proyecto

Este proyecto corresponde al backend del Sistema de Gestión de Rutinas de Gimnasio.

La API permite gestionar rutinas de entrenamiento y sus ejercicios asociados. Desde el backend se exponen endpoints REST para crear, listar, buscar, visualizar, modificar y eliminar rutinas, además de agregar, modificar y eliminar ejercicios dentro de cada rutina.

El backend se comunica con una base de datos PostgreSQL y utiliza SQLModel para representar las entidades del dominio y gestionar la persistencia de datos.

## 2. Entregables del backend

El backend incluye los siguientes archivos principales como parte de la entrega:

- `requirements.txt`: contiene todas las dependencias necesarias para instalar y ejecutar el backend.
- `README.md`: contiene las instrucciones completas de instalación, configuración, ejecución y uso de la API.
- `app/`: contiene el código fuente principal del backend.
- `.env.example`: contiene un ejemplo de configuración para las variables de entorno necesarias.

El archivo `.env` debe ser creado localmente por cada persona que ejecute el proyecto, ya que contiene credenciales propias de la base de datos.

## 3. Tecnologías utilizadas

- Python 3.10 o superior
- FastAPI
- SQLModel
- PostgreSQL
- Pydantic
- Uvicorn
- python-dotenv
- psycopg2-binary

## 4. Requisitos previos

Antes de ejecutar el backend, se debe contar con:

- Python 3.10 o superior instalado.
- PostgreSQL instalado y en ejecución.
- pip instalado.
- Una base de datos PostgreSQL creada para el proyecto.
- Un entorno virtual de Python, recomendado para aislar las dependencias.

Para verificar la versión de Python instalada:

```bash
python --version
```

Para verificar que pip esté disponible:

```bash
pip --version
```

## 5. Estructura del proyecto backend

La estructura principal del backend es la siguiente:

```text
backend/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models/
│   │   └── models.py
│   ├── schemas/
│   │   └── schemas.py
│   ├── routers/
│   │   ├── rutinas.py
│   │   └── ejercicios.py
│   ├── core/
│   └── services/
├── requirements.txt
├── .env.example
└── README.md
```

Descripción de los archivos y carpetas principales:

- `app/main.py`: punto de entrada de la aplicación FastAPI. Registra routers, middleware y configuración inicial.
- `app/database.py`: configuración de conexión a PostgreSQL, engine de SQLModel y sesiones de base de datos.
- `app/models/`: contiene los modelos de base de datos definidos con SQLModel.
- `app/schemas/`: contiene los esquemas de validación y respuesta definidos con Pydantic.
- `app/routers/`: contiene los endpoints de la API separados por recurso.
- `app/services/`: carpeta reservada para lógica de servicio si se requiere separar responsabilidades.
- `requirements.txt`: lista de dependencias necesarias para ejecutar el backend.
- `.env.example`: archivo de ejemplo para configurar variables de entorno.

## 6. Configuración de la base de datos

El backend utiliza PostgreSQL como base de datos relacional.

Antes de iniciar el servidor, se debe crear una base de datos llamada:

```text
gym_routines_db
```

### Crear la base de datos con pgAdmin

1. Abrir pgAdmin.
2. Conectarse al servidor local de PostgreSQL.
3. Hacer clic derecho sobre `Databases`.
4. Seleccionar `Create > Database`.
5. En el campo de nombre, ingresar:

```text
gym_routines_db
```

6. Guardar los cambios.

### Crear la base de datos con psql

También se puede crear desde la consola de PostgreSQL:

```sql
CREATE DATABASE gym_routines_db;
```

## 7. Variables de entorno

Dentro de la carpeta `backend`, se debe crear un archivo llamado `.env`.

El archivo `.env` debe contener la variable `DATABASE_URL`, que define la conexión a PostgreSQL.

Formato general del string de conexión:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/gym_routines_db
```

Ejemplo:

```env
DATABASE_URL=postgresql://postgres:123456@localhost:5432/gym_routines_db
```

Donde:

- `usuario` es el usuario de PostgreSQL.
- `password` es la contraseña del usuario de PostgreSQL.
- `localhost` indica que la base de datos corre en la máquina local.
- `5432` es el puerto por defecto de PostgreSQL.
- `gym_routines_db` es el nombre de la base de datos.

Ejemplo de archivo `.env`:

```env
DATABASE_URL=postgresql://postgres:123456@localhost:5432/gym_routines_db
```

El archivo `.env.example` sirve como plantilla de configuración. Se puede copiar su contenido para crear el archivo `.env`.

Importante: el archivo `.env` contiene credenciales locales y no debería subirse a un repositorio público.

## 8. Instalación

Desde la raíz del proyecto, ingresar a la carpeta del backend:

```bash
cd backend
```

Crear un entorno virtual:

```bash
python -m venv venv
```

Activar el entorno virtual en Windows:

```bash
venv\Scripts\activate
```

En Linux o macOS, activar el entorno virtual con:

```bash
source venv/bin/activate
```

Instalar todas las dependencias desde `requirements.txt`:

```bash
pip install -r requirements.txt
```

El archivo `requirements.txt` contiene las dependencias necesarias para ejecutar el backend.

## 9. Migraciones y creación de tablas

Este proyecto no utiliza una herramienta externa de migraciones como Alembic.

Las tablas se crean o verifican automáticamente al iniciar la aplicación mediante SQLModel, siempre que:

- PostgreSQL esté en ejecución.
- La base de datos `gym_routines_db` exista.
- La variable `DATABASE_URL` esté correctamente configurada en el archivo `.env`.

Por este motivo, en esta versión no es necesario ejecutar comandos de migración manuales.

## 10. Ejecución del servidor

Para iniciar el backend en modo desarrollo, ejecutar desde la carpeta `backend`:

```bash
uvicorn app.main:app --reload
```

El backend queda disponible por defecto en:

```text
http://localhost:8000
```

El parámetro `--reload` permite que el servidor se reinicie automáticamente cuando se detectan cambios en el código durante el desarrollo.

## 11. Documentación automática de la API

FastAPI genera documentación automática de la API.

Una vez iniciado el servidor, se puede acceder a Swagger en:

```text
http://localhost:8000/docs
```

Desde esa interfaz se pueden probar los endpoints disponibles.

## 12. Endpoint de prueba

El backend incluye un endpoint de prueba para verificar que la API esté funcionando:

```http
GET /api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "message": "API is healthy"
}
```

## 13. Endpoints disponibles

### Rutinas

Listar todas las rutinas:

```http
GET /api/rutinas
```

Obtener el detalle de una rutina específica:

```http
GET /api/rutinas/{id}
```

Buscar rutinas por nombre:

```http
GET /api/rutinas/buscar?nombre=texto
```

Crear una nueva rutina:

```http
POST /api/rutinas
```

Actualizar una rutina existente:

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

Actualizar un ejercicio existente:

```http
PUT /api/ejercicios/{id}
```

Eliminar un ejercicio:

```http
DELETE /api/ejercicios/{id}
```

## 14. Modelo de datos resumido

El sistema utiliza dos entidades principales:

### Rutina

Una rutina representa un plan de entrenamiento.

Campos principales:

- `id`
- `nombre`
- `descripcion`
- `fecha_creacion`

### Ejercicio

Un ejercicio representa una actividad dentro de una rutina.

Campos principales:

- `id`
- `rutina_id`
- `nombre`
- `dia_semana`
- `series`
- `repeticiones`
- `peso`
- `notas`
- `orden`

La relación entre ambas entidades es uno a muchos:

```text
Rutina 1 ---- N Ejercicio
```

Esto significa que una rutina puede tener muchos ejercicios y cada ejercicio pertenece a una sola rutina.

El campo `rutina_id` en la tabla de ejercicios funciona como clave foránea hacia la tabla de rutinas.

El requerimiento de ejercicios organizados por día se resuelve mediante el campo `dia_semana` de cada ejercicio. No existe una columna física llamada `ejercicios_por_dia` en la tabla de rutinas.

Los ejercicios se ordenan dentro de cada día mediante el campo `orden`.

Al eliminar una rutina, también se eliminan sus ejercicios asociados para evitar registros huérfanos.

## 15. Validaciones principales

El backend aplica validaciones para proteger la integridad de los datos.

Validaciones de rutinas:

- El nombre de la rutina es obligatorio.
- El nombre de la rutina debe ser único.
- La descripción es opcional.

Validaciones de ejercicios:

- El nombre del ejercicio es obligatorio.
- El día de la semana es obligatorio y debe ser válido.
- Los días válidos son: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado y Domingo.
- Las series deben ser mayores a cero.
- Las repeticiones deben ser mayores a cero.
- El peso es opcional, pero si se informa debe ser mayor a cero.
- Las notas son opcionales.
- El orden debe ser mayor a cero.

## 16. Códigos de respuesta principales

La API utiliza códigos HTTP para informar el resultado de cada operación.

Ejemplos:

- `200 OK`: operación exitosa.
- `201 Created`: recurso creado correctamente.
- `400 Bad Request`: error de validación de negocio, por ejemplo nombre duplicado.
- `404 Not Found`: recurso no encontrado.
- `422 Unprocessable Entity`: error de validación automática de datos.
- `500 Internal Server Error`: error inesperado del servidor.

## 17. Notas de ejecución

Para que el backend funcione correctamente:

- PostgreSQL debe estar instalado y en ejecución.
- La base de datos `gym_routines_db` debe existir antes de iniciar el servidor.
- El archivo `.env` debe estar creado dentro de la carpeta `backend`.
- La variable `DATABASE_URL` debe tener una cadena de conexión válida.
- Las tablas se crean o verifican automáticamente al iniciar la aplicación.
- La documentación Swagger queda disponible en `http://localhost:8000/docs`.

## 18. Prueba rápida de funcionamiento

1. Iniciar PostgreSQL.
2. Crear la base de datos `gym_routines_db`.
3. Crear el archivo `.env` dentro de `backend`.
4. Instalar dependencias.
5. Ejecutar el servidor:

```bash
uvicorn app.main:app --reload
```

6. Abrir Swagger:

```text
http://localhost:8000/docs
```

7. Probar el endpoint:

```http
GET /api/health
```

Si el endpoint responde correctamente, el backend está funcionando.