-- ============================================================
-- Modelo de datos del Centro Integrado de FP · SQLite ≥ 3.37
--
-- Orden de carga: schema.sql → views.sql → seed_2asir.sql
--
-- Convenciones:
--   · Tablas STRICT: SQLite comprueba el tipo de cada columna.
--   · Fechas en texto ISO 'AAAA-MM-DD', horas 'HH:MM', instantes ISO 8601 UTC.
--     Así se comparan y ordenan bien como texto.
--   · Booleanos como INTEGER 0/1.
--   · Las claves ajenas solo se cumplen con «PRAGMA foreign_keys = ON», que hay que
--     activar en CADA conexión (la API debe hacerlo al abrir la base de datos).
--   · SQLite no tiene usuarios ni roles: qué ve cada perfil lo decide la API
--     (ver docs/modelo-datos.md, «Permisos»). Aquí van las reglas de integridad.
-- ============================================================

PRAGMA foreign_keys = ON;

-- ---------- Configuración del centro (una sola fila) ----------

CREATE TABLE configuracion (
  id                  INTEGER PRIMARY KEY CHECK (id = 1),
  nombre_centro       TEXT    NOT NULL,
  -- % mínimo de asistencia por módulo (pérdida de evaluación continua)
  umbral_asistencia   REAL    NOT NULL DEFAULT 80 CHECK (umbral_asistencia BETWEEN 0 AND 100),
  -- Si las faltas justificadas también cuentan para el límite (depende de la normativa)
  cuenta_justificadas INTEGER NOT NULL DEFAULT 1 CHECK (cuenta_justificadas IN (0, 1))
) STRICT;

-- ============================================================
-- ESTRUCTURA ACADÉMICA
-- ============================================================

CREATE TABLE curso_academico (
  id     INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,                    -- '2026-27'
  inicio TEXT NOT NULL CHECK (date(inicio) = inicio),
  fin    TEXT NOT NULL CHECK (date(fin) = fin),
  CHECK (fin > inicio)
) STRICT;

-- Trimestres o evaluaciones (no pueden solaparse dentro de un curso: ver triggers)
CREATE TABLE periodo (
  id                 INTEGER PRIMARY KEY,
  curso_academico_id INTEGER NOT NULL REFERENCES curso_academico ON DELETE CASCADE,
  orden              INTEGER NOT NULL CHECK (orden > 0),
  nombre             TEXT    NOT NULL,
  inicio             TEXT    NOT NULL CHECK (date(inicio) = inicio),
  fin                TEXT    NOT NULL CHECK (date(fin) = fin),
  CHECK (fin >= inicio),
  UNIQUE (curso_academico_id, orden)
) STRICT;

CREATE TABLE familia_profesional (
  id     INTEGER PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,                    -- 'IFC'
  nombre TEXT NOT NULL
) STRICT;

CREATE TABLE ciclo (
  id            INTEGER PRIMARY KEY,
  familia_id    INTEGER NOT NULL REFERENCES familia_profesional,
  codigo        TEXT    NOT NULL UNIQUE,          -- 'ASIR'
  nombre        TEXT    NOT NULL,
  grado         TEXT    NOT NULL CHECK (grado IN ('basico', 'medio', 'superior')),
  horas_totales INTEGER CHECK (horas_totales > 0)
) STRICT;

CREATE TABLE curso_ciclo (
  id       INTEGER PRIMARY KEY,
  ciclo_id INTEGER NOT NULL REFERENCES ciclo ON DELETE CASCADE,
  numero   INTEGER NOT NULL CHECK (numero BETWEEN 1 AND 3),
  UNIQUE (ciclo_id, numero)
) STRICT;

CREATE TABLE modulo (
  id              INTEGER PRIMARY KEY,
  curso_ciclo_id  INTEGER NOT NULL REFERENCES curso_ciclo ON DELETE CASCADE,
  codigo          TEXT    NOT NULL,               -- 'ADE'
  nombre          TEXT    NOT NULL,
  horas_curriculo INTEGER CHECK (horas_curriculo > 0),
  color           TEXT,                           -- color CSS con que lo pinta la app
  UNIQUE (curso_ciclo_id, codigo),
  -- Destino de las claves ajenas compuestas que obligan a que módulo y grupo sean del mismo curso
  UNIQUE (id, curso_ciclo_id)
) STRICT;

CREATE TABLE aula (
  id        INTEGER PRIMARY KEY,
  codigo    TEXT NOT NULL UNIQUE,                 -- 'A232'
  nombre    TEXT NOT NULL,
  capacidad INTEGER CHECK (capacidad > 0)
) STRICT;

-- ============================================================
-- PERSONAS
-- ============================================================

CREATE TABLE usuario (
  id            INTEGER PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE CHECK (email = lower(email) AND email LIKE '%_@_%'),
  nombre        TEXT NOT NULL,
  apellidos     TEXT,
  password_hash TEXT,                             -- hash bcrypt/argon2 que calcula la API; nunca la contraseña
  activo        INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
  creado_en     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
) STRICT;

CREATE TABLE usuario_rol (
  usuario_id INTEGER NOT NULL REFERENCES usuario ON DELETE CASCADE,
  rol        TEXT    NOT NULL CHECK (rol IN ('jefatura', 'profesor', 'alumno')),
  PRIMARY KEY (usuario_id, rol)
) STRICT, WITHOUT ROWID;

CREATE TABLE profesor (
  usuario_id   INTEGER PRIMARY KEY REFERENCES usuario ON DELETE CASCADE,
  departamento TEXT
) STRICT;

CREATE TABLE alumno (
  usuario_id INTEGER PRIMARY KEY REFERENCES usuario ON DELETE CASCADE,
  nia        TEXT NOT NULL UNIQUE                 -- número de identificación del alumnado
) STRICT;

CREATE TABLE grupo (
  id                 INTEGER PRIMARY KEY,
  curso_ciclo_id     INTEGER NOT NULL REFERENCES curso_ciclo,
  curso_academico_id INTEGER NOT NULL REFERENCES curso_academico,
  nombre             TEXT    NOT NULL,            -- 'A'
  turno              TEXT    NOT NULL CHECK (turno IN ('manana', 'tarde')),
  tutor_id           INTEGER REFERENCES profesor ON DELETE SET NULL,
  UNIQUE (curso_ciclo_id, curso_academico_id, nombre),
  UNIQUE (id, curso_ciclo_id)
) STRICT;

-- Un alumno puede estar en más de un grupo el mismo curso (p. ej. módulos pendientes de 1.º)
CREATE TABLE matricula (
  id         INTEGER PRIMARY KEY,
  alumno_id  INTEGER NOT NULL REFERENCES alumno ON DELETE CASCADE,
  grupo_id   INTEGER NOT NULL REFERENCES grupo  ON DELETE CASCADE,
  fecha_alta TEXT    NOT NULL CHECK (date(fecha_alta) = fecha_alta),
  fecha_baja TEXT    CHECK (fecha_baja IS NULL OR (date(fecha_baja) = fecha_baja AND fecha_baja >= fecha_alta)),
  UNIQUE (alumno_id, grupo_id)
) STRICT;

-- Solo para las excepciones: sin filas, el alumno cursa todos los módulos del grupo
CREATE TABLE matricula_modulo (
  matricula_id INTEGER NOT NULL REFERENCES matricula ON DELETE CASCADE,
  modulo_id    INTEGER NOT NULL REFERENCES modulo,
  estado       TEXT    NOT NULL DEFAULT 'cursando'
               CHECK (estado IN ('cursando', 'convalidado', 'exento', 'pendiente')),
  PRIMARY KEY (matricula_id, modulo_id)
) STRICT, WITHOUT ROWID;

-- Qué profesor imparte qué módulo a qué grupo
CREATE TABLE imparticion (
  id             INTEGER PRIMARY KEY,
  grupo_id       INTEGER NOT NULL,
  modulo_id      INTEGER NOT NULL,
  curso_ciclo_id INTEGER NOT NULL,
  profesor_id    INTEGER NOT NULL REFERENCES profesor,
  UNIQUE (grupo_id, modulo_id, profesor_id),
  FOREIGN KEY (grupo_id, curso_ciclo_id)  REFERENCES grupo  (id, curso_ciclo_id) ON DELETE CASCADE,
  FOREIGN KEY (modulo_id, curso_ciclo_id) REFERENCES modulo (id, curso_ciclo_id) ON DELETE CASCADE
) STRICT;

-- ============================================================
-- CALENDARIO Y HORARIO
-- ============================================================

CREATE TABLE franja_horaria (
  id          INTEGER PRIMARY KEY,
  turno       TEXT    NOT NULL CHECK (turno IN ('manana', 'tarde')),
  orden       INTEGER NOT NULL CHECK (orden > 0),
  inicio      TEXT    NOT NULL CHECK (inicio GLOB '[0-2][0-9]:[0-5][0-9]'),
  fin         TEXT    NOT NULL CHECK (fin    GLOB '[0-2][0-9]:[0-5][0-9]'),
  es_descanso INTEGER NOT NULL DEFAULT 0 CHECK (es_descanso IN (0, 1)),
  CHECK (fin > inicio),
  UNIQUE (turno, orden)
) STRICT;

-- Días sin clase de todo el centro. Los demás días entre semana del curso son lectivos.
CREATE TABLE dia_calendario (
  fecha              TEXT PRIMARY KEY CHECK (date(fecha) = fecha),
  curso_academico_id INTEGER NOT NULL REFERENCES curso_academico ON DELETE CASCADE,
  tipo               TEXT    NOT NULL CHECK (tipo IN ('festivo', 'no_lectivo')),
  motivo             TEXT    NOT NULL
) STRICT, WITHOUT ROWID;

-- Periodos en los que un grupo concreto no tiene clase (formación en empresa, viaje…)
CREATE TABLE grupo_sin_clase (
  id       INTEGER PRIMARY KEY,
  grupo_id INTEGER NOT NULL REFERENCES grupo ON DELETE CASCADE,
  inicio   TEXT    NOT NULL CHECK (date(inicio) = inicio),
  fin      TEXT    NOT NULL CHECK (date(fin) = fin),
  motivo   TEXT    NOT NULL,
  CHECK (fin >= inicio)
) STRICT;

-- Horario semanal fijo (para los grupos que lo tienen); de él se generan sesiones
CREATE TABLE plantilla_horaria (
  id             INTEGER PRIMARY KEY,
  grupo_id       INTEGER NOT NULL,
  curso_ciclo_id INTEGER NOT NULL,
  dia_semana     INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),   -- ISO: 1 = lunes
  franja_id      INTEGER NOT NULL REFERENCES franja_horaria,
  modulo_id      INTEGER NOT NULL,
  profesor_id    INTEGER NOT NULL REFERENCES profesor,
  aula_id        INTEGER REFERENCES aula,
  vigente_desde  TEXT    NOT NULL CHECK (date(vigente_desde) = vigente_desde),
  vigente_hasta  TEXT    NOT NULL CHECK (date(vigente_hasta) = vigente_hasta),
  CHECK (vigente_hasta >= vigente_desde),
  FOREIGN KEY (grupo_id, curso_ciclo_id)  REFERENCES grupo  (id, curso_ciclo_id) ON DELETE CASCADE,
  FOREIGN KEY (modulo_id, curso_ciclo_id) REFERENCES modulo (id, curso_ciclo_id)
) STRICT;

-- Una fila por clase real. Es la fuente de verdad del horario: en 2.º ASIR cambia cada
-- semana, así que no basta con la plantilla. Una clase puede darse a varios grupos a la
-- vez (clase conjunta, agrupamiento): los grupos que asisten van en «sesion_grupo».
CREATE TABLE sesion (
  id          INTEGER PRIMARY KEY,
  fecha       TEXT    NOT NULL CHECK (date(fecha) = fecha),
  franja_id   INTEGER NOT NULL REFERENCES franja_horaria,
  modulo_id   INTEGER NOT NULL REFERENCES modulo,
  profesor_id INTEGER NOT NULL REFERENCES profesor,
  aula_id     INTEGER REFERENCES aula,            -- NULL: sin aula (en línea, tutoría) o por confirmar
  estado      TEXT    NOT NULL DEFAULT 'prevista' CHECK (estado IN ('prevista', 'impartida', 'cancelada'))
) STRICT;
CREATE INDEX sesion_fecha    ON sesion (fecha, franja_id);
CREATE INDEX sesion_modulo   ON sesion (modulo_id);
CREATE INDEX sesion_profesor ON sesion (profesor_id, fecha);

CREATE TABLE sesion_grupo (
  sesion_id INTEGER NOT NULL REFERENCES sesion ON DELETE CASCADE,
  grupo_id  INTEGER NOT NULL REFERENCES grupo  ON DELETE CASCADE,
  PRIMARY KEY (sesion_id, grupo_id)
) STRICT, WITHOUT ROWID;
CREATE INDEX sesion_grupo_grupo ON sesion_grupo (grupo_id);

-- ============================================================
-- ASISTENCIA
-- ============================================================

-- Registro OFICIAL: lo escribe el profesor al pasar lista
CREATE TABLE falta (
  id             INTEGER PRIMARY KEY,
  sesion_id      INTEGER NOT NULL REFERENCES sesion ON DELETE CASCADE,
  alumno_id      INTEGER NOT NULL REFERENCES alumno ON DELETE CASCADE,
  tipo           TEXT    NOT NULL DEFAULT 'injustificada'
                 CHECK (tipo IN ('injustificada', 'justificada', 'retraso')),
  observaciones  TEXT,
  registrada_por INTEGER REFERENCES usuario ON DELETE SET NULL,
  registrada_en  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE (sesion_id, alumno_id)
) STRICT;
CREATE INDEX falta_alumno ON falta (alumno_id);

-- Seguimiento PERSONAL del alumno (lo que hace hoy la app). Nunca cuenta como oficial.
CREATE TABLE falta_personal (
  id        INTEGER PRIMARY KEY,
  sesion_id INTEGER NOT NULL REFERENCES sesion ON DELETE CASCADE,
  alumno_id INTEGER NOT NULL REFERENCES alumno ON DELETE CASCADE,
  creada_en TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE (sesion_id, alumno_id)
) STRICT;

-- El alumno pide justificar unas fechas; el tutor la resuelve
CREATE TABLE solicitud_justificacion (
  id            INTEGER PRIMARY KEY,
  alumno_id     INTEGER NOT NULL REFERENCES alumno ON DELETE CASCADE,
  desde         TEXT    NOT NULL CHECK (date(desde) = desde),
  hasta         TEXT    NOT NULL CHECK (date(hasta) = hasta),
  motivo        TEXT    NOT NULL,
  documento_url TEXT,
  estado        TEXT    NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  creada_en     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  resuelta_por  INTEGER REFERENCES usuario ON DELETE SET NULL,
  resuelta_en   TEXT,
  CHECK (hasta >= desde),
  -- Resuelta ⇔ tiene quién y cuándo
  CHECK ((estado = 'pendiente') = (resuelta_por IS NULL AND resuelta_en IS NULL))
) STRICT;

-- ============================================================
-- EVALUACIÓN (del profesor) Y ORGANIZACIÓN PERSONAL (del alumno)
-- ============================================================

CREATE TABLE actividad_evaluable (
  id             INTEGER PRIMARY KEY,
  grupo_id       INTEGER NOT NULL,
  modulo_id      INTEGER NOT NULL,
  curso_ciclo_id INTEGER NOT NULL,
  tipo           TEXT    NOT NULL CHECK (tipo IN ('examen', 'tarea')),
  titulo         TEXT    NOT NULL,
  descripcion    TEXT,                            -- temas del examen o enunciado de la tarea
  fecha          TEXT    NOT NULL CHECK (date(fecha) = fecha),   -- examen o entrega
  sesion_id      INTEGER REFERENCES sesion ON DELETE SET NULL,
  peso           REAL    CHECK (peso BETWEEN 0 AND 100),
  creada_por     INTEGER NOT NULL REFERENCES profesor,
  creada_en      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  FOREIGN KEY (grupo_id, curso_ciclo_id)  REFERENCES grupo  (id, curso_ciclo_id) ON DELETE CASCADE,
  FOREIGN KEY (modulo_id, curso_ciclo_id) REFERENCES modulo (id, curso_ciclo_id)
) STRICT;

CREATE TABLE calificacion (
  actividad_id INTEGER NOT NULL REFERENCES actividad_evaluable ON DELETE CASCADE,
  alumno_id    INTEGER NOT NULL REFERENCES alumno ON DELETE CASCADE,
  nota         REAL    CHECK (nota BETWEEN 0 AND 10),
  entregada    INTEGER NOT NULL DEFAULT 0 CHECK (entregada IN (0, 1)),
  entregada_en TEXT,
  PRIMARY KEY (actividad_id, alumno_id),
  CHECK (entregada = 1 OR entregada_en IS NULL)
) STRICT, WITHOUT ROWID;

-- Exámenes, tareas y notas que el alumno se apunta él mismo: en una hora (sesion_id),
-- en un día con clase (por_dia = 1) o en un día sin clase (solo fecha).
-- Sustituye a «userEvents» y «personalEvents» de la app.
CREATE TABLE registro_personal (
  id          INTEGER PRIMARY KEY,
  alumno_id   INTEGER NOT NULL REFERENCES alumno ON DELETE CASCADE,
  tipo        TEXT    NOT NULL CHECK (tipo IN ('examen', 'tarea', 'nota')),
  fecha       TEXT    NOT NULL CHECK (date(fecha) = fecha),
  sesion_id   INTEGER REFERENCES sesion ON DELETE SET NULL,
  modulo_id   INTEGER REFERENCES modulo,
  por_dia     INTEGER NOT NULL DEFAULT 0 CHECK (por_dia IN (0, 1)),
  texto       TEXT    NOT NULL,                   -- resumen de una línea
  descripcion TEXT,
  peso        REAL    CHECK (peso BETWEEN 0 AND 100),
  nota        REAL    CHECK (nota BETWEEN 0 AND 10),
  estado      TEXT    CHECK (estado IN ('pendiente', 'hecha')),
  creado_en   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  CHECK (tipo <> 'nota' OR (peso IS NULL AND nota IS NULL)),
  CHECK ((tipo = 'tarea') = (estado IS NOT NULL)),
  -- Sin módulo (día sin clase) no hay peso ni nota: es organización personal
  CHECK (modulo_id IS NOT NULL OR (peso IS NULL AND nota IS NULL))
) STRICT;
CREATE INDEX registro_personal_alumno ON registro_personal (alumno_id, fecha);

-- Recordatorios (notificaciones de la app de Android): de un examen/tarea del profesor
-- o de un registro personal, nunca de los dos
CREATE TABLE aviso (
  id                   INTEGER PRIMARY KEY,
  usuario_id           INTEGER NOT NULL REFERENCES usuario ON DELETE CASCADE,
  actividad_id         INTEGER REFERENCES actividad_evaluable ON DELETE CASCADE,
  registro_personal_id INTEGER REFERENCES registro_personal  ON DELETE CASCADE,
  CHECK ((actividad_id IS NULL) + (registro_personal_id IS NULL) = 1),
  UNIQUE (usuario_id, actividad_id),
  UNIQUE (usuario_id, registro_personal_id)
) STRICT;

-- Días de antelación de cada aviso (uno por fila: 1.ª forma normal)
CREATE TABLE aviso_dia (
  aviso_id   INTEGER NOT NULL REFERENCES aviso ON DELETE CASCADE,
  dias_antes INTEGER NOT NULL CHECK (dias_antes BETWEEN 1 AND 30),
  PRIMARY KEY (aviso_id, dias_antes)
) STRICT, WITHOUT ROWID;

-- ============================================================
-- TRIGGERS: reglas que SQLite no puede expresar con CHECK
-- ============================================================

-- Periodos de un mismo curso sin solaparse
CREATE TRIGGER periodo_sin_solape_ins BEFORE INSERT ON periodo
WHEN EXISTS (SELECT 1 FROM periodo p WHERE p.curso_academico_id = NEW.curso_academico_id
             AND p.inicio <= NEW.fin AND NEW.inicio <= p.fin)
BEGIN SELECT RAISE(ABORT, 'El periodo se solapa con otro del mismo curso'); END;

CREATE TRIGGER periodo_sin_solape_upd BEFORE UPDATE OF curso_academico_id, inicio, fin ON periodo
WHEN EXISTS (SELECT 1 FROM periodo p WHERE p.curso_academico_id = NEW.curso_academico_id AND p.id <> NEW.id
             AND p.inicio <= NEW.fin AND NEW.inicio <= p.fin)
BEGIN SELECT RAISE(ABORT, 'El periodo se solapa con otro del mismo curso'); END;

-- Periodos sin clase de un grupo sin solaparse
CREATE TRIGGER grupo_sin_clase_sin_solape BEFORE INSERT ON grupo_sin_clase
WHEN EXISTS (SELECT 1 FROM grupo_sin_clase g WHERE g.grupo_id = NEW.grupo_id
             AND g.inicio <= NEW.fin AND NEW.inicio <= g.fin)
BEGIN SELECT RAISE(ABORT, 'El periodo sin clase se solapa con otro del mismo grupo'); END;

-- Plantilla: un grupo no puede tener dos módulos en la misma franja del mismo día de la semana
CREATE TRIGGER plantilla_sin_solape BEFORE INSERT ON plantilla_horaria
WHEN EXISTS (SELECT 1 FROM plantilla_horaria p
             WHERE p.grupo_id = NEW.grupo_id AND p.dia_semana = NEW.dia_semana AND p.franja_id = NEW.franja_id
               AND p.vigente_desde <= NEW.vigente_hasta AND NEW.vigente_desde <= p.vigente_hasta)
BEGIN SELECT RAISE(ABORT, 'La plantilla ya tiene una clase en ese día y franja'); END;

-- Sesiones: nunca en un descanso ni en un festivo del centro. Ni el aula ni el profesor
-- pueden tener dos clases que se solapen en el tiempo (aunque sean de franjas de otro
-- turno). Las horas 'HH:MM' se comparan bien como texto. Se comprueba al crear la sesión
-- y al cambiarle el día, la franja, el aula, el profesor o el estado.
CREATE TRIGGER sesion_valida_ins BEFORE INSERT ON sesion
BEGIN
  SELECT RAISE(ABORT, 'Esa franja es un descanso: no admite sesiones')
  WHERE (SELECT es_descanso FROM franja_horaria WHERE id = NEW.franja_id) = 1;
  SELECT RAISE(ABORT, 'Ese día es festivo o no lectivo en el centro')
  WHERE EXISTS (SELECT 1 FROM dia_calendario d WHERE d.fecha = NEW.fecha);
  SELECT RAISE(ABORT, 'Choque de horario: el aula ya está ocupada')
  WHERE NEW.estado <> 'cancelada' AND NEW.aula_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM sesion s
    JOIN franja_horaria f  ON f.id  = s.franja_id
    JOIN franja_horaria nf ON nf.id = NEW.franja_id
    WHERE s.fecha = NEW.fecha AND s.aula_id = NEW.aula_id AND s.estado <> 'cancelada'
      AND f.inicio < nf.fin AND nf.inicio < f.fin);
  SELECT RAISE(ABORT, 'Choque de horario: el profesor ya tiene clase')
  WHERE NEW.estado <> 'cancelada' AND EXISTS (
    SELECT 1 FROM sesion s
    JOIN franja_horaria f  ON f.id  = s.franja_id
    JOIN franja_horaria nf ON nf.id = NEW.franja_id
    WHERE s.fecha = NEW.fecha AND s.profesor_id = NEW.profesor_id AND s.estado <> 'cancelada'
      AND f.inicio < nf.fin AND nf.inicio < f.fin);
END;

CREATE TRIGGER sesion_valida_upd BEFORE UPDATE OF fecha, franja_id, aula_id, profesor_id, estado ON sesion
BEGIN
  SELECT RAISE(ABORT, 'Esa franja es un descanso: no admite sesiones')
  WHERE (SELECT es_descanso FROM franja_horaria WHERE id = NEW.franja_id) = 1;
  SELECT RAISE(ABORT, 'Ese día es festivo o no lectivo en el centro')
  WHERE EXISTS (SELECT 1 FROM dia_calendario d WHERE d.fecha = NEW.fecha);
  SELECT RAISE(ABORT, 'Choque de horario: el aula ya está ocupada')
  WHERE NEW.estado <> 'cancelada' AND NEW.aula_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM sesion s
    JOIN franja_horaria f  ON f.id  = s.franja_id
    JOIN franja_horaria nf ON nf.id = NEW.franja_id
    WHERE s.id <> NEW.id AND s.fecha = NEW.fecha AND s.aula_id = NEW.aula_id AND s.estado <> 'cancelada'
      AND f.inicio < nf.fin AND nf.inicio < f.fin);
  SELECT RAISE(ABORT, 'Choque de horario: el profesor ya tiene clase')
  WHERE NEW.estado <> 'cancelada' AND EXISTS (
    SELECT 1 FROM sesion s
    JOIN franja_horaria f  ON f.id  = s.franja_id
    JOIN franja_horaria nf ON nf.id = NEW.franja_id
    WHERE s.id <> NEW.id AND s.fecha = NEW.fecha AND s.profesor_id = NEW.profesor_id AND s.estado <> 'cancelada'
      AND f.inicio < nf.fin AND nf.inicio < f.fin);
END;

-- Grupos de una sesión: el módulo es de su curso, ese día el grupo tiene clase y no
-- tiene ya otra sesión a la misma hora
CREATE TRIGGER sesion_grupo_valida BEFORE INSERT ON sesion_grupo
BEGIN
  SELECT RAISE(ABORT, 'El módulo de la sesión no pertenece al curso del grupo')
  WHERE NOT EXISTS (
    SELECT 1 FROM sesion s JOIN modulo m ON m.id = s.modulo_id JOIN grupo g ON g.id = NEW.grupo_id
    WHERE s.id = NEW.sesion_id AND m.curso_ciclo_id = g.curso_ciclo_id);
  SELECT RAISE(ABORT, 'El grupo no tiene clase ese día (periodo sin clase)')
  WHERE EXISTS (
    SELECT 1 FROM sesion s JOIN grupo_sin_clase g ON g.grupo_id = NEW.grupo_id
    WHERE s.id = NEW.sesion_id AND s.fecha BETWEEN g.inicio AND g.fin);
  SELECT RAISE(ABORT, 'Choque de horario: el grupo ya tiene clase')
  WHERE EXISTS (
    SELECT 1 FROM sesion s
    JOIN franja_horaria nf ON nf.id = s.franja_id
    JOIN sesion_grupo sg   ON sg.grupo_id = NEW.grupo_id AND sg.sesion_id <> s.id
    JOIN sesion o          ON o.id = sg.sesion_id AND o.fecha = s.fecha AND o.estado <> 'cancelada'
    JOIN franja_horaria f  ON f.id = o.franja_id
    WHERE s.id = NEW.sesion_id AND s.estado <> 'cancelada'
      AND f.inicio < nf.fin AND nf.inicio < f.fin);
END;

-- Solo se registran faltas de alumnos matriculados (y no dados de baja) en un grupo de la sesión
CREATE TRIGGER falta_matriculado BEFORE INSERT ON falta
WHEN NOT EXISTS (
  SELECT 1 FROM sesion s
  JOIN sesion_grupo sg ON sg.sesion_id = s.id
  JOIN matricula m     ON m.grupo_id = sg.grupo_id AND m.alumno_id = NEW.alumno_id
  WHERE s.id = NEW.sesion_id AND s.fecha >= m.fecha_alta AND (m.fecha_baja IS NULL OR s.fecha <= m.fecha_baja))
BEGIN SELECT RAISE(ABORT, 'El alumno no está matriculado en ningún grupo de esa sesión'); END;

CREATE TRIGGER falta_personal_matriculado BEFORE INSERT ON falta_personal
WHEN NOT EXISTS (
  SELECT 1 FROM sesion s
  JOIN sesion_grupo sg ON sg.sesion_id = s.id
  JOIN matricula m     ON m.grupo_id = sg.grupo_id AND m.alumno_id = NEW.alumno_id
  WHERE s.id = NEW.sesion_id AND s.fecha >= m.fecha_alta AND (m.fecha_baja IS NULL OR s.fecha <= m.fecha_baja))
BEGIN SELECT RAISE(ABORT, 'El alumno no está matriculado en ningún grupo de esa sesión'); END;

-- Al aprobar una justificación, las faltas injustificadas de esas fechas pasan a justificadas
CREATE TRIGGER justificacion_aprobada AFTER UPDATE OF estado ON solicitud_justificacion
WHEN NEW.estado = 'aprobada' AND OLD.estado <> 'aprobada'
BEGIN
  UPDATE falta SET tipo = 'justificada'
  WHERE alumno_id = NEW.alumno_id AND tipo = 'injustificada'
    AND sesion_id IN (SELECT id FROM sesion WHERE fecha BETWEEN NEW.desde AND NEW.hasta);
END;

-- Un registro ligado a una hora tiene la fecha y el módulo de esa sesión
CREATE TRIGGER registro_coherente_ins BEFORE INSERT ON registro_personal
WHEN NEW.sesion_id IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM sesion s WHERE s.id = NEW.sesion_id AND s.fecha = NEW.fecha AND s.modulo_id IS NEW.modulo_id)
BEGIN SELECT RAISE(ABORT, 'La fecha y el módulo del registro deben ser los de su sesión'); END;

CREATE TRIGGER registro_coherente_upd BEFORE UPDATE OF sesion_id, fecha, modulo_id ON registro_personal
WHEN NEW.sesion_id IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM sesion s WHERE s.id = NEW.sesion_id AND s.fecha = NEW.fecha AND s.modulo_id IS NEW.modulo_id)
BEGIN SELECT RAISE(ABORT, 'La fecha y el módulo del registro deben ser los de su sesión'); END;
