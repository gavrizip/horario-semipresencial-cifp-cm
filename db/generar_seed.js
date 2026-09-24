// Genera db/seed_2asir.sql a partir de las tablas de js/script.js (MODULES, TIME_SLOTS,
// CALENDAR_DATES, MONTHS_DATA, SCHEDULE_A/B), para que la base de datos y la app no se
// desincronicen. Uso, desde la raíz del proyecto:
//   node db/generar_seed.js
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js/script.js'), 'utf8');
// Solo el bloque de datos del principio (lo demás necesita el navegador)
const data = src.slice(src.indexOf('const MODULES'), src.indexOf('const EVENT_TYPES'));
const ctx = {};
vm.runInNewContext(`${data}\n;out = { MODULES, TIME_SLOTS, CALENDAR_DATES, MONTHS_DATA, SCHEDULE_A, SCHEDULE_B };`, ctx);
const { MODULES, TIME_SLOTS, CALENDAR_DATES, MONTHS_DATA, SCHEDULE_A, SCHEDULE_B } = ctx.out;

const q = v => v === null || v === undefined ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
const row = vals => `(${vals.map(q).join(', ')})`;
const insert = (table, cols, rows) => rows.length
  ? `INSERT INTO ${table} (${cols.join(', ')}) VALUES\n  ${rows.map(row).join(',\n  ')};\n`
  : '';
const cap = s => s.charAt(0) + s.slice(1).toLowerCase();
const iso = cd => {
  const m = MONTHS_DATA[cd.monthIdx];
  return `${m.year}-${String(m.monthIdx + 1).padStart(2, '0')}-${String(cd.dayNum).padStart(2, '0')}`;
};

const out = [];
const warn = [];

// ---------- Centro, curso y periodos ----------
// Los trimestres son los tramos de la pestaña «Trimestre» de la app, extendidos para que
// cada día del curso caiga en uno (23 sep–13 ene, 20 ene–14 abr, 21 abr–2 jun)
out.push(insert('configuracion', ['id', 'nombre_centro', 'umbral_asistencia', 'cuenta_justificadas'],
  [[1, 'Centro Integrado de Formación Profesional', 80, 1]]));
out.push(insert('curso_academico', ['id', 'nombre', 'inicio', 'fin'], [[1, '2026-27', '2026-09-01', '2027-06-30']]));
out.push(insert('periodo', ['id', 'curso_academico_id', 'orden', 'nombre', 'inicio', 'fin'], [
  [1, 1, 1, '1.er trimestre', '2026-09-01', '2027-01-19'],
  [2, 1, 2, '2.º trimestre', '2027-01-20', '2027-04-20'],
  [3, 1, 3, '3.er trimestre', '2027-04-21', '2027-06-30']
]));
out.push(insert('familia_profesional', ['id', 'codigo', 'nombre'], [[1, 'IFC', 'Informática y Comunicaciones']]));
out.push(insert('ciclo', ['id', 'familia_id', 'codigo', 'nombre', 'grado', 'horas_totales'],
  [[1, 1, 'ASIR', 'Administración de Sistemas Informáticos en Red', 'superior', 2000]]));
out.push(insert('curso_ciclo', ['id', 'ciclo_id', 'numero'], [[1, 1, 2]]));

// ---------- Módulos y aulas ----------
const mods = Object.values(MODULES);
const modId = Object.fromEntries(mods.map((m, i) => [m.code, i + 1]));
out.push(insert('modulo', ['id', 'curso_ciclo_id', 'codigo', 'nombre', 'color'],
  mods.map(m => [modId[m.code], 1, m.code, m.name, m.color])));

const rooms = [...new Set(mods.map(m => m.presencial).filter(r => r && r !== '-'))];
const roomId = Object.fromEntries(rooms.map((r, i) => [r, i + 1]));
out.push(insert('aula', ['id', 'codigo', 'nombre'], rooms.map(r => [roomId[r], 'A' + r.replace(/\D/g, ''), r])));

// ---------- Usuarios: jefatura, profesorado (de MODULES) y dos alumnos de prueba ----------
const users = [[1, 'jefatura@cifp.example', 'Jefatura de estudios', null]];
const roles = [[1, 'jefatura']];
const teachers = [...new Set(mods.map(m => m.teacher))];
const teacherId = {};
teachers.forEach((t, i) => {
  teacherId[t] = i + 2;
  users.push([i + 2, `${t.toLowerCase()}@cifp.example`, cap(t), null]);
  roles.push([i + 2, 'profesor']);
});
const studentA = teachers.length + 2, studentB = teachers.length + 3;
users.push([studentA, 'alumno.a@cifp.example', 'Alumno de prueba', 'Grupo A']);
users.push([studentB, 'alumno.b@cifp.example', 'Alumno de prueba', 'Grupo B']);
roles.push([studentA, 'alumno'], [studentB, 'alumno']);
out.push(insert('usuario', ['id', 'email', 'nombre', 'apellidos'], users));
out.push(insert('usuario_rol', ['usuario_id', 'rol'], roles));
out.push(insert('profesor', ['usuario_id'], teachers.map(t => [teacherId[t]])));
out.push(insert('alumno', ['usuario_id', 'nia'], [[studentA, 'PRUEBA-A'], [studentB, 'PRUEBA-B']]));

// ---------- Grupos, matrículas e impartición ----------
// Tutor: quien imparte Tutoría (TUO) en la app
const tutor = MODULES.TUO ? teacherId[MODULES.TUO.teacher] : null;
const groups = [[1, 'A', SCHEDULE_A], [2, 'B', SCHEDULE_B]];
out.push(insert('grupo', ['id', 'curso_ciclo_id', 'curso_academico_id', 'nombre', 'turno', 'tutor_id'],
  groups.map(([id, name]) => [id, 1, 1, name, 'tarde', tutor])));
out.push(insert('matricula', ['id', 'alumno_id', 'grupo_id', 'fecha_alta'],
  [[1, studentA, 1, '2026-09-01'], [2, studentB, 2, '2026-09-01']]));
const teaching = [];
groups.forEach(([gid, , sched]) => {
  const used = new Set(sched.flatMap(d => d || []).filter(Boolean));
  if (MODULES.TUO) used.add('TUO');
  mods.filter(m => used.has(m.code)).forEach(m => teaching.push([gid, modId[m.code], 1, teacherId[m.teacher]]));
});
out.push(insert('imparticion', ['grupo_id', 'modulo_id', 'curso_ciclo_id', 'profesor_id'], teaching));

// ---------- Franjas y festivos ----------
const slotId = {};
out.push(insert('franja_horaria', ['id', 'turno', 'orden', 'inicio', 'fin', 'es_descanso'], TIME_SLOTS.map((t, i) => {
  slotId[t.key] = i + 1;
  const [start, end] = t.range.split(' - ');
  return [i + 1, 'tarde', i + 1, start, end, t.key === 'break' ? 1 : 0];
})));
out.push(insert('dia_calendario', ['fecha', 'curso_academico_id', 'tipo', 'motivo'],
  CALENDAR_DATES.filter(cd => cd.holiday).map(cd => [iso(cd), 1, 'festivo', cd.holiday])));

// ---------- Sesiones ----------
// Si A y B tienen el mismo módulo a la misma hora es una clase conjunta: una sesión con los
// dos grupos. La app guarda un aula por módulo, no por clase; si eso deja dos clases distintas
// en la misma aula a la vez, la segunda se queda sin aula («por confirmar»).
const sessions = [];
const sessionGroups = [];
CALENDAR_DATES.forEach((cd, i) => {
  const date = iso(cd);
  for (let key = 0; key < 5; key++) {
    const byModule = new Map();
    groups.forEach(([gid, , sched]) => {
      const code = (sched[i] || [])[key];
      if (!code) return;
      if (!byModule.has(code)) byModule.set(code, []);
      byModule.get(code).push(gid);
    });
    const roomsTaken = new Set();
    byModule.forEach((gids, code) => {
      const m = MODULES[code];
      let room = m.presencial && m.presencial !== '-' ? roomId[m.presencial] : null;
      if (room && roomsTaken.has(room)) {
        warn.push(`${date} ${TIME_SLOTS.find(t => t.key === key).range}: ${code} (grupo ${gids.map(g => groups[g - 1][1]).join('+')}) coincide en ${m.presencial} con otra clase; aula por confirmar`);
        room = null;
      }
      if (room) roomsTaken.add(room);
      const id = sessions.length + 1;
      sessions.push([id, date, slotId[key], modId[code], teacherId[m.teacher], room]);
      gids.forEach(g => sessionGroups.push([id, g]));
    });
  }
});
out.push(insert('sesion', ['id', 'fecha', 'franja_id', 'modulo_id', 'profesor_id', 'aula_id'], sessions));
out.push(insert('sesion_grupo', ['sesion_id', 'grupo_id'], sessionGroups));

const header = `-- ============================================================
-- Datos reales de 2.º ASIR 2026-27 (grupos A y B)
-- GENERADO por db/generar_seed.js a partir de js/script.js: no editar a mano.
-- Los usuarios usan el dominio reservado cifp.example; los dos alumnos son de prueba.
-- ${sessions.length} sesiones, ${sessionGroups.length - sessions.length} de ellas conjuntas (A+B).
${warn.map(w => `-- AVISO: ${w}`).join('\n')}
-- ============================================================

PRAGMA foreign_keys = ON;
BEGIN;

`;
fs.writeFileSync(path.join(__dirname, 'seed_2asir.sql'), header + out.join('\n') + '\nCOMMIT;\n');
console.log(`seed_2asir.sql: ${sessions.length} sesiones, ${warn.length} avisos`);
warn.forEach(w => console.log('  aviso:', w));
