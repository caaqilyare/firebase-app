<div align="center">
  <h1>🔐 Firebase Credential Manager</h1>
  <p>A modern credential management system built with React + Vite and Firebase</p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

  <a href="https://github.com/caaqilyare/firebase-app/stargazers">
    <img src="https://img.shields.io/github/stars/caaqilyare/firebase-app" alt="Stars" />
  </a>
  <a href="https://github.com/caaqilyare/firebase-app/network/members">
    <img src="https://img.shields.io/github/forks/caaqilyare/firebase-app" alt="Forks" />
  </a>
  <a href="https://github.com/caaqilyare/firebase-app/issues">
    <img src="https://img.shields.io/github/issues/caaqilyare/firebase-app" alt="Issues" />
  </a>
</div>

## 🌟 Recent Updates

### Version 1.3.4
- 🔒 **Authentication Updates**
  - Removed registration functionality
  - Simplified auth context
  - Improved login flow
  - Enhanced security measures
  - Better error handling

### Version 1.3.3
- 🔐 **Authentication Integration**
  - Added Firebase Authentication setup
  - Integrated AuthContext for user management
  - Added auth state persistence
  - Improved error handling for auth operations
  - Better auth service initialization

- 🛠️ **Firebase Configuration**
  - Updated Firebase initialization
  - Added proper auth service exports
  - Fixed environment variable handling
  - Improved service initialization
  - Better error handling

### Version 1.3.2
- 🎨 **Field Display Improvements**
  - Added truncated wallet address display (TDGR...91GS)
  - Enhanced phone number formatting with status indicator
  - Improved number field with better formatting
  - Added gradient backgrounds and animations
  - Enhanced field-specific styling

- ✨ **UI Enhancements**
  - Added hover effects for all field types
  - Improved dark mode support
  - Added copy feedback for all fields
  - Enhanced accessibility
  - Better mobile responsiveness

### Version 1.3.1
- 🐛 **Bug Fixes**
  - Fixed category filtering after item updates
  - Added category preservation in item updates
  - Improved data consistency in updates
  - Enhanced error handling for categories
  
### Version 1.3.0
- 🔍 **Search & Filter System**
  - Added real-time search across items and fields
  - Implemented category-based filtering
  - Added filter tags with individual clear buttons
  - Improved search performance

- 🐛 **Bug Fixes**
  - Fixed categories undefined error in AddItemForm
  - Fixed Select component value handling
  - Resolved button nesting warning in filters
  - Improved error handling in form submissions
  - Added proper prop types and defaults

### Version 1.2.0
- 📝 **Note Editor**
  - Added clean notepad design
  - Improved dark mode support
  - Added line counting
  - Better text formatting

### Version 1.1.0
- 💻 **Code Editor**
  - Enhanced terminal-style interface
  - Added line numbers
  - Improved copy functionality
  - Added fullscreen support

### Version 1.0.1
- 🔄 **Item Management**
  - Added loading states
  - Fixed undefined ID issues
  - Improved error handling
  - Added toast notifications

  - ✨ **UI Improvements**
  - Added loading states for update operations
  - Enhanced user feedback during updates
  - Disabled buttons during submission
  - Added loading spinners to update buttons

- 🔒 **Data Integrity**
  - Improved data structure validation
  - Added ID validation before updates
  - Enhanced error messages for better debugging

### Version 1.3.1
- 🐛 **Bug Fixes**
  - Fixed category filtering after item updates
  - Added category preservation in item updates
  - Improved data consistency in updates
  - Enhanced error handling for categories

---

## 🌟 Overview

A powerful credential management application built with modern web technologies. Store and manage your credentials securely with a beautiful, responsive interface and real-time updates.

### ✨ Key Features

- 🎨 **Modern UI/UX**
  - Dark mode support
  - Responsive design
  - Smooth animations
  - Beautiful gradients
  - Loading states and feedback

- 🔑 **Smart Field Types**
  - Password fields with visibility toggle
  - Code blocks with syntax highlighting
  - URLs with smart formatting
  - Notes with rich text editor
  - API keys with secure storage

- 🚀 **Advanced Features**
  - Real-time updates
  - Copy to clipboard
  - Field type detection
  - Secure storage
  - Search and filter
  - Improved error handling
  - Loading indicators


## 🚀 Getting Started

### Prerequisites

```bash
node -v  # v16 or higher
npm -v   # v8 or higher
```

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/caaqilyare/firebase-app.git
cd firebase-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Copy your config

4. **Environment Setup**
```bash
# Create .env file
cp .env.example .env

# Add your Firebase config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... add other Firebase config values
```

5. **Start Development Server**
```bash
npm run dev
```

## 🏗️ Tech Stack

- **Frontend Framework**: React with Vite
- **Styling**: TailwindCSS
- **Backend**: Firebase
- **State Management**: React Context
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion

## 📦 Project Structure

```
firebase-app/
├─── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── items/
│   │   └── ui/
│   ├── lib/
│   ├── styles/
│   └── App.jsx
├── public/
└── package.json
```

## 🔐 Security Features

- **Authentication**: Firebase Auth
- **Data Protection**: Firestore Security Rules
- **Field Security**: 
  - Sensitive data masking
  - Secure visibility toggle
  - Encrypted storage

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Field Types

| Type | Icon | Security | Features |
|------|------|----------|-----------|
| Text | ���� | Normal | Copy |
| Password | 🔒 | Hidden | Toggle, Copy |
| Code | 💻 | Normal | Highlight, Copy |
| URL | 🔗 | Normal | Format, Open |
| API Key | 🔑 | Hidden | Toggle, Copy |
| Note | 📄 | Normal | Editor |

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Munasar Abuukar - [@caaqilyare](https://github.com/caaqilyare)

Project Link: [https://github.com/caaqilyare/firebase-app](https://github.com/caaqilyare/firebase-app)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/caaqilyare">Munasar Abuukar</a></p>
  
  <a href="https://github.com/caaqilyare">
    <img src="https://img.shields.io/github/followers/caaqilyare?label=Follow&style=social" alt="Follow" />
  </a>
</div>