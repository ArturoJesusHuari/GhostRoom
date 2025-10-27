# 🕯️ Ghost Room
> 🔐 **Conversaciones privadas. Salas temporales. Mensajes que desaparecen.** > Bienvenido a Ghost Room: donde cada palabra tiene su momento... y luego desaparece. Todavia en desarrollo ...
---

## 💡 ¿Qué es Ghost Room?

**Ghost Room** es una aplicación de mensajería efímera que permite crear salas de chat temporales donde los mensajes se autodestruyen pasado un tiempo definido por el creador. Diseñada para conversaciones que no necesitan dejar rastro, Ghost Room también evita capturas de pantalla y promueve la privacidad total.

---

## ✨ Características principales

- ⏳ **Mensajes con tiempo de vida**: cada mensaje desaparece automáticamente.
- 🧑‍🤝‍🧑 **Salas únicas**: crea salas privadas para compartir con quien elijas.
- 📵 **Anti-captura de pantalla**: prevenimos screenshots en la app (cuando es posible).
- 🚀 **Rápido y moderno**: construido con React y desplegado en Firebase.
- 🧩 **Backend potente**: usando Supabase para autenticar y gestionar datos en tiempo real.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
| :--- | :--- |
| ⚛️ React | Frontend SPA |
| 🧪 Supabase | Base de datos y autenticación |
| 💨 TailwindCSS | (opcional) Estilado moderno |
| 🔐 Custom JS | Prevención de capturas de pantalla |

---

## 🗄️ Esquema de la Base de Datos (Supabase)

Este es el esquema principal utilizado para gestionar los datos de la aplicación en Supabase.

### Tabla: `public.users`
Información de los usuarios.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único del usuario. Autogenerado. |
| `removal_at` | `timestamp with time zone` | Marca de eliminación o baja del usuario. |
| `username` | `text` | Nombre del usuario. |

### Tabla: `public.rooms`
Define las salas de chat.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único de la sala. Autogenerado. |
| `id_owner` | `uuid` | Usuario creador o dueño. |
| `messages_duration_seconds` | `integer` | Tiempo que duran los mensajes antes de eliminarse. |
| `redirection_address` | `text` | Alguna URL asociada a la sala. |
| `password` | `text` | Contraseña si es sala privada. |
| `name` | `text` | Nombre de la sala. Obligatorio. |
| `create_at` | `timestamp with time zone` | Fecha de creación en UTC. Autogenerada. |

### Tabla: `public.room_user`
Tabla de unión entre salas y usuarios. Indica qué usuario pertenece a qué sala.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único del registro. Autogenerado. |
| `id_user` | `uuid` | Miembro de la sala. |
| `id_room` | `uuid` | Sala a la que pertenece el usuario. |

### Tabla: `public.messages`
Representa los mensajes enviados en una sala. Debe tener la función realtime

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único del mensaje. Autogenerado. |
| `id_room` | `uuid` | Sala donde se envió el mensaje. |
| `content` | `text` | Contenido del mensaje. |
| `created_at` | `timestamp with time zone` | Fecha en UTC del envío. Se autogenera con `now()`. |
| `id_user` | `uuid` | Usuario que envió el mensaje. |

### Tabla: `public.message_seen`
Registra cuándo un usuario ha visto un mensaje.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único del registro. Autogenerado. |
| `id_message` | `uuid` | Referencia al mensaje visto. |
| `id_user` | `uuid` | Usuario que lo vio. |
| `seen_at` | `timestamp with time zone` | Momento en que se marcó como visto. |

---

## 🧪 ¿Cómo lo uso localmente?

1.  Clona el repositorio e instala dependencias:
    ```bash
    git clone https://github.com/ArturoJesusHuari/GhostRoom.git
    cd GhostRoom
    npm install
    ```

2.  Configura las variables de entorno:
    ⚠️ Requiere configuración previa de Supabase. Debes crear un archivo llamado `.env` en la raíz del proyecto.
    Tu archivo `.env` debe lucir así (reemplaza con tus claves):
    ```.env
    VITE_SUPABASE_URL=[https://tu-proyecto-url.supabase.co](https://tu-proyecto-url.supabase.co)
    VITE_SUPABASE_KEY=tu-anon-key-publica
    ```

3.  Ejecuta la aplicación:
    ```bash
    npm run dev
    ```
