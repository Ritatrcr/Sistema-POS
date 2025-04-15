# 🥭🍽️ ManGusteau - Sistema de Restaurante Inteligente

**ManGusteau** es una aplicación full stack diseñada para gestionar un restaurante de manera eficiente y moderna. Desarrollada con **React Native + Expo**, **Express**, **TypeScript** y **Firebase**, permite controlar pedidos, gestionar productos, administrar usuarios y visualizar reportes. Todo en tiempo real y con acceso segmentado por roles.

---

## 🚀 Tecnologías Principales

- ⚛️ **Frontend:** React Native con Expo (para apps móviles)
- 🔥 **Backend:** Node.js + Express (API REST)
- 💬 **Base de Datos:** Firebase Firestore (NoSQL en tiempo real)
- 📦 **Almacenamiento:** Firebase Storage (imágenes de productos)
- 🛡️ **Autenticación:** Firebase Auth
- 💻 **Lenguaje:** TypeScript en todo el stack

---

## 👥 Roles en el sistema

### 👤 Cliente
- Escanea un código QR para identificarse en una mesa
- Realiza pedidos desde el celular
- Visualiza el estado de sus órdenes en tiempo real
- Gestiona su perfil y PQRS

### 👨‍🍳 Cocina
- Visualiza las órdenes por estado (`ordenado`, `cocinando`, `listo`)
- Cambia el estado de los pedidos según el progreso
- Visualiza recetas e ingredientes por pasos
- Ve un resumen de qué productos necesita preparar

### 💼 Caja / Administrador
- CRUD de productos con imágenes y categorías
- Generación de informes de ventas y pedidos
- Control de usuarios y sus roles
- Visualiza y gestiona todas las órdenes
- Cambia estados a “entregado”, “pagado”, “finalizado”, etc.

---

## 📦 Estructura del Proyecto

Sistema-POS/
├── app/                     # Rutas y pantallas del frontend móvil
├── components/              # Componentes reutilizables (modals, botones, etc.)
├── context/                 # Contextos globales (auth, productos, órdenes)
├── server/                  # Backend con Express y lógica de API REST
├── utils/                   # Configuración de Firebase, helpers, etc.
├── assets/                  # Imágenes, iconos
├── types/                   # Definiciones de tipos TypeScript
├── package.json             # Dependencias frontend
├── README.md

---

## ⚙️ Instalación y ejecución

### 1. Clona el repositorio:

\`\`\`bash
https://github.com/Ritatrcr/Sistema-POS.git
\`\`\`

### 2. Instala las dependencias:

\`\`\`bash
npm install
\`\`\`

### 3. Configura Firebase:

Crea un archivo `.env` en la raíz con tus credenciales de Firebase:

\`\`\`
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
\`\`\`

### 4. Ejecuta el proyecto móvil:

\`\`\`bash
npx expo start
\`\`\`

### 5. (Opcional) Ejecuta el servidor backend:

\`\`\`bash
cd server
npm run dev
\`\`\`

---

## 🧠 Aprendizajes y objetivos

- Aplicación real multirol con arquitectura modular
- Manejo de estados globales con Context API
- Comunicación Firebase en tiempo real
- Subida y visualización de imágenes con Storage
- Buenas prácticas con TypeScript
- Implementación de diseño adaptable y modular en Expo

---

## 🤝 Colaboradores

- [Rita Trindade da Cruz](https://github.com/Ritatrcr) 
- [Brandon Eduardo Merchan Sandoval](https://github.com/Merchito12) 

---

---

### 💛 Un merge perfecto


Este proyecto fue creado por dos manguitos.  
**ManGusteau** es mucho más que una app, es la demostración de lo que somos cuando creamos juntos, del verdadero significado del trabajo en equipo.  
Gracias por acompañarme en mis ideas locas y en momentos de estrés, en mis "se me olvidó pushearlo" y en mis "no me gustó, lo voy a borrar y volver a hacerlo desde cero". 
Te amo, Manguito. 💛🥭

 

---
