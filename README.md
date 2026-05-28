# Theatre Reservation System

# Backend

Μεταβείτε στον φάκελο backend:

```bash
cd backend
```

Εγκατάσταση dependencies:

```bash
npm install
```

Εκτέλεση backend server:

```bash
npm run dev
```

---

# Frontend

Μεταβείτε στον φάκελο frontend:

```bash
cd frontend
```

Εγκατάσταση dependencies:

```bash
npm install
```

Εκτέλεση εφαρμογής:

```bash
npx expo start
```

---

# Database Setup

1. Εκκίνηση Apache και MySQL μέσω XAMPP.

2. Άνοιγμα phpMyAdmin:

```txt
http://localhost/phpmyadmin
```

3. Δημιουργία database:

Εισαγωγή της βάσης δεδομένων στον φάλεκο database από το αρχείο:

```txt
theatre_reservation_db
```


# API Configuration

Αλλαγή IP στο αρχείο:

```txt
frontend/config/api.ts
```

Παράδειγμα:

```ts
export const API_URL = "http://YOUR_IP:5000/api";
export const AUTH_URL = "http://YOUR_IP:5000/api/auth";
```

# Environment Variables

Στον φάκελο backend πρέπει να δημιουργηθεί αρχείο:

```txt
.env
```

με τα παρακάτω στοιχεία:

```env
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
PORT
```
