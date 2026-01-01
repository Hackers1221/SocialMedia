# 🚀 SocialMedia

A full-stack **Social Media Web Application** built using modern web technologies.  
This project demonstrates real-world features like authentication, posts, interactions, and user profiles — designed to resemble a production-ready social platform.

---

## ✨ Features

- 🔐 User Authentication (Signup / Login / Logout)
- 📝 Create, Edit & Delete Posts
- ❤️ Like & 💬 Comment on Posts
- 👤 User Profiles
- 🤝 Follow / Unfollow Users
- 🔔 Notifications
- 🔍 Search Users / Posts
- 📱 Fully Responsive UI
- ⚡ Real-time Updates (where applicable)

---

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- HTML / CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Other Tools
- JWT Authentication
- REST APIs
- Git & GitHub

---

## 📂 Project Structure

SocialMedia
├─ client        (Frontend – React)
├─ server        (Backend – Node + Express)
├─ README.md
└─ .gitignore

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Hackers1221/SocialMedia.git
cd SocialMedia
```

### Backend Setup
```bash
cd server
npm install
```

### Create a .env file in the server folder:
```bash
secret_key=your_secret_key
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_secret
EMAIL=your_app_email
PASS=your_2fa_password
PORT=8080
FRONT_URL=https://localhost:5173/
PORT=5000
URL=your_mongodb_connection_string
```

### Start the backend server:
```bash
npm start
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Frontend will run on
```bash
http://localhost:5173
```

### Backend will run on
```bash
http://localhost:8080
```
