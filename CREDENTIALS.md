# 🔐 System Credentials

## 📊 Role Hierarchy

```
superadmin → admin → supervisor → client
```

## 👥 User Accounts

### **Superadmin** (Top Level)
```
Email: superadmin@reservario.com
Password: Super@123
Role: System Administrator
Access: Full system access, manage admins, system settings
Dashboard: http://localhost:8080/superadmin
```

### **Admin** (Middle Management)
```
Email: admin@reservario.com
Password: Admin@123
Role: Property Manager / Admin
Access: Properties, inventory, bookings, rates, team management
Can Manage: Supervisors and Clients (NOT other admins)
Dashboard: http://localhost:8080/admin
```

### **Supervisors** (Operational Oversight)

**Supervisor 1**
```
Email: supervisor1@reservario.com
Password: Admin@123
Role: Supervisor
Access: View all pages (dashboard, properties, bookings, inventory, rates)
Cannot Access: Team management
Dashboard: http://localhost:8080/supervisor
```

**Supervisor 2**
```
Email: supervisor2@reservario.com
Password: Admin@123
Role: Supervisor
Access: View all pages (dashboard, properties, bookings, inventory, rates)
Cannot Access: Team management
Dashboard: http://localhost:8080/supervisor
```

### **Client** (Guest/Customer)
```
Email: client@reservario.com
Password: Admin@123
Role: Client/Guest
Access: Personal bookings only
Dashboard: http://localhost:8080/client
```

---

## 🎯 Pages and Access by Role

### **Public Pages (No Login Required)**

#### Guest Booking Page
```
URL: http://localhost:8080/book
Login: NOT REQUIRED
Purpose: Public booking form for guests

Test Data:
- Guest Name: John Doe
- Email: test@example.com
- Phone: +1234567890
- Guests: 2
```

#### Booking Confirmation Page
```
URL: http://localhost:8080/booking-confirmation/{CONFIRMATION_CODE}
Login: NOT REQUIRED
Purpose: View booking details by confirmation code
```

---

### **Superadmin Pages** 🔴

Login: `superadmin@reservario.com` / `Super@123`

#### Dashboard
```
URL: http://localhost:8080/superadmin
Features: System overview, all users statistics
```

#### User Management
```
URL: http://localhost:8080/superadmin/users
Features: Manage all users (admins, supervisors, clients)
Can: Create/Edit/Delete ANY user including admins
```

#### System Settings
```
URL: http://localhost:8080/superadmin/settings
Features: Global configuration, system settings
```

#### Switch to Admin Panel
```
URL: http://localhost:8080/admin
Features: Can also access admin panel
```

---

### **Admin Pages** 🟡

Login: `admin@reservario.com` / `Admin@123`

#### Dashboard
```
URL: http://localhost:8080/admin
Features: Revenue charts, occupancy, bookings analytics
Charts: Income trends, bookings by channel, monthly revenue
```

#### Properties Management
```
URL: http://localhost:8080/admin/properties
Features: Create/Edit/Delete properties and rooms
Can: Full CRUD operations
```

#### Bookings Management
```
URL: http://localhost:8080/admin/bookings
Features: View all bookings, create manual bookings
Can: Full booking management
```

#### Inventory Management
```
URL: http://localhost:8080/admin/inventory
Features: Room availability, pricing calendar
Displays: n/n format (e.g., 3/4 = 3 available out of 4 total)
```

#### Rate Plans
```
URL: http://localhost:8080/admin/rates
Features: Manage rate plans, pricing strategies
Can: Create/Edit rate plans per channel
```

#### Team Management ⭐
```
URL: http://localhost:8080/admin/team
Features: Manage supervisors and clients under this admin
Can Create: Supervisors, Clients
CANNOT Create: Other admins or superadmins
```

---

### **Supervisor Pages** 🟢

Login: `supervisor1@reservario.com` / `Admin@123`
Login: `supervisor2@reservario.com` / `Admin@123`

#### Dashboard
```
URL: http://localhost:8080/supervisor
Features: Same as admin dashboard (view-only focus)
Charts: Revenue, occupancy, bookings
```

#### Properties (View/Limited Edit)
```
URL: http://localhost:8080/supervisor/properties
Features: View properties, limited operations
```

#### Bookings (View/Limited Edit)
```
URL: http://localhost:8080/supervisor/bookings
Features: View and manage bookings
```

#### Inventory (View)
```
URL: http://localhost:8080/supervisor/inventory
Features: View room availability
```

#### Rates (View)
```
URL: http://localhost:8080/supervisor/rates
Features: View rate plans and analytics
```

#### ❌ NO Team Management
```
Supervisors CANNOT access /supervisor/team
Cannot manage other users
```

---

### **Client Pages** 🔵

Login: `client@reservario.com` / `Admin@123`

#### Client Dashboard
```
URL: http://localhost:8080/client
Features: Personal booking overview
```

#### My Reservations
```
URL: http://localhost:8080/client/reservations
Features: View own bookings only
```

#### Make Booking
```
URL: http://localhost:8080/book
Features: Create new booking
```

---

## 🧪 Testing Scenarios

### **Scenario 1: Guest Makes Booking**
```
1. Go to: http://localhost:8080/book
2. No login needed
3. Fill form and book
4. Get confirmation code
5. Visit: http://localhost:8080/booking-confirmation/{CODE}
```

### **Scenario 2: Admin Manages Team**
```
1. Login: admin@reservario.com / Admin@123
2. Go to: http://localhost:8080/admin/team
3. Click "Add Team Member"
4. Select role: Supervisor or Client
5. Fill details and save
6. New user can now login
```

### **Scenario 3: Supervisor View-Only Access**
```
1. Login: supervisor1@reservario.com / Admin@123
2. Access: All pages EXCEPT team management
3. See "View Only" badge in sidebar
4. Can view dashboard, properties, bookings, inventory, rates
5. Cannot access: /supervisor/team (404 or redirect)
```

### **Scenario 4: Verify Inventory-Booking Sync**
```
1. **Tab 1**: Login as admin → Go to /admin/inventory
2. **Tab 2**: Open /book (no login)
3. Check inventory shows: e.g., 4/4 available
4. Make booking in Tab 2
5. Tab 1 should show: 3/4 available (real-time update)
6. Formula verified: Available = Total - Booked
```

### **Scenario 5: Superadmin Full Control**
```
1. Login: superadmin@reservario.com / Super@123
2. Go to: http://localhost:8080/superadmin/users
3. Can create/edit/delete ANY user type
4. Can create new admins (only superadmin can do this)
5. Can switch to admin panel: /admin
```

### **Scenario 6: Test Role Hierarchy**
```
Superadmin → Can manage admins
Admin → Can manage supervisors & clients (NOT other admins)
Supervisor → NO user management access
Client → Personal bookings only

Test:
1. Login as admin
2. Try to access /admin/team
3. Should only see "Supervisor" and "Client" options
4. Should NOT see "Admin" or "Superadmin" options
```

---

## 🔧 API Endpoints

### **Public Endpoints (No Auth)**
```
GET  /api/v1/guest/properties
GET  /api/v1/guest/properties/:id
POST /api/v1/guest/check-availability
POST /api/v1/guest/bookings
GET  /api/v1/guest/bookings/:confirmationCode
```

### **Authentication Endpoints**
```
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh-token
GET  /api/v1/auth/me
```

### **Superadmin Endpoints**
```
GET    /api/v1/users (all users)
POST   /api/v1/users (create any role)
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/settings
PUT    /api/v1/settings
```

### **Admin Endpoints**
```
GET    /api/v1/users/team (supervisors & clients under admin)
POST   /api/v1/users/team (create supervisor or client)
PUT    /api/v1/users/team/:id
DELETE /api/v1/users/team/:id
GET    /api/v1/properties
POST   /api/v1/properties
PUT    /api/v1/properties/:id
DELETE /api/v1/properties/:id
GET    /api/v1/inventory
PUT    /api/v1/inventory
GET    /api/v1/analytics/revenue
GET    /api/v1/analytics/trends/revenue
GET    /api/v1/analytics/bookings
```

### **Supervisor Endpoints** (mostly read-only)
```
GET  /api/v1/properties (view only)
GET  /api/v1/inventory (view only)
GET  /api/v1/bookings
GET  /api/v1/analytics/revenue
```

### **Client Endpoints**
```
GET  /api/v1/client/overview
GET  /api/v1/client/reservations
GET  /api/v1/client/reservations/:id
```

---

## 💡 Quick Reference

**Need to test guest booking?**
→ http://localhost:8080/book (no login)

**Need to view as client?**
→ Login: client@reservario.com / Admin@123

**Need to view as supervisor?**
→ Login: supervisor1@reservario.com / Admin@123

**Need to manage as admin?**
→ Login: admin@reservario.com / Admin@123

**Need superadmin access?**
→ Login: superadmin@reservario.com / Super@123

**Want to test team management?**
→ Login as admin → /admin/team → Add supervisor

**Forgot password?**
→ Check this file! All passwords are listed above.

---

## 📋 All Credentials Quick Copy

```
Superadmin: superadmin@reservario.com / Super@123
Admin:      admin@reservario.com / Admin@123
Supervisor1: supervisor1@reservario.com / Admin@123
Supervisor2: supervisor2@reservario.com / Admin@123
Client:     client@reservario.com / Admin@123
```

---

## 🎉 All Set!

Use these credentials to access different parts of the system and test the complete workflow!



