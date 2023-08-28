# ✨ UWU ✨

UWU es un sitio ecommerce de productos de belleza variados, realizado con React.js, Node.js y MongoDB

## Deploy

[uwu deploy](https://desafio01-production.up.railway.app/)

## Datos de log in
### Admin
- admin@coder.com // admin

### Premium
- premium@premium.com // premium

### User
- user@user.com // user


## Descripción

Desde el índex se pueden acceder los endpoints pertenecientes al backend para ver productos nuevos, log in, sign up y subscribe. Una vez loggeado en el sitio, el usuario puede interactuar con un shop paginado, con categorías y límite de muestra; puede crear productos (en el caso de un usuario premium) y editar su propia cuenta. Por su parte, el administrador puede eliminar cualquier producto y purgar usuarios inactivos. Todos los usuarios pueden dejar comentarios en la plataforma para cada producto.

## Librerías

- [Create React App][cra] - Setup
- [React Router][router] - Navegación
- [Toastify][toast] - Notificaciones
- [uuid][uuid]

## Prerequisitos

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org)

## Other tools used

- Adobe Illustrator 
- Adobe Photoshop 

## Estructura de folders relevantes

- `docs`: Contiene documentación de API.
- `frontend`: Contiene todo el frontend.
    - `components`: Componentes utilizados.
    - `context`: Context Providers.
- `src`: Contiene la totalidad del backend.
    - `config`: Archivos de configuración de la API.
    - `controllers`: Controladores para cada endpoint.
    - `dao`: Contiene factory, repository & services.
        - `dto`: Data Transfer Objects.
        - `managers`: Contiene managers FS (NO ESTÁ EN USO) y DB.
            - `factory`: Archivo factory.
            - `DB/models`: Archivos modelo de MDB.
            - `DB/services`: Archivos service para cada modelo.
        - `repository`: Contiene repository donde es necesario.
    - `errors`: Contiene configuración para customError.
    - `routes`: Contiene routers.
    - `views`: Archivos backup de handlebars (NO ESTÁN EN USO)
    - `App.js`: Componente principal.

[cra]: https://github.com/facebook/create-react-app
[router]: https://github.com/remix-run/react-router
[form]: https://github.com/react-hook-form/react-hook-form
[toast]: https://www.npmjs.com/package/react-toastify
[uuid] : https://www.npmjs.com/package/uuid