  const MODULES = {
    IPW: { code: 'IPW', name: 'Itinerario para la Empleabilidad II', teacher: 'LAURA', presencial: '-', color: 'var(--color-ipw)' },
    ADE: { code: 'ADE', name: 'Admin. Sistemas Gestores BDDD', teacher: 'OLIVER', presencial: 'Aula 235', color: 'var(--color-ade)' },
    EIB: { code: 'EIB', name: 'Estructuras de Control Python', teacher: 'JUAN', presencial: 'Aula 232', color: 'var(--color-eib)' },
    SGY: { code: 'SGY', name: 'Seguridad y Alta Disponibilidad', teacher: 'ALEJANDRO', presencial: 'Aula 235', color: 'var(--color-sgy)' },
    SRD: { code: 'SRD', name: 'Servicios de Red e Internet', teacher: 'ALEJANDRO', presencial: 'Aula 235', color: 'var(--color-srd)' },
    CC3: { code: 'CC3', name: 'Proyecto Intermodular', teacher: 'ALEJANDRO', presencial: 'Aula 232', color: 'var(--color-cc3)' },
    TUO: { code: 'TUO', name: 'Tutoría', teacher: 'ALEJANDRO', presencial: '-', color: 'var(--color-tuo)' },
    ADD: { code: 'ADD', name: 'Admin. Sistemas Operativos', teacher: 'GERARDO', presencial: 'Aula 232', color: 'var(--color-add)' },
    SOJ: { code: 'SOJ', name: 'Sostenibilidad', teacher: 'SERENA', presencial: 'Aula 235', color: 'var(--color-soj)' },
    IMW: { code: 'IMW', name: 'Implantación Aplicaciones Web', teacher: 'JUAN', presencial: 'Aula 232', color: 'var(--color-imw)' }
  };

  const TIME_SLOTS = [
    { range: '18:15 - 19:10', key: 0 },
    { range: '19:10 - 20:00', key: 1 },
    { range: '20:00 - 20:50', key: 2 },
    { range: '20:50 - 21:05', key: 'break', label: '☕ Descanso' },
    { range: '21:05 - 21:55', key: 3 },
    { range: '21:55 - 22:45', key: 4 }
  ];

  const CALENDAR_DATES = [
    { week: '1', date: '23 Sep', monthIdx: 0, year: 2026, dayNum: 23 },
    { week: '2', date: '30 Sep', monthIdx: 0, year: 2026, dayNum: 30 },
    { week: '3', date: '7 Oct', monthIdx: 1, year: 2026, dayNum: 7 },
    { week: '4', date: '14 Oct', monthIdx: 1, year: 2026, dayNum: 14 },
    { week: '5', date: '21 Oct', monthIdx: 1, year: 2026, dayNum: 21 },
    { week: '6', date: '28 Oct', monthIdx: 1, year: 2026, dayNum: 28 },
    { week: '7', date: '4 Nov', monthIdx: 2, year: 2026, dayNum: 4 },
    { week: '8', date: '11 Nov', monthIdx: 2, year: 2026, dayNum: 11 },
    { week: '9', date: '18 Nov', monthIdx: 2, year: 2026, dayNum: 18 },
    { week: '10', date: '25 Nov', monthIdx: 2, year: 2026, dayNum: 25 },
    { week: '11', date: '2 Dic', monthIdx: 3, year: 2026, dayNum: 2 },
    { week: '12', date: '9 Dic', monthIdx: 3, year: 2026, dayNum: 9 },
    { week: '13', date: '16 Dic', monthIdx: 3, year: 2026, dayNum: 16 },
    { week: 'F', date: '23 Dic', monthIdx: 3, year: 2026, dayNum: 23, holiday: 'Navidad' },
    { week: 'F', date: '30 Dic', monthIdx: 3, year: 2026, dayNum: 30, holiday: 'Navidad' },
    { week: 'F', date: '6 Ene', monthIdx: 4, year: 2027, dayNum: 6, holiday: 'Reyes' },
    { week: '14', date: '13 Ene', monthIdx: 4, year: 2027, dayNum: 13 },
    { week: '15', date: '20 Ene', monthIdx: 4, year: 2027, dayNum: 20 },
    { week: '16', date: '27 Ene', monthIdx: 4, year: 2027, dayNum: 27 },
    { week: '17', date: '3 Feb', monthIdx: 5, year: 2027, dayNum: 3 },
    { week: '18', date: '10 Feb', monthIdx: 5, year: 2027, dayNum: 10 },
    { week: '19', date: '17 Feb', monthIdx: 5, year: 2027, dayNum: 17 },
    { week: 'F', date: '24 Feb', monthIdx: 5, year: 2027, dayNum: 24, holiday: 'No lectivo' },
    { week: '20', date: '3 Mar', monthIdx: 6, year: 2027, dayNum: 3 },
    { week: '21', date: '10 Mar', monthIdx: 6, year: 2027, dayNum: 10 },
    { week: '22', date: '17 Mar', monthIdx: 6, year: 2027, dayNum: 17 },
    { week: 'F', date: '24 Mar', monthIdx: 6, year: 2027, dayNum: 24, holiday: 'Semana Santa' },
    { week: '23', date: '31 Mar', monthIdx: 6, year: 2027, dayNum: 31 },
    { week: '24', date: '7 Abr', monthIdx: 7, year: 2027, dayNum: 7 },
    { week: '25', date: '14 Abr', monthIdx: 7, year: 2027, dayNum: 14 },
    { week: '26', date: '21 Abr', monthIdx: 7, year: 2027, dayNum: 21 },
    { week: '27', date: '28 Abr', monthIdx: 7, year: 2027, dayNum: 28 },
    { week: '28', date: '5 May', monthIdx: 8, year: 2027, dayNum: 5 },
    { week: '29', date: '12 May', monthIdx: 8, year: 2027, dayNum: 12 },
    { week: '30', date: '19 May', monthIdx: 8, year: 2027, dayNum: 19 },
    { week: '31', date: '26 May', monthIdx: 8, year: 2027, dayNum: 26 },
    { week: '32', date: '2 Jun', monthIdx: 9, year: 2027, dayNum: 2 },
    { week: '33', date: '9 Jun', monthIdx: 9, year: 2027, dayNum: 9 },
    { week: '34', date: '16 Jun', monthIdx: 9, year: 2027, dayNum: 16 }
  ];

  const SCHEDULE_A = [
    ['IMW','IMW','IMW','SRD','SRD'], ['IMW','IMW','SRD','SRD','SRD'], ['IMW','IMW','IMW','SRD','SRD'], ['IMW','IMW','SRD','SRD','SRD'],
    ['IMW','IMW','IMW','SRD','SRD'], ['IMW','IMW','SRD','SRD','SRD'], ['IMW','IMW','IMW','SRD','SRD'], ['IMW','IMW','SRD','SRD','SRD'],
    ['EIB','EIB','EIB','SRD','SRD'], ['EIB','EIB','SRD','SRD','SRD'], ['EIB','EIB','SRD','ADE','ADE'], ['EIB','EIB','ADE','ADE','ADE'],
    ['EIB','EIB','EIB','ADE','ADE'], null, null, null,
    ['EIB','EIB','ADE','ADE','ADE'], ['ADD','ADD','ADD','SGY','SGY'], ['ADD','ADD','SGY','SGY','SGY'], ['ADD','ADD','ADD','SGY','SGY'],
    ['ADD','ADD','SGY','SGY','SGY'], ['ADD','ADD','ADD','SGY','SGY'], null, ['ADD','ADD','SGY','SGY','SGY'],
    ['IPW','IPW','SGY','SGY','SGY'], ['IPW','IPW','ADD','ADD','ADD'], null, ['IPW','IPW','ADD','ADD','ADD'],
    ['IPW','IPW','ADD','ADD','ADD'], ['IPW','IPW','ADD','ADD','SGY'], ['IPW','IPW','SGY','SGY','SGY'], ['IPW','IPW','SGY','SGY','SGY'],
    ['SOJ','SOJ','SOJ','SGY',null], ['SOJ','SOJ',null,null,null], ['CC3','CC3','CC3',null,null], ['CC3','CC3','CC3',null,null],
    ['CC3','CC3',null,null,null], ['CC3','CC3',null,null,null], ['IMW',null,null,null,null]
  ];

  const SCHEDULE_B = [
    ['SRD','SRD','SRD','IMW','IMW'], ['SRD','SRD','IMW','IMW','IMW'], ['SRD','SRD','SRD','IMW','IMW'], ['SRD','SRD','IMW','IMW','IMW'],
    ['SRD','SRD','SRD','IMW','IMW'], ['SRD','SRD','IMW','IMW','IMW'], ['SRD','SRD','SRD','IMW','IMW'], ['SRD','SRD','IMW','IMW','IMW'],
    ['SRD','SRD','SRD','EIB','EIB'], ['SRD','SRD','EIB','EIB','EIB'], ['SRD','ADE','ADE','EIB','EIB'], ['ADE','ADE','EIB','EIB','EIB'],
    ['ADE','ADE','ADE','EIB','EIB'], null, null, null,
    ['ADE','ADE','SGY','EIB','EIB'], ['ADE','SGY','SGY','ADD','ADD'], ['SGY','SGY','ADD','ADD','ADD'], ['SGY','SGY','SGY','ADD','ADD'],
    ['SGY','SGY','ADD','ADD','ADD'], ['SGY','SGY','SGY','ADD','ADD'], null, ['SGY','SGY','ADD','ADD','ADD'],
    ['ADD','ADD','ADD','IPW','IPW'], ['SGY','SGY','SGY','IPW','IPW'], null, ['SGY','SGY','SGY','IPW','IPW'],
    ['SGY','SGY','SGY','IPW','IPW'], ['SGY','SGY',null,'IPW','IPW'], ['ADD','ADD','ADD','IPW','IPW'], ['ADD','ADD','ADD','IPW','IPW'],
    ['ADD','ADD',null,'SOJ','SOJ'], [null,null,'SOJ','SOJ','SOJ'], [null,null,null,'CC3','CC3'], [null,null,null,'CC3','CC3'],
    [null,null,'CC3','CC3','CC3'], [null,null,'CC3','CC3','CC3'], [null,'IMW',null,null,null]
  ];

  const MONTHS_DATA = [
    { name: 'Septiembre 2026', year: 2026, monthIdx: 8, daysInMonth: 30, startDayOfWeek: 1 },
    { name: 'Octubre 2026', year: 2026, monthIdx: 9, daysInMonth: 31, startDayOfWeek: 3 },
    { name: 'Noviembre 2026', year: 2026, monthIdx: 10, daysInMonth: 30, startDayOfWeek: 6 },
    { name: 'Diciembre 2026', year: 2026, monthIdx: 11, daysInMonth: 31, startDayOfWeek: 1 },
    { name: 'Enero 2027', year: 2027, monthIdx: 0, daysInMonth: 31, startDayOfWeek: 4 },
    { name: 'Febrero 2027', year: 2027, monthIdx: 1, daysInMonth: 28, startDayOfWeek: 0 },
    { name: 'Marzo 2027', year: 2027, monthIdx: 2, daysInMonth: 31, startDayOfWeek: 0 },
    { name: 'Abril 2027', year: 2027, monthIdx: 3, daysInMonth: 30, startDayOfWeek: 3 },
    { name: 'Mayo 2027', year: 2027, monthIdx: 4, daysInMonth: 31, startDayOfWeek: 5 },
    { name: 'Junio 2027', year: 2027, monthIdx: 5, daysInMonth: 30, startDayOfWeek: 1 }
  ];

  const EVENT_TYPES = {
    absence: { label: 'Falta' },
    exam: { label: 'Examen' },
    task: { label: 'Tarea' },
    note: { label: 'Nota' }
  };

  const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const LAST_TEACHING_WEEK = 34;

  let currentGroup = loadGroup();
  let selectedMonthIndex = 0;
  let selectedDateIndex = 0;
  let currentMatrixSubTab = 1;
  let currentTab = 'grid';
  let filterModule = null;
  let lastAddedKey = null;
  let pendingPop = null;
  let toastTimer = null;
  let userEvents = loadEvents();
  // Tareas y notas personales en días sin clase, por fecha: { 'AAAA-MM-DD': [registro, …] }.
  // Van aparte de userEvents, que se indexa por posición en CALENDAR_DATES.
  let personalEvents = loadPersonal();

  // --- Utilidades ---
  // El grupo elegido se recuerda entre sesiones
  function loadGroup() {
    try { return localStorage.getItem('horario_group') === 'B' ? 'B' : 'A'; }
    catch { return 'A'; }
  }

  function loadEvents() {
    try { return JSON.parse(localStorage.getItem('academic_events_dark') || '{}'); }
    catch { return {}; }
  }

  function loadPersonal() {
    try { return JSON.parse(localStorage.getItem('horario_personal') || '{}'); }
    catch { return {}; }
  }

  const isoOf = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  function isoDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // «sábado 3 de octubre»
  function isoLong(iso) {
    const d = isoDate(iso);
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '');
  }

  // Mismo formato que las fechas de clase: «3 Oct»
  function isoShort(iso) {
    const d = isoDate(iso);
    const idx = MONTHS_DATA.findIndex(m => m.year === d.getFullYear() && m.monthIdx === d.getMonth());
    const mon = idx === -1 ? d.toLocaleDateString('es-ES', { month: 'short' }) : monthWord(idx).slice(0, 3);
    return { date: `${d.getDate()} ${capitalize(mon)}`, dayNum: d.getDate(), monthIdx: idx };
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function capitalize(name) {
    return name.charAt(0) + name.slice(1).toLowerCase();
  }

  function getSchedule() {
    return currentGroup === 'A' ? SCHEDULE_A : SCHEDULE_B;
  }

  function realDate(cd) {
    const m = MONTHS_DATA[cd.monthIdx];
    return new Date(m.year, m.monthIdx, cd.dayNum);
  }

  function monthWord(monthIdx) {
    return MONTHS_DATA[monthIdx].name.split(' ')[0].toLowerCase();
  }

  function startOfToday() {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }

  // Próximo miércoles lectivo (o el último si el curso ya terminó)
  function nextClassIndex() {
    const today = startOfToday();
    const idx = CALENDAR_DATES.findIndex(cd => !cd.holiday && realDate(cd) >= today);
    return idx === -1 ? CALENDAR_DATES.length - 1 : idx;
  }

  function chip(code, extraClass = '') {
    const mod = MODULES[code];
    const dim = filterModule && filterModule !== code ? ' is-dimmed' : '';
    return `<span class="chip ${extraClass}${dim}" style="--m:${mod.color}" title="${escapeHTML(mod.name)}">${code}</span>`;
  }

  function icon(id) {
    return `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  }

  // Reinicia una animación CSS aunque la clase ya estuviera puesta
  function replay(el, cls) {
    if (document.documentElement.classList.contains('is-intro')) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  // --- Arranque ---
  function init() {
    // Segunda comprobación de la app de Android (la primera está en <head>)
    if (window.AndroidApp) document.documentElement.classList.add('is-app');
    selectedDateIndex = nextClassIndex();
    selectedMonthIndex = CALENDAR_DATES[selectedDateIndex].monthIdx;
    setMatrixSubTab(subTabOf(selectedDateIndex));

    syncGroupLabels();
    populateModalDateSelect();
    renderMonthSidebar();
    renderMonthView();
    renderDateList();
    renderTimeline();
    renderAttendanceBars();
    renderSidebarNotes();
    renderMatrix();
    renderModulesList();
    moveTabIndicator();
    syncThemeToggle();

    const dialog = document.getElementById('eventModal');
    dialog.addEventListener('click', e => { if (e.target === dialog) closeAddModal(); });
    dialog.addEventListener('cancel', e => { e.preventDefault(); closeAddModal(); });
    document.querySelectorAll('input[name="eventType"]').forEach(r => r.addEventListener('change', updateTypeHelp));
    document.getElementById('modalEventText').addEventListener('input', () => setTextError(false));

    const table = document.getElementById('matrixTable');
    document.addEventListener('contextmenu', e => {
      const el = e.target.closest(MENU_TARGETS);
      if (!el) return;
      e.preventDefault();
      // En táctil el menú lo abre la pulsación larga, no el menú nativo de Android
      if (press.touch) return;
      openMenuFor(el, e);
    });
    document.addEventListener('pointerdown', startLongPress);
    document.addEventListener('pointermove', e => {
      if (press.timer && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 10) cancelLongPress();
    });
    document.addEventListener('pointerup', cancelLongPress);
    document.addEventListener('pointercancel', cancelLongPress);
    table.addEventListener('pointerover', e => {
      const c = e.target.closest('.slot-chip.has-recs');
      if (c && e.pointerType !== 'touch') scheduleTip(c);
    });
    table.addEventListener('pointerout', e => {
      const c = e.target.closest('.slot-chip.has-recs');
      if (c && !c.contains(e.relatedTarget)) hideTip();
    });
    table.addEventListener('focusin', e => {
      const c = e.target.closest('.slot-chip.has-recs');
      if (c && c.matches(':focus-visible')) scheduleTip(c, 0);
    });
    table.addEventListener('focusout', hideTip);
    table.addEventListener('pointerdown', hideTip);
    document.querySelector('.table-wrap').addEventListener('scroll', hideTip, { passive: true });
    window.addEventListener('scroll', hideTip, { passive: true });

    const slotDialog = document.getElementById('slotDialog');
    slotDialog.addEventListener('click', e => { if (e.target === slotDialog) closeSlotDialog(); });
    slotDialog.addEventListener('cancel', e => { e.preventDefault(); closeSlotDialog(); });
    slotDialog.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', () => setFieldError(el.id, false)));

    document.getElementById('matrixTable').addEventListener('click', e => {
      const chipEl = e.target.closest('.slot-chip');
      if (chipEl) { toggleSlotAbsence(parseInt(chipEl.dataset.date), parseInt(chipEl.dataset.slot)); return; }
      const headEl = e.target.closest('button.th-inner');
      if (headEl) toggleDayAbsence(parseInt(headEl.dataset.date));
    });

    const menu = document.getElementById('menuDrawer');
    menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
    menu.addEventListener('cancel', e => { e.preventDefault(); closeMenu(); });

    startLive();
    // Tema rosa escondido: se activa manteniendo pulsado «Día» 3 segundos
    const dayBtn = document.getElementById('btnThemeLight');
    let rosaTimer = null;
    const stopHold = () => { clearTimeout(rosaTimer); dayBtn.classList.remove('is-holding'); };
    dayBtn.addEventListener('pointerdown', () => {
      dayBtn.classList.add('is-holding');
      rosaTimer = setTimeout(() => {
        stopHold();
        haptic('strong');
        swallowNextClick();   // el click al soltar pondría el modo día
        setTheme('rosa', dayBtn);
      }, 3000);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => dayBtn.addEventListener(t, stopHold));

    applyNativeActions();
    syncReminders();

    window.addEventListener('resize', () => { moveTabIndicator(); alignSidebar(); });
    alignSidebar();
    scrollMatrixToToday();
    if (document.fonts) document.fonts.ready.then(() => { moveTabIndicator(); alignSidebar(); scrollMatrixToToday(); });

    setTimeout(() => document.documentElement.classList.remove('is-intro'), 1500);
  }

  // --- AVISOS (app de Android) ---
  // La web calcula los avisos y se los pasa a Android, que los programa y los guarda
  // para reprogramarlos tras reiniciar. Las tareas repiten cada día hasta que se entregan.
  const REMINDER_HOUR = 10;

  function newRecordId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function syncReminders() {
    if (!window.AndroidApp || !AndroidApp.syncReminders) return;
    let assigned = false;
    const list = [];
    Object.entries(userEvents).forEach(([dateIdx, events]) => {
      const cd = CALENDAR_DATES[dateIdx];
      if (!cd) return;
      events.forEach(ev => {
        if (ev.type !== 'exam' && ev.type !== 'task') return;
        if (!ev.id) { ev.id = newRecordId(); assigned = true; }
        if (!ev.notify || !ev.notifyDays || !ev.notifyDays.length) return;
        if (ev.type === 'task' && ev.status === 'done') return;
        const slot = TIME_SLOTS.find(t => t.key === ev.slot);
        const start = slot ? slotBounds(slot).start : '18:15';
        const [hh, mm] = start.split(':').map(Number);
        const due = realDate(cd);
        due.setHours(hh, mm, 0, 0);
        const times = ev.notifyDays.map(d => {
          const t = realDate(cd);
          t.setDate(t.getDate() - d);
          t.setHours(REMINDER_HOUR, 0, 0, 0);
          return t.getTime();
        });
        list.push({
          id: ev.id,
          kind: ev.type,
          code: ev.module,
          what: ev.type === 'task' ? (ev.title || ev.text) : (ev.topics || ev.text),
          when: `miércoles ${cd.date}, ${start}`,
          due: due.getTime(),
          times,
          hour: REMINDER_HOUR,
          repeat: ev.type === 'task'
        });
      });
    });
    Object.entries(personalEvents).forEach(([iso, events]) => events.forEach(ev => {
      if (ev.type !== 'task' || !ev.notify || !ev.notifyDays || !ev.notifyDays.length || ev.status === 'done') return;
      const due = isoDate(iso);
      due.setHours(23, 59, 0, 0);
      const times = ev.notifyDays.map(d => {
        const t = isoDate(iso);
        t.setDate(t.getDate() - d);
        t.setHours(REMINDER_HOUR, 0, 0, 0);
        return t.getTime();
      });
      list.push({ id: ev.id, kind: 'task', code: '', what: ev.title || ev.text, when: isoLong(iso), due: due.getTime(), times, hour: REMINDER_HOUR, repeat: true });
    }));
    if (assigned) localStorage.setItem('academic_events_dark', JSON.stringify(userEvents));
    AndroidApp.syncReminders(JSON.stringify(list));
  }

  // «Entregada» pulsado en una notificación con la app cerrada: Android lo guarda y aquí se aplica
  function applyNativeActions() {
    if (!window.AndroidApp || !AndroidApp.takeDoneIds) return;
    const ids = JSON.parse(AndroidApp.takeDoneIds() || '[]');
    if (!ids.length) return;
    let changed = false;
    [...Object.values(userEvents), ...Object.values(personalEvents)].forEach(events => events.forEach(ev => {
      if (ev.type === 'task' && ids.includes(ev.id) && ev.status !== 'done') { ev.status = 'done'; changed = true; }
    }));
    if (changed) saveData();
  }

  function saveData() {
    localStorage.setItem('academic_events_dark', JSON.stringify(userEvents));
    localStorage.setItem('horario_personal', JSON.stringify(personalEvents));
    syncReminders();
    renderMonthView();
    renderDateList();
    renderTimeline();
    renderAttendanceBars();
    renderSidebarNotes();
    renderMatrix();
  }

  // --- Navegación ---
  function switchGroup(group) {
    if (group === currentGroup) return;
    currentGroup = group;
    try { localStorage.setItem('horario_group', group); } catch {}
    syncGroupLabels();

    renderMonthView();
    renderDateList();
    renderTimeline();
    renderAttendanceBars();
    renderMatrix();
    renderModulesList();

    replay(document.getElementById('monthGrid'), 'is-swapping');
    replay(document.getElementById('timelineContainer'), 'is-swapping');
    replay(document.querySelector('.table-wrap'), 'is-swapping');
    tickLive();
  }

  function syncGroupLabels() {
    const group = currentGroup;
    const seg = document.getElementById('btnGroupA').parentElement;
    seg.dataset.active = group;
    ['A', 'B'].forEach(g => {
      const b = document.getElementById('btnGroup' + g);
      b.classList.toggle('is-active', g === group);
      b.setAttribute('aria-pressed', g === group);
    });
    document.getElementById('groupBadge').innerText = `Grupo ${group}`;
  }

  // Desplazamiento lateral de la tabla al salir de «Trimestre»: se recupera al volver
  let matrixScroll = null;

  function switchTab(tab) {
    const ids = { monthly: 'viewMonthly', weekly: 'viewWeekly', grid: 'viewGrid', modules: 'viewModules' };
    const wrap = document.querySelector('.table-wrap');
    if (currentTab === 'grid' && tab !== 'grid') matrixScroll = wrap.scrollLeft;
    currentTab = tab;
    Object.entries(ids).forEach(([key, id]) => {
      document.getElementById(id).classList.toggle('is-shown', key === tab);
    });
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('is-active'));
    document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('is-active');
    moveTabIndicator();
    alignSidebar();
    renderAttendanceBars();
    renderSidebarNotes();
    if (tab === 'grid' && matrixScroll !== null) wrap.scrollLeft = matrixScroll;

    if (tab === 'weekly') {
      const active = document.querySelector('.date-item.is-active');
      if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  // Con los paneles al lado, bajan hasta el borde superior de la tabla
  // (el selector de tramo y la ayuda quedan por encima). Se mide contra la
  // propia vista: la tabla se desplaza con ella durante la animación de entrada.
  function alignSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const view = document.getElementById('viewGrid');
    const wrap = view.querySelector('.table-wrap');
    const offset = view.classList.contains('is-shown')
      ? wrap.getBoundingClientRect().top - view.getBoundingClientRect().top
      : 0;
    sidebar.style.setProperty('--align', `${Math.round(offset)}px`);
  }

  // --- Menú lateral (grupo, tema y ayuda) ---
  function openMenu() {
    const menu = document.getElementById('menuDrawer');
    if (!menu.open) menu.showModal();
  }

  function closeMenu() {
    const menu = document.getElementById('menuDrawer');
    if (!menu.open || menu.classList.contains('is-closing')) return;
    const finish = () => {
      menu.classList.remove('is-closing');
      menu.close();
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    menu.classList.add('is-closing');
    menu.addEventListener('animationend', finish, { once: true });
  }

  function moveTabIndicator() {
    const active = document.querySelector('.tab.is-active');
    const indicator = document.querySelector('.tab-indicator');
    if (!active || !indicator) return;
    indicator.style.setProperty('--x', `${active.offsetLeft + 12}px`);
    indicator.style.setProperty('--s', (active.offsetWidth - 24) / 100);
  }

  function switchMatrixSubTab(subTabNum) {
    if (subTabNum === currentMatrixSubTab) return;
    setMatrixSubTab(subTabNum);
    renderMatrix();
    renderAttendanceBars();
    renderSidebarNotes();
    scrollMatrixToToday();
    replay(document.querySelector('.table-wrap'), 'is-swapping');
  }

  function setMatrixSubTab(subTabNum) {
    currentMatrixSubTab = subTabNum;
    document.getElementById('subTab1').parentElement.dataset.active = subTabNum;
    [1, 2, 3].forEach(n => document.getElementById('subTab' + n).classList.toggle('is-active', n === subTabNum));
  }

  // Tramo de la tabla que contiene esa fecha (el primero si no está en ninguno)
  function subTabOf(dateIdx) {
    const saved = currentMatrixSubTab;
    let found = 1;
    [1, 2, 3].forEach(n => {
      currentMatrixSubTab = n;
      const { startIdx, endIdx } = matrixRange();
      if (dateIdx >= startIdx && dateIdx <= endIdx) found = n;
    });
    currentMatrixSubTab = saved;
    return found;
  }

  // Móvil: la tabla no cabe a lo ancho. Se desplaza para que la primera fecha visible,
  // pegada a la columna de horas, sea la última clase anterior a hoy (el 7 oct deja
  // el 30 sep a la izquierda; el 30 oct, el 28 oct). En el ordenador no se mueve.
  function scrollMatrixToToday() {
    if (!matchMedia('(pointer: coarse)').matches) return;
    const wrap = document.querySelector('.table-wrap');
    const { startIdx, endIdx } = matrixRange();
    const today = startOfToday();
    let anchor = -1;
    for (let i = startIdx; i <= endIdx; i++) {
      if (!CALENDAR_DATES[i].holiday && realDate(CALENDAR_DATES[i]) < today) anchor = i;
    }
    // Distancia desde la primera columna de fechas (la que queda junto a «Hora» sin desplazar)
    const ths = document.querySelectorAll('#matrixTable thead th');
    const left = anchor === -1 ? 0 : ths[anchor - startIdx + 1].offsetLeft - ths[1].offsetLeft;
    wrap.scrollLeft = Math.max(0, left);
  }

  // --- 1. VISTA MENSUAL ---
  function renderMonthSidebar() {
    const container = document.getElementById('monthList');
    container.innerHTML = '';
    MONTHS_DATA.forEach((m, idx) => {
      const classes = CALENDAR_DATES.filter(cd => cd.monthIdx === idx && !cd.holiday).length;
      const item = document.createElement('button');
      item.className = `month-item ${idx === selectedMonthIndex ? 'is-active' : ''}`;
      item.innerHTML = `<span>${m.name}</span><span class="count">${classes}</span>`;
      item.title = `${classes} ${classes === 1 ? 'miércoles lectivo' : 'miércoles lectivos'}`;
      item.onclick = () => changeMonth(idx);
      container.appendChild(item);
    });
  }

  function changeMonth(idx) {
    idx = parseInt(idx);
    if (idx === selectedMonthIndex) return;
    const grid = document.getElementById('monthGrid');
    grid.style.setProperty('--dir', idx > selectedMonthIndex ? 1 : -1);
    selectedMonthIndex = idx;
    renderMonthSidebar();
    renderMonthView();
    replay(grid, 'is-swapping');
    const active = document.querySelector('.month-item.is-active');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function stepMonth(delta) {
    const idx = selectedMonthIndex + delta;
    if (idx >= 0 && idx < MONTHS_DATA.length) changeMonth(idx);
  }

  function goToToday() {
    selectDate(nextClassIndex());
    const month = CALENDAR_DATES[selectedDateIndex].monthIdx;
    if (month === selectedMonthIndex) renderMonthView();
    else changeMonth(month);
  }

  function selectDate(idx) {
    selectedDateIndex = idx;
    renderDateList();
    renderTimeline();
    renderAttendanceBars();
    replay(document.getElementById('timelineContainer'), 'is-swapping');
  }

  function renderMonthView() {
    const month = MONTHS_DATA[selectedMonthIndex];
    document.getElementById('monthTitleDisplay').innerText = month.name;
    const grid = document.getElementById('monthGrid');
    const schedule = getSchedule();
    const today = startOfToday();
    const nextIdx = nextClassIndex();

    let html = WEEKDAYS.map((d, i) => `<div class="day-name ${i === 2 ? 'is-class' : ''}" style="--w:${i}">${d}</div>`).join('');

    for (let i = 0; i < month.startDayOfWeek; i++) {
      html += `<div class="month-day is-empty"></div>`;
    }

    for (let day = 1; day <= month.daysInMonth; day++) {
      const col = (month.startDayOfWeek + day - 1) % 7;
      const row = Math.floor((month.startDayOfWeek + day - 1) / 7) + 1;
      const wave = `--w:${row + col}`;
      const isToday = today.getFullYear() === month.year && today.getMonth() === month.monthIdx && today.getDate() === day;
      const dateIdx = CALENDAR_DATES.findIndex(cd => cd.monthIdx === selectedMonthIndex && cd.dayNum === day);
      const baseClass = `month-day${col >= 5 ? ' is-weekend' : ''}${isToday ? ' is-today' : ''}`;
      const iso = isoOf(month.year, month.monthIdx, day);
      const personal = personalEvents[iso] || [];

      // Día sin clase: se puede tocar para añadir tareas y notas personales
      if (dateIdx === -1) {
        const label = `${capitalize(isoLong(iso))}${personal.length ? `, ${personal.length} ${personal.length === 1 ? 'registro personal' : 'registros personales'}` : ''}. Añadir tarea o nota`;
        html += `<button class="${baseClass} is-free" style="${wave}" data-iso="${iso}" aria-haspopup="menu" aria-label="${label}"><span class="day-num">${day}</span>${personalList(personal)}${dayMarks(personal)}</button>`;
        continue;
      }

      const cd = CALENDAR_DATES[dateIdx];
      const daySched = schedule[dateIdx];
      const events = userEvents[dateIdx] || [];
      let inner = `<span class="day-num"><span class="day-n">${day}${dayDot(dateIdx)}</span></span>`;
      let label = `Miércoles ${day} de ${monthWord(selectedMonthIndex)}`;

      if (cd.holiday) {
        inner += `<span class="holiday-label">${cd.holiday}</span>`;
        label += `, festivo: ${cd.holiday}`;
      } else if (daySched) {
        const uniqueMods = [...new Set(daySched.filter(Boolean))].filter(m => MODULES[m]);
        inner += `<div class="day-badges">${uniqueMods.map(m => chip(m)).join('')}</div>`;
        label += `, ${uniqueMods.join(', ')}`;
      }

      if (personal.length) inner += personalList(personal);
      if (events.length || personal.length) {
        inner += dayMarks([...events, ...personal]);
        const n = events.length + personal.length;
        label += `, ${n} ${n === 1 ? 'registro' : 'registros'}`;
      }

      if (dateIdx === nextIdx && !isToday) inner += `<span class="next-label">Próxima</span>`;

      const dim = filterModule && !(daySched || []).includes(filterModule) ? ' is-dimmed' : '';
      const cls = `${baseClass} is-class${cd.holiday ? ' is-holiday' : ''}${dateIdx === nextIdx ? ' is-next' : ''}${dayStateClass(dateIdx)}${dateIdx === selectedDateIndex ? ' is-selected' : ''}${dim}`;
      html += `<button class="${cls}" style="${wave}" data-idx="${dateIdx}" data-iso="${iso}" aria-label="${label}">${inner}</button>`;
    }

    grid.innerHTML = html;
    grid.querySelectorAll('button.month-day').forEach(btn => {
      btn.onclick = e => {
        // Sin clases (día libre o festivo): el clic abre el menú de tareas y notas personales.
        // En táctil no: ahí solo se abre manteniendo pulsado (startLongPress)
        if (!hasClasses(btn)) {
          const touch = e.pointerType ? e.pointerType === 'touch' : press.touch;
          if (!touch) openPersonalMenu(btn, e);
          return;
        }
        selectDate(parseInt(btn.dataset.idx));
        renderMonthView();
        switchTab('weekly');
      };
    });
  }

  function hasClasses(dayBtn) {
    return dayBtn.dataset.idx !== undefined && dayBlocks(parseInt(dayBtn.dataset.idx)).length > 0;
  }

  function dayMarks(events) {
    const types = ['exam', 'task', 'absence', 'note'].filter(t => events.some(e => e.type === t));
    if (!types.length) return '';
    return `<span class="day-marks">${types.map(t => `<span class="mark mark-${t}" title="${EVENT_TYPES[t].label}"></span>`).join('')}</span>`;
  }

  // Hasta tres registros personales escritos en la casilla (en móvil solo quedan las marcas)
  function personalList(events) {
    if (!events.length) return '';
    const items = events.slice(0, 3).map(ev =>
      `<span class="personal-item${ev.type === 'task' && ev.status === 'done' ? ' is-done' : ''}" data-type="${ev.type}">${escapeHTML(ev.text)}</span>`).join('');
    const more = events.length > 3 ? `<span class="personal-more">+${events.length - 3}</span>` : '';
    return `<span class="day-personal">${items}${more}</span>`;
  }

  // --- 2. CONTROL DE ASISTENCIA ---
  function renderAttendanceBars() {
    const container = document.getElementById('attendanceBarsContainer');
    const schedule = getSchedule();
    const { startIdx, endIdx } = sidebarRange();

    // El % siempre cuenta el curso entero (un módulo repartido entre trimestres no puede
    // pasar de 100 % a 0 % por una falta en el trimestre en el que tiene una sola clase).
    // El tramo visible solo decide qué módulos salen: los que tienen clase en él.
    const inRange = new Set();
    schedule.forEach((daySched, dateIdx) => {
      if (daySched && dateIdx >= startIdx && dateIdx <= endIdx) daySched.forEach(m => { if (m) inRange.add(m); });
    });

    // En la vista Día solo salen los módulos de ese día
    const dayOnly = currentTab === 'weekly';
    let shown = Object.keys(MODULES).filter(m => inRange.has(m));
    if (dayOnly) {
      shown = [...new Set((schedule[selectedDateIndex] || []).filter(m => m && MODULES[m]))];
    }

    const totalHoursPerModule = {};
    const missedHoursPerModule = {};

    Object.keys(MODULES).forEach(m => {
      totalHoursPerModule[m] = 0;
      missedHoursPerModule[m] = 0;
    });

    schedule.forEach((daySched, dateIdx) => {
      if (!daySched) return;
      daySched.forEach(m => {
        if (m && totalHoursPerModule[m] !== undefined) {
          totalHoursPerModule[m]++;
        }
      });

      const events = userEvents[dateIdx] || [];
      events.forEach(ev => {
        if (ev.type === 'absence') {
          if (Number.isInteger(ev.slot) && missedHoursPerModule[ev.module] !== undefined) {
            missedHoursPerModule[ev.module] += 1;
          } else if (ev.module && missedHoursPerModule[ev.module] !== undefined) {
            const countInDay = daySched.filter(x => x === ev.module).length;
            missedHoursPerModule[ev.module] += (countInDay > 0 ? countInDay : 2);
          } else {
            daySched.forEach(m => {
              if (m && missedHoursPerModule[m] !== undefined) missedHoursPerModule[m]++;
            });
          }
        }
      });
    });

    // Conserva el valor anterior de cada barra para que el cambio se anime
    const previous = {};
    container.querySelectorAll('.att-row').forEach(r => {
      previous[r.dataset.code] = r.querySelector('.bar-fill').style.getPropertyValue('--p');
    });

    let html = '';
    let i = 0;
    shown.forEach(m => {
      const total = totalHoursPerModule[m];
      if (total === 0) return;

      const missed = missedHoursPerModule[m];
      const attended = Math.max(0, total - missed);
      const percentage = Math.round((attended / total) * 100);
      const allowed = Math.floor(total * 0.2);
      const left = allowed - missed;

      const state = percentage < 80 ? 'risk' : percentage < 90 ? 'warn' : 'ok';
      const margin = left < 0
        ? `Límite superado por ${-left} h`
        : left === 0
          ? 'Sin margen: la próxima falta supera el límite'
          : `Puedes faltar ${left} h más · ${attended}/${total} h`;

      const dim = filterModule && filterModule !== m ? ' is-dimmed' : '';
      html += `
        <div class="att-row${dim}" data-state="${state}" data-code="${m}" data-p="${percentage / 100}">
          <div class="att-top">
            ${chip(m)}
            <span class="att-name">${MODULES[m].name}</span>
            <span class="att-pct">${percentage}%</span>
          </div>
          <div class="bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentage}" aria-label="Asistencia ${m}">
            <span class="bar-limit"></span>
            <span class="bar-fill" style="--p:${previous[m] || percentage / 100}; --i:${i++}"></span>
          </div>
          <div class="att-margin">${margin}</div>
        </div>`;
    });
    if (!html && dayOnly) {
      const holiday = CALENDAR_DATES[selectedDateIndex].holiday;
      html = `<p class="att-empty">${holiday ? `Festivo · ${holiday}` : 'No hay clases este día'}. Elige otra fecha para ver la asistencia de sus asignaturas.</p>`;
    }
    container.innerHTML = html;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      container.querySelectorAll('.att-row').forEach(r => {
        r.querySelector('.bar-fill').style.setProperty('--p', r.dataset.p);
      });
    }));
  }

  // --- 3. REGISTROS ---
  // Etiqueta del tramo que se está contando en cada panel
  // Tipo del registro con su color (la fecha va aparte, en grande, y sin hora)
  function recordMeta(label) {
    return `<span class="record-mark" aria-hidden="true"></span><span class="type">${label}</span>`;
  }

  // «7 Oct» → «7 SEP»
  function recordDate(d) {
    const [day, mon] = d.date.split(' ');
    const aria = d.monthIdx >= 0 ? `${d.dayNum} de ${monthWord(d.monthIdx)}` : d.date;
    return `<span class="record-date num" aria-label="${aria}">${day} ${mon.toUpperCase()}</span>`;
  }


  function fmtNum(n) {
    return Number(n).toLocaleString('es-ES', { maximumFractionDigits: 2 });
  }

  // En Registros: estado de la tarea o nota del examen junto al tipo («Tarea — Pendiente»)
  function recordStatus(ev) {
    // Las tareas personales no tienen asignatura: se «hacen», no se entregan
    if (ev.type === 'task') return ev.status === 'done' ? (ev.module ? 'Entregada' : 'Hecha') : 'Pendiente';
    if (ev.type === 'exam' && ev.grade !== undefined && ev.grade !== null) return `Nota <span class="num">${fmtNum(ev.grade)}</span>`;
    return '';
  }

  // En Registros, lo que no va junto al tipo: peso y nota de la tarea
  function recordExtra(ev) {
    const parts = [];
    if ((ev.type === 'exam' || ev.type === 'task') && ev.weight !== undefined && ev.weight !== null) parts.push(`${fmtNum(ev.weight)}% de la nota`);
    if (ev.type === 'task' && ev.grade !== undefined && ev.grade !== null) parts.push(`Nota <span class="num">${fmtNum(ev.grade)}</span>`);
    return parts.join(' · ');
  }

  // Línea secundaria con los datos de examen / tarea
  function recordDetail(ev) {
    const parts = [];
    if (ev.type === 'task') {
      parts.push(ev.status === 'done' ? 'Entregada' : 'Pendiente');
    }
    if ((ev.type === 'exam' || ev.type === 'task') && ev.weight !== undefined && ev.weight !== null) parts.push(`${fmtNum(ev.weight)}% de la nota`);
    if ((ev.type === 'exam' || ev.type === 'task') && ev.grade !== undefined && ev.grade !== null) parts.push(`Nota <span class="num">${fmtNum(ev.grade)}</span>`);
    return parts.join(' · ');
  }

  // Faltas por hora seguidas (2 o más, aunque haya descanso entre medias) se muestran como un
  // único registro con cada asignatura y sus sesiones; si cubren todo el día, «Falta del día».
  // Devuelve los registros del día en orden: { ev, evIdx } sueltos o { group } agrupados.
  function groupDayEvents(dateIdx) {
    const events = userEvents[dateIdx] || [];
    const bySlot = events
      .map((ev, evIdx) => ({ ev, evIdx }))
      .filter(({ ev }) => ev.type === 'absence' && Number.isInteger(ev.slot))
      .sort((a, b) => a.ev.slot - b.ev.slot);

    const runs = [];
    bySlot.forEach(item => {
      const run = runs[runs.length - 1];
      if (run && item.ev.slot === run[run.length - 1].ev.slot + 1) run.push(item);
      else runs.push([item]);
    });

    const daySched = getSchedule()[dateIdx] || [];
    const classSlots = daySched.filter(m => m && MODULES[m]).length;
    const groupOf = new Map();
    runs.filter(run => run.length > 1).forEach(run => {
      const modules = [];
      run.forEach(({ ev }) => {
        const m = modules.find(x => x.code === ev.module);
        if (m) m.n++; else modules.push({ code: ev.module, n: 1 });
      });
      const group = { indices: run.map(r => r.evIdx), modules, full: run.length === classSlots };
      run.forEach(r => groupOf.set(r.evIdx, group));
    });

    const out = [];
    const emitted = new Set();
    events.forEach((ev, evIdx) => {
      const group = groupOf.get(evIdx);
      if (!group) { out.push({ ev, evIdx }); return; }
      if (emitted.has(group)) return;
      emitted.add(group);
      out.push({ group });
    });
    return out;
  }

  function sessionsLabel(n) {
    return `${n} ${n === 1 ? 'sesión' : 'sesiones'}`;
  }

  function groupModules(group) {
    return `<span class="abs-mods">${group.modules.map(m =>
      `<span class="abs-mod">${chip(m.code)}${sessionsLabel(m.n)}</span>`).join('')}</span>`;
  }

  // Filtro de la caja de registros: null muestra todo; 'exam' | 'task' | 'note' solo ese tipo
  let recordFilter = null;
  const FILTER_EMPTY = { exam: 'exámenes', task: 'tareas', note: 'notas' };

  function setRecordFilter(type) {
    recordFilter = recordFilter === type ? null : type;
    document.querySelectorAll('.record-filter').forEach(b => {
      const on = b.dataset.type === recordFilter;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });
    renderSidebarNotes();
    replay(document.getElementById('sidebarNotesList'), 'is-swapping');
  }

  function renderSidebarNotes() {
    const container = document.getElementById('sidebarNotesList');
    const { startIdx, endIdx, all } = sidebarRange();
    let html = '';
    let i = 0;

    // Días personales del tramo: desde su primera fecha hasta antes del tramo siguiente,
    // para que ningún día libre se quede sin tramo
    const last = CALENDAR_DATES.length - 1;
    const lo = all || startIdx === 0 ? -Infinity : realDate(CALENDAR_DATES[startIdx]).getTime();
    const hi = all || endIdx === last ? Infinity : realDate(CALENDAR_DATES[endIdx + 1]).getTime();
    const days = CALENDAR_DATES
      .map((d, dateIdx) => ({ t: realDate(d).getTime(), dateIdx }))
      .filter(({ dateIdx }) => dateIdx >= startIdx && dateIdx <= endIdx);
    Object.keys(personalEvents).forEach(iso => {
      const t = isoDate(iso).getTime();
      if (t >= lo && t < hi) days.push({ t, iso });
    });
    days.sort((a, b) => a.t - b.t);

    days.forEach(({ dateIdx, iso }) => {
      if (iso) {
        personalEvents[iso].forEach((ev, evIdx) => {
          if (recordFilter && ev.type !== recordFilter) return;
          const isNew = lastAddedKey === `p:${iso}:${evIdx}` ? ' is-new' : '';
          const status = recordStatus(ev);
          html += `
          <li class="record is-editable is-personal${isNew}" data-type="${ev.type}" style="--i:${i++}">
            <div class="record-when">${recordDate(isoShort(iso))}<span class="personal-tag">Personal</span></div>
            <div class="record-body" onclick="openPersonalDialog('${ev.type}', '${iso}', ${evIdx})" onkeydown="if(event.key==='Enter'){this.click()}" tabindex="0" role="button" title="Editar">
              <div class="record-head"><span class="record-meta">${recordMeta(EVENT_TYPES[ev.type].label)}${status ? `<span class="record-status">— <span data-status="${ev.status || 'pending'}">${status}</span></span>` : ''}</span></div>
              <div class="record-text">${escapeHTML(ev.text)}</div>
              ${ev.type === 'task' && ev.desc ? `<div class="record-detail">${escapeHTML(ev.desc)}</div>` : ''}
            </div>
            <button class="record-del" onclick="deletePersonal('${iso}', ${evIdx}, this)" aria-label="Eliminar registro">${icon('x')}</button>
          </li>`;
        });
        return;
      }
      const d = CALENDAR_DATES[dateIdx];
      groupDayEvents(dateIdx).forEach(({ ev, evIdx, group }) => {
        if (group) {
          if (recordFilter) return;
          const isNewGroup = group.indices.some(k => lastAddedKey === `${dateIdx}:${k}`) ? ' is-new' : '';
          html += `
          <li class="record is-group${isNewGroup}" data-type="absence" style="--i:${i++}">
            <div class="record-when">${recordDate(d)}</div>
            <div class="record-body">
              <div class="record-head"><span class="record-meta">${recordMeta(group.full ? 'Falta del día' : 'Faltas seguidas')}</span></div>
              <div class="record-text">${groupModules(group)}</div>
            </div>
            <button class="record-del" onclick="deleteEvents(${dateIdx}, [${group.indices}], this)" aria-label="Eliminar estas faltas">${icon('x')}</button>
          </li>`;
          return;
        }
        if (recordFilter && ev.type !== recordFilter) return;
        const isNew = lastAddedKey === `${dateIdx}:${evIdx}` ? ' is-new' : '';
        const editable = Number.isInteger(ev.slot) && ev.type !== 'absence';
        const open = editable ? ` onclick="openSlotDialog('${ev.type}', ${dateIdx}, ${ev.slot}, ${evIdx})" onkeydown="if(event.key==='Enter'){this.click()}" tabindex="0" role="button" title="Editar"` : '';
        const detail = recordExtra(ev);
        const status = recordStatus(ev);
        html += `
          <li class="record${isNew}${editable ? ' is-editable' : ''}" data-type="${ev.type}" style="--i:${i++}">
            <div class="record-when">${recordDate(d)}${ev.module && MODULES[ev.module] ? chip(ev.module) : ''}</div>
            <div class="record-body"${open}>
              <div class="record-head"><span class="record-meta">${recordMeta(EVENT_TYPES[ev.type].label)}${status ? `<span class="record-status">— <span data-status="${ev.type === 'task' ? ev.status || 'pending' : 'graded'}">${status}</span></span>` : ''}</span></div>
              <div class="record-text">${ev.type === 'absence' && Number.isInteger(ev.slot) ? sessionsLabel(1) : escapeHTML(ev.text)}</div>
              ${detail ? `<div class="record-detail">${detail}</div>` : ''}
            </div>
            <button class="record-del" onclick="deleteEvent(${dateIdx}, ${evIdx}, this)" aria-label="Eliminar registro">${icon('x')}</button>
          </li>`;
      });
    });

    container.innerHTML = html || (recordFilter ? `
      <li class="records-empty">
        <strong>Sin ${FILTER_EMPTY[recordFilter]}${all ? '' : ' en este tramo'}</strong>
        Añádelos desde el horario: ${matchMedia('(pointer: coarse)').matches ? 'mantén pulsada' : 'clic derecho en'} una asignatura.
      </li>` : `
      <li class="records-empty">
        <strong>${all ? 'Aún no hay registros' : 'Sin registros en este tramo'}</strong>
        ${all
          ? 'Marca faltas y añade exámenes, tareas o notas desde el horario. Las faltas se descuentan de la asistencia de cada módulo.'
          : 'Los registros de otras fechas siguen guardados; cambia de tramo o de vista para verlos.'}
      </li>`);
    lastAddedKey = null;
  }

  // --- 4. VISTA DÍA ---
  function renderDateList() {
    const container = document.getElementById('dateList');
    const nextIdx = nextClassIndex();
    container.innerHTML = '';
    CALENDAR_DATES.forEach((d, index) => {
      const item = document.createElement('button');
      item.className = `date-item${index === selectedDateIndex ? ' is-active' : ''}${d.holiday ? ' is-holiday' : ''}${index === nextIdx ? ' is-next' : ''}${dayStateClass(index)}`;
      item.onclick = () => { if (index !== selectedDateIndex) selectDate(index); };
      const tag = d.holiday ? d.holiday : /^\d+$/.test(d.week) ? `S${d.week}` : '';
      item.innerHTML = `<span class="date-n">${d.date}</span><span class="week">${tag}</span>`;
      container.appendChild(item);
    });
  }

  function slotBounds(slot) {
    const [start, end] = slot.range.split(' - ');
    return { start, end };
  }

  function renderTimeline() {
    const container = document.getElementById('timelineContainer');
    const dateInfo = CALENDAR_DATES[selectedDateIndex];
    const schedule = getSchedule()[selectedDateIndex];

    // La fecha entera lleva el color del estado del día (próxima, pasada o falta)
    const title = document.getElementById('selectedDateTitle');
    title.className = `${selectedDateIndex === nextClassIndex() ? 'is-next' : ''}${dayStateClass(selectedDateIndex)}`.trim();
    title.innerHTML = `<span class="date-n">${dateInfo.dayNum} de ${monthWord(dateInfo.monthIdx)}</span>`;
    document.getElementById('selectedWeekTitle').innerText = dateInfo.holiday
      ? `Festivo · ${dateInfo.holiday}`
      : /^\d+$/.test(dateInfo.week)
        ? `Semana ${dateInfo.week} de ${LAST_TEACHING_WEEK}`
        : 'Fuera del calendario lectivo';

    renderDayEvents();

    const hasClasses = schedule && schedule.some(Boolean);
    if (!hasClasses) {
      container.innerHTML = `
        <li class="day-empty">
          <strong>${dateInfo.holiday ? 'No hay clase: ' + dateInfo.holiday : 'Sin clases programadas'}</strong>
          ${dateInfo.holiday ? 'El curso se retoma el siguiente miércoles lectivo.' : `El grupo ${currentGroup} no tiene sesiones este miércoles.`}
        </li>`;
      return;
    }

    // Agrupa franjas consecutivas del mismo módulo; el descanso corta los bloques
    const blocks = [];
    TIME_SLOTS.forEach(slot => {
      if (slot.key === 'break') { blocks.push({ isBreak: true, slot }); return; }
      const code = schedule[slot.key] || null;
      const last = blocks[blocks.length - 1];
      if (last && !last.isBreak && last.code === code) {
        last.slots.push(slot);
      } else {
        blocks.push({ code, slots: [slot] });
      }
    });

    container.innerHTML = blocks.map((b, i) => {
      if (b.isBreak) {
        const { start, end } = slotBounds(b.slot);
        return `<li class="slot-break" style="--i:${i}"><span>Descanso</span><span class="num">${start}–${end}</span></li>`;
      }
      const start = slotBounds(b.slots[0]).start;
      const end = slotBounds(b.slots[b.slots.length - 1]).end;
      const n = b.slots.length;
      const time = `<div class="slot-time">${start}–${end}</div>`;
      const sessions = `<span class="slot-dur">— ${n} ${n === 1 ? 'sesión' : 'sesiones'}</span>`;
      const mod = b.code ? MODULES[b.code] : null;

      if (!mod) {
        return `<li class="slot is-free" style="--i:${i}"><div class="slot-body"><div class="slot-name">Sin clase</div></div>${time}</li>`;
      }
      const dim = filterModule && filterModule !== b.code ? ' is-dimmed' : '';
      const room = mod.presencial === '-' ? 'Sin aula asignada' : mod.presencial;
      return `
        <li class="slot${dim}" style="--i:${i}" data-date="${selectedDateIndex}" data-slots="${b.slots.map(t => t.key).join(',')}">
          <div class="slot-body">
            ${chip(b.code, 'chip-lg')}
            <div>
              <div class="slot-name">${mod.name} ${sessions}</div>
              <div class="slot-meta">${capitalize(mod.teacher)} · ${room}</div>
            </div>
          </div>
          ${time}
        </li>`;
    }).join('');
  }

  function renderDayEvents() {
    const container = document.getElementById('dayEvents');
    container.innerHTML = groupDayEvents(selectedDateIndex).map(({ ev, group }) => group ? `
      <div class="day-record" data-type="absence">
        <span class="record-mark" aria-hidden="true"></span>
        <span class="type">${group.full ? 'Falta del día' : 'Faltas seguidas'}</span>
        ${groupModules(group)}
      </div>` : `
      <div class="day-record" data-type="${ev.type}">
        <span class="record-mark" aria-hidden="true"></span>
        <span class="type">${EVENT_TYPES[ev.type].label}</span>
        ${ev.module && MODULES[ev.module] ? chip(ev.module) : ''}
        <span>${escapeHTML(ev.text)}</span>
      </div>`).join('');
  }

  // --- 5. TRIMESTRE ---
  // Fechas del tramo elegido en "Trimestre"
  function matrixRange() {
    const bounds = { 1: ['23 Sep', '13 Ene'], 2: ['20 Ene', '14 Abr'], 3: ['21 Abr', '16 Jun'] }[currentMatrixSubTab] || [];
    let startIdx = CALENDAR_DATES.findIndex(d => d.date === bounds[0]);
    let endIdx = CALENDAR_DATES.findIndex(d => d.date === bounds[1]);
    if (startIdx === -1) startIdx = 0;
    if (endIdx === -1) endIdx = CALENDAR_DATES.length - 1;
    return { startIdx, endIdx };
  }

  // La barra lateral sigue al tramo mientras se ve "Trimestre"
  function sidebarRange() {
    if (currentTab !== 'grid') return { startIdx: 0, endIdx: CALENDAR_DATES.length - 1, all: true };
    return { ...matrixRange(), all: false };
  }

  function renderMatrix() {
    const table = document.getElementById('matrixTable');
    const schedule = getSchedule();
    const nextIdx = nextClassIndex();
    const { startIdx, endIdx } = matrixRange();

    const filteredDates = CALENDAR_DATES.slice(startIdx, endIdx + 1);

    let headerRow = '<thead><tr><th style="--w:0">Hora</th>';
    filteredDates.forEach((d, rel) => {
      const idx = startIdx + rel;
      const cls = (`${d.holiday ? 'is-holiday' : ''}${idx === nextIdx ? ' is-next' : ''}${dayStateClass(idx)}`).trim();
      const hasClasses = (schedule[idx] || []).some(Boolean);
      const headPop = pendingPop && pendingPop.head === idx ? ` is-pop-${pendingPop.kind}` : '';
      const inside = `<span class="th-day"><span class="day-n">${d.dayNum}${dayDot(idx)}</span></span><span class="th-month">${d.holiday ? d.holiday : monthWord(d.monthIdx).slice(0, 3)}</span>`;
      const head = hasClasses
        ? `<button type="button" class="th-inner${headPop}" data-date="${idx}" aria-label="${d.dayNum} de ${monthWord(d.monthIdx)}. Marcar o quitar la falta de todo el día">${inside}</button>`
        : `<span class="th-inner">${inside}</span>`;
      headerRow += `<th class="${cls}" style="--w:${rel + 1}" title="${d.holiday ? d.holiday : 'Semana ' + d.week + ' · clic para marcar todo el día'}">${head}</th>`;
    });
    headerRow += '</tr></thead>';

    let bodyRows = '<tbody>';
    TIME_SLOTS.forEach((slot, row) => {
      const { start } = slotBounds(slot);
      const w = row + 1;
      if (slot.key === 'break') {
        bodyRows += `<tr class="break-row"><td class="num" style="--w:${w}">${start}</td><td class="break-label" colspan="${filteredDates.length}" style="--w:${w + 1}">Descanso</td></tr>`;
        return;
      }
      bodyRows += `<tr><td class="num" style="--w:${w}">${start}</td>`;
      filteredDates.forEach((d, relativeIdx) => {
        const dayIdx = startIdx + relativeIdx;
        const daySched = schedule[dayIdx];
        const modCode = daySched ? daySched[slot.key] : null;
        const cls = `${d.holiday ? ' class="is-holiday"' : ''} style="--w:${w + relativeIdx + 1}"`;
        bodyRows += modCode && MODULES[modCode]
          ? `<td${cls}>${slotChip(dayIdx, slot, modCode)}</td>`
          : `<td${cls}><span class="empty">·</span></td>`;
      });
      bodyRows += '</tr>';
    });
    bodyRows += '</tbody>';
    table.innerHTML = headerRow + bodyRows;
  }

  // Estado de falta de una hora concreta: 'slot' (marcada con clic),
  // 'broad' (cubierta por una falta de módulo o de día completo) o null
  function slotAbsence(dateIdx, key, code) {
    const events = (userEvents[dateIdx] || []).filter(e => e.type === 'absence');
    if (events.some(e => e.slot === key && e.module === code)) return 'slot';
    if (events.some(e => !Number.isInteger(e.slot) && (!e.module || e.module === code))) return 'broad';
    return null;
  }

  // Exámenes creados desde el menú del día: su punto va sobre el número del día, no en la etiqueta
  const isDayExam = ev => ev.type === 'exam' && ev.byDay;

  function chipRecords(dateIdx, key, code) {
    return slotRecords(dateIdx, key, code).filter(({ ev }) => !isDayExam(ev));
  }

  // Completado: examen con nota, tarea entregada. Las notas no se completan: no impiden el
  // verde, pero sin nada completable el punto se queda amarillo.
  function recordsDone(evs) {
    const todo = evs.filter(ev => ev.type === 'exam' || ev.type === 'task');
    return todo.length > 0 && todo.every(ev =>
      ev.type === 'exam' ? ev.grade !== undefined && ev.grade !== null : ev.status === 'done');
  }

  // Color del número del día: 'absent' si faltó a todas sus horas (rojo),
  // 'past' si ya pasó (verde) o '' (sin marcar; la próxima clase va en ámbar)
  function dayState(dateIdx) {
    const cd = CALENDAR_DATES[dateIdx];
    const daySched = getSchedule()[dateIdx] || [];
    const slots = TIME_SLOTS.filter(t => t.key !== 'break' && daySched[t.key] && MODULES[daySched[t.key]]);
    if (cd.holiday || !slots.length) return '';
    if (slots.every(t => slotAbsence(dateIdx, t.key, daySched[t.key]))) return 'absent';
    return realDate(cd) < startOfToday() ? 'past' : '';
  }

  const dayStateClass = dateIdx => {
    const state = dayState(dateIdx);
    return state ? ` is-${state}` : '';
  };

  function dayDot(dateIdx) {
    const exams = (userEvents[dateIdx] || []).filter(isDayExam);
    if (!exams.length) return '';
    return `<span class="day-dot${recordsDone(exams) ? ' is-done' : ''}" aria-hidden="true"></span>`;
  }

  function slotChip(dateIdx, slot, code) {
    const mod = MODULES[code];
    const cd = CALENDAR_DATES[dateIdx];
    const { start, end } = slotBounds(slot);
    const state = slotAbsence(dateIdx, slot.key, code);
    const dim = filterModule && filterModule !== code ? ' is-dimmed' : '';
    const absent = state ? ' is-absent' : '';
    const pop = pendingPop && pendingPop.dateIdx === dateIdx && (pendingPop.key === slot.key || pendingPop.key === '*') ? ` is-pop-${pendingPop.kind}` : '';
    const recs = chipRecords(dateIdx, slot.key, code);
    const kinds = ['exam', 'task', 'note'].filter(k => recs.some(r => r.ev.type === k));
    // Un único punto, haya lo que haya en esa hora: amarillo, o verde cuando todo está completado
    const done = recordsDone(recs.map(r => r.ev));
    const dots = kinds.length ? `<span class="chip-dots" aria-hidden="true"><span class="chip-dot${done ? ' is-done' : ''}"></span></span>` : '';
    const recLabel = kinds.length ? ` Con ${kinds.map(k => EVENT_TYPES[k].label.toLowerCase()).join(', ')}.` : '';
    const rec = pendingPop && pendingPop.rec ? ` style="--m:${mod.color}; --rec:var(--${pendingPop.rec})"` : ` style="--m:${mod.color}"`;
    const hint = state === 'broad'
      ? 'Falta ya registrada para todo el día o el módulo'
      : state ? 'Clic para quitar la falta' : 'Clic para marcar falta';
    // Con registros, el bocadillo propio sustituye al title nativo
    const title = kinds.length ? '' : ` title="${escapeHTML(mod.name)} · ${start}–${end}\n${hint}"`;
    return `<button type="button" class="chip chip-lg slot-chip${absent}${dim}${pop}${kinds.length ? ' has-recs' : ''}"${rec}
      data-date="${dateIdx}" data-slot="${slot.key}" aria-pressed="${!!state}" aria-haspopup="menu"
      aria-label="${code}, ${cd.date}, ${start}–${end}. ${hint}.${recLabel} Clic derecho para más opciones."${title}>${code}${dots}</button>`;
  }

  function toggleSlotAbsence(dateIdx, key) {
    const code = (getSchedule()[dateIdx] || [])[key];
    if (!code || !MODULES[code]) return;
    const slot = TIME_SLOTS.find(t => t.key === key);
    const { start, end } = slotBounds(slot);
    const where = `${code} · ${CALENDAR_DATES[dateIdx].date} ${start}`;
    const state = slotAbsence(dateIdx, key, code);

    if (state === 'broad') {
      pendingPop = { dateIdx, key, kind: 'blocked' };
      renderMatrix();
      pendingPop = null;
      showToast(`${where} ya cuenta como falta por un registro de todo el día o del módulo.`);
      return;
    }

    haptic('tap');
    if (state === 'slot') {
      const events = userEvents[dateIdx];
      events.splice(events.findIndex(e => e.type === 'absence' && e.slot === key && e.module === code), 1);
      if (!events.length) delete userEvents[dateIdx];
      pendingPop = { dateIdx, key, kind: 'off' };
      saveData();
    } else {
      if (!userEvents[dateIdx]) userEvents[dateIdx] = [];
      userEvents[dateIdx].push({ type: 'absence', module: code, slot: key, text: `Hora ${start}–${end}` });
      lastAddedKey = `${dateIdx}:${userEvents[dateIdx].length - 1}`;
      pendingPop = { dateIdx, key, kind: 'on' };
      saveData();
      rosaSparkles(dateIdx, key);
    }
    pendingPop = null;

    // Mantener el foco de teclado en la celda tras volver a pintar la tabla
    const again = document.querySelector(`.slot-chip[data-date="${dateIdx}"][data-slot="${key}"]`);
    if (again && document.activeElement === document.body) again.focus({ preventScroll: true });
  }

  // Falta en todas las horas del día: marca las que falten, o las quita si ya estaban todas
  function toggleDayAbsence(dateIdx) {
    const daySched = getSchedule()[dateIdx] || [];
    const cd = CALENDAR_DATES[dateIdx];
    const slots = TIME_SLOTS.filter(t => t.key !== 'break' && daySched[t.key] && MODULES[daySched[t.key]]);
    if (!slots.length) return;

    const states = slots.map(t => slotAbsence(dateIdx, t.key, daySched[t.key]));
    if (states.includes('broad')) {
      pendingPop = { dateIdx, key: '*', head: dateIdx, kind: 'blocked' };
      renderMatrix();
      pendingPop = null;
      showToast(`${cd.date} ya cuenta como falta por un registro de todo el día o del módulo.`);
      return;
    }

    haptic('strong');
    const events = userEvents[dateIdx] || [];
    const allMarked = states.every(st => st === 'slot');
    if (allMarked) {
      userEvents[dateIdx] = events.filter(e => !(e.type === 'absence' && Number.isInteger(e.slot)));
      if (!userEvents[dateIdx].length) delete userEvents[dateIdx];
    } else {
      if (!userEvents[dateIdx]) userEvents[dateIdx] = [];
      slots.forEach((t, i) => {
        if (states[i] === 'slot') return;
        const { start, end } = slotBounds(t);
        userEvents[dateIdx].push({ type: 'absence', module: daySched[t.key], slot: t.key, text: `Hora ${start}–${end}` });
      });
    }

    pendingPop = { dateIdx, key: '*', head: dateIdx, kind: allMarked ? 'off' : 'on' };
    saveData();
    pendingPop = null;
    if (!allMarked) rosaSparkles(dateIdx, '*');
  }

  // Tema rosa: al marcar una falta, de la etiqueta salen destellos (estrellitas de 4 puntas)
  const SPARKLE_COLORS = ['#f70071', '#ff1b82', '#ff5aa4', '#ffffff'];
  function rosaSparkles(dateIdx, key) {
    if (currentTheme() !== 'rosa' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sel = key === '*' ? `.slot-chip[data-date="${dateIdx}"]` : `.slot-chip[data-date="${dateIdx}"][data-slot="${key}"]`;
    document.querySelectorAll(sel).forEach(chipEl => {
      const r = chipEl.getBoundingClientRect();
      if (!r.width) return;   // tabla oculta (falta puesta desde otra vista)
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (let i = 0; i < 8; i++) {
        const size = 9 + Math.random() * 8;
        const a = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
        const d = 20 + Math.random() * 18;
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.style.cssText = `left:${cx - size / 2}px;top:${cy - size / 2}px;--s:${size}px;--c:${SPARKLE_COLORS[i % SPARKLE_COLORS.length]}`;
        document.body.append(s);
        const dx = Math.cos(a) * d, dy = Math.sin(a) * d;
        // Sale disparada (primer tramo) y luego se apaga despacio girando (segundo tramo)
        s.animate([
          { transform: 'translate(0, 0) scale(0) rotate(0deg)', opacity: 1, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(90deg)`, opacity: 1, offset: 0.45, easing: 'ease-in' },
          { transform: `translate(${dx * 1.3}px, ${dy * 1.3}px) scale(0.3) rotate(180deg)`, opacity: 0 }
        ], { duration: 900 + Math.random() * 300 })
          .finished.then(() => s.remove());
      }
    });
  }

  // Respuesta háptica al tocar: 'tap' muy suave (falta de una hora), 'press' al abrir el
  // menú con pulsación larga y 'strong' algo más marcada (falta del día entero). En la app
  // usa los efectos nativos de Android; en un navegador táctil, una vibración mínima.
  const HAPTIC_MS = { tap: 8, press: 15, strong: 28 };
  function haptic(kind) {
    if (window.AndroidApp && AndroidApp.haptic) { AndroidApp.haptic(kind); return; }
    if (navigator.vibrate && matchMedia('(pointer: coarse)').matches) navigator.vibrate(HAPTIC_MS[kind]);
  }

  function showToast(message, undo) {
    const toast = document.getElementById('toast');
    const btn = document.getElementById('toastUndo');
    document.getElementById('toastText').innerText = message;
    btn.hidden = !undo;
    btn.onclick = () => { hideToast(); if (undo) undo(); };
    toast.classList.remove('is-shown');
    void toast.offsetWidth;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4000);
  }

  function hideToast() {
    clearTimeout(toastTimer);
    document.getElementById('toast').classList.remove('is-shown');
  }

  // --- EXAMEN / TAREA / NOTA POR HORA ---
  const KIND_META = {
    exam: { title: 'Examen', key: 'e' },
    task: { title: 'Tarea', key: 't' },
    note: { title: 'Nota', key: 'n' }
  };
  let menuTarget = null;
  // Ocultado pendiente del menú que se está cerrando: si se abre otro antes de que
  // termine la animación, hay que cancelarlo o escondería el menú nuevo
  let menuPendingHide = null;
  let slotEditing = null;

  function slotRecords(dateIdx, key, code) {
    return (userEvents[dateIdx] || [])
      .map((ev, index) => ({ ev, index }))
      .filter(({ ev }) => ev.slot === key && ev.module === code && ev.type !== 'absence');
  }

  function slotContext(dateIdx, key) {
    const code = (getSchedule()[dateIdx] || [])[key];
    const { start, end } = slotBounds(TIME_SLOTS.find(t => t.key === key));
    return { code, start, end, cd: CALENDAR_DATES[dateIdx] };
  }

  // --- Bocadillo con el contenido de la hora ---
  let tipTimer = null;
  let tipFor = null;

  function scheduleTip(chipEl, delay = 280) {
    if (tipFor === chipEl) return;
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => showTip(chipEl), delay);
  }

  function showTip(chipEl) {
    if (menuTarget || !chipEl.isConnected) return;
    const dateIdx = parseInt(chipEl.dataset.date);
    const key = parseInt(chipEl.dataset.slot);
    const { code, start, end, cd } = slotContext(dateIdx, key);
    const recs = chipRecords(dateIdx, key, code);
    if (!recs.length) return;

    const tip = document.getElementById('chipTip');
    tip.innerHTML = `
      <div class="tip-head">${MODULES[code].name}<span class="num">Miércoles ${cd.date} · ${start}–${end}</span></div>
      ${recs.map(({ ev }) => {
        const body = ev.type === 'task' && ev.desc ? `${escapeHTML(ev.text)}<span class="tip-extra">${escapeHTML(ev.desc)}</span>` : escapeHTML(ev.text);
        const detail = recordDetail(ev);
        return `<div class="tip-item" data-type="${ev.type}">
          <span class="tip-type">${EVENT_TYPES[ev.type].label}</span>
          <div class="tip-text">${body}</div>
          ${detail ? `<div class="tip-detail">${detail}</div>` : ''}
        </div>`;
      }).join('')}`;

    tip.hidden = false;
    tip.classList.remove('is-shown', 'is-below');
    const r = chipEl.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = r.left + r.width / 2 - w / 2;
    x = Math.max(8, Math.min(x, innerWidth - w - 8));
    let y = r.top - h - 10;
    if (y < 8) { y = r.bottom + 10; tip.classList.add('is-below'); }
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
    tip.style.setProperty('--arrow-x', `${r.left + r.width / 2 - x}px`);
    void tip.offsetWidth;
    tip.classList.add('is-shown');
    tipFor = chipEl;
  }

  function hideTip() {
    clearTimeout(tipTimer);
    tipFor = null;
    const tip = document.getElementById('chipTip');
    if (tip) tip.classList.remove('is-shown');
  }

  // Pulsación larga en táctil = clic derecho en escritorio
  const LONG_PRESS_MS = 480;
  const press = { timer: null, touch: false, x: 0, y: 0, chip: null };

  function startLongPress(e) {
    press.touch = e.pointerType === 'touch';
    if (!press.touch) return;
    const chipEl = e.target.closest(MENU_TARGETS);
    if (!chipEl) return;
    cancelLongPress();
    press.x = e.clientX; press.y = e.clientY; press.chip = chipEl;
    chipEl.classList.add('is-pressing');
    press.timer = setTimeout(() => {
      press.timer = null;
      chipEl.classList.remove('is-pressing');
      // Días sin clase (festivos) no tienen menú: el toque sigue su curso normal
      if (!openMenuFor(chipEl, { clientX: press.x, clientY: press.y })) return;
      swallowReleaseClick();
      haptic('press');
    }, LONG_PRESS_MS);
  }

  // Al levantar el dedo llega un click: no debe marcar la falta ni pulsar la
  // opción del menú que acaba de aparecer bajo el dedo.
  function swallowReleaseClick() {
    const swallow = ev => { ev.preventDefault(); ev.stopPropagation(); };
    document.addEventListener('click', swallow, true);
    document.addEventListener('pointerup', () => {
      setTimeout(() => document.removeEventListener('click', swallow, true), 400);
    }, { capture: true, once: true });
  }

  function cancelLongPress() {
    clearTimeout(press.timer);
    press.timer = null;
    if (press.chip) press.chip.classList.remove('is-pressing');
    press.chip = null;
  }

  // --- Menú contextual (clic derecho / mantener pulsado) ---
  // Modos: 'slot' (etiqueta de la tabla: una hora), 'block' (asignatura en la vista Día)
  // y 'day' (fecha de la cabecera o día del mes: primero qué añadir, luego de qué asignatura).
  const menuItem = (kind, label, extra = '') =>
    `<button type="button" class="ctx-item" role="menuitem" data-kind="${kind}" data-action="${kind}" ${extra}>${icon(kind)}<span>${label}</span><kbd>${KIND_META[kind] ? KIND_META[kind].key.toUpperCase() : 'F'}</kbd></button>`;
  const ADD_ITEMS = () => menuItem('exam', 'Añadir examen') + menuItem('task', 'Añadir tarea') + menuItem('note', 'Añadir nota');

  function recordItems(recs, label) {
    if (!recs.length) return '';
    return `<div class="ctx-sep"></div><div class="ctx-label">${label}</div>` + recs.map(({ ev, index }) => {
      const detail = recordDetail(ev).replace(/<[^>]+>/g, '');
      return `<button type="button" class="ctx-item is-record" role="menuitem" data-kind="${ev.type}" data-action="edit" data-index="${index}">
          ${icon(ev.type)}<span class="ctx-sub">${escapeHTML(ev.text)}<small>${ev.module ? ev.module + ' · ' : ''}${EVENT_TYPES[ev.type].label}${detail ? ' · ' + detail : ''}</small></span><span></span></button>`;
    }).join('');
  }

  // Asignaturas del día agrupadas por horas seguidas (el descanso corta el bloque)
  function dayBlocks(dateIdx) {
    const daySched = getSchedule()[dateIdx] || [];
    const blocks = [];
    let prev = null;
    TIME_SLOTS.forEach(t => {
      if (t.key === 'break') { prev = null; return; }
      const code = daySched[t.key];
      if (!code || !MODULES[code]) { prev = null; return; }
      const { start, end } = slotBounds(t);
      if (prev && prev.code === code) { prev.slots.push(t.key); prev.end = end; }
      else { prev = { code, slots: [t.key], start, end }; blocks.push(prev); }
    });
    return blocks;
  }

  function openSlotMenu(chipEl, e) {
    const dateIdx = parseInt(chipEl.dataset.date);
    const key = parseInt(chipEl.dataset.slot);
    const { code, start, end, cd } = slotContext(dateIdx, key);
    if (!code) return false;
    const absent = slotAbsence(dateIdx, key, code);
    let html = `<div class="ctx-head">${chip(code)}<span class="num">${cd.date} · ${start}–${end}</span></div>`;
    html += ADD_ITEMS() + recordItems(slotRecords(dateIdx, key, code), 'En esta hora');
    html += `<div class="ctx-sep"></div>`;
    html += absent === 'broad'
      ? `<button type="button" class="ctx-item" role="menuitem" data-kind="absence" disabled aria-disabled="true">${icon('absence')}<span>Falta de día completo</span><span></span></button>`
      : menuItem('absence', absent ? 'Quitar falta' : 'Marcar falta');
    return showMenu(chipEl, e, { mode: 'slot', dateIdx, key }, html, `Opciones de ${code}, ${cd.date} ${start}`);
  }

  // Asignatura de la vista Día: los registros van a su primera hora del día
  function openBlockMenu(el, e) {
    const dateIdx = parseInt(el.dataset.date);
    const slots = el.dataset.slots.split(',').map(Number);
    const { code, cd } = slotContext(dateIdx, slots[0]);
    if (!code) return false;
    // Por asignatura: todas sus horas del día, aunque el descanso las separe
    const daySched = getSchedule()[dateIdx] || [];
    const keys = TIME_SLOTS.filter(t => t.key !== 'break' && daySched[t.key] === code).map(t => t.key);
    const recs = keys.flatMap(k => slotRecords(dateIdx, k, code));
    let html = `<div class="ctx-head">${chip(code)}<span class="num">${cd.date}</span></div>`;
    html += ADD_ITEMS() + recordItems(recs, 'Registros de esta asignatura');
    return showMenu(el, e, { mode: 'block', dateIdx, key: keys[0] }, html, `Opciones de ${code}, ${cd.date}`);
  }

  // Fecha de la cabecera o día del mes
  function openDayMenu(el, e, dateIdx) {
    const blocks = dayBlocks(dateIdx);
    if (!blocks.length) return false;
    const cd = CALENDAR_DATES[dateIdx];
    const daySched = getSchedule()[dateIdx] || [];
    const states = blocks.flatMap(b => b.slots).map(k => slotAbsence(dateIdx, k, daySched[k]));
    const recs = (userEvents[dateIdx] || [])
      .map((ev, index) => ({ ev, index }))
      .filter(({ ev }) => ev.type !== 'absence' && Number.isInteger(ev.slot));

    let html = `<div class="ctx-head"><span class="num">Miércoles ${cd.date}</span></div>`;
    html += ADD_ITEMS() + recordItems(recs, 'En este día');
    html += `<div class="ctx-sep"></div>`;
    html += states.includes('broad')
      ? `<button type="button" class="ctx-item" role="menuitem" data-kind="absence" disabled aria-disabled="true">${icon('absence')}<span>Falta de día completo</span><span></span></button>`
      : menuItem('absence', states.every(st => st === 'slot') ? 'Quitar falta del día' : 'Marcar falta del día');
    return showMenu(el, e, { mode: 'day', dateIdx, blocks }, html, `Opciones del ${cd.date}`);
  }

  // Día sin clase de la vista Mes: tareas y notas personales (sin asignatura)
  function openPersonalMenu(el, e) {
    const iso = el.dataset.iso;
    const recs = (personalEvents[iso] || []).map((ev, index) => ({ ev, index }));
    let html = `<div class="ctx-head"><span class="num">${capitalize(isoLong(iso))}</span></div>`;
    html += menuItem('task', 'Añadir tarea') + menuItem('note', 'Añadir nota') + recordItems(recs, 'En este día');
    return showMenu(el, e, { mode: 'personal', iso }, html, `Tareas y notas del ${isoLong(iso)}`);
  }

  // Segundo paso del menú del día: de qué asignatura es el registro (una opción por
  // asignatura, sin horas; el registro va a su primera hora del día)
  function showModulePicker(kind) {
    const modules = [];
    menuTarget.blocks.forEach(b => { if (!modules.some(m => m.code === b.code)) modules.push({ code: b.code, slot: b.slots[0] }); });
    if (modules.length === 1) { runPick(kind, modules[0].slot); return; }
    menuTarget.pickKind = kind;
    const menu = document.getElementById('ctxMenu');
    menu.innerHTML = `<div class="ctx-label">${KIND_META[kind].title}: ¿de qué asignatura?</div>` + modules.map(m =>
      `<button type="button" class="ctx-item is-pick" role="menuitem" data-kind="${kind}" data-action="pick" data-slot="${m.slot}">
        ${chip(m.code)}<span class="ctx-sub">${MODULES[m.code].name}</span><span></span></button>`).join('');
    placeMenu(menu);
    const first = menu.querySelector('.ctx-item');
    if (first) first.focus({ preventScroll: true });
  }

  function runPick(kind, key) {
    const { dateIdx } = menuTarget;
    closeSlotMenu(false);
    openSlotDialog(kind, dateIdx, key, null, { byDay: true });
  }

  function showMenu(el, e, target, html, label) {
    hideTip();
    closeSlotMenu(false);
    const r = el.getBoundingClientRect();
    let x = e.clientX, y = e.clientY;
    // Abierto con teclado: bajo el elemento
    if (!x && !y) { x = r.left; y = r.bottom + 6; }
    menuTarget = { ...target, chipEl: el, x, y };
    el.classList.add('is-menu-open');

    const menu = document.getElementById('ctxMenu');
    menu.innerHTML = html;
    menu.setAttribute('aria-label', label);
    menu.hidden = false;
    if (menuPendingHide) { menu.removeEventListener('animationend', menuPendingHide); menuPendingHide = null; }
    menu.classList.remove('is-closing', 'is-open');
    placeMenu(menu);
    void menu.offsetWidth;
    menu.classList.add('is-open');

    menu.onclick = ev => {
      const btn = ev.target.closest('.ctx-item');
      if (!btn || btn.disabled) return;
      runMenuAction(btn);
    };
    const first = menu.querySelector('.ctx-item:not([disabled])');
    if (first) first.focus({ preventScroll: true });

    document.addEventListener('pointerdown', onMenuOutside, true);
    document.addEventListener('keydown', onMenuKey, true);
    window.addEventListener('resize', closeMenuNow);
    window.addEventListener('blur', closeMenuNow);
    document.querySelector('.table-wrap').addEventListener('scroll', closeMenuNow, { once: true });
    window.addEventListener('scroll', closeMenuNow, { once: true });
    return true;
  }

  // Coloca el menú en el punto de apertura sin salirse de la pantalla
  function placeMenu(menu) {
    let { x, y } = menuTarget;
    const w = menu.offsetWidth, h = menu.offsetHeight;
    let ox = 'left', oy = 'top';
    if (x + w > innerWidth - 8) { x = Math.max(8, x - w); ox = 'right'; }
    if (y + h > innerHeight - 8) { y = Math.max(8, y - h); oy = 'bottom'; }
    menu.style.transform = '';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.setProperty('--ox', ox);
    menu.style.setProperty('--oy', oy);
  }

  function runMenuAction(btn) {
    const action = btn.dataset.action;
    const { mode, dateIdx, key } = menuTarget;
    if (mode === 'personal') {
      const { iso } = menuTarget;
      closeSlotMenu(false);
      if (action === 'edit') {
        const index = parseInt(btn.dataset.index);
        openPersonalDialog(personalEvents[iso][index].type, iso, index);
      } else openPersonalDialog(action, iso, null);
      return;
    }
    if (action === 'pick') { runPick(menuTarget.pickKind, Number(btn.dataset.slot)); return; }
    if (mode === 'day' && KIND_META[action]) { showModulePicker(action); return; }
    closeSlotMenu(false);
    if (action === 'absence') {
      if (mode === 'day') toggleDayAbsence(dateIdx);
      else toggleSlotAbsence(dateIdx, key);
    } else if (action === 'edit') {
      const index = parseInt(btn.dataset.index);
      const ev = userEvents[dateIdx][index];
      openSlotDialog(ev.type, dateIdx, ev.slot, index);
    } else openSlotDialog(action, dateIdx, key, null);
  }

  // Qué menú abre cada elemento (clic derecho o pulsación larga)
  const MENU_TARGETS = '#matrixTable .slot-chip, #matrixTable button.th-inner, #monthGrid button.month-day, #timelineContainer .slot[data-slots]';

  function openMenuFor(el, e) {
    if (el.matches('.slot-chip')) return openSlotMenu(el, e);
    if (el.matches('button.th-inner')) return openDayMenu(el, e, parseInt(el.dataset.date));
    if (el.matches('.month-day')) return hasClasses(el) ? openDayMenu(el, e, parseInt(el.dataset.idx)) : openPersonalMenu(el, e);
    if (el.matches('.slot')) return openBlockMenu(el, e);
    return false;
  }

  function onMenuOutside(e) {
    if (e.target.closest('#ctxMenu')) return;
    // Pulsar otra vez el elemento del menú abierto solo lo cierra: el click que viene
    // detrás no debe reabrirlo (ni marcar la falta de esa hora)
    const again = menuTarget && menuTarget.chipEl.contains(e.target);
    closeSlotMenu(false);
    if (again) swallowNextClick();
  }

  // Descarta solo el click de esta pulsación; si no llega (clic derecho, arrastre),
  // se retira con la siguiente pulsación para no comerse un clic posterior
  function swallowNextClick() {
    const done = () => {
      document.removeEventListener('click', swallow, true);
      document.removeEventListener('pointerdown', done, true);
    };
    const swallow = ev => { ev.preventDefault(); ev.stopPropagation(); done(); };
    document.addEventListener('click', swallow, true);
    // Añadido durante este mismo pointerdown: no se ejecuta hasta la próxima pulsación
    document.addEventListener('pointerdown', done, true);
  }

  function closeMenuNow() { closeSlotMenu(false); }

  function onMenuKey(e) {
    const menu = document.getElementById('ctxMenu');
    const items = [...menu.querySelectorAll('.ctx-item:not([disabled])')];
    const i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeSlotMenu(true); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); return; }
    if (e.key === 'Home') { e.preventDefault(); items[0].focus(); return; }
    if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); return; }
    if (e.key === 'Tab') { e.preventDefault(); return; }
    const shortcut = { e: 'exam', t: 'task', n: 'note', f: 'absence' }[e.key.toLowerCase()];
    if (shortcut && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const btn = items.find(b => b.dataset.action === shortcut);
      if (btn) { e.preventDefault(); btn.click(); }
    }
  }

  function closeSlotMenu(refocus) {
    const menu = document.getElementById('ctxMenu');
    document.removeEventListener('pointerdown', onMenuOutside, true);
    document.removeEventListener('keydown', onMenuKey, true);
    window.removeEventListener('resize', closeMenuNow);
    window.removeEventListener('blur', closeMenuNow);
    if (!menuTarget) return;
    const { chipEl } = menuTarget;
    chipEl.classList.remove('is-menu-open');
    if (refocus && chipEl.isConnected) chipEl.focus({ preventScroll: true });
    menuTarget = null;
    if (menu.hidden) return;
    const hide = () => { menuPendingHide = null; menu.hidden = true; menu.classList.remove('is-closing', 'is-open'); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { hide(); return; }
    menu.classList.remove('is-open');
    menu.classList.add('is-closing');
    menuPendingHide = hide;
    menu.addEventListener('animationend', hide, { once: true });
  }

  function setFieldError(id, show) {
    const err = document.querySelector(`#slotDialog [data-error="${id}"]`);
    if (err) err.hidden = !show;
    const el = document.getElementById(id);
    if (el) el.setAttribute('aria-invalid', show);
  }

  function openSlotDialog(kind, dateIdx, key, index, opts = {}) {
    const { code, start, end, cd } = slotContext(dateIdx, key);
    const ev = index !== null ? userEvents[dateIdx][index] : null;
    const moduleCode = ev ? ev.module : code;
    // byDay: creado desde el menú del día (fecha o día del mes), no desde una etiqueta
    slotEditing = { kind, dateIdx, key, index, module: moduleCode, byDay: ev ? !!ev.byDay : !!opts.byDay };
    showRecordDialog(kind, ev, `${chip(moduleCode)}${MODULES[moduleCode].name}<span class="when">Miércoles ${cd.date} · ${start}–${end}</span>`, false);
  }

  // Tarea o nota personal de un día sin clase: sin asignatura, peso ni nota
  function openPersonalDialog(kind, iso, index) {
    const ev = index !== null ? personalEvents[iso][index] : null;
    slotEditing = { kind, iso, index, personal: true };
    showRecordDialog(kind, ev, `<span class="personal-tag">Personal</span><span class="when">${capitalize(isoLong(iso))}</span>`, true);
  }

  function showRecordDialog(kind, ev, metaHtml, personal) {
    const dialog = document.getElementById('slotDialog');
    const form = document.getElementById('slotForm');
    dialog.classList.toggle('is-personal', personal);
    // Textos que cambian en las tareas personales («Detalles», «Hecha»)
    dialog.querySelectorAll('[data-personal]').forEach(el => { el.textContent = personal ? el.dataset.personal : el.dataset.class; });
    form.reset();
    dialog.querySelectorAll('.field-error').forEach(el => { el.hidden = true; });
    dialog.querySelectorAll('[aria-invalid]').forEach(el => el.setAttribute('aria-invalid', 'false'));
    dialog.dataset.kind = kind;
    document.getElementById('slotDialogKind').innerHTML = icon(kind);
    document.getElementById('slotDialogTitle').innerText = `${ev ? 'Editar' : 'Nuevo'} ${KIND_META[kind].title.toLowerCase()}`.replace(/^\w/, c => c.toUpperCase()).replace('Nuevo nota', 'Nueva nota').replace('Nuevo tarea', 'Nueva tarea');
    document.getElementById('slotDialogMeta').innerHTML = metaHtml;
    document.getElementById('slotDelete').hidden = !ev;

    const set = (id, v) => { document.getElementById(id).value = v === undefined || v === null ? '' : v; };
    if (kind === 'exam') {
      set('examTopics', ev ? ev.topics : '');
      set('examWeight', ev ? ev.weight : '');
      set('examGrade', ev ? ev.grade : '');
    } else if (kind === 'task') {
      set('taskTitle', ev ? ev.title : '');
      set('taskDesc', ev ? ev.desc : '');
      set('taskWeight', ev ? ev.weight : '');
      set('taskGrade', ev ? ev.grade : '');
      form.querySelector(`input[name="taskStatus"][value="${ev && ev.status === 'done' ? 'done' : 'pending'}"]`).checked = true;
    } else {
      set('noteText', ev ? ev.text : '');
    }
    // Registros anteriores a los avisos no tienen el campo: se abren con «No»
    if (ev && kind !== 'note') {
      form.querySelector(`input[name="notify"][value="${ev.notify ? 'yes' : 'no'}"]`).checked = true;
      const days = ev.notify && ev.notifyDays ? ev.notifyDays : [3];
      form.querySelectorAll('input[name="notifyDays"]').forEach(i => { i.checked = days.includes(Number(i.value)); });
    }

    dialog.classList.remove('is-closing');
    dialog.showModal();
    const firstField = { exam: 'examTopics', task: 'taskTitle', note: 'noteText' }[kind];
    document.getElementById(firstField).focus();
  }

  function closeSlotDialog() {
    const dialog = document.getElementById('slotDialog');
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    const finish = () => { dialog.classList.remove('is-closing'); dialog.close(); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    dialog.classList.add('is-closing');
    dialog.addEventListener('animationend', finish, { once: true });
  }

  // Lee un número opcional dentro de un rango; devuelve undefined si está vacío y NaN si no es válido
  function readNumber(id, min, max) {
    const raw = document.getElementById(id).value.trim().replace(',', '.');
    if (raw === '') return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && n >= min && n <= max ? n : NaN;
  }

  function saveSlotRecord(e) {
    e.preventDefault();
    const { kind, dateIdx, key, index, module } = slotEditing;
    const val = id => document.getElementById(id).value.trim();
    const errors = [];
    let rec;

    if (kind === 'exam') {
      const topics = val('examTopics');
      const weight = readNumber('examWeight', 0, 100);
      const grade = readNumber('examGrade', 0, 10);
      if (!topics) errors.push('examTopics');
      if (Number.isNaN(weight)) errors.push('examWeight');
      if (Number.isNaN(grade)) errors.push('examGrade');
      rec = { type: 'exam', module, slot: key, text: topics, topics, weight, grade };
    } else if (kind === 'task') {
      const title = val('taskTitle');
      const weight = readNumber('taskWeight', 0, 100);
      const grade = readNumber('taskGrade', 0, 10);
      if (!title) errors.push('taskTitle');
      if (Number.isNaN(weight)) errors.push('taskWeight');
      if (Number.isNaN(grade)) errors.push('taskGrade');
      rec = {
        type: 'task', module, slot: key, text: title, title,
        desc: val('taskDesc'), weight, grade,
        status: document.querySelector('input[name="taskStatus"]:checked').value
      };
    } else {
      const text = val('noteText');
      if (!text) errors.push('noteText');
      rec = { type: 'note', module, slot: key, text };
    }

    // Aviso en la app de Android: días de antelación marcados (por defecto 3)
    if (kind !== 'note') {
      const notify = document.querySelector('input[name="notify"]:checked').value === 'yes';
      const days = [...document.querySelectorAll('input[name="notifyDays"]:checked')].map(i => Number(i.value)).sort((a, b) => b - a);
      if (notify && !days.length && document.documentElement.classList.contains('is-app')) errors.push('notifyDays');
      rec.notify = notify && days.length > 0;
      rec.notifyDays = days;
    }
    const store = slotEditing.personal ? personalEvents : userEvents;
    const day = slotEditing.personal ? slotEditing.iso : dateIdx;
    rec.id = (index !== null && store[day][index].id) || newRecordId();
    if (slotEditing.byDay) rec.byDay = true;
    if (slotEditing.personal) { delete rec.module; delete rec.slot; delete rec.weight; delete rec.grade; }

    ['examTopics', 'examWeight', 'examGrade', 'taskTitle', 'taskWeight', 'taskGrade', 'noteText', 'notifyDays'].forEach(id => setFieldError(id, errors.includes(id)));
    if (errors.length) {
      const first = document.getElementById(errors[0]) || document.querySelector('input[name="notifyDays"]');
      first.focus();
      return;
    }

    if (!store[day]) store[day] = [];
    if (index !== null) store[day][index] = rec;
    else store[day].push(rec);
    const saved = `${KIND_META[kind].title} ${index !== null ? 'actualizada' : 'guardada'}`;

    if (slotEditing.personal) {
      lastAddedKey = `p:${day}:${index !== null ? index : store[day].length - 1}`;
      closeSlotDialog();
      saveData();
      showToast(`${saved} · ${isoShort(day).date}`);
      return;
    }
    lastAddedKey = `${dateIdx}:${index !== null ? index : userEvents[dateIdx].length - 1}`;

    const { start } = slotContext(dateIdx, key);
    pendingPop = { dateIdx, key, kind: 'rec', rec: kind };
    closeSlotDialog();
    saveData();
    pendingPop = null;
    showToast(`${saved} · ${module} · ${CALENDAR_DATES[dateIdx].date} ${start}`.replace('Examen actualizada', 'Examen actualizado').replace('Examen guardada', 'Examen guardado'));
  }

  // Borrar desde el formulario: sin aviso ni «Deshacer»
  function deleteSlotRecord() {
    const { dateIdx, index, personal, iso } = slotEditing;
    const store = personal ? personalEvents : userEvents;
    const day = personal ? iso : dateIdx;
    store[day].splice(index, 1);
    if (!store[day].length) delete store[day];
    closeSlotDialog();
    saveData();
  }

  // --- 6. MÓDULOS ---
  function renderModulesList() {
    const container = document.getElementById('modulesGridList');
    const schedule = getSchedule();
    const hours = {};
    schedule.forEach(day => (day || []).forEach(m => { if (m) hours[m] = (hours[m] || 0) + 1; }));

    // Cabecera una sola vez; las filas llevan solo los valores
    const head = `
      <div class="module-row is-head" aria-hidden="true">
        <div class="module-th is-module">Módulo</div>
        <div class="module-th">Docente</div>
        <div class="module-th">Aula</div>
        <div class="module-th is-hours">Horas presenciales</div>
      </div>`;
    container.innerHTML = head + Object.values(MODULES).map(mod => {
      const dim = filterModule && filterModule !== mod.code ? ' is-dimmed' : '';
      const h = hours[mod.code] || 0;
      const room = mod.presencial === '-' ? 'Sin aula' : mod.presencial;
      return `
        <div class="module-row${dim}" aria-label="${escapeHTML(mod.name)}. Docente: ${capitalize(mod.teacher)}. ${room}. ${h ? h + ' horas presenciales' : 'Sin sesiones'}">
          ${chip(mod.code, 'chip-lg')}
          <div class="module-name">${mod.name}</div>
          <div class="module-cell">${capitalize(mod.teacher)}</div>
          <div class="module-cell">${room}</div>
          <div class="module-hours${h ? '' : ' is-none'}">${h ? `${h} h` : '—'}</div>
        </div>`;
    }).join('');
  }

  // --- DIÁLOGO ---
  function openAddModal() {
    const dialog = document.getElementById('eventModal');
    document.getElementById('modalDateSelect').value = selectedDateIndex;
    updateModalModuleOptions(); // Cargar asignaturas exclusivas del día actual
    updateTypeHelp();
    setTextError(false);
    dialog.classList.remove('is-closing');
    dialog.showModal();
    document.getElementById('modalEventText').focus();
  }

  function closeAddModal() {
    const dialog = document.getElementById('eventModal');
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    const finish = () => {
      dialog.classList.remove('is-closing');
      dialog.close();
      document.getElementById('eventForm').reset();
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    dialog.classList.add('is-closing');
    dialog.addEventListener('animationend', finish, { once: true });
  }

  function updateTypeHelp() {
    const type = document.querySelector('input[name="eventType"]:checked').value;
    const help = {
      absence: 'Una falta sin módulo cuenta en todas las horas de ese día.',
      exam: 'Aparecerá marcado en el calendario y en la vista del día.',
      note: 'Un recordatorio personal; no afecta a la asistencia.'
    };
    document.getElementById('typeHelp').innerText = help[type];
  }

  function setTextError(show) {
    document.getElementById('textError').hidden = !show;
    document.getElementById('modalEventText').setAttribute('aria-invalid', show);
  }

  function populateModalDateSelect() {
    const select = document.getElementById('modalDateSelect');
    select.innerHTML = CALENDAR_DATES.map((d, idx) =>
      `<option value="${idx}">${d.date} · ${d.holiday ? d.holiday : /^\d+$/.test(d.week) ? 'semana ' + d.week : 'sin semana'}</option>`
    ).join('');
  }

  // Muestra únicamente las asignaturas que existen ese día
  function updateModalModuleOptions() {
    const dateIdx = parseInt(document.getElementById('modalDateSelect').value);
    const daySched = getSchedule()[dateIdx];
    const moduleSelect = document.getElementById('modalModuleSelect');
    const uniqueMods = daySched ? [...new Set(daySched.filter(Boolean))].filter(m => MODULES[m]) : [];

    let html = `<option value="">General · sin módulo</option>`;
    html += uniqueMods.map(m => `<option value="${m}">${m} · ${MODULES[m].name}</option>`).join('');
    if (!uniqueMods.length) {
      html += `<option value="" disabled>${CALENDAR_DATES[dateIdx].holiday ? 'Festivo: no hay clase' : 'No hay clases este día'}</option>`;
    }
    moduleSelect.innerHTML = html;
  }

  function saveCustomEvent(e) {
    e.preventDefault();
    const dateIdx = parseInt(document.getElementById('modalDateSelect').value);
    const type = document.querySelector('input[name="eventType"]:checked').value;
    const module = document.getElementById('modalModuleSelect').value;
    const text = document.getElementById('modalEventText').value.trim();

    if (!text) {
      setTextError(true);
      document.getElementById('modalEventText').focus();
      return;
    }
    if (!userEvents[dateIdx]) userEvents[dateIdx] = [];
    userEvents[dateIdx].push({ type, module, text });
    lastAddedKey = `${dateIdx}:${userEvents[dateIdx].length - 1}`;

    closeAddModal();
    saveData();
  }

  function deleteEvent(dateIdx, evIndex, btn) {
    const remove = () => {
      userEvents[dateIdx].splice(evIndex, 1);
      if (userEvents[dateIdx].length === 0) delete userEvents[dateIdx];
      saveData();
    };
    const row = btn && btn.closest('.record');
    if (!row || matchMedia('(prefers-reduced-motion: reduce)').matches) { remove(); return; }
    row.classList.add('is-leaving');
    row.addEventListener('animationend', remove, { once: true });
  }

  function deletePersonal(iso, evIndex, btn) {
    const remove = () => {
      personalEvents[iso].splice(evIndex, 1);
      if (!personalEvents[iso].length) delete personalEvents[iso];
      saveData();
    };
    const row = btn && btn.closest('.record');
    if (!row || matchMedia('(prefers-reduced-motion: reduce)').matches) { remove(); return; }
    row.classList.add('is-leaving');
    row.addEventListener('animationend', remove, { once: true });
  }

  // Borra varios registros del mismo día (un grupo de faltas seguidas)
  function deleteEvents(dateIdx, indices, btn) {
    const remove = () => {
      [...indices].sort((a, b) => b - a).forEach(k => userEvents[dateIdx].splice(k, 1));
      if (userEvents[dateIdx].length === 0) delete userEvents[dateIdx];
      saveData();
    };
    const row = btn && btn.closest('.record');
    if (!row || matchMedia('(prefers-reduced-motion: reduce)').matches) { remove(); return; }
    row.classList.add('is-leaving');
    row.addEventListener('animationend', remove, { once: true });
  }

  // --- TEMA ---
  // Color de fondo de cada tema (barra del navegador, círculo del cambio y barras de Android)
  const THEME_BG = { dark: '#1c1512', light: '#e6d7bd', rosa: '#ffc0dc' };

  function currentTheme() {
    const t = document.documentElement.dataset.theme;
    return THEME_BG[t] ? t : 'dark';
  }

  function syncThemeToggle() {
    const theme = currentTheme();
    document.getElementById('themeSwitch').dataset.active = theme;
    // Rosa se muestra como «Día» (es su variante escondida)
    const shown = theme === 'rosa' ? 'light' : theme;
    [['dark', 'btnThemeDark'], ['light', 'btnThemeLight']].forEach(([t, id]) => {
      const b = document.getElementById(id);
      b.classList.toggle('is-active', t === shown);
      b.setAttribute('aria-pressed', t === shown);
    });
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = THEME_BG[theme];
    try { localStorage.setItem('horario_theme', theme); } catch {}
    // En la app de Android, las barras del sistema siguen al tema
    if (window.AndroidApp) AndroidApp.setTheme(theme);
    syncThemeToggle();
  }

  // El tema elegido se guarda (applyTheme) y el <head> lo aplica al abrir la app
  function setTheme(next, origin) {
    if (next === currentTheme()) return;
    const root = document.documentElement;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { applyTheme(next); return; }

    // Sin View Transitions: fundido de colores
    if (!document.startViewTransition) {
      root.classList.add('theme-fading');
      applyTheme(next);
      setTimeout(() => root.classList.remove('theme-fading'), 300);
      return;
    }

    // El círculo nace en el botón pulsado y cubre hasta la esquina más lejana
    const b = origin.getBoundingClientRect();
    const x = b.left + b.width / 2, y = b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    // En táctil, el recorte con clip-path se repinta en cada fotograma y se traba:
    // se usa un círculo que solo escala (GPU) y tapa el cambio de tema
    if (matchMedia('(pointer: coarse)').matches) { themeWipe(next, x, y, r); return; }

    // Con View Transitions: el tema nuevo se revela en círculo desde la esquina
    document.startViewTransition(() => applyTheme(next)).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  // Círculo del color de fondo del tema nuevo que crece desde la esquina (solo transform).
  // Con la pantalla cubierta se aplica el tema sin transiciones y el círculo se desvanece.
  let wiping = false;
  function themeWipe(next, x, y, r) {
    if (wiping) return;
    wiping = true;
    const root = document.documentElement;
    const d = document.createElement('div');
    d.className = 'theme-wipe';
    d.style.cssText = `left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;background:${THEME_BG[next]}`;
    // Con el menú abierto (capa superior), el círculo va dentro para quedar por encima
    const menu = document.getElementById('menuDrawer');
    (menu.open ? menu : document.body).append(d);

    d.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', fill: 'forwards' })
      .finished.then(() => {
        root.classList.add('theme-instant');
        applyTheme(next);
        // Dos fotogramas: el tema nuevo ya está pintado debajo antes de destapar
        requestAnimationFrame(() => requestAnimationFrame(() => {
          root.classList.remove('theme-instant');
          d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' })
            .finished.then(() => { d.remove(); wiping = false; });
        }));
      });
  }

  // --- CLASE EN CURSO ---
  // Bajo la tabla: progreso de la hora o del descanso en curso. Al terminar la última
  // clase queda al 100 % en verde (con fuegos artificiales una vez) hasta las 23:59.
  const DAY_END = '23:59';
  let liveKey = null;
  // Desfase del reloj para la barra de pruebas (0 = hora real)
  let clockOffset = 0;
  const liveNow = () => new Date(Date.now() + clockOffset);

  // Barra de pruebas: lleva el reloj a esa hora del próximo día de clase y lo deja correr
  function simulateAt(time, btn) {
    if (!time) clockOffset = 0;
    else {
      const [h, m, sec = 0] = time.split(':').map(Number);
      const d = realDate(CALENDAR_DATES[nextClassIndex()]);
      d.setHours(h, m, sec);
      clockOffset = d - Date.now();
    }
    document.querySelectorAll('.sim-btn').forEach(b => b.classList.toggle('is-active', b === btn));
    if (currentTab !== 'grid') switchTab('grid');
    tickLive();
    const box = document.getElementById('liveClass');
    if (!box.hidden) box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function atTime(hhmm, base) {
    const [h, m] = hhmm.split(':').map(Number);
    return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m);
  }

  function todayClassIndex(now) {
    return CALENDAR_DATES.findIndex(cd => {
      const d = realDate(cd);
      return !cd.holiday && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    });
  }

  // Tramo actual del día: { kind: 'class'|'free'|'break'|'done', seg, next, … } o null
  function livePhase(now) {
    const idx = todayClassIndex(now);
    const daySched = idx === -1 ? null : getSchedule()[idx];
    if (!daySched) return null;

    const segs = TIME_SLOTS.map(slot => {
      const { start, end } = slotBounds(slot);
      const code = slot.key === 'break' ? null : daySched[slot.key];
      return {
        slot, start, end, code: code && MODULES[code] ? code : null,
        from: atTime(start, now), to: atTime(end, now),
        kind: slot.key === 'break' ? 'break' : code && MODULES[code] ? 'class' : 'free'
      };
    });
    const classes = segs.filter(sg => sg.kind === 'class');
    if (!classes.length || now < classes[0].from || now >= atTime(DAY_END, now)) return null;

    const last = classes[classes.length - 1];
    if (now >= last.to) return { kind: 'done', idx };

    const i = segs.findIndex(sg => now >= sg.from && now < sg.to);
    if (i === -1) return null;
    const seg = segs[i];
    return {
      kind: seg.kind, idx, seg,
      next: segs.slice(i + 1).find(sg => sg.kind !== 'free' && sg.from < last.to) || null,
      progress: (now - seg.from) / (seg.to - seg.from)
    };
  }

  function nextClassAfter(idx) {
    const schedule = getSchedule();
    for (let j = idx + 1; j < CALENDAR_DATES.length; j++) {
      const cd = CALENDAR_DATES[j];
      if (!cd.holiday && (schedule[j] || []).some(Boolean)) return `miércoles ${cd.dayNum} de ${monthWord(cd.monthIdx)}`;
    }
    return null;
  }

  function remainingText(ms) {
    const min = Math.ceil(ms / 60000);
    return min <= 1 ? 'Queda menos de 1 min' : `Quedan ${min} min`;
  }

  function liveMarkup(ph) {
    const bar = `<div class="live-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso"><span class="live-fill"></span></div>`;
    if (ph.kind === 'done') {
      const next = nextClassAfter(ph.idx);
      return `
        <div class="live-head">
          <span class="live-kind">${icon('check')}Día completado</span>
          <span class="live-pct mono">100%</span>
        </div>
        <p class="live-title">Has terminado las clases de hoy</p>
        ${bar}
        <div class="live-foot">
          <span>${next ? `Próxima clase: ${next}` : 'Último día del curso'}</span>
          <button type="button" class="btn btn-ghost btn-sm" onclick="launchFireworks()">Otra vez</button>
        </div>`;
    }
    const { seg, next } = ph;
    const kind = ph.kind === 'break' ? 'Descanso' : ph.kind === 'free' ? 'Hora libre' : `En clase · ${seg.slot.key + 1}.ª hora`;
    const title = ph.kind === 'class'
      ? `${chip(seg.code)}<span class="live-name">${escapeHTML(MODULES[seg.code].name)}</span>`
      : `<span class="live-name">${ph.kind === 'break' ? `Pausa de ${Math.round((seg.to - seg.from) / 60000)} min` : 'Sin clase a esta hora'}</span>`;
    const after = next
      ? `Después: ${next.kind === 'break' ? 'descanso' : next.code} a las <span class="mono">${next.start}</span>`
      : 'Última hora del día';
    return `
      <div class="live-head">
        <span class="live-kind"><span class="live-pulse" aria-hidden="true"></span>${kind}</span>
        <span class="live-pct mono"></span>
      </div>
      <p class="live-title">${title}<span class="live-time mono">${seg.start}–${seg.end}</span></p>
      ${bar}
      <div class="live-foot"><span class="live-left"></span><span>${after}</span></div>`;
  }

  function tickLive() {
    if (document.hidden) return;
    const box = document.getElementById('liveClass');
    const now = liveNow();
    const clock = document.getElementById('simClock');
    if (clock) clock.textContent = clockOffset
      ? `${CALENDAR_DATES[todayClassIndex(now)]?.date || ''} ${now.toTimeString().slice(0, 8)}`
      : '';
    const ph = livePhase(now);
    const key = ph ? `${currentGroup}:${ph.idx}:${ph.kind}:${ph.seg ? ph.seg.start : ''}` : null;

    if (key !== liveKey) {
      liveKey = key;
      box.hidden = !ph;
      if (!ph) return;
      box.dataset.kind = ph.kind;
      if (ph.seg && ph.seg.code) box.style.setProperty('--m', MODULES[ph.seg.code].color);
      else box.style.removeProperty('--m');
      box.innerHTML = liveMarkup(ph);
      replay(box, 'is-swapping');
      if (ph.kind === 'done') celebrateDay(ph.idx);
    }
    if (!ph) return;

    const p = ph.kind === 'done' ? 1 : Math.min(ph.progress, 0.999);
    const pct = Math.floor(p * 100);
    box.querySelector('.live-fill').style.setProperty('--p', p);
    box.querySelector('.live-bar').setAttribute('aria-valuenow', pct);
    if (ph.kind !== 'done') {
      box.querySelector('.live-pct').textContent = `${pct}%`;
      box.querySelector('.live-left').textContent = remainingText(ph.seg.to - now);
    }
  }

  // Los fuegos salen una sola vez por día completado (aunque se abra la app más tarde)
  function celebrateDay(idx) {
    // En las pruebas salen siempre y no gastan los del día real
    if (clockOffset) { launchFireworks(); return; }
    const key = CALENDAR_DATES[idx].date;
    let seen = null;
    try { seen = localStorage.getItem('horario_fireworks'); } catch {}
    if (seen === key) return;
    try { localStorage.setItem('horario_fireworks', key); } catch {}
    launchFireworks();
  }

  function startLive() {
    tickLive();
    setInterval(tickLive, 1000);
    document.addEventListener('visibilitychange', tickLive);
  }

  // --- FUEGOS ARTIFICIALES ---
  // Lienzo a pantalla completa sin eventos de puntero; cohetes que suben y estallan
  // en partículas con gravedad y rozamiento. Se retira solo al apagarse la última.
  function launchFireworks() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.querySelector('.fireworks')) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'fireworks';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const fit = () => {
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener('resize', fit);

    const css = getComputedStyle(document.documentElement);
    // En el tema rosa estallan en forma de corazón y cada chispa es un corazoncito
    const hearts = currentTheme() === 'rosa';
    const palette = hearts ? ['#f70071', '#ff1b82', '#ff5aa4', '#d1005e', '#ffffff']
      : ['--accent', '--done', '--exam', '--absence', '--note', '--task'].map(v => css.getPropertyValue(v).trim()).filter(Boolean);
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const small = w < 600;

    const ROCKET_G = small ? 0.28 : 0.36;
    const rockets = [];
    const sparks = [];
    const shots = small ? 7 : 10;
    for (let i = 0; i < shots; i++) {
      rockets.push({
        at: i * (small ? 330 : 260) + Math.random() * 180,
        x: w * (0.15 + Math.random() * 0.7),
        ty: h * (0.14 + Math.random() * 0.3),
        color: pick(palette),
        launched: false
      });
    }

    const burst = (x, y, color) => {
      const n = small ? 46 : 70;
      const second = pick(palette);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.2;
        let vx, vy;
        if (hearts) {
          // Curva del corazón: x = 16 sen³t, y = −(13 cos t − 5 cos 2t − 2 cos 3t − cos 4t)
          const k = (0.24 + Math.random() * 0.05) * (small ? 0.8 : 1);
          vx = 16 * Math.sin(a) ** 3 * k;
          vy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * k;
        } else {
          const v = 2.2 + Math.random() * 3.2;
          vx = Math.cos(a) * v; vy = Math.sin(a) * v;
        }
        sparks.push({
          x, y, px: x, py: y,
          vx, vy,
          life: 1, decay: 0.012 + Math.random() * 0.012,
          color: Math.random() < 0.25 ? second : color,
          size: 1.4 + Math.random() * 1.2
        });
      }
    };

    const t0 = performance.now();
    let last = t0;
    const frame = now => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      const t = now - t0;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';

      rockets.forEach(r => {
        if (r.done || t < r.at) return;
        // Velocidad justa para frenar en su altura de estallido (unos 0,8 s de subida)
        if (!r.launched) { r.launched = true; r.y = h + 10; r.vy = -Math.sqrt(2 * ROCKET_G * (h + 10 - r.ty)); }
        r.vy += ROCKET_G * dt;
        r.y += r.vy * dt;
        const trail = ctx.createLinearGradient(r.x, r.y, r.x, r.y - r.vy * 5);
        trail.addColorStop(0, r.color);
        trail.addColorStop(1, 'transparent');
        ctx.globalAlpha = 1;
        ctx.strokeStyle = trail;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(r.x, r.y - r.vy * 5); ctx.lineTo(r.x, r.y); ctx.stroke();
        if (r.vy >= 0 || r.y <= r.ty) { r.done = true; burst(r.x, r.y, r.color); }
      });

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.px = p.x; p.py = p.y;
        p.vx *= Math.pow(0.975, dt);
        p.vy = p.vy * Math.pow(0.975, dt) + 0.05 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, p.life * 1.4);
        if (hearts) {
          const s = p.size * 2.2;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y + s * 0.7);
          ctx.bezierCurveTo(p.x - s * 1.2, p.y - s * 0.1, p.x - s * 0.6, p.y - s, p.x, p.y - s * 0.35);
          ctx.bezierCurveTo(p.x + s * 0.6, p.y - s, p.x + s * 1.2, p.y - s * 0.1, p.x, p.y + s * 0.7);
          ctx.fill();
        } else {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
      }

      if (sparks.length || rockets.some(r => !r.done)) requestAnimationFrame(frame);
      else { window.removeEventListener('resize', fit); canvas.remove(); }
    };
    requestAnimationFrame(frame);
  }

  init();
