/**
 * AcademiSync Pro - Live Firebase Backend Connection & Local Sync Engine
 * Project: time-table-42cb4
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAo4lFKB4QHa0zCLcUQOHq43EE0oHu6BO0",
  authDomain: "time-table-42cb4.firebaseapp.com",
  projectId: "time-table-42cb4",
  storageBucket: "time-table-42cb4.firebasestorage.app",
  messagingSenderId: "694640677052",
  appId: "1:694640677052:web:3aed460bfc50efef0240b9",
  measurementId: "G-H981JH6YZN"
};

class FirebaseManager {
  constructor() {
    this.storageKey = "academisync_db_v1";
    this.firebaseApp = null;
    this.firestore = null;
    this.auth = null;
    this.analytics = null;

    this.initFirebase();
    this.initDatabase();
  }

  // Initialize Live Firebase SDK
  initFirebase() {
    try {
      if (window.firebase) {
        if (!firebase.apps.length) {
          this.firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
          this.firebaseApp = firebase.app();
        }

        this.firestore = firebase.firestore();
        this.auth = firebase.auth();
        if (firebase.analytics) this.analytics = firebase.analytics();

        console.log("🔥 Firebase initialized successfully! Connected to project: time-table-42cb4");
        this.syncWithFirestore();
      }
    } catch (e) {
      console.warn("Firebase CDN SDK loading notice, fallback to local hybrid storage:", e);
    }
  }

  // Force Push All Initial Collections to Cloud Firestore
  async pushAllDataToFirestore() {
    if (!this.firestore) {
      if (window.app) window.app.showToast("Firebase SDK not connected!", "error");
      return false;
    }

    try {
      const state = this.getState();

      // Push Timetable
      for (const slot of state.timetable) {
        await this.firestore.collection("timetable").doc(slot.id).set(slot);
      }
      // Push Students
      for (const stu of state.students) {
        await this.firestore.collection("students").doc(stu.id).set(stu);
      }
      // Push Faculty
      for (const fac of state.faculty) {
        await this.firestore.collection("faculty").doc(fac.id).set(fac);
      }
      // Push Swap Requests
      for (const req of state.swapRequests) {
        await this.firestore.collection("swapRequests").doc(req.id).set(req);
      }
      // Push Audit Logs
      for (const log of state.auditLogs) {
        await this.firestore.collection("auditLogs").doc(log.id).set(log);
      }
      // Push Syllabus
      if (state.syllabus) {
        for (const s of state.syllabus) {
          await this.firestore.collection("syllabus").doc(s.code).set(s);
        }
      }
      // Push Student Performance
      if (state.studentPerformance) {
        for (const p of state.studentPerformance) {
          await this.firestore.collection("studentPerformance").doc(p.studentId).set(p);
        }
      }
      // Push Teacher Tips
      if (state.teacherTips) {
        for (const t of state.teacherTips) {
          await this.firestore.collection("teacherTips").doc(t.id).set(t);
        }
      }

      console.log("🔥 Successfully populated Cloud Firestore collections!");
      if (window.app) window.app.showToast("Cloud Firestore Database Seeded Successfully!", "success");
      return true;
    } catch (e) {
      console.error("Firestore push error:", e);
      if (window.app) window.app.showToast("Firestore write blocked. Please set Security Rules to Test Mode in Firebase Console!", "error");
      return false;
    }
  }

  // Initialize or fetch persisted state from LocalStorage
  initDatabase() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      this.saveState(INITIAL_DATA);
    }
  }

  getState() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : INITIAL_DATA;
    } catch (e) {
      console.error("Failed to parse LocalStorage data, resetting to initial seed:", e);
      this.saveState(INITIAL_DATA);
      return INITIAL_DATA;
    }
  }

  saveState(state) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  resetToDefault() {
    this.saveState(INITIAL_DATA);
    return INITIAL_DATA;
  }

  // Database Accessors
  getStudents() { return this.getState().students || []; }
  getFaculty() { return this.getState().faculty || []; }
  getTimetable() { return this.getState().timetable || []; }
  getSwapRequests() { return this.getState().swapRequests || []; }
  getNotifications() { return this.getState().notifications || []; }
  getAuditLogs() { return this.getState().auditLogs || []; }
  getSyllabus() { return this.getState().syllabus || []; }
  
  getStudentPerformance(studentId) {
    const list = this.getState().studentPerformance || [];
    return list.find(p => p.studentId === studentId);
  }

  getAllStudentPerformance() { return this.getState().studentPerformance || []; }
  
  getTeacherTips() { return this.getState().teacherTips || []; }
  
  getTeacherTipsForStudent(studentId) {
    const tips = this.getTeacherTips();
    return tips.filter(t => t.studentId === studentId);
  }

  async addTeacherTip(tip) {
    const state = this.getState();
    if (!state.teacherTips) state.teacherTips = [];
    state.teacherTips.unshift(tip);
    this.saveState(state);

    if (this.firestore) {
      try {
        await this.firestore.collection("teacherTips").doc(tip.id).set(tip);
      } catch(e) { console.warn("Firestore tip sync error:", e); }
    }

    // Dispatch student notification
    this.addNotification({
      id: "notif_tip_" + Date.now(),
      targetType: "STUDENT",
      targetSection: tip.section,
      title: `💡 New Teacher Tip: ${tip.subject}`,
      message: `${tip.facultyName} posted academic performance tips for ${tip.examPhase} (${tip.subject}). Check your Teacher Tips section!`,
      timestamp: new Date().toLocaleString(),
      read: false
    });

    return tip;
  }

  async updateStudentPerformance(studentId, subjectScores, overallGrade) {
    const state = this.getState();
    if (!state.studentPerformance) state.studentPerformance = [];
    const index = state.studentPerformance.findIndex(p => p.studentId === studentId);
    if (index !== -1) {
      if (subjectScores) state.studentPerformance[index].subjectScores = subjectScores;
      if (overallGrade) state.studentPerformance[index].overallGrade = overallGrade;
      this.saveState(state);

      if (this.firestore) {
        try {
          await this.firestore.collection("studentPerformance").doc(studentId).set(state.studentPerformance[index]);
        } catch(e) { console.warn("Firestore performance sync error:", e); }
      }
    }
  }


  // Student Profile lookup by Email
  getStudentByEmail(email) {
    const students = this.getStudents();
    return students.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  // Faculty Profile lookup by Email or ID
  getFacultyByEmail(email) {
    const faculty = this.getFaculty();
    return faculty.find(f => f.email.toLowerCase() === email.toLowerCase());
  }

  getFacultyById(id) {
    const faculty = this.getFaculty();
    return faculty.find(f => f.id === id);
  }

  // Update Period details (Direct edit by assigned faculty or substitute)
  async updatePeriod(periodId, updates) {
    const state = this.getState();
    const index = state.timetable.findIndex(p => p.id === periodId);
    if (index !== -1) {
      state.timetable[index] = { ...state.timetable[index], ...updates };
      this.saveState(state);

      // Sync to Cloud Firestore if connected
      if (this.firestore) {
        try {
          await this.firestore.collection("timetable").doc(periodId).update(updates);
        } catch (e) { console.warn("Firestore update error:", e); }
      }

      return state.timetable[index];
    }
    return null;
  }

  // Create new Swap Request
  async createSwapRequest(request) {
    const state = this.getState();
    state.swapRequests.unshift(request);
    this.saveState(state);

    // Sync to Firestore
    if (this.firestore) {
      try {
        await this.firestore.collection("swapRequests").doc(request.id).set(request);
      } catch (e) { console.warn("Firestore swap request error:", e); }
    }

    // Also dispatch notification to requested faculty
    this.addNotification({
      id: "notif_" + Date.now(),
      targetType: "FACULTY",
      targetFacultyId: request.requestedFacultyId,
      title: "New Period Swap Request",
      message: `${request.requestingFacultyName} requested you to take ${request.subject} for ${request.section} on ${request.day} (${request.startTime} - ${request.endTime}).`,
      timestamp: new Date().toLocaleString(),
      read: false
    });

    return request;
  }

  // Respond to Swap Request (ACCEPT / REJECT)
  async respondSwapRequest(requestId, status, responderFaculty) {
    const state = this.getState();
    const reqIndex = state.swapRequests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return null;

    const req = state.swapRequests[reqIndex];
    req.status = status;
    req.updatedAt = new Date().toISOString();

    if (status === "ACCEPTED") {
      req.acceptedAt = new Date().toLocaleString();

      // 1. Update Timetable Period slot with replacement faculty
      const pIndex = state.timetable.findIndex(p => p.id === req.periodId);
      if (pIndex !== -1) {
        const period = state.timetable[pIndex];
        const originalFaculty = period.facultyName;

        period.facultyId = req.requestedFacultyId;
        period.facultyName = req.requestedFacultyName;
        period.isSubstituted = true;

        // 2. Create Audit Log
        const auditLog = {
          id: "audit_" + Date.now(),
          timestamp: new Date().toLocaleString(),
          slot: `${req.day} ${req.startTime} (${req.section})`,
          originalFaculty: originalFaculty,
          substitutedFaculty: req.requestedFacultyName,
          approvedBy: `${req.requestedFacultyName} (Accepted Request)`,
          reason: req.reason
        };
        state.auditLogs.unshift(auditLog);

        // Sync Timetable & Audit to Cloud Firestore
        if (this.firestore) {
          try {
            await this.firestore.collection("timetable").doc(period.id).update({
              facultyId: req.requestedFacultyId,
              facultyName: req.requestedFacultyName,
              isSubstituted: true
            });
            await this.firestore.collection("auditLogs").doc(auditLog.id).set(auditLog);
          } catch (e) { console.warn("Firestore swap sync error:", e); }
        }

        // 3. Dispatch Student Notification
        state.notifications.unshift({
          id: "notif_stu_" + Date.now(),
          targetType: "STUDENT",
          targetSection: req.section,
          title: "Timetable Updated",
          message: `Your ${req.subject} period from ${req.startTime} - ${req.endTime} will be handled by ${req.requestedFacultyName} instead of ${originalFaculty}.`,
          timestamp: new Date().toLocaleString(),
          read: false
        });

        // 4. Dispatch Faculty Notifications
        state.notifications.unshift({
          id: "notif_fac_req_" + Date.now(),
          targetType: "FACULTY",
          targetFacultyId: req.requestingFacultyId,
          title: "Swap Request Accepted! 🎉",
          message: `${req.requestedFacultyName} accepted your request to take ${req.subject} (${req.section}) at ${req.startTime}.`,
          timestamp: new Date().toLocaleString(),
          read: false
        });
      }
    } else if (status === "REJECTED") {
      // Dispatch Rejection notification to requesting faculty
      state.notifications.unshift({
        id: "notif_fac_rej_" + Date.now(),
        targetType: "FACULTY",
        targetFacultyId: req.requestingFacultyId,
        title: "Swap Request Declined",
        message: `${req.requestedFacultyName} rejected your request to take ${req.subject} (${req.section}) at ${req.startTime}.`,
        timestamp: new Date().toLocaleString(),
        read: false
      });
    }

    this.saveState(state);

    if (this.firestore) {
      try {
        await this.firestore.collection("swapRequests").doc(requestId).update({ status: status, updatedAt: req.updatedAt });
      } catch (e) { console.warn("Firestore status update error:", e); }
    }

    return req;
  }

  // Add Notification
  async addNotification(notif) {
    const state = this.getState();
    state.notifications.unshift(notif);
    this.saveState(state);

    if (this.firestore) {
      try {
        await this.firestore.collection("notifications").doc(notif.id).set(notif);
      } catch (e) { console.warn("Firestore notification error:", e); }
    }
  }

  // Mark notifications read
  markNotificationsRead() {
    const state = this.getState();
    state.notifications.forEach(n => n.read = true);
    this.saveState(state);
  }

  // Export Production Firestore Security Rules string
  getFirestoreRulesString() {
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check authentication
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check role claims
    function hasRole(role) {
      return isAuthenticated() && request.auth.token.role == role;
    }

    // 1. STUDENTS COLLECTION
    match /students/{studentId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('HOD');
    }

    // 2. FACULTY COLLECTION
    match /faculty/{facultyId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('HOD');
    }

    // 3. TIMETABLE COLLECTION
    match /timetable/{periodId} {
      // Students and Faculty can view all section timetables
      allow read: if isAuthenticated();
      
      // Assigned faculty can update session topics and room
      allow update: if hasRole('FACULTY') && 
        (resource.data.facultyId == request.auth.uid || 
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['topic', 'room']));
         
      // HOD has full master override permissions
      allow create, update, delete: if hasRole('HOD');
    }

    // 4. PERIOD SWAP REQUESTS COLLECTION
    match /swapRequests/{requestId} {
      allow read: if isAuthenticated();
      
      // Requesting faculty can create swap requests
      allow create: if hasRole('FACULTY') && request.resource.data.requestingFacultyId == request.auth.uid;
      
      // Requested faculty can update status (ACCEPT/REJECT)
      allow update: if hasRole('FACULTY') && resource.data.requestedFacultyId == request.auth.uid;
    }

    // 5. AUDIT LOGS & NOTIFICATIONS
    match /auditLogs/{logId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('FACULTY') || hasRole('HOD');
    }
  }
}`;
  }
}

window.db = new FirebaseManager();
