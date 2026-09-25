/**
 * AcademiSync Pro - Initial Seed Dataset
 * Contains pre-populated Student Profiles, Faculty Profiles, Timetables, and Swap Requests
 */

const INITIAL_DATA = {
  students: [
    {
      id: "STU-2024-8841",
      name: "Alex Johnson",
      email: "alex.j@college.edu",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      semester: "5th Semester",
      section: "CSE-A"
    },
    {
      id: "STU-2024-8842",
      name: "Sarah Miller",
      email: "sarah.m@college.edu",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      semester: "5th Semester",
      section: "CSE-B"
    },
    {
      id: "STU-2024-8843",
      name: "David Kim",
      email: "david.k@college.edu",
      department: "Electronics & Communication",
      year: "3rd Year",
      semester: "5th Semester",
      section: "ECE-A"
    }
  ],

  faculty: [
    {
      id: "FAC-CSE-101",
      name: "Prof. Ravi Kumar",
      email: "ravi.k@college.edu",
      department: "Computer Science & Engineering",
      subjects: ["Mathematics", "Linear Algebra"],
      sections: ["CSE-A", "CSE-B"]
    },
    {
      id: "FAC-CSE-102",
      name: "Prof. Suresh Kumar",
      email: "kumar.s@college.edu",
      department: "Computer Science & Engineering",
      subjects: ["DBMS", "SQL Architecture"],
      sections: ["CSE-A", "CSE-B"]
    },
    {
      id: "FAC-CSE-103",
      name: "Prof. Priya Sharma",
      email: "priya.p@college.edu",
      department: "Computer Science & Engineering",
      subjects: ["Java Programming", "Object Oriented Design"],
      sections: ["CSE-A", "ECE-A"]
    },
    {
      id: "FAC-CSE-104",
      name: "Prof. Amit Sharma",
      email: "sharma.a@college.edu",
      department: "Computer Science & Engineering",
      subjects: ["Operating Systems", "Computer Networks"],
      sections: ["CSE-B", "ECE-A"]
    }
  ],

  timetable: [
    // --- THURSDAY (TODAY) - SECTION CSE-A ---
    {
      id: "period_thu_1_csea",
      day: "Thursday",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      subject: "Mathematics",
      section: "CSE-A",
      room: "Room 201",
      facultyId: "FAC-CSE-101",
      facultyName: "Prof. Ravi Kumar",
      originalFacultyId: "FAC-CSE-101",
      originalFacultyName: "Prof. Ravi Kumar",
      isSubstituted: false,
      topic: "Differential Calculus & Matrix Equations"
    },
    {
      id: "period_thu_2_csea",
      day: "Thursday",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      subject: "DBMS",
      section: "CSE-A",
      room: "Room 204",
      facultyId: "FAC-CSE-102",
      facultyName: "Prof. Suresh Kumar",
      originalFacultyId: "FAC-CSE-102",
      originalFacultyName: "Prof. Suresh Kumar",
      isSubstituted: false,
      topic: "Relational Algebra & Normalization (3NF)"
    },
    {
      id: "period_thu_3_csea",
      day: "Thursday",
      startTime: "11:15 AM",
      endTime: "12:15 PM",
      subject: "Java Programming",
      section: "CSE-A",
      room: "Room 203",
      facultyId: "FAC-CSE-103",
      facultyName: "Prof. Priya Sharma",
      originalFacultyId: "FAC-CSE-103",
      originalFacultyName: "Prof. Priya Sharma",
      isSubstituted: false,
      topic: "Multithreading & Concurrency Control"
    },
    {
      id: "period_thu_4_csea",
      day: "Thursday",
      startTime: "01:15 PM",
      endTime: "02:15 PM",
      subject: "Operating Systems",
      section: "CSE-A",
      room: "Lab 3",
      facultyId: "FAC-CSE-104",
      facultyName: "Prof. Amit Sharma",
      originalFacultyId: "FAC-CSE-104",
      originalFacultyName: "Prof. Amit Sharma",
      isSubstituted: false,
      topic: "Page Replacement Algorithms"
    },

    // --- THURSDAY (TODAY) - SECTION CSE-B ---
    {
      id: "period_thu_1_cseb",
      day: "Thursday",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      subject: "DBMS",
      section: "CSE-B",
      room: "Room 204",
      facultyId: "FAC-CSE-102",
      facultyName: "Prof. Suresh Kumar",
      originalFacultyId: "FAC-CSE-102",
      originalFacultyName: "Prof. Suresh Kumar",
      isSubstituted: false,
      topic: "Indexing & B+ Trees"
    },
    {
      id: "period_thu_2_cseb",
      day: "Thursday",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      subject: "Mathematics",
      section: "CSE-B",
      room: "Room 201",
      facultyId: "FAC-CSE-101",
      facultyName: "Prof. Ravi Kumar",
      originalFacultyId: "FAC-CSE-101",
      originalFacultyName: "Prof. Ravi Kumar",
      isSubstituted: false,
      topic: "Fourier Analysis"
    },
    {
      id: "period_thu_3_cseb",
      day: "Thursday",
      startTime: "11:15 AM",
      endTime: "12:15 PM",
      subject: "Operating Systems",
      section: "CSE-B",
      room: "Room 205",
      facultyId: "FAC-CSE-104",
      facultyName: "Prof. Amit Sharma",
      originalFacultyId: "FAC-CSE-104",
      originalFacultyName: "Prof. Amit Sharma",
      isSubstituted: false,
      topic: "Deadlock Detection & Prevention"
    },

    // --- MONDAY - CSE-A ---
    {
      id: "period_mon_1_csea",
      day: "Monday",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      subject: "Mathematics",
      section: "CSE-A",
      room: "Room 201",
      facultyId: "FAC-CSE-101",
      facultyName: "Prof. Ravi Kumar",
      originalFacultyId: "FAC-CSE-101",
      originalFacultyName: "Prof. Ravi Kumar",
      isSubstituted: false,
      topic: "Probability Distributions"
    },
    {
      id: "period_mon_2_csea",
      day: "Monday",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      subject: "Java Programming",
      section: "CSE-A",
      room: "Lab 1",
      facultyId: "FAC-CSE-103",
      facultyName: "Prof. Priya Sharma",
      originalFacultyId: "FAC-CSE-103",
      originalFacultyName: "Prof. Priya Sharma",
      isSubstituted: false,
      topic: "Collections Framework"
    },

    // --- TUESDAY - CSE-A ---
    {
      id: "period_tue_1_csea",
      day: "Tuesday",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      subject: "DBMS",
      section: "CSE-A",
      room: "Room 204",
      facultyId: "FAC-CSE-102",
      facultyName: "Prof. Suresh Kumar",
      originalFacultyId: "FAC-CSE-102",
      originalFacultyName: "Prof. Suresh Kumar",
      isSubstituted: false,
      topic: "ACID Properties & Transactions"
    },

    // --- WEDNESDAY - CSE-A ---
    {
      id: "period_wed_1_csea",
      day: "Wednesday",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      subject: "Operating Systems",
      section: "CSE-A",
      room: "Room 202",
      facultyId: "FAC-CSE-104",
      facultyName: "Prof. Amit Sharma",
      originalFacultyId: "FAC-CSE-104",
      originalFacultyName: "Prof. Amit Sharma",
      isSubstituted: false,
      topic: "Virtual Memory Architecture"
    },

    // --- FRIDAY - CSE-A ---
    {
      id: "period_fri_1_csea",
      day: "Friday",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      subject: "Mathematics",
      section: "CSE-A",
      room: "Room 201",
      facultyId: "FAC-CSE-101",
      facultyName: "Prof. Ravi Kumar",
      originalFacultyId: "FAC-CSE-101",
      originalFacultyName: "Prof. Ravi Kumar",
      isSubstituted: false,
      topic: "Numerical Methods"
    }
  ],

  swapRequests: [
    {
      id: "req_demo_101",
      periodId: "period_thu_1_csea",
      requestingFacultyId: "FAC-CSE-101",
      requestingFacultyName: "Prof. Ravi Kumar",
      requestedFacultyId: "FAC-CSE-102",
      requestedFacultyName: "Prof. Suresh Kumar",
      subject: "Mathematics",
      section: "CSE-A",
      day: "Thursday",
      date: "24 Sep 2026",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      room: "Room 201",
      reason: "I will be unavailable during this period due to an urgent departmental curriculum committee meeting.",
      status: "PENDING", // PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED
      createdAt: "2026-09-24T08:15:00Z"
    },
    {
      id: "req_demo_100",
      periodId: "period_mon_1_csea",
      requestingFacultyId: "FAC-CSE-103",
      requestingFacultyName: "Prof. Priya Sharma",
      requestedFacultyId: "FAC-CSE-101",
      requestedFacultyName: "Prof. Ravi Kumar",
      subject: "Java Programming",
      section: "CSE-A",
      day: "Monday",
      date: "21 Sep 2026",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      room: "Lab 1",
      reason: "Attending national workshop on AI & Cloud Systems.",
      status: "ACCEPTED",
      acceptedAt: "2026-09-21T07:30:00Z",
      createdAt: "2026-09-20T14:20:00Z"
    }
  ],

  notifications: [
    {
      id: "notif_1",
      targetType: "STUDENT",
      targetSection: "CSE-A",
      title: "Timetable Updated",
      message: "Your Java Programming period on Monday from 10:00 AM - 11:00 AM was handled by Prof. Ravi Kumar instead of Prof. Priya Sharma.",
      timestamp: "21 Sep 2026, 07:30 AM",
      read: false
    },
    {
      id: "notif_2",
      targetType: "FACULTY",
      targetFacultyId: "FAC-CSE-102",
      title: "New Substitution Request",
      message: "Prof. Ravi Kumar requested you to take Mathematics for CSE-A on Thursday (09:00 AM - 10:00 AM).",
      timestamp: "24 Sep 2026, 08:15 AM",
      read: false
    }
  ],

  auditLogs: [
    {
      id: "audit_1",
      timestamp: "2026-09-21 07:30:00",
      slot: "Monday 10:00 AM (CSE-A)",
      originalFaculty: "Prof. Priya Sharma",
      substitutedFaculty: "Prof. Ravi Kumar",
      approvedBy: "Prof. Ravi Kumar (Accepted Request)",
      reason: "Attending national workshop on AI & Cloud Systems"
    }
  ],

  syllabus: [
    {
      subject: "Mathematics",
      department: "Computer Science & Engineering",
      semester: "5th Semester",
      progress: 75,
      code: "CS-501",
      facultyName: "Prof. Ravi Kumar",
      referenceBooks: ["Advanced Engineering Mathematics by Erwin Kreyszig", "Higher Engineering Mathematics by B.S. Grewal"],
      modules: [
        {
          id: "m1",
          title: "Module 1: Differential Calculus & Matrix Equations",
          progress: 100,
          topics: [
            { name: "Eigenvalues & Eigenvectors", status: "COMPLETED" },
            { name: "Cayley-Hamilton Theorem", status: "COMPLETED" },
            { name: "Matrix Transformations", status: "COMPLETED" }
          ]
        },
        {
          id: "m2",
          title: "Module 2: Fourier & Laplace Transforms",
          progress: 100,
          topics: [
            { name: "Periodic Functions & Fourier Series", status: "COMPLETED" },
            { name: "Laplace Initial Value Problems", status: "COMPLETED" }
          ]
        },
        {
          id: "m3",
          title: "Module 3: Probability & Vector Calculus",
          progress: 65,
          topics: [
            { name: "Random Variables & Binomial Distributions", status: "COMPLETED" },
            { name: "Gauss Divergence Theorem", status: "IN_PROGRESS" },
            { name: "Stokes Theorem Applications", status: "UPCOMING" }
          ]
        },
        {
          id: "m4",
          title: "Module 4: Numerical Optimization Methods",
          progress: 35,
          topics: [
            { name: "Newton-Raphson & Secant Method", status: "IN_PROGRESS" },
            { name: "Runge-Kutta 4th Order", status: "UPCOMING" }
          ]
        }
      ]
    },
    {
      subject: "DBMS",
      department: "Computer Science & Engineering",
      semester: "5th Semester",
      progress: 80,
      code: "CS-502",
      facultyName: "Prof. Suresh Kumar",
      referenceBooks: ["Database System Concepts by Korth & Silberschatz", "Fundamentals of Database Systems by Elmasri & Navathe"],
      modules: [
        {
          id: "m1",
          title: "Module 1: ER Modeling & Relational Algebra",
          progress: 100,
          topics: [
            { name: "Entity-Relationship Diagrams", status: "COMPLETED" },
            { name: "Relational Algebra Operations", status: "COMPLETED" }
          ]
        },
        {
          id: "m2",
          title: "Module 2: SQL & Advanced Queries",
          progress: 100,
          topics: [
            { name: "Complex Joins & Subqueries", status: "COMPLETED" },
            { name: "Views, Triggers & Stored Procedures", status: "COMPLETED" }
          ]
        },
        {
          id: "m3",
          title: "Module 3: Database Normalization (1NF to BCNF)",
          progress: 80,
          topics: [
            { name: "Functional Dependencies & 3NF", status: "COMPLETED" },
            { name: "Boyce-Codd Normal Form (BCNF)", status: "IN_PROGRESS" }
          ]
        },
        {
          id: "m4",
          title: "Module 4: Transaction Processing & Indexing",
          progress: 40,
          topics: [
            { name: "ACID Properties & Concurrency Control", status: "IN_PROGRESS" },
            { name: "B+ Tree Indexing Architecture", status: "UPCOMING" }
          ]
        }
      ]
    },
    {
      subject: "Java Programming",
      department: "Computer Science & Engineering",
      semester: "5th Semester",
      progress: 70,
      code: "CS-503",
      facultyName: "Prof. Priya Sharma",
      referenceBooks: ["Core Java Volume I & II by Cay S. Horstmann", "Java: The Complete Reference by Herbert Schildt"],
      modules: [
        {
          id: "m1",
          title: "Module 1: OOP Principles & Inheritance",
          progress: 100,
          topics: [
            { name: "Classes, Objects & Constructors", status: "COMPLETED" },
            { name: "Polymorphism & Abstract Classes", status: "COMPLETED" }
          ]
        },
        {
          id: "m2",
          title: "Module 2: Exception Handling & Collections",
          progress: 90,
          topics: [
            { name: "Custom Exceptions & Try-Catch Blocks", status: "COMPLETED" },
            { name: "ArrayList, HashMap & Set Interfaces", status: "COMPLETED" }
          ]
        },
        {
          id: "m3",
          title: "Module 3: Multithreading & Concurrency",
          progress: 60,
          topics: [
            { name: "Thread Life Cycle & Synchronized Blocks", status: "IN_PROGRESS" },
            { name: "ExecutorService & Thread Pools", status: "UPCOMING" }
          ]
        }
      ]
    },
    {
      subject: "Operating Systems",
      department: "Computer Science & Engineering",
      semester: "5th Semester",
      progress: 65,
      code: "CS-504",
      facultyName: "Prof. Amit Sharma",
      referenceBooks: ["Operating System Concepts by Silberschatz, Galvin & Gagne", "Modern Operating Systems by Andrew S. Tanenbaum"],
      modules: [
        {
          id: "m1",
          title: "Module 1: Process Management & CPU Scheduling",
          progress: 100,
          topics: [
            { name: "Process Control Blocks & Context Switching", status: "COMPLETED" },
            { name: "Round Robin & FCFS Scheduling", status: "COMPLETED" }
          ]
        },
        {
          id: "m2",
          title: "Module 2: Deadlocks & Synchronization",
          progress: 75,
          topics: [
            { name: "Banker's Algorithm for Deadlock Avoidance", status: "COMPLETED" },
            { name: "Semaphores & Mutex Locks", status: "IN_PROGRESS" }
          ]
        },
        {
          id: "m3",
          title: "Module 3: Memory Management & Paging",
          progress: 40,
          topics: [
            { name: "Virtual Memory & Page Replacement", status: "IN_PROGRESS" },
            { name: "TLB Architecture & Segmentation", status: "UPCOMING" }
          ]
        }
      ]
    }
  ],

  studentPerformance: [
    {
      studentId: "STU-2024-8841",
      studentName: "Alex Johnson",
      section: "CSE-A",
      overallGrade: "A",
      attendance: 92,
      subjectScores: [
        { subject: "Mathematics", mid1: 88, mid2: 76, sem: 85, grade: "A" },
        { subject: "DBMS", mid1: 94, mid2: 90, sem: 92, grade: "A+" },
        { subject: "Java Programming", mid1: 82, mid2: 85, sem: 86, grade: "A" },
        { subject: "Operating Systems", mid1: 78, mid2: 70, sem: 75, grade: "B+" }
      ]
    },
    {
      studentId: "STU-2024-8842",
      studentName: "Sarah Miller",
      section: "CSE-B",
      overallGrade: "A+",
      attendance: 96,
      subjectScores: [
        { subject: "Mathematics", mid1: 95, mid2: 92, sem: 94, grade: "A+" },
        { subject: "DBMS", mid1: 90, mid2: 88, sem: 91, grade: "A+" },
        { subject: "Java Programming", mid1: 89, mid2: 91, sem: 90, grade: "A+" },
        { subject: "Operating Systems", mid1: 85, mid2: 88, sem: 87, grade: "A" }
      ]
    },
    {
      studentId: "STU-2024-8843",
      studentName: "David Kim",
      section: "ECE-A",
      overallGrade: "B",
      attendance: 84,
      subjectScores: [
        { subject: "Mathematics", mid1: 70, mid2: 68, sem: 72, grade: "B" },
        { subject: "DBMS", mid1: 75, mid2: 78, sem: 76, grade: "B" },
        { subject: "Java Programming", mid1: 80, mid2: 82, sem: 81, grade: "A-" },
        { subject: "Operating Systems", mid1: 65, mid2: 62, sem: 68, grade: "C+" }
      ]
    }
  ],

  teacherTips: [
    {
      id: "tip_101",
      studentId: "STU-2024-8841",
      studentName: "Alex Johnson",
      section: "CSE-A",
      subject: "Mathematics",
      facultyId: "FAC-CSE-101",
      facultyName: "Prof. Ravi Kumar",
      examPhase: "Mid-2",
      performanceTag: "Needs Improvement in Vectors",
      scoreValue: "76%",
      tipText: "Alex performed well in Differential Calculus during Mid-1 (88%), but dropped slightly in Mid-2 (76%) due to Vector Calculus proofs.",
      actionableAdvice: [
        "Revise Gauss Divergence and Stokes Theorem numerical problems.",
        "Practice past 5 years Mid-2 question papers for 30 minutes daily.",
        "Attend Friday doubt clearing session for Vector Calculus."
      ],
      createdAt: "22 Sep 2026, 11:30 AM"
    },
    {
      id: "tip_102",
      studentId: "STU-2024-8841",
      studentName: "Alex Johnson",
      section: "CSE-A",
      subject: "DBMS",
      facultyId: "FAC-CSE-102",
      facultyName: "Prof. Suresh Kumar",
      examPhase: "Mid-1",
      performanceTag: "Outstanding Performance",
      scoreValue: "94%",
      tipText: "Exceptional mastery of SQL joins, relational algebra, and normalization up to 3NF!",
      actionableAdvice: [
        "Keep up the great momentum for End-Semester exams!",
        "Try solving B+ tree indexing and concurrency control advanced problems to aim for 100% in End-Sem."
      ],
      createdAt: "20 Sep 2026, 04:15 PM"
    },
    {
      id: "tip_103",
      studentId: "STU-2024-8841",
      studentName: "Alex Johnson",
      section: "CSE-A",
      subject: "Operating Systems",
      facultyId: "FAC-CSE-104",
      facultyName: "Prof. Amit Sharma",
      examPhase: "Semester Strategy",
      performanceTag: "Focus on Virtual Memory",
      scoreValue: "75%",
      tipText: "Good conceptual understanding of CPU scheduling. Mid-2 score (70%) indicates need for practice in Page Replacement algorithms.",
      actionableAdvice: [
        "Re-simulate FIFO vs LRU page replacement trace calculations.",
        "Review Banker's algorithm step-by-step for the upcoming End-Sem."
      ],
      createdAt: "23 Sep 2026, 09:45 AM"
    }
  ]
};

