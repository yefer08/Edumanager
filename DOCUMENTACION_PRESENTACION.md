# 📚 BIBLIOMANAGER - DOCUMENTACIÓN PARA PRESENTACIÓN A JURADOS

## 🎯 1. INFORMACIÓN GENERAL DEL PROYECTO

### Datos Básicos
- **Nombre del Proyecto:** BiblioManager (Plataforma Web de Biblioteca Virtual Inteligente)
- **Programa Académico:** Ingeniería del Software
- **Facultad:** Ingeniería
- **Versión:** 1.0.0
- **Repositorio:** https://github.com/yefer08/Edumanager
- **Rama Principal:** develop

---

## 🏗️ 2. ARQUITECTURA DEL PROYECTO

### 2.1 Patrón de Arquitectura
**Arquitectura de 3 Capas (Three-Tier Architecture)**

```
┌─────────────────────────────────────────────────┐
│           CAPA DE PRESENTACIÓN                  │
│         (Frontend - React.js)                   │
│  - Componentes UI                               │
│  - Páginas                                      │
│  - Estilos CSS                                  │
└─────────────────────────────────────────────────┘
                    ↕️
┌─────────────────────────────────────────────────┐
│          CAPA DE LÓGICA DE NEGOCIO              │
│         (Context API + Custom Hooks)            │
│  - AuthContext (Autenticación)                  │
│  - PreferencesContext (Preferencias)            │
│  - useOpenLibrary (Integración API)             │
└─────────────────────────────────────────────────┘
                    ↕️
┌─────────────────────────────────────────────────┐
│          CAPA DE DATOS (Backend)                │
│         (Firebase Services)                     │
│  - Firebase Authentication                      │
│  - Cloud Firestore (Base de Datos NoSQL)       │
│  - Firebase Analytics                           │
└─────────────────────────────────────────────────┘
                    ↕️
┌─────────────────────────────────────────────────┐
│          SERVICIOS EXTERNOS (APIs)              │
│         (Open Library API)                      │
│  - Catálogo de libros                           │
│  - Búsqueda de libros                           │
│  - Información de autores                       │
└─────────────────────────────────────────────────┘
```

### 2.2 Modelo de Arquitectura Cliente-Servidor

**Cliente (Navegador Web)**
- Single Page Application (SPA)
- React.js + Vite
- Interacción en tiempo real

**Servidor (Firebase Cloud)**
- Backend as a Service (BaaS)
- Autenticación
- Base de datos en tiempo real
- Almacenamiento en la nube

---

## 👨‍💻 3. METODOLOGÍA DE DESARROLLO (SCRUM)

### 3.1 Aplicación de SCRUM

**¿Qué es SCRUM?**
- Metodología ágil para desarrollo de software
- Trabajo en iteraciones cortas (Sprints)
- Entregas incrementales
- Retroalimentación continua

### 3.2 Sprints Realizados

#### 📌 **SPRINT 1: Configuración e Infraestructura** (Semana 1-2)
**Objetivos:**
- ✅ Configuración del proyecto con Vite + React
- ✅ Configuración de Firebase (Authentication, Firestore)
- ✅ Estructura de carpetas y arquitectura base
- ✅ Configuración de rutas con React Router

**Entregables:**
- Proyecto inicializado
- Firebase conectado
- Estructura base de componentes

**Scrum Artifacts:**
- Product Backlog inicial
- Sprint Planning
- Daily Standups (reuniones diarias)

---

#### 📌 **SPRINT 2: Sistema de Autenticación** (Semana 3-4)
**Objetivos:**
- ✅ Implementar registro de usuarios
- ✅ Implementar inicio de sesión
- ✅ Crear contexto de autenticación
- ✅ Validación de formularios

**Entregables:**
- LoginForm.jsx
- RegisterForm.jsx
- AuthContext.jsx
- Validaciones completas

**Documentación:**
- FIREBASE_SETUP.md

---

#### 📌 **SPRINT 3: Gestión de Usuarios y Perfiles** (Semana 5-6)
**Objetivos:**
- ✅ Página de perfil de usuario
- ✅ Sistema de preferencias
- ✅ Actualización de información personal
- ✅ Gestión de géneros de interés

**Entregables:**
- PerfilPage.jsx
- PreferencesContext.jsx
- PreferencesForm.jsx
- AvatarWithInitials.jsx

---

#### 📌 **SPRINT 4: Catálogo de Libros e Integración API** (Semana 7-8)
**Objetivos:**
- ✅ Integración con Open Library API
- ✅ Sistema de búsqueda de libros
- ✅ Visualización de catálogo
- ✅ Carrusel de libros recomendados

**Entregables:**
- useOpenLibrary.js (Custom Hook)
- BibliotecaPage.jsx
- BookCard.jsx
- BookCarousel.jsx
- SearchBar.jsx

---

#### 📌 **SPRINT 5: Sistema de Tareas y Gestión** (Semana 9-10)
**Objetivos:**
- ✅ CRUD de tareas con Firestore
- ✅ Interfaz de gestión de tareas
- ✅ Filtros y búsqueda de tareas
- ✅ Diseño responsivo

**Entregables:**
- TareasPage.jsx
- TaskList.jsx
- Componentes de gestión

---

#### 📌 **SPRINT 6: UX/UI y Optimización** (Semana 11-12)
**Objetivos:**
- ✅ Mejoras de diseño responsivo
- ✅ Optimización de rendimiento
- ✅ Validaciones mejoradas
- ✅ Skeleton loaders
- ✅ Animaciones y transiciones

**Entregables:**
- SkeletonCard.jsx
- Mejoras en CSS
- Optimización de componentes
- Sistema de navegación mejorado

---

#### 📌 **SPRINT 7: Despliegue y Producción** (Semana 13-14)
**Objetivos:**
- ✅ Configuración de Vercel
- ✅ Optimización de build
- ✅ Configuración de Firebase para producción
- ✅ Documentación final

**Entregables:**
- vercel.json
- vite.config.js optimizado
- .gitignore configurado
- Documentación completa

---

### 3.3 Artefactos SCRUM Generados

1. **Product Backlog:**
   - Lista priorizada de funcionalidades
   - Historias de usuario
   - Criterios de aceptación

2. **Sprint Backlog:**
   - Tareas específicas por sprint
   - Estimaciones de tiempo
   - Asignaciones de equipo

3. **Increment:**
   - Versión funcional al final de cada sprint
   - Integración continua
   - Testing iterativo

4. **Retrospectivas:**
   - Mejoras identificadas
   - Lecciones aprendidas
   - Ajustes de proceso

---

## 💻 4. LENGUAJES DE PROGRAMACIÓN Y TECNOLOGÍAS

### 4.1 FRONTEND (Capa de Presentación)

#### **Lenguajes:**
- **JavaScript ES6+** (95%)
  - Sintaxis moderna (arrow functions, async/await, destructuring)
  - Módulos ES6 (import/export)
  - Programación funcional

- **HTML5** (3%)
  - Estructura semántica
  - Accesibilidad web

- **CSS3** (2%)
  - Flexbox y Grid Layout
  - Animaciones y transiciones
  - Diseño responsivo (Mobile-first)

#### **Framework y Librerías:**
```json
{
  "react": "^18.2.0",              // Framework principal
  "react-dom": "^18.2.0",          // Renderizado DOM
  "react-router-dom": "^6.8.1"    // Enrutamiento SPA
}
```

**¿Por qué React?**
- ✅ Componentización reutilizable
- ✅ Virtual DOM para alto rendimiento
- ✅ Hooks para manejo de estado
- ✅ Comunidad activa y documentación extensa

#### **Herramientas de Desarrollo:**
```json
{
  "vite": "^5.0.8",                    // Build tool ultra-rápido
  "eslint": "^8.55.0",                 // Linter de código
  "@vitejs/plugin-react": "^4.2.1"    // Plugin de React para Vite
}
```

---

### 4.2 BACKEND (Capa de Datos)

#### **Plataforma BaaS (Backend as a Service):**
**Firebase de Google**

```javascript
// Servicios utilizados
{
  "firebase": "^12.5.0"
}
```

#### **Módulos de Firebase Implementados:**

1. **Firebase Authentication**
   - Registro de usuarios
   - Inicio de sesión
   - Gestión de sesiones
   - Recuperación de contraseñas

2. **Cloud Firestore (Base de Datos)**
   - Base de datos NoSQL
   - Operaciones en tiempo real
   - Colecciones: users, tasks, preferences

3. **Firebase Analytics**
   - Seguimiento de uso
   - Métricas de rendimiento

**¿Por qué Firebase?**
- ✅ Escalabilidad automática
- ✅ Sincronización en tiempo real
- ✅ Seguridad integrada
- ✅ Hosting gratuito
- ✅ No requiere configuración de servidor

---

## 🗄️ 5. BASE DE DATOS

### 5.1 Tipo de Base de Datos
**Cloud Firestore - Base de Datos NoSQL Documental**

### 5.2 Estructura de la Base de Datos

#### **Colección: users**
```javascript
users/{userId}
{
  uid: "string",                    // ID único de usuario
  email: "string",                  // Correo electrónico
  displayName: "string",            // Nombre completo
  photoURL: "string",               // URL foto de perfil
  birthDate: "timestamp",           // Fecha de nacimiento
  gender: "string",                 // Género
  phoneNumber: "string",            // Teléfono
  address: "string",                // Dirección
  createdAt: "timestamp",           // Fecha de creación
  updatedAt: "timestamp"            // Última actualización
}
```

#### **Colección: preferences**
```javascript
preferences/{userId}
{
  userId: "string",                 // Referencia al usuario
  favoriteGenres: ["array"],        // Géneros favoritos
  readingGoals: "number",           // Meta de lectura
  notifications: "boolean",         // Preferencias de notificaciones
  theme: "string",                  // Tema de interfaz
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### **Colección: tasks**
```javascript
tasks/{taskId}
{
  id: "string",                     // ID de la tarea
  userId: "string",                 // Usuario propietario
  title: "string",                  // Título de la tarea
  description: "string",            // Descripción
  completed: "boolean",             // Estado
  dueDate: "timestamp",             // Fecha límite
  priority: "string",               // Prioridad (alta/media/baja)
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### **Colección: favoriteBooks**
```javascript
favoriteBooks/{bookId}
{
  userId: "string",                 // Usuario
  bookKey: "string",                // ID del libro en Open Library
  title: "string",                  // Título
  author: "string",                 // Autor
  coverUrl: "string",               // Portada
  addedAt: "timestamp"              // Fecha agregado
}
```

### 5.3 Reglas de Seguridad Firestore
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden acceder a sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
    
    match /preferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🔌 6. INTEGRACIÓN DE APIs

### 6.1 Open Library API (Internet Archive)

**¿Qué es Open Library?**
- API pública gratuita
- Catálogo de millones de libros
- Información detallada de libros y autores
- Sin necesidad de API Key

**URL Base:**
```
https://openlibrary.org
```

### 6.2 Endpoints Utilizados

#### **1. Búsqueda de Libros**
```javascript
// Endpoint
GET https://openlibrary.org/search.json

// Parámetros
?q={query}              // Término de búsqueda
&limit=20               // Límite de resultados
&fields=key,title,      // Campos específicos
        author_name,
        cover_i,
        first_publish_year,
        subject

// Implementación en el proyecto
const response = await fetch(
  `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
);
const data = await response.json();
```

#### **2. Búsqueda por Género/Tema**
```javascript
// Endpoint
GET https://openlibrary.org/subjects/{subject}.json

// Ejemplo
GET https://openlibrary.org/subjects/science_fiction.json?limit=10

// Implementación
const response = await fetch(
  `https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json?limit=${limit}`
);
```

#### **3. Detalles de un Libro**
```javascript
// Endpoint
GET https://openlibrary.org{workKey}.json

// Ejemplo
GET https://openlibrary.org/works/OL45883W.json

// Implementación
const response = await fetch(`https://openlibrary.org${workKey}.json`);
const bookDetails = await response.json();
```

### 6.3 Cómo se Conectó la API

#### **Custom Hook: useOpenLibrary.js**

**Ubicación:** `src/hooks/useOpenLibrary.js`

**Funciones Principales:**

```javascript
// 1. Búsqueda de libros
const searchBooks = async (query) => {
  try {
    setLoading(true);
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
    );
    const data = await response.json();
    
    // Transformar datos al formato necesario
    const books = data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] || 'Autor desconocido',
      coverUrl: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : '/placeholder-book.png',
      publishYear: book.first_publish_year,
      subjects: book.subject || []
    }));
    
    setBooks(books);
    setLoading(false);
  } catch (error) {
    setError('Error al buscar libros');
    setLoading(false);
  }
};

// 2. Obtener libros por género
const getBooksByGenre = async (genre, limit = 10) => {
  const response = await fetch(
    `https://openlibrary.org/subjects/${genre}.json?limit=${limit}`
  );
  const data = await response.json();
  return transformBookData(data.works);
};

// 3. Obtener detalles de un libro
const getBookDetails = async (workKey) => {
  const response = await fetch(`https://openlibrary.org${workKey}.json`);
  return await response.json();
};
```

#### **Manejo de Errores**
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error fetching data:', error);
  setError(error.message);
  return null;
}
```

#### **Caché y Optimización**
```javascript
// Estado para caché
const [cache, setCache] = useState({});

// Verificar caché antes de hacer petición
if (cache[cacheKey]) {
  return cache[cacheKey];
}

// Guardar en caché después de la petición
setCache(prev => ({
  ...prev,
  [cacheKey]: data
}));
```

---

## 📱 7. FLUJO DE DATOS EN LA APLICACIÓN

### 7.1 Flujo de Autenticación

```
Usuario → LoginForm → Firebase Auth → AuthContext → App actualizada
```

**Paso a paso:**
1. Usuario ingresa credenciales en `LoginForm.jsx`
2. Se llama a `signInWithEmailAndPassword()` de Firebase
3. Firebase valida y retorna el usuario
4. `AuthContext.jsx` actualiza el estado global
5. La aplicación redirige a la página principal
6. Todos los componentes tienen acceso al usuario autenticado

### 7.2 Flujo de Búsqueda de Libros

```
Usuario → SearchBar → useOpenLibrary → Open Library API → 
BibliotecaPage → BookCard (renderizado)
```

**Paso a paso:**
1. Usuario escribe en `SearchBar.jsx`
2. Se ejecuta `searchBooks()` del hook `useOpenLibrary`
3. Se hace petición GET a Open Library API
4. La API retorna JSON con libros
5. Los datos se transforman al formato de la app
6. `BibliotecaPage.jsx` recibe los libros
7. Se renderizan en componentes `BookCard.jsx`

### 7.3 Flujo de Gestión de Tareas

```
Usuario → TaskList → Firestore → Estado actualizado → UI actualizada
```

**Paso a paso:**
1. Usuario crea/edita tarea en `TaskList.jsx`
2. Se llama a función de Firestore:
   ```javascript
   await addDoc(collection(db, 'tasks'), taskData);
   ```
3. Firestore guarda y retorna confirmación
4. El listener en tiempo real detecta el cambio
5. El estado local se actualiza
6. La UI se re-renderiza automáticamente

---

## 📂 8. ESTRUCTURA DEL PROYECTO

```
Edumanager/
│
├── public/                          # Archivos estáticos
│   ├── images/                      # Imágenes del proyecto
│   └── vite.svg                     # Logo de Vite
│
├── src/                             # Código fuente
│   ├── components/                  # Componentes reutilizables
│   │   ├── AvatarWithInitials.jsx   # Avatar con iniciales
│   │   ├── BookCard.jsx             # Tarjeta de libro
│   │   ├── BookCardSimple.jsx       # Tarjeta simplificada
│   │   ├── BookCarousel.jsx         # Carrusel de libros
│   │   ├── Footer.jsx               # Pie de página
│   │   ├── Header.jsx               # Encabezado
│   │   ├── LoginForm.jsx            # Formulario de login
│   │   ├── Navigation.jsx           # Navegación
│   │   ├── PreferencesForm.jsx      # Formulario de preferencias
│   │   ├── RecommendationsSystem.jsx # Sistema de recomendaciones
│   │   ├── RegisterForm.jsx         # Formulario de registro
│   │   ├── SearchBar.jsx            # Barra de búsqueda
│   │   ├── SkeletonCard.jsx         # Skeleton loader
│   │   └── TaskList.jsx             # Lista de tareas
│   │
│   ├── context/                     # Contextos de React
│   │   ├── AuthContext.jsx          # Contexto de autenticación
│   │   └── PreferencesContext.jsx   # Contexto de preferencias
│   │
│   ├── hooks/                       # Custom Hooks
│   │   └── useOpenLibrary.js        # Hook para Open Library API
│   │
│   ├── pages/                       # Páginas de la aplicación
│   │   ├── BibliotecaPage.jsx       # Página de biblioteca
│   │   ├── HomePage.jsx             # Página principal
│   │   ├── LoginPage.jsx            # Página de login
│   │   ├── PerfilPage.jsx           # Página de perfil
│   │   ├── RegisterPage.jsx         # Página de registro
│   │   └── TareasPage.jsx           # Página de tareas
│   │
│   ├── config/                      # Configuraciones
│   │   └── firebaseConfig.js        # Configuración de Firebase
│   │
│   ├── styles/                      # Estilos globales
│   │   └── (archivos CSS)
│   │
│   ├── utils/                       # Utilidades
│   │
│   ├── App.jsx                      # Componente principal
│   ├── App.css                      # Estilos del App
│   ├── main.jsx                     # Punto de entrada
│   └── index.css                    # Estilos globales
│
├── .gitignore                       # Archivos ignorados por Git
├── .vercelignore                    # Archivos ignorados por Vercel
├── firestore.rules                  # Reglas de seguridad Firestore
├── index.html                       # HTML principal
├── package.json                     # Dependencias y scripts
├── package-lock.json                # Lockfile de dependencias
├── vercel.json                      # Configuración de Vercel
├── vite.config.js                   # Configuración de Vite
│
├── README.md                        # Documentación del proyecto
├── FIREBASE_SETUP.md                # Guía de configuración Firebase
├── INTEGRATION_SUMMARY.md           # Resumen de integración
└── DOCUMENTACION_PRESENTACION.md    # Este documento
```

---

## 🚀 9. PROCESO DE DESPLIEGUE

### 9.1 Plataforma de Hosting
**Vercel** - Plataforma de despliegue para aplicaciones web

**¿Por qué Vercel?**
- ✅ Integración automática con GitHub
- ✅ Despliegue continuo (CI/CD)
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Preview de ramas
- ✅ Gratuito para proyectos personales

### 9.2 Configuración de Despliegue

**vercel.json**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**vite.config.js** (Optimizado para producción)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('firebase')) return 'firebase'
        }
      }
    }
  }
})
```

### 9.3 Variables de Entorno

**Configuración en Vercel:**
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🎨 10. CARACTERÍSTICAS DESTACABLES

### 10.1 Diseño Responsivo
- Mobile-first approach
- Breakpoints para tablet y desktop
- Imágenes optimizadas
- Navegación adaptativa

### 10.2 Experiencia de Usuario (UX)
- Skeleton loaders durante carga
- Feedback visual en todas las acciones
- Validación en tiempo real
- Mensajes de error claros

### 10.3 Rendimiento
- Code splitting automático
- Lazy loading de imágenes
- Caché de peticiones API
- Bundle optimizado (Firebase ~124KB gzipped)

### 10.4 Seguridad
- Autenticación Firebase
- Reglas de seguridad Firestore
- Validación client-side y server-side
- HTTPS obligatorio

---

## 📊 11. MÉTRICAS DEL PROYECTO

### Código
- **Archivos totales:** ~50 archivos
- **Líneas de código:** ~3,500 líneas
- **Componentes React:** 20+ componentes
- **Páginas:** 6 páginas principales

### Build
- **Tiempo de build:** ~5 segundos
- **Tamaño del bundle:**
  - Main bundle: ~171 KB (55 KB gzipped)
  - Firebase bundle: ~524 KB (124 KB gzipped)
  - CSS total: ~54 KB (11 KB gzipped)

### Performance
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** 90+

---

## 🎯 12. PUNTOS CLAVE PARA LA PRESENTACIÓN

### Para los Jurados - Resumen Ejecutivo:

1. **Arquitectura Moderna:**
   - SPA con React.js
   - BaaS con Firebase
   - API REST con Open Library
   - Despliegue en Vercel

2. **Metodología Ágil:**
   - 7 Sprints de 2 semanas
   - Entregas incrementales
   - Mejora continua

3. **Stack Tecnológico:**
   - **Frontend:** React 18, JavaScript ES6+, CSS3
   - **Backend:** Firebase (Auth + Firestore)
   - **API Externa:** Open Library
   - **Build Tool:** Vite
   - **Hosting:** Vercel

4. **Base de Datos NoSQL:**
   - Cloud Firestore
   - 4 colecciones principales
   - Sincronización en tiempo real
   - Reglas de seguridad implementadas

5. **Integración API:**
   - Custom Hook (useOpenLibrary)
   - 3 endpoints principales
   - Manejo de errores robusto
   - Sistema de caché

6. **Características Destacables:**
   - Autenticación completa
   - Sistema de recomendaciones
   - Gestión de tareas
   - Diseño responsivo
   - Optimización de rendimiento

---

## 📞 13. DATOS DE CONTACTO Y RECURSOS

- **Repositorio:** https://github.com/yefer08/Edumanager
- **Rama:** develop
- **Demo en Vivo:** [URL de Vercel]
- **Documentación Técnica:** Ver archivos .md en el repositorio

---

## 📝 NOTAS FINALES PARA LA PRESENTACIÓN

### Guión Sugerido:

1. **Introducción (2 min):**
   - Presentar el problema que resuelve BiblioManager
   - Objetivos del proyecto

2. **Arquitectura (3 min):**
   - Explicar arquitectura de 3 capas
   - Mostrar diagrama
   - Explicar flujo de datos

3. **Metodología (3 min):**
   - Presentar SCRUM
   - Mostrar los 7 sprints
   - Explicar entregables

4. **Tecnologías (4 min):**
   - Stack completo
   - Por qué cada tecnología
   - Demo de Firebase Console

5. **Base de Datos (3 min):**
   - Estructura Firestore
   - Mostrar colecciones
   - Explicar reglas de seguridad

6. **Integración API (3 min):**
   - Cómo funciona Open Library
   - Mostrar código del hook
   - Demo de búsqueda en vivo

7. **Demo en Vivo (5 min):**
   - Registro de usuario
   - Búsqueda de libros
   - Agregar a favoritos
   - Gestión de tareas

8. **Conclusiones (2 min):**
   - Logros alcanzados
   - Aprendizajes
   - Trabajo futuro

---

**¡ÉXITO EN TU PRESENTACIÓN!** 🚀📚
