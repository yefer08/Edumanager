# 🔥 Configuración de Firebase para BiblioEdu

## Error Actual: `auth/configuration-not-found`

Este error indica que la **autenticación por Email/Password no está habilitada** en Firebase Console.

## 📋 Pasos para solucionarlo:

### 1. **Ir a Firebase Console**
```
https://console.firebase.google.com/project/biblioedu-1e659
```

### 2. **Habilitar Authentication**
1. En el menú lateral, hacer clic en **"Authentication"**
2. Ir a la pestaña **"Sign-in method"**
3. Buscar **"Email/Password"** en la lista de proveedores
4. Hacer clic en **"Email/Password"**
5. **Habilitar** la primera opción (Email/Password)
6. Opcionalmente habilitar la segunda opción (Email link - passwordless sign-in)
7. Hacer clic en **"Save"** o **"Guardar"**

### 3. **Configurar Firestore Database**
1. En el menú lateral, hacer clic en **"Firestore Database"**
2. Si no está creado, hacer clic en **"Create database"**
3. Seleccionar **"Start in test mode"** (para desarrollo)
4. Elegir una ubicación (preferiblemente us-central)
5. Hacer clic en **"Done"**

### 4. **Configurar reglas de Firestore (Opcional)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso completo para usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. **Verificar configuración del proyecto**
- **Project ID**: `biblioedu-1e659`
- **Auth Domain**: `biblioedu-1e659.firebaseapp.com`
- **API Key**: Verificar que esté habilitada para tu dominio

## 🧪 Prueba después de la configuración:
1. Recargar la aplicación en el navegador
2. Intentar registrar un nuevo usuario
3. Verificar que no aparezcan errores en la consola

## 📞 Si persisten los problemas:
- Verificar que la clave API esté habilitada
- Revisar que el dominio localhost esté autorizado
- Comprobar las reglas de Firestore
- Verificar que el proyecto tenga facturación habilitada (si es necesario)

## 🔧 Configuración actual del proyecto:
- **Firebase SDK**: v10.7.1
- **React**: ^18.3.1  
- **Vite**: ^5.4.8

¡Una vez completados estos pasos, la autenticación debería funcionar correctamente! 🚀