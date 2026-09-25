# 🎓 AcademiSync Pro - College Timetable & Period Substitution Hub

AcademiSync Pro is a modern, responsive, real-time college timetable management system designed for hackathons, universities, and academic institutes. Built with responsive glassmorphism design, role-based access control (Student, Faculty, HOD), period swap request approval system, student push alerts, and Firebase backend integration.

---

## ✨ Features & Role Capabilities

### 🎓 1. Student Portal
* **Verified Login Flow:** Enter college email (`alex.j@college.edu`) to receive a 6-digit OTP code (Demo code: `123456`).
* **Auto-Retrieved Profile:** Section (`CSE-A`), Year, Semester, and Student ID are loaded directly from the database without requiring user selection.
* **Today's & Weekly Schedule:** Real-time view of daily periods with subject name, teacher name, room number, live status indicator (`LIVE`, `UPCOMING`, `COMPLETED`), and topic planned.
* **Class Feedback & Rating:** Submit 5-star ratings and constructive feedback for completed lectures.
* **Strict Read-Only Enforcement:** Students cannot edit subject, teacher, period, room, date, or section.

### 👨‍🏫 2. Faculty Portal
* **Faculty Authentication:** Password-based login or one-click demo selector (`Prof. Ravi`, `Prof. Kumar`, `Prof. Priya`, `Prof. Sharma`).
* **Assigned Schedule Management:** Direct edit control (Room number, Topic/Lecture notes) strictly for assigned periods.
* **1-Click Period Swap System:**
  1. Select a period -> Click **"Request Another Faculty"**.
  2. Choose substitute faculty from dropdown & enter reason.
  3. **Schedule Conflict Guard:** Automatically checks if target faculty already has a class at that time slot and displays a warning.
  4. **Immediate Non-Mutation:** Timetable remains unchanged upon request creation (`PENDING` status).
* **Received Requests Inbox:**
  * View pending requests with requester name, subject, section, time slot, and reason.
  * **ACCEPT:** Replaces original teacher in timetable, creates swap history log, dispatches student alert, updates request status to `ACCEPTED`.
  * **REJECT:** Keeps original timetable unchanged, updates status to `REJECTED`, notifies requesting teacher.
* **Sent Requests Tracker:** Track status (`PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`).

### 🏛️ 3. Head of Department (HOD) Super-Admin
* **Master Timetable Grid:** View and filter schedules by section (`CSE-A`, `CSE-B`) and weekday.
* **Override & Edit Controls:** HOD can manually assign substitute teachers or alter room allocations.
* **Timetable Audit Log:** Complete historical audit trail recording every swap approval, original teacher, substitute, reason, and timestamp.
* **Department Broadcast Engine:** Dispatch urgent announcements to students and faculty.
* **Firebase Rules & Config Console:** Export and review production Firestore Security Rules.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** HTML5, Modern Vanilla CSS3 Design System (Glassmorphism, Ambient Mesh Background, CSS Variables), ES Modules JavaScript.
* **Icons:** Lucide Icons.
* **Database & Sync:** Hybrid LocalStorage Firestore Simulation Engine + Live Firebase JS SDK configuration.
* **Security:** Role-based security rules (`firestore.rules`).

---

## 🚀 How to Run Locally

Simply open `index.html` in any web browser (Chrome, Edge, Firefox, Safari) or serve via a local HTTP server!

```bash
# Option 1: Double-click index.html or open via browser
start index.html

# Option 2: Run with Python HTTP server (if Python is installed)
python -m http.server 8000
```

---

## 🔒 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() { return request.auth != null; }
    function hasRole(role) { return isAuthenticated() && request.auth.token.role == role; }

    match /students/{studentId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('HOD');
    }

    match /faculty/{facultyId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('HOD');
    }

    match /timetable/{periodId} {
      allow read: if isAuthenticated();
      allow update: if hasRole('FACULTY') && 
        (resource.data.facultyId == request.auth.uid || 
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['topic', 'room']));
      allow create, update, delete: if hasRole('HOD');
    }

    match /swapRequests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('FACULTY') && request.resource.data.requestingFacultyId == request.auth.uid;
      allow update: if hasRole('FACULTY') && resource.data.requestedFacultyId == request.auth.uid;
    }

    match /auditLogs/{logId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('FACULTY') || hasRole('HOD');
    }
  }
}
```
