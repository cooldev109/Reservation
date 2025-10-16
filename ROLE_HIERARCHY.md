# Role Hierarchy Documentation

## Overview

Reservario implements a 4-tier role hierarchy system for access control and permission management.

```
superadmin → admin → supervisor → client
```

## Role Structure

### 1. **Superadmin** (Top Level)
**Access:** Full system control

**Capabilities:**
- ✅ Manage all admins (CRUD)
- ✅ Manage all users (view, edit, delete)
- ✅ Access system settings
- ✅ View all properties and bookings across all admins
- ✅ Full dashboard access
- ✅ Can switch to admin panel

**Routes:**
- `/superadmin` - Dashboard
- `/superadmin/users` - User Management
- `/superadmin/settings` - System Settings
- Can also access `/admin/*` routes

**Layout:** `SuperadminLayout.tsx`

---

### 2. **Admin** (Middle Management)
**Access:** Property and team management

**Capabilities:**
- ✅ Manage supervisors under them (CRUD)
- ✅ Manage client users (CRUD)
- ✅ Full property management (create, edit, delete)
- ✅ Full booking management
- ✅ Inventory management
- ✅ Rate plan management
- ✅ View analytics and dashboards
- ❌ Cannot manage other admins
- ❌ Cannot access system settings

**Routes:**
- `/admin` - Dashboard with charts
- `/admin/properties` - Property management
- `/admin/bookings` - Booking management
- `/admin/inventory` - Inventory management
- `/admin/rates` - Rate plan management
- `/admin/team` - **Team Management** (manage supervisors & clients)

**Layout:** `AdminLayout.tsx`

**Team Management:**
- Can add/edit/delete supervisors
- Can add/edit/delete clients
- Cannot create admins or superadmins

---

### 3. **Supervisor** (Operational Oversight)
**Access:** View-only and operational tasks

**Capabilities:**
- ✅ View dashboard (same as admin)
- ✅ View all properties
- ✅ View all bookings
- ✅ View inventory
- ✅ View rates and analytics
- ❌ **NO Team Management** (cannot manage other users)
- ❌ Cannot create/edit/delete (mostly read-only with some operational permissions)

**Routes:**
- `/supervisor` - Dashboard (uses AdminDashboard component)
- `/supervisor/properties` - Properties view
- `/supervisor/bookings` - Bookings view
- `/supervisor/inventory` - Inventory view
- `/supervisor/rates` - Rates view
- **No `/supervisor/team` route**

**Layout:** `SupervisorLayout.tsx`

**Key Difference from Admin:**
- Same pages as admin BUT no access to team management
- Primarily oversight and monitoring role
- Can perform operational tasks but not user management

---

### 4. **Client** (Guest/Customer)
**Access:** Personal bookings only

**Capabilities:**
- ✅ View own reservations
- ✅ Make new bookings
- ✅ View booking confirmations
- ✅ Manage personal profile
- ❌ No access to admin/supervisor panels
- ❌ Cannot view other users' data

**Routes:**
- `/client` - Client Dashboard
- `/client/reservations` - Personal reservations list
- `/client/reservations/:id` - Reservation details
- `/book` - Make new booking
- `/booking-confirmation/:code` - Confirmation page

**Layout:** `Layout.tsx` (public layout)

---

## Hierarchy Visual

```
┌─────────────────────────────────────────────────────┐
│              SUPERADMIN (Full Control)              │
│  • Manage all admins                                │
│  • System settings                                  │
│  • Global oversight                                 │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ manages
                       ▼
┌─────────────────────────────────────────────────────┐
│        ADMIN (Property & Team Management)           │
│  • Manage supervisors                               │
│  • Manage clients                                   │
│  • Full property/booking/inventory CRUD             │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ manages
                       ▼
┌─────────────────────────────────────────────────────┐
│         SUPERVISOR (Operational Oversight)          │
│  • View-only dashboard                              │
│  • Monitor properties/bookings                      │
│  • NO user management                               │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ serves
                       ▼
┌─────────────────────────────────────────────────────┐
│              CLIENT (Guest/Customer)                │
│  • Personal bookings only                           │
│  • No access to management panels                   │
└─────────────────────────────────────────────────────┘
```

---

## Permission Matrix

| Feature | Superadmin | Admin | Supervisor | Client |
|---------|------------|-------|------------|--------|
| **User Management** |
| Manage Admins | ✅ | ❌ | ❌ | ❌ |
| Manage Supervisors | ✅ | ✅ | ❌ | ❌ |
| Manage Clients | ✅ | ✅ | ❌ | ❌ |
| **Property Management** |
| Create Property | ✅ | ✅ | ❌ | ❌ |
| Edit Property | ✅ | ✅ | ❌ | ❌ |
| Delete Property | ✅ | ✅ | ❌ | ❌ |
| View Properties | ✅ | ✅ | ✅ | ❌ |
| **Booking Management** |
| Create Booking | ✅ | ✅ | ✅* | ✅ (own) |
| Edit Booking | ✅ | ✅ | ❌ | ❌ |
| Cancel Booking | ✅ | ✅ | ❌ | ✅ (own) |
| View Bookings | ✅ | ✅ | ✅ | ✅ (own) |
| **Inventory Management** |
| Update Inventory | ✅ | ✅ | ❌ | ❌ |
| View Inventory | ✅ | ✅ | ✅ | ❌ |
| **Rates Management** |
| Create Rate Plans | ✅ | ✅ | ❌ | ❌ |
| Edit Rate Plans | ✅ | ✅ | ❌ | ❌ |
| View Rates | ✅ | ✅ | ✅ | ❌ |
| **Analytics** |
| Dashboard | ✅ | ✅ | ✅ | ✅ (own) |
| Reports | ✅ | ✅ | ✅ | ❌ |
| **System** |
| System Settings | ✅ | ❌ | ❌ | ❌ |

*✅ = Full access, ❌ = No access, ✅* = Limited access

---

## Route Protection

### Implementation (`RequireRole` component)

All protected routes use the `<RequireRole>` component:

```tsx
<Route
  path="/admin"
  element={
    <RequireRole roles={["admin", "superadmin"]}>
      <AdminLayout />
    </RequireRole>
  }
>
  {/* Admin routes */}
</Route>
```

### Role Checks

```tsx
// In components
const { hasRole } = useAuthStore();

if (hasRole(['admin'])) {
  // Show admin features
}

if (hasRole(['supervisor'])) {
  // Show supervisor features
}
```

---

## Team Management Flow

### Admin manages Supervisors

1. **Admin** logs in → Access `/admin/team`
2. Click "Add Team Member"
3. Select role: **Supervisor** or **Client** (only these options available)
4. Fill in details and save
5. Supervisor can now log in with supervisor role

### Form Configuration

```tsx
// In TeamManagement.tsx
<SelectContent>
  <SelectItem value="supervisor">Supervisor</SelectItem>
  <SelectItem value="client">Client</SelectItem>
  {/* Note: NO admin or superadmin options */}
</SelectContent>
```

**Security:**
- Admins CANNOT create other admins
- Admins CANNOT escalate privileges
- Only superadmins can manage admins

---

## Login Flow by Role

### Superadmin Login
1. Login at `/login`
2. Redirect to `/superadmin`
3. Can switch to `/admin` if needed

### Admin Login
1. Login at `/login`
2. Redirect to `/admin`
3. See team management option in sidebar

### Supervisor Login
1. Login at `/login`
2. Redirect to `/supervisor`
3. Same interface as admin BUT:
   - No "Team" link in navigation
   - Read-only/view permissions on most pages
   - "View Only" badge visible in sidebar

### Client Login
1. Login at `/login`
2. Redirect to `/client`
3. See personal booking interface

---

## Current User Accounts

| Email | Role | Password |
|-------|------|----------|
| superadmin@reservario.com | superadmin | Admin@123 |
| admin@reservario.com | admin | Admin@123 |
| supervisor1@reservario.com | supervisor | Admin@123 |
| supervisor2@reservario.com | supervisor | Admin@123 |
| client@reservario.com | client | Admin@123 |

---

## Key Files Modified

### Routes
- `frontend/src/App.tsx` - Added supervisor routes (reusing admin components)

### Layouts
- `frontend/src/layouts/SupervisorLayout.tsx` - Updated navigation menu
- `frontend/src/layouts/AdminLayout.tsx` - Already has team management link

### Pages
- `frontend/src/pages/admin/TeamManagement.tsx` - Configured for supervisor/client CRUD
- Admin pages are shared with supervisors (same components, different routes)

---

## Summary

✅ **Hierarchy:** superadmin → admin → supervisor → client
✅ **Admin can CRUD supervisors:** Via `/admin/team` page
✅ **Supervisor has same pages as admin EXCEPT team management**
✅ **Route protection:** Enforced via `RequireRole` component
✅ **Security:** Admins cannot create other admins or superadmins

This structure ensures:
1. Clear separation of responsibilities
2. Proper access control
3. No privilege escalation
4. Scalable team management
