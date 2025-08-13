# 📌 Pengembangan Sistem Majanemen Prospek, Spk, Dan Penjualan Kendaraan (Studi Kasus Mazda Banjararu)

Backend untuk aplikasi **Tracking Prospek** menggunakan **Express.js + MongoDB**.  




## 📦 Requirements
Sebelum menjalankan aplikasi ini, pastikan sudah terpasang:
- Node.js v22.14.0 + Express.js
- MongoDB v6.0.16+ Mongoose
- JWT (JSON Web Token) untuk autentikasi
- Postman untuk pengujian endpoint


## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/username/nama-repo.git
cd nama-repo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. ⚙️ Setup Environment Variables
Buat file `.env` di root folder:

```bash
JWT_SECRET= rtyuimnmbvcxsghwjkpal234567890
MONGO_URI=mongodb://localhost:27017/trackingProspek
FRONTEND_URL= http://localhost:5173
```

### 4. Jalankan Server
```bash
npm run dev
```

### 5. Struktur folder
```
├── controllers/       # Logic untuk setiap route
├── models/            # Schema Mongoose
├── routes/            # Endpoint API
├── services/          # Business logic (service layer)
├── utils/             # Helper functions
├── reports/           # Modul laporan penjualan & export PDF
├── docs/              # Dokumentasi API (Postman/Swagger)
├── .env.example       # Contoh environment variables
└── server.js          # Entry point aplikasi
```

## 📖 Rest API Documentation
`https://documenter.getpostman.com/view/40066467/2sAYdmjnbT`