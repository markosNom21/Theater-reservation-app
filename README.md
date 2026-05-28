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

# Database

Εισαγωγή της βάσης δεδομένων στον φάλεκο database από το αρχείο:

```txt
theatre_reservation_db
```

---

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
