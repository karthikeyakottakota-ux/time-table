/**
 * AcademiSync Pro - Core Application Engine & Event Handlers
 */

class Application {
  constructor() {
    this.currentUser = null;
    this.currentRole = null; // 'STUDENT', 'FACULTY', 'HOD'
    this.activePage = 'landing';
    this.studentSelectedDay = 'Thursday';
    this.studentScheduleTab = 'today';
    this.facultySelectedTab = 'myPeriods';
    this.hodSelectedTab = 'master';
    
    this.init();
  }

  init() {
    // Inject Firebase Security Rules into code elements
    const rulesCode = db.getFirestoreRulesString();
    const hodRulesEl = document.getElementById("hodRulesCode");
    const modalRulesEl = document.getElementById("modalRulesCode");
    if (hodRulesEl) hodRulesEl.textContent = rulesCode;
    if (modalRulesEl) modalRulesEl.textContent = rulesCode;

    // Attach OTP box auto-tab listeners
    this.setupOtpBoxListeners();
  }

  // --- NAVIGATION & PAGE ROUTING ---
  showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    let targetPageEl = null;
    switch(pageId) {
      case 'landing': targetPageEl = document.getElementById('pageLanding'); break;
      case 'studentLogin': targetPageEl = document.getElementById('pageStudentLogin'); break;
      case 'studentDashboard': targetPageEl = document.getElementById('pageStudentDashboard'); break;
      case 'facultyLogin': targetPageEl = document.getElementById('pageFacultyLogin'); break;
      case 'facultyDashboard': targetPageEl = document.getElementById('pageFacultyDashboard'); break;
      case 'hodLogin': targetPageEl = document.getElementById('pageHodLogin'); break;
      case 'hodDashboard': targetPageEl = document.getElementById('pageHodDashboard'); break;
    }

    if (targetPageEl) {
      targetPageEl.classList.add('active');
      this.activePage = pageId;
      window.scrollTo(0, 0);
    }

    // Refresh lucide icons
    if (window.lucide) lucide.createIcons();
  }

  // --- DEMO QUICK LOGIN CONTROLLER ---
  quickLogin(roleType) {
    switch(roleType) {
      case 'student':
        const student = db.getStudentByEmail('alex.j@college.edu');
        this.loginAsStudent(student);
        this.showToast('Logged in as Student: Alex Johnson (CSE-A)', 'success');
        break;
      case 'faculty1':
        const fac1 = db.getFacultyByEmail('ravi.k@college.edu');
        this.loginAsFaculty(fac1);
        this.showToast('Logged in as Faculty: Prof. Ravi Kumar (Mathematics)', 'success');
        break;
      case 'faculty2':
        const fac2 = db.getFacultyByEmail('kumar.s@college.edu');
        this.loginAsFaculty(fac2);
        this.showToast('Logged in as Faculty: Prof. Suresh Kumar (DBMS)', 'success');
        break;
      case 'hod':
        this.loginAsHod();
        this.showToast('Authenticated as HOD: Dr. S. Vance', 'success');
        break;
    }
  }

  // --- STUDENT LOGIN & OTP FLOW ---
  handleStudentEmailSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('studentEmail').value.trim();
    const student = db.getStudentByEmail(emailInput);

    if (!student) {
      this.showToast('Student profile not found! Try alex.j@college.edu', 'error');
      return;
    }

    // Show OTP section
    document.getElementById('sentEmailDisplay').textContent = emailInput;
    document.getElementById('studentEmailForm').classList.add('hidden');
    document.getElementById('studentOtpSection').classList.remove('hidden');

    // Display retrieved section automatically
    document.getElementById('matchedName').textContent = student.name;
    document.getElementById('matchedSection').textContent = `${student.section} (Auto-Retrieved from Profile)`;
    
    this.showToast(`OTP Code 123456 sent to ${emailInput}`, 'info');
  }

  setupOtpBoxListeners() {
    const boxes = document.querySelectorAll('.otp-box');
    boxes.forEach((box, index) => {
      box.addEventListener('keyup', (e) => {
        if (box.value.length === 1 && index < boxes.length - 1) {
          boxes[index + 1].focus();
        }
      });
    });
  }

  handleStudentOtpSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('sentEmailDisplay').textContent;
    const student = db.getStudentByEmail(email);
    if (student) {
      this.loginAsStudent(student);
      this.showToast('OTP verified successfully!', 'success');
    }
  }

  fillStudentDemo(email) {
    document.getElementById('studentEmail').value = email;
  }

  loginAsStudent(student) {
    this.currentUser = student;
    this.currentRole = 'STUDENT';
    this.updateUserNavbar();

    // Populate Student Profile Headers
    document.getElementById('stuNameHeader').textContent = `Welcome, ${student.name}`;
    document.getElementById('stuIdDisplay').textContent = student.id;
    document.getElementById('stuEmailDisplay').textContent = student.email;
    document.getElementById('stuDeptBadge').textContent = student.department;
    document.getElementById('stuSecBadge').textContent = `Section ${student.section}`;
    document.getElementById('stuYearSemBadge').textContent = `${student.year} • ${student.semester}`;

    this.renderStudentDashboard();
    this.showPage('studentDashboard');
  }

  // --- STUDENT DASHBOARD RENDERER & TABS ---
  switchStudentMainTab(tabName) {
    this.studentSelectedMainTab = tabName;
    const tabs = ['Schedule', 'Syllabus', 'Tips'];
    tabs.forEach(t => {
      const tabItem = document.getElementById(`stuTab${t}`);
      const tabContent = document.getElementById(`stuTabContent${t}`);
      if (tabItem) tabItem.classList.toggle('active', t.toLowerCase() === tabName.toLowerCase());
      if (tabContent) tabContent.classList.toggle('hidden', t.toLowerCase() !== tabName.toLowerCase());
    });

    if (tabName === 'syllabus') this.renderStudentSyllabus();
    if (tabName === 'tips') {
      this.renderStudentPerformance();
      this.renderStudentTips();
    }
  }

  switchStudentScheduleTab(tab) {
    this.studentScheduleTab = tab;
    const todayBtn = document.getElementById('tabBtnToday');
    const weeklyBtn = document.getElementById('tabBtnWeekly');
    const todayView = document.getElementById('studentTodayView');
    const weeklyView = document.getElementById('studentWeeklyView');

    if (tab === 'today') {
      todayBtn.classList.add('active');
      weeklyBtn.classList.remove('active');
      todayView.classList.remove('hidden');
      weeklyView.classList.add('hidden');
    } else {
      todayBtn.classList.remove('active');
      weeklyBtn.classList.add('active');
      todayView.classList.add('hidden');
      weeklyView.classList.remove('hidden');
      this.filterStudentWeeklyDay('Monday');
    }
  }

  filterStudentWeeklyDay(day) {
    this.studentSelectedDay = day;
    document.querySelectorAll('#studentDayPills .day-pill').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === day);
    });
    this.renderStudentWeeklySlots();
  }

  renderStudentSyllabus() {
    const filterEl = document.getElementById('syllabusSubjectFilter');
    const filter = filterEl ? filterEl.value : 'ALL';
    let syllabusList = db.getSyllabus();

    if (filter !== 'ALL') {
      syllabusList = syllabusList.filter(s => s.subject === filter);
    }

    const container = document.getElementById('studentSyllabusContainer');
    if (!container) return;
    container.innerHTML = '';

    if (syllabusList.length === 0) {
      container.innerHTML = `<p class="form-hint">No syllabus records found.</p>`;
      return;
    }

    syllabusList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'syllabus-card glass-panel';

      let modulesHtml = '';
      item.modules.forEach(m => {
        let topicsHtml = '';
        m.topics.forEach(t => {
          let statusClass = 'status-upcoming';
          if (t.status === 'COMPLETED') statusClass = 'status-completed';
          if (t.status === 'IN_PROGRESS') statusClass = 'status-inprogress';

          topicsHtml += `
            <div class="topic-item">
              <span class="topic-name"><i data-lucide="check-circle" class="icon-sm"></i> ${t.name}</span>
              <span class="topic-status-pill ${statusClass}">${t.status.replace('_', ' ')}</span>
            </div>
          `;
        });

        modulesHtml += `
          <div class="module-block">
            <div class="module-header">
              <h5>${m.title}</h5>
              <span class="badge badge-accent">${m.progress}% Covered</span>
            </div>
            <div class="module-topics-list">
              ${topicsHtml}
            </div>
          </div>
        `;
      });

      let booksHtml = '';
      if (item.referenceBooks && item.referenceBooks.length > 0) {
        booksHtml = `
          <div class="ref-books-section">
            <h5><i data-lucide="book"></i> Recommended Reference Books</h5>
            <ul>
              ${item.referenceBooks.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="syllabus-card-header">
          <div class="s-info">
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
              <span class="badge badge-primary">${item.code}</span>
              <span class="badge badge-outline">${item.semester}</span>
            </div>
            <h4>${item.subject}</h4>
            <span class="form-hint">Faculty Instructor: <strong>${item.facultyName}</strong></span>
          </div>
          <div class="s-progress-box">
            <div class="s-progress-bar-bg">
              <div class="s-progress-bar-fill" style="width: ${item.progress}%;"></div>
            </div>
            <span class="s-prog-text"><strong>${item.progress}%</strong> Syllabus Covered</span>
          </div>
        </div>
        <div class="syllabus-modules-container">
          ${modulesHtml}
        </div>
        ${booksHtml}
      `;

      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  renderStudentPerformance() {
    if (!this.currentUser) return;
    const perf = db.getStudentPerformance(this.currentUser.id);
    const container = document.getElementById('studentScorecardGrid');
    if (!container) return;
    container.innerHTML = '';

    if (!perf || !perf.subjectScores) {
      container.innerHTML = `<p class="form-hint">No exam scorecard data available.</p>`;
      return;
    }

    perf.subjectScores.forEach(subj => {
      const card = document.createElement('div');
      card.className = 'scorecard-card glass-panel';

      let gradeClass = 'badge-primary';
      if (subj.grade.startsWith('A')) gradeClass = 'badge-accent';
      if (subj.grade.startsWith('C') || subj.grade.startsWith('D')) gradeClass = 'badge-warning';

      card.innerHTML = `
        <div class="score-card-header">
          <h4>${subj.subject}</h4>
          <span class="badge ${gradeClass}">${subj.grade}</span>
        </div>
        <div class="score-metrics-grid">
          <div class="metric-box">
            <span class="m-val">${subj.mid1}%</span>
            <span class="m-lbl">Mid-Term 1</span>
          </div>
          <div class="metric-box">
            <span class="m-val">${subj.mid2}%</span>
            <span class="m-lbl">Mid-Term 2</span>
          </div>
          <div class="metric-box highlight">
            <span class="m-val">${subj.sem}%</span>
            <span class="m-lbl">End-Semester</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  renderStudentTips() {
    if (!this.currentUser) return;
    const filterEl = document.getElementById('tipExamFilter');
    const filterPhase = filterEl ? filterEl.value : 'ALL';
    let tips = db.getTeacherTipsForStudent(this.currentUser.id);

    if (filterPhase !== 'ALL') {
      tips = tips.filter(t => t.examPhase === filterPhase);
    }

    const container = document.getElementById('studentTipsFeed');
    if (!container) return;
    container.innerHTML = '';

    if (tips.length === 0) {
      container.innerHTML = `<p class="form-hint">No teacher tips posted for this filter yet.</p>`;
      return;
    }

    tips.forEach(tip => {
      const card = document.createElement('div');
      card.className = 'teacher-tip-card glass-panel';

      let adviceHtml = '';
      if (tip.actionableAdvice && tip.actionableAdvice.length > 0) {
        adviceHtml = `
          <div class="tip-advice-box">
            <h5><i data-lucide="check-circle-2"></i> Actionable Improvement Plan</h5>
            <ul>
              ${tip.actionableAdvice.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="tip-card-header">
          <div class="tip-author">
            <div class="author-avatar">${tip.facultyName.charAt(5) || 'F'}</div>
            <div>
              <h4 class="author-name">${tip.facultyName}</h4>
              <span class="form-hint">${tip.subject} • ${tip.createdAt}</span>
            </div>
          </div>
          <div class="tip-badges">
            <span class="badge badge-accent">${tip.examPhase}</span>
            <span class="badge badge-primary">${tip.scoreValue}</span>
          </div>
        </div>

        <div class="tip-performance-tag">
          <i data-lucide="award"></i> <strong>Remark:</strong> ${tip.performanceTag}
        </div>

        <div class="tip-body-text">
          "${tip.tipText}"
        </div>

        ${adviceHtml}
      `;

      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }


  renderStudentDashboard() {
    if (!this.currentUser || this.currentRole !== 'STUDENT') return;
    const section = this.currentUser.section;
    const timetable = db.getTimetable();

    // 1. Filter Today's Slots (Thursday is Today)
    const todaySlots = timetable.filter(p => p.day === 'Thursday' && p.section === section);
    const todayContainer = document.getElementById('studentTodaySlots');
    todayContainer.innerHTML = '';

    if (todaySlots.length === 0) {
      todayContainer.innerHTML = `<div class="period-card"><p>No classes scheduled for today.</p></div>`;
    } else {
      todaySlots.forEach(slot => {
        todayContainer.appendChild(this.createPeriodCardElement(slot, 'STUDENT'));
      });
    }

    // 2. Populate Feedback Period Selector
    const feedbackSelect = document.getElementById('feedbackPeriodSelect');
    feedbackSelect.innerHTML = '';
    todaySlots.forEach(slot => {
      const opt = document.createElement('option');
      opt.value = slot.id;
      opt.textContent = `${slot.startTime} - ${slot.subject} (${slot.facultyName})`;
      feedbackSelect.appendChild(opt);
    });

    // 3. Populate Student Notifications & Alerts
    this.renderStudentAlerts();

    if (window.lucide) lucide.createIcons();
  }

  renderStudentWeeklySlots() {
    if (!this.currentUser) return;
    const section = this.currentUser.section;
    const timetable = db.getTimetable();
    const daySlots = timetable.filter(p => p.day === this.studentSelectedDay && p.section === section);

    const container = document.getElementById('studentWeeklySlots');
    container.innerHTML = '';

    if (daySlots.length === 0) {
      container.innerHTML = `<div class="period-card"><p>No classes scheduled for ${this.studentSelectedDay}.</p></div>`;
    } else {
      daySlots.forEach(slot => {
        container.appendChild(this.createPeriodCardElement(slot, 'STUDENT'));
      });
    }
    if (window.lucide) lucide.createIcons();
  }

  renderStudentAlerts() {
    const alertsContainer = document.getElementById('stuAlertsList');
    alertsContainer.innerHTML = '';
    const notifications = db.getNotifications().filter(n => 
      n.targetType === 'STUDENT' && (n.targetSection === this.currentUser.section || !n.targetSection)
    );

    document.getElementById('stuNotifCountBadge').textContent = `${notifications.length} Alerts`;

    if (notifications.length === 0) {
      alertsContainer.innerHTML = `<p class="form-hint">No recent timetable changes.</p>`;
      return;
    }

    notifications.forEach(n => {
      const item = document.createElement('div');
      item.className = 'notif-item unread';
      item.innerHTML = `
        <div class="notif-icon-box accept"><i data-lucide="refresh-cw"></i></div>
        <div class="notif-details">
          <p><strong>${n.title}</strong></p>
          <p>${n.message}</p>
          <span class="notif-time">${n.timestamp}</span>
        </div>
      `;
      alertsContainer.appendChild(item);
    });
  }

  handleFeedbackSubmit(e) {
    e.preventDefault();
    this.showToast('Thank you! Your feedback has been submitted to department head.', 'success');
    document.getElementById('studentFeedbackForm').reset();
  }

  // --- FACULTY LOGIN & DASHBOARD ---
  fillFacultyDemo(email) {
    document.getElementById('facultyEmail').value = email;
  }

  handleFacultyLogin(e) {
    e.preventDefault();
    const email = document.getElementById('facultyEmail').value.trim();
    const faculty = db.getFacultyByEmail(email);

    if (!faculty) {
      this.showToast('Faculty profile not found! Try ravi.k@college.edu', 'error');
      return;
    }

    this.loginAsFaculty(faculty);
    this.showToast(`Welcome ${faculty.name}`, 'success');
  }

  loginAsFaculty(faculty) {
    this.currentUser = faculty;
    this.currentRole = 'FACULTY';
    this.updateUserNavbar();

    // Populate Faculty Profile Banner
    document.getElementById('facNameHeader').textContent = faculty.name;
    document.getElementById('facIdBadge').textContent = faculty.id;
    document.getElementById('facDeptBadge').textContent = faculty.department;
    document.getElementById('facSubjectsDisplay').textContent = faculty.subjects.join(', ');
    document.getElementById('facSectionsDisplay').textContent = faculty.sections.join(', ');

    this.renderFacultySchedule();
    this.renderFacultyRequests();
    this.showPage('facultyDashboard');
  }

  switchFacultyTab(tabName) {
    this.facultySelectedTab = tabName;
    const tabs = ['MyPeriods', 'Received', 'Sent', 'Master', 'Tips'];
    tabs.forEach(t => {
      const tabItem = document.getElementById(`facTab${t}`);
      const tabContent = document.getElementById(`facTabContent${t}`);
      if (tabItem) tabItem.classList.toggle('active', t.toLowerCase() === tabName.toLowerCase());
      if (tabContent) tabContent.classList.toggle('hidden', t.toLowerCase() !== tabName.toLowerCase());
    });

    if (tabName === 'myPeriods') this.renderFacultySchedule();
    if (tabName === 'received' || tabName === 'sent') this.renderFacultyRequests();
    if (tabName === 'master') this.renderFacultyMasterSchedule();
    if (tabName === 'tips') this.renderFacultyTipsTab();
  }

  renderFacultyTipsTab() {
    if (!this.currentUser || this.currentRole !== 'FACULTY') return;

    // Populate Target Students Dropdown
    const studentSelect = document.getElementById('tipStudentSelect');
    if (studentSelect) {
      studentSelect.innerHTML = '';
      const students = db.getStudents();
      students.forEach(stu => {
        const opt = document.createElement('option');
        opt.value = stu.id;
        opt.textContent = `${stu.name} (${stu.section} • ${stu.id})`;
        studentSelect.appendChild(opt);
      });
    }

    // Populate Subjects Dropdown (assigned to this faculty member)
    const subjectSelect = document.getElementById('tipSubjectSelect');
    if (subjectSelect) {
      subjectSelect.innerHTML = '';
      const subjects = this.currentUser.subjects || ["Mathematics", "DBMS", "Java Programming", "Operating Systems"];
      subjects.forEach(subj => {
        const opt = document.createElement('option');
        opt.value = subj;
        opt.textContent = subj;
        subjectSelect.appendChild(opt);
      });
    }

    this.onFacultyTipStudentChange();
    this.renderFacultyTipsHistory();
  }

  onFacultyTipStudentChange() {
    const studentSelect = document.getElementById('tipStudentSelect');
    if (!studentSelect) return;
    const studentId = studentSelect.value;
    const perf = db.getStudentPerformance(studentId);
    
    if (perf && perf.subjectScores && perf.subjectScores.length > 0) {
      const subjSelect = document.getElementById('tipSubjectSelect');
      const subj = subjSelect ? subjSelect.value : perf.subjectScores[0].subject;
      const scoreObj = perf.subjectScores.find(s => s.subject === subj);
      const scoreInput = document.getElementById('tipScoreValue');
      if (scoreObj && scoreInput) {
        scoreInput.value = `${scoreObj.mid2}% (Mid-2)`;
      }
    }
  }

  renderFacultyTipsHistory() {
    if (!this.currentUser) return;
    const allTips = db.getTeacherTips();
    const myTips = allTips.filter(t => t.facultyId === this.currentUser.id);
    const container = document.getElementById('facTipsHistoryList');
    if (!container) return;
    container.innerHTML = '';

    if (myTips.length === 0) {
      container.innerHTML = `<p class="form-hint">You haven't posted any student tips yet.</p>`;
      return;
    }

    myTips.forEach(tip => {
      const item = document.createElement('div');
      item.className = 'notif-item';
      item.innerHTML = `
        <div class="notif-icon-box info"><i data-lucide="sparkles"></i></div>
        <div class="notif-details" style="width: 100%;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>${tip.studentName} (${tip.section})</strong>
            <span class="badge badge-accent">${tip.examPhase}</span>
          </div>
          <p style="margin-top: 4px;"><strong>Subject:</strong> ${tip.subject} | <strong>Remark:</strong> ${tip.performanceTag}</p>
          <p class="form-hint">"${tip.tipText}"</p>
          <span class="notif-time">${tip.createdAt}</span>
        </div>
      `;
      container.appendChild(item);
    });

    if (window.lucide) lucide.createIcons();
  }

  handleSendTeacherTip(e) {
    e.preventDefault();
    const studentId = document.getElementById('tipStudentSelect').value;
    const student = db.getStudents().find(s => s.id === studentId);
    const subject = document.getElementById('tipSubjectSelect').value;
    const examPhase = document.getElementById('tipExamPhase').value;
    const scoreValue = document.getElementById('tipScoreValue').value.trim();
    const performanceTag = document.getElementById('tipPerformanceTag').value.trim();
    const tipText = document.getElementById('tipText').value.trim();
    const adviceText = document.getElementById('tipAdviceLines').value.trim();

    if (!student) return;

    const adviceLines = adviceText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const tipObj = {
      id: "tip_" + Date.now(),
      studentId: student.id,
      studentName: student.name,
      section: student.section,
      subject: subject,
      facultyId: this.currentUser.id,
      facultyName: this.currentUser.name,
      examPhase: examPhase,
      performanceTag: performanceTag,
      scoreValue: scoreValue,
      tipText: tipText,
      actionableAdvice: adviceLines,
      createdAt: new Date().toLocaleString()
    };

    db.addTeacherTip(tipObj);
    document.getElementById('facTipForm').reset();
    this.showToast(`Performance Tip dispatched to ${student.name}!`, 'success');
    this.renderFacultyTipsHistory();
  }


  renderFacultySchedule() {
    if (!this.currentUser || this.currentRole !== 'FACULTY') return;
    const day = document.getElementById('facDaySelect').value;
    const timetable = db.getTimetable();
    
    // Filter periods assigned to this faculty member
    const mySlots = timetable.filter(p => p.day === day && p.facultyId === this.currentUser.id);
    const container = document.getElementById('facultyPeriodsList');
    container.innerHTML = '';

    document.getElementById('facTodayCount').textContent = mySlots.length;

    if (mySlots.length === 0) {
      container.innerHTML = `<div class="period-card"><p>No classes assigned to you on ${day}.</p></div>`;
    } else {
      mySlots.forEach(slot => {
        container.appendChild(this.createPeriodCardElement(slot, 'FACULTY'));
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  renderFacultyRequests() {
    if (!this.currentUser || this.currentRole !== 'FACULTY') return;
    const allRequests = db.getSwapRequests();

    // 1. RECEIVED REQUESTS
    const received = allRequests.filter(r => r.requestedFacultyId === this.currentUser.id);
    const receivedContainer = document.getElementById('facReceivedRequestsList');
    receivedContainer.innerHTML = '';

    const pendingReceived = received.filter(r => r.status === 'PENDING');
    document.getElementById('receivedBadgeCount').textContent = pendingReceived.length;
    document.getElementById('facPendingCount').textContent = pendingReceived.length;

    if (received.length === 0) {
      receivedContainer.innerHTML = `<p class="form-hint">No substitution requests received.</p>`;
    } else {
      received.forEach(req => {
        receivedContainer.appendChild(this.createRequestCardElement(req, 'RECEIVED'));
      });
    }

    // 2. SENT REQUESTS
    const sent = allRequests.filter(r => r.requestingFacultyId === this.currentUser.id);
    const sentContainer = document.getElementById('facSentRequestsList');
    sentContainer.innerHTML = '';

    if (sent.length === 0) {
      sentContainer.innerHTML = `<p class="form-hint">You have not sent any substitution requests.</p>`;
    } else {
      sent.forEach(req => {
        sentContainer.appendChild(this.createRequestCardElement(req, 'SENT'));
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  renderFacultyMasterSchedule() {
    const day = document.getElementById('facDaySelect').value;
    const timetable = db.getTimetable().filter(p => p.day === day);
    const container = document.getElementById('facMasterList');
    container.innerHTML = '';

    timetable.forEach(slot => {
      container.appendChild(this.createPeriodCardElement(slot, 'FACULTY_READONLY'));
    });
    if (window.lucide) lucide.createIcons();
  }

  // --- HOD LOGIN & DASHBOARD ---
  handleHodLogin(e) {
    e.preventDefault();
    const passcode = document.getElementById('hodPasscode').value;
    if (passcode === 'admin123') {
      this.loginAsHod();
      this.showToast('HOD session authenticated successfully.', 'success');
    } else {
      this.showToast('Invalid HOD passcode! Try admin123', 'error');
    }
  }

  loginAsHod() {
    this.currentUser = { id: 'HOD_1', name: 'Dr. S. Vance', role: 'HOD' };
    this.currentRole = 'HOD';
    this.updateUserNavbar();
    this.renderHodMasterSchedule();
    this.renderHodSwaps();
    this.renderHodAuditLog();
    this.showPage('hodDashboard');
  }

  switchHodTab(tabName) {
    this.hodSelectedTab = tabName;
    const tabs = ['Master', 'Swaps', 'Audit', 'Rules'];
    tabs.forEach(t => {
      const item = document.getElementById(`hodTab${t}`);
      const content = document.getElementById(`hodTabContent${t}`);
      if (item) item.classList.toggle('active', t.toLowerCase() === tabName.toLowerCase());
      if (content) content.classList.toggle('hidden', t.toLowerCase() !== tabName.toLowerCase());
    });
  }

  renderHodMasterSchedule() {
    const secFilter = document.getElementById('hodSecFilter').value;
    const dayFilter = document.getElementById('hodDayFilter').value;
    let timetable = db.getTimetable().filter(p => p.day === dayFilter);

    if (secFilter !== 'ALL') {
      timetable = timetable.filter(p => p.section === secFilter);
    }

    const grid = document.getElementById('hodMasterGrid');
    grid.innerHTML = '';

    if (timetable.length === 0) {
      grid.innerHTML = `<div class="period-card"><p>No slots found for selected filters.</p></div>`;
    } else {
      timetable.forEach(slot => {
        grid.appendChild(this.createPeriodCardElement(slot, 'HOD'));
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  renderHodSwaps() {
    const requests = db.getSwapRequests();
    const container = document.getElementById('hodAllSwapsList');
    container.innerHTML = '';

    if (requests.length === 0) {
      container.innerHTML = `<p class="form-hint">No substitution history recorded.</p>`;
    } else {
      requests.forEach(req => {
        container.appendChild(this.createRequestCardElement(req, 'HOD_VIEW'));
      });
    }
    if (window.lucide) lucide.createIcons();
  }

  renderHodAuditLog() {
    const logs = db.getAuditLogs();
    const tbody = document.getElementById('hodAuditTableBody');
    tbody.innerHTML = '';

    logs.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${log.timestamp}</td>
        <td><strong>${log.slot}</strong></td>
        <td>${log.originalFaculty}</td>
        <td><span class="badge badge-accent">${log.substitutedFaculty}</span></td>
        <td>${log.approvedBy}</td>
        <td><em>${log.reason}</em></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // --- PERIOD CARD COMPONENT BUILDER ---
  createPeriodCardElement(slot, mode) {
    const card = document.createElement('div');
    card.className = `period-card ${slot.isSubstituted ? 'substituted' : ''}`;

    const isAssignedFaculty = this.currentUser && this.currentUser.id === slot.facultyId;

    let subNoticeHtml = '';
    if (slot.isSubstituted) {
      subNoticeHtml = `
        <div class="p-sub-notice">
          <i data-lucide="info"></i>
          <span>Substituted Period (Original: ${slot.originalFacultyName})</span>
        </div>
      `;
    }

    let actionsHtml = '';
    if (mode === 'FACULTY' && isAssignedFaculty) {
      actionsHtml = `
        <div class="period-actions">
          <button class="btn btn-outline" onclick="app.openEditModal('${slot.id}')">
            <i data-lucide="edit-3"></i> Edit Details
          </button>
          <button class="btn btn-primary" onclick="app.openSwapModal('${slot.id}')">
            <i data-lucide="repeat"></i> Request Swap
          </button>
        </div>
      `;
    } else if (mode === 'HOD') {
      actionsHtml = `
        <div class="period-actions">
          <button class="btn btn-outline-light" onclick="app.openEditModal('${slot.id}')">
            <i data-lucide="sliders"></i> HOD Edit
          </button>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="period-time-block">
        <span class="p-time">${slot.startTime}</span>
        <span class="p-duration">to ${slot.endTime}</span>
      </div>

      <div class="period-info-main" style="cursor:pointer;" onclick="app.openPeriodDetailModal('${slot.id}')" title="Click for details">
        <div class="p-header">
          <span class="p-subject">${slot.subject}</span>
          <span class="badge badge-secondary">${slot.section}</span>
          <span class="badge badge-outline">${slot.room}</span>
        </div>
        
        <div class="p-details">
          <span><i data-lucide="user"></i> <strong>Faculty:</strong> ${slot.facultyName}</span>
          ${slot.topic ? `<span><i data-lucide="book-open"></i> <strong>Topic:</strong> ${slot.topic}</span>` : ''}
        </div>

        ${subNoticeHtml}
      </div>

      ${actionsHtml}
    `;

    return card;
  }

  // --- SWAP REQUEST CARD COMPONENT BUILDER ---
  createRequestCardElement(req, mode) {
    const card = document.createElement('div');
    card.className = 'request-card';

    let statusBadgeClass = 'status-pending';
    if (req.status === 'ACCEPTED') statusBadgeClass = 'status-accepted';
    if (req.status === 'REJECTED') statusBadgeClass = 'status-rejected';

    let actionsHtml = '';
    if (mode === 'RECEIVED' && req.status === 'PENDING') {
      actionsHtml = `
        <div class="req-actions">
          <button class="btn btn-outline" onclick="app.respondSwap('${req.id}', 'REJECTED')">
            <i data-lucide="x-circle"></i> Reject
          </button>
          <button class="btn btn-success" onclick="app.respondSwap('${req.id}', 'ACCEPTED')">
            <i data-lucide="check-circle-2"></i> Accept & Update Timetable
          </button>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="req-header">
        <div class="req-faculty-info">
          <div class="req-avatar">${req.requestingFacultyName.substring(5, 7)}</div>
          <div>
            <h4>Requested by: ${req.requestingFacultyName}</h4>
            <span class="form-hint">Target Faculty: <strong>${req.requestedFacultyName}</strong></span>
          </div>
        </div>
        <span class="status-badge ${statusBadgeClass}">${req.status}</span>
      </div>

      <div class="req-grid">
        <div class="req-grid-item"><span>Subject</span><strong>${req.subject}</strong></div>
        <div class="req-grid-item"><span>Section</span><strong>${req.section}</strong></div>
        <div class="req-grid-item"><span>Date & Day</span><strong>${req.day} (${req.date})</strong></div>
        <div class="req-grid-item"><span>Time Slot</span><strong>${req.startTime} - ${req.endTime}</strong></div>
      </div>

      <div class="req-reason-box">
        "<strong>Reason:</strong> ${req.reason}"
      </div>

      ${actionsHtml}
    `;

    return card;
  }

  // --- PERIOD SWAP REQUEST WORKFLOW ---
  openSwapModal(periodId) {
    const slot = db.getTimetable().find(p => p.id === periodId);
    if (!slot) return;

    document.getElementById('modalPeriodId').value = slot.id;
    document.getElementById('modalSubject').textContent = slot.subject;
    document.getElementById('modalSection').textContent = slot.section;
    document.getElementById('modalTime').textContent = `${slot.startTime} - ${slot.endTime}`;
    document.getElementById('modalRoom').textContent = slot.room;

    // Populate Eligible Faculty (excluding current requesting faculty)
    const select = document.getElementById('modalRequestedFaculty');
    select.innerHTML = '';
    const facultyList = db.getFaculty().filter(f => f.id !== this.currentUser.id);

    facultyList.forEach(fac => {
      const opt = document.createElement('option');
      opt.value = fac.id;
      opt.textContent = `${fac.name} (${fac.department})`;
      select.appendChild(opt);
    });

    document.getElementById('swapModal').classList.remove('hidden');
    this.validateFacultyConflict();
  }

  closeSwapModal() {
    document.getElementById('swapModal').classList.add('hidden');
  }

  validateFacultyConflict() {
    const periodId = document.getElementById('modalPeriodId').value;
    const requestedFacId = document.getElementById('modalRequestedFaculty').value;
    const slot = db.getTimetable().find(p => p.id === periodId);
    const alertBox = document.getElementById('conflictAlert');

    if (!slot || !requestedFacId) return;

    // Check if target faculty has a class at the same day & time
    const conflict = db.getTimetable().find(p => 
      p.facultyId === requestedFacId && p.day === slot.day && p.startTime === slot.startTime
    );

    if (conflict) {
      document.getElementById('conflictAlertText').textContent = 
        `⚠️ Schedule Conflict Alert: ${conflict.facultyName} already has ${conflict.subject} (${conflict.section}) at ${conflict.startTime}!`;
      alertBox.classList.remove('hidden');
    } else {
      alertBox.classList.add('hidden');
    }
  }

  handleSendSwapRequest(e) {
    e.preventDefault();
    const periodId = document.getElementById('modalPeriodId').value;
    const requestedFacId = document.getElementById('modalRequestedFaculty').value;
    const reason = document.getElementById('modalReason').value.trim();

    const slot = db.getTimetable().find(p => p.id === periodId);
    const targetFaculty = db.getFacultyById(requestedFacId);

    if (!slot || !targetFaculty) return;

    const requestObj = {
      id: "req_" + Date.now(),
      periodId: slot.id,
      requestingFacultyId: this.currentUser.id,
      requestingFacultyName: this.currentUser.name,
      requestedFacultyId: targetFaculty.id,
      requestedFacultyName: targetFaculty.name,
      subject: slot.subject,
      section: slot.section,
      day: slot.day,
      date: "24 Sep 2026",
      startTime: slot.startTime,
      endTime: slot.endTime,
      room: slot.room,
      reason: reason,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    db.createSwapRequest(requestObj);
    this.closeSwapModal();
    this.showToast(`Swap request sent to ${targetFaculty.name}!`, 'success');
    this.renderFacultyRequests();
  }

  // --- ACCEPT / REJECT SWAP RESPONDER ---
  respondSwap(requestId, status) {
    const res = db.respondSwapRequest(requestId, status, this.currentUser);
    if (res) {
      if (status === 'ACCEPTED') {
        this.showToast('Request ACCEPTED! Timetable updated and students notified.', 'success');
      } else {
        this.showToast('Request REJECTED.', 'info');
      }
      this.renderFacultySchedule();
      this.renderFacultyRequests();
    }
  }

  // --- EDIT PERIOD MODAL ---
  openEditModal(periodId) {
    const slot = db.getTimetable().find(p => p.id === periodId);
    if (!slot) return;

    document.getElementById('editPeriodId').value = slot.id;
    document.getElementById('editSubject').value = slot.subject;
    document.getElementById('editRoom').value = slot.room;
    document.getElementById('editTopic').value = slot.topic || '';

    document.getElementById('editPeriodModal').classList.remove('hidden');
  }

  closeEditModal() {
    document.getElementById('editPeriodModal').classList.add('hidden');
  }

  handleSaveEditPeriod(e) {
    e.preventDefault();
    const id = document.getElementById('editPeriodId').value;
    const updates = {
      subject: document.getElementById('editSubject').value,
      room: document.getElementById('editRoom').value,
      topic: document.getElementById('editTopic').value
    };

    db.updatePeriod(id, updates);
    this.closeEditModal();
    this.showToast('Period details updated!', 'success');

    if (this.currentRole === 'FACULTY') this.renderFacultySchedule();
    if (this.currentRole === 'HOD') this.renderHodMasterSchedule();
  }

  // --- HOD BROADCAST ANNOUNCEMENT ---
  openBroadcastModal() {
    document.getElementById('broadcastModal').classList.remove('hidden');
  }

  closeBroadcastModal() {
    document.getElementById('broadcastModal').classList.add('hidden');
  }

  handleSendBroadcast(e) {
    e.preventDefault();
    const title = document.getElementById('broadcastTitle').value;
    const content = document.getElementById('broadcastContent').value;
    const audience = document.getElementById('broadcastAudience').value;

    db.addNotification({
      id: 'notif_bcast_' + Date.now(),
      targetType: audience,
      title: `📢 HOD Broadcast: ${title}`,
      message: content,
      timestamp: new Date().toLocaleString(),
      read: false
    });

    this.closeBroadcastModal();
    this.showToast('Broadcast dispatched successfully!', 'success');
  }

  // --- FIREBASE CONFIG MODAL ---
  openFirebaseConfigModal() {
    document.getElementById('firebaseModal').classList.remove('hidden');
  }

  closeFirebaseConfigModal() {
    document.getElementById('firebaseModal').classList.add('hidden');
  }

  switchFbTab(tab) {
    document.querySelectorAll('.fb-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.fb-tab-content').forEach(c => c.classList.add('hidden'));

    if (tab === 'config') {
      document.querySelectorAll('.fb-tab')[0].classList.add('active');
      document.getElementById('fbTabConfig').classList.remove('hidden');
    } else if (tab === 'rules') {
      document.querySelectorAll('.fb-tab')[1].classList.add('active');
      document.getElementById('fbTabRules').classList.remove('hidden');
    } else {
      document.querySelectorAll('.fb-tab')[2].classList.add('active');
      document.getElementById('fbTabMessaging').classList.remove('hidden');
    }
  }

  saveFirebaseConfig() {
    this.showToast('Firebase settings saved and initialized!', 'success');
    this.closeFirebaseConfigModal();
  }

  // --- NOTIFICATION DRAWER & TOAST ENGINE ---
  toggleNotificationDrawer() {
    const drawer = document.getElementById('notifDrawer');
    drawer.classList.toggle('hidden');
    if (!drawer.classList.contains('hidden')) {
      this.renderNotificationDrawer();
    }
  }

  renderNotificationDrawer() {
    const list = document.getElementById('notifList');
    list.innerHTML = '';
    const notifications = db.getNotifications();

    if (notifications.length === 0) {
      list.innerHTML = `<p class="form-hint">No notifications.</p>`;
      return;
    }

    notifications.forEach(n => {
      const item = document.createElement('div');
      item.className = `notif-item ${n.read ? '' : 'unread'}`;
      item.innerHTML = `
        <div class="notif-icon-box info"><i data-lucide="bell"></i></div>
        <div class="notif-details">
          <p><strong>${n.title}</strong></p>
          <p>${n.message}</p>
          <span class="notif-time">${n.timestamp}</span>
        </div>
      `;
      list.appendChild(item);
    });

    if (window.lucide) lucide.createIcons();
  }

  markAllNotificationsRead() {
    db.markNotificationsRead();
    this.renderNotificationDrawer();
    document.getElementById('notifBadge').classList.add('hidden');
  }

  updateUserNavbar() {
    const userArea = document.getElementById('navUserArea');
    if (this.currentUser) {
      userArea.classList.remove('hidden');
      document.getElementById('userNameDisplay').textContent = this.currentUser.name;
      document.getElementById('userRoleTag').textContent = `${this.currentRole} ${this.currentUser.section ? '• ' + this.currentUser.section : ''}`;
      document.getElementById('userAvatar').textContent = this.currentUser.name.charAt(0);
    } else {
      userArea.classList.add('hidden');
    }
  }

  logout() {
    this.currentUser = null;
    this.currentRole = null;
    this.updateUserNavbar();
    this.showPage('landing');
    this.showToast('Signed out successfully.', 'info');
  }

  // --- SEARCH & EXPORT FEATURES ---
  filterStudentScheduleBySearch() {
    const query = document.getElementById('stuSearchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('#studentTodaySlots .period-card, #studentWeeklySlots .period-card');
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  exportStudentSchedule() {
    if (!this.currentUser) return;
    const timetable = db.getTimetable().filter(p => p.section === this.currentUser.section);
    
    let csvContent = "data:text/csv;charset=utf-8,Day,Time,Subject,Faculty,Room,Topic,Substituted\n";
    timetable.forEach(p => {
      csvContent += `"${p.day}","${p.startTime} - ${p.endTime}","${p.subject}","${p.facultyName}","${p.room}","${p.topic || ''}","${p.isSubstituted ? 'YES' : 'NO'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Timetable_${this.currentUser.section}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('Schedule exported as CSV!', 'success');
  }

  // --- PERIOD DETAIL MODAL ---
  openPeriodDetailModal(periodId) {
    const slot = db.getTimetable().find(p => p.id === periodId);
    if (!slot) return;

    document.getElementById('detailSubject').textContent = slot.subject;
    document.getElementById('detailSection').textContent = slot.section;
    document.getElementById('detailRoom').textContent = slot.room;
    document.getElementById('detailTime').textContent = `${slot.startTime} - ${slot.endTime}`;
    document.getElementById('detailFacultyName').textContent = slot.facultyName;
    document.getElementById('detailTopic').textContent = slot.topic || 'Standard Course Curriculum';

    const subGroup = document.getElementById('detailSubGroup');
    if (slot.isSubstituted) {
      subGroup.classList.remove('hidden');
      document.getElementById('detailSubText').textContent = `This class is handled by substitute faculty ${slot.facultyName} (Original: ${slot.originalFacultyName}).`;
    } else {
      subGroup.classList.add('hidden');
    }

    document.getElementById('periodDetailModal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  closePeriodDetailModal() {
    document.getElementById('periodDetailModal').classList.add('hidden');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check-circle-2';
    if (type === 'error') icon = 'alert-circle';

    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Global instance
window.app = new Application();
