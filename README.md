# BiblioManager - Plataforma Web de Biblioteca Virtual Inteligente

## 📚 Descripción del Proyecto

**Programa académico:** Ingeniería del Software  
**Facultad:** Ingeniería

## 1. INTRODUCCIÓN

En la era digital, la gestión eficiente del conocimiento es esencial para fomentar la lectura y el aprendizaje. **BiblioManager** es una plataforma web de biblioteca virtual inteligente que permite a los usuarios registrarse, buscar libros, marcar favoritos, consultar el historial y conocer el estado de cada ejemplar.

El sistema incorpora una sesión de recomendados, esto se implementará cuando el usuario esté haciendo el registro aparezca la opción de géneros de interés y el cual cuando inicie de sesión aparezca los libros de sugerencias.

## 2. PLANTEAMIENTO DEL PROBLEMA

En clásica instituciones académicas, la gestión de libros y el acceso a la información aún se realizan de forma manual o mediante sistemas poco intuitivos. Esta situación dificulta la búsqueda, el registro y el seguimiento de los préstamos, afectando la eficiencia del personal y la satisfacción de los usuarios. Además, la ausencia de herramientas digitales limita la posibilidad de ofrecer recomendaciones personalizadas, reduciendo el interés por la lectura y el aprovechamiento de los recursos bibliográficos. Como resultado, se presentan bajos índices de lectura, pérdida de información y una experiencia poco atractiva. Ante este panorama, surge la necesidad de implementar una plataforma digital inteligente que automatice los procesos, optimice la gestión bibliotecaria y promueva la lectura mediante el uso de tecnologías web e inteligencia artificial.

## 3. METODOLOGÍA

El desarrollo del módulo **BiblioManager** se basará en la metodología ágil **Scrum**, que permite iteraciones cortas, retroalimentación constante y flexibilidad ante los cambios. El proceso incluye seis etapas:

- **Análisis de requerimientos:** para recolectar información sobre la biblioteca
- **Diseño:** con diagramas, base de datos e interfaces; desarrollo, en Java y tecnologías web
- **Integración:** mediante conexión con APIs externas
- **Pruebas:** para validar el funcionamiento y corregir errores
- **Documentación y entrega:** con el despliegue del prototipo funcional

Este enfoque garantiza eficiencia y evolución continua del sistema.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas
- 🔐 **Sistema de Autenticación:** Registro e inicio de sesión con Firebase
- 👤 **Perfiles de Usuario:** Gestión de información personal y preferencias
- 📖 **Catálogo de Libros:** Visualización y búsqueda de libros disponibles
- ⭐ **Sistema de Favoritos:** Marcar y gestionar libros favoritos
- 🎯 **Recomendaciones Personalizadas:** Basadas en géneros de interés del usuario
- 📱 **Diseño Responsivo:** Optimizado para desktop y móvil
- 🔍 **Búsqueda Avanzada:** Filtros por género, autor y disponibilidad

### 🔄 En Desarrollo
- 📋 **Historial de Préstamos:** Seguimiento de libros prestados
- 📊 **Dashboard Administrativo:** Panel de gestión para bibliotecarios
- 🤖 **IA para Recomendaciones:** Algoritmos inteligentes de sugerencias
- 📱 **Notificaciones:** Alertas de vencimiento y nuevos libros

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React.js, CSS3, JavaScript ES6+
- **Backend:** Firebase (Authentication, Firestore)
- **Desarrollo:** Vite, ESLint
- **Routing:** React Router DOM
- **Metodología:** Scrum/Ágil

## 🏃‍♂️ Cómo Ejecutar el Proyecto

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/yefer08/Edumanager.git

# Navegar al directorio
cd Biblioedu

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Configuración de Firebase
1. Crear un proyecto en Firebase Console
2. Habilitar Authentication y Firestore
3. Configurar las credenciales en `src/config/firebaseConfig.js`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── BookCard.jsx    # Tarjeta de libro
│   ├── BookCarousel.jsx # Carrusel de libros
│   ├── LoginForm.jsx   # Formulario de login
│   ├── RegisterForm.jsx # Formulario de registro
│   └── Navigation.jsx  # Navegación principal
├── context/            # Contextos de React
│   ├── AuthContext.jsx # Autenticación
│   └── PreferencesContext.jsx # Preferencias
├── pages/              # Páginas principales
├── config/             # Configuraciones
└── App.jsx            # Componente principal
```

## 🎯 Objetivos del Proyecto

### Objetivo General
Desarrollar una plataforma web inteligente para la gestión eficiente de bibliotecas virtuales que mejore la experiencia del usuario y optimice los procesos bibliotecarios.

### Objetivos Específicos
1. Implementar un sistema de autenticación seguro
2. Crear un catálogo digital intuitivo y funcional
3. Desarrollar algoritmos de recomendación personalizados
4. Optimizar la gestión de préstamos y devoluciones
5. Proporcionar herramientas analíticas para bibliotecarios

## 👥 Equipo de Desarrollo

- **Desarrollador Principal:** [Tu Nombre]
- **Metodología:** Scrum
- **Sprint Duration:** 2 semanas
- **Tecnologías:** React, Firebase, JavaScript

## 📈 Roadmap

### Sprint 1 (Completado)
- ✅ Configuración inicial del proyecto
- ✅ Sistema de autenticación
- ✅ Interfaz básica de usuario

### Sprint 2 (En Progreso)
- 🔄 Sistema de recomendaciones
- 🔄 Optimización de rendimiento
- 🔄 Gestión de preferencias

### Sprint 3 (Planificado)
- 📋 Historial de préstamos
- 📊 Dashboard administrativo
- 🔍 Búsqueda avanzada

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📧 Contacto

- **Proyecto:** BiblioManager
- **Universidad:** [Nombre de la Universidad]
- **Facultad:** Ingeniería
- **Programa:** Ingeniería del Software

---

*Desarrollado con ❤️ para mejorar la experiencia de lectura digital*