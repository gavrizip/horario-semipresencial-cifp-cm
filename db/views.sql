-- ============================================================
-- Vistas: horario, horas y asistencia (SQLite)
-- ============================================================

-- Horario legible de cada grupo, una fila por clase
CREATE VIEW v_horario_grupo AS
SELECT s.id           AS sesion_id,
       sg.grupo_id,
       s.fecha,
       f.inicio,
       f.fin,
       m.codigo       AS modulo,
       m.nombre       AS modulo_nombre,
       u.nombre       AS profesor,
       coalesce(a.nombre, 'Sin aula') AS aula,
       s.estado
FROM sesion s
JOIN sesion_grupo sg  ON sg.sesion_id = s.id
JOIN franja_horaria f ON f.id = s.franja_id
JOIN modulo m         ON m.id = s.modulo_id
JOIN usuario u        ON u.id = s.profesor_id
LEFT JOIN aula a      ON a.id = s.aula_id;

-- Horas presenciales de cada módulo en cada grupo durante el curso (sin clases canceladas)
CREATE VIEW v_horas_modulo AS
SELECT sg.grupo_id, s.modulo_id, count(*) AS horas
FROM sesion s
JOIN sesion_grupo sg ON sg.sesion_id = s.id
WHERE s.estado <> 'cancelada'
GROUP BY sg.grupo_id, s.modulo_id;

-- Módulos que cursa cada matrícula: los del grupo menos los convalidados o exentos
CREATE VIEW v_matricula_modulo AS
SELECT mt.id AS matricula_id, mt.alumno_id, mt.grupo_id, h.modulo_id, h.horas
FROM matricula mt
JOIN v_horas_modulo h ON h.grupo_id = mt.grupo_id
WHERE NOT EXISTS (
  SELECT 1 FROM matricula_modulo mm
  WHERE mm.matricula_id = mt.id AND mm.modulo_id = h.modulo_id AND mm.estado IN ('convalidado', 'exento'));

-- Asistencia OFICIAL por alumno y módulo, siempre sobre el curso completo (igual que la app).
-- Cuentan las injustificadas y, según la configuración, también las justificadas; los retrasos no.
CREATE VIEW v_asistencia AS
WITH conf AS (SELECT umbral_asistencia AS umbral, cuenta_justificadas FROM configuracion),
-- El grupo de cada falta es el de la matrícula del alumno entre los grupos de la sesión
faltas AS (
  SELECT f.alumno_id, m.grupo_id, s.modulo_id, count(*) AS horas
  FROM falta f
  JOIN sesion s        ON s.id = f.sesion_id AND s.estado <> 'cancelada'
  JOIN sesion_grupo sg ON sg.sesion_id = s.id
  JOIN matricula m     ON m.grupo_id = sg.grupo_id AND m.alumno_id = f.alumno_id
  CROSS JOIN conf
  WHERE f.tipo = 'injustificada' OR (f.tipo = 'justificada' AND conf.cuenta_justificadas = 1)
  GROUP BY f.alumno_id, m.grupo_id, s.modulo_id
),
base AS (
  SELECT mm.alumno_id, mm.grupo_id, mm.modulo_id, mm.horas,
         coalesce(fa.horas, 0) AS faltas,
         -- Máximo de horas que se puede faltar: parte entera de horas × (100 − umbral) / 100
         CAST(mm.horas * (100 - conf.umbral) / 100 AS INTEGER) AS permitidas,
         conf.umbral
  FROM v_matricula_modulo mm
  CROSS JOIN conf
  LEFT JOIN faltas fa ON fa.alumno_id = mm.alumno_id AND fa.grupo_id = mm.grupo_id AND fa.modulo_id = mm.modulo_id
)
SELECT alumno_id, grupo_id, modulo_id, horas, faltas,
       max(horas - faltas, 0)                                  AS asistidas,
       CAST(round(100.0 * max(horas - faltas, 0) / horas) AS INTEGER) AS porcentaje,
       permitidas,
       permitidas - faltas                                     AS margen,
       CASE WHEN 100.0 * max(horas - faltas, 0) / horas < umbral      THEN 'riesgo'
            WHEN 100.0 * max(horas - faltas, 0) / horas < umbral + 10 THEN 'aviso'
            ELSE 'ok' END                                      AS estado
FROM base;

-- Lo mismo con el seguimiento PERSONAL del alumno (estimación mientras no haya registro oficial)
CREATE VIEW v_asistencia_personal AS
WITH conf AS (SELECT umbral_asistencia AS umbral FROM configuracion),
faltas AS (
  SELECT fp.alumno_id, m.grupo_id, s.modulo_id, count(*) AS horas
  FROM falta_personal fp
  JOIN sesion s        ON s.id = fp.sesion_id AND s.estado <> 'cancelada'
  JOIN sesion_grupo sg ON sg.sesion_id = s.id
  JOIN matricula m     ON m.grupo_id = sg.grupo_id AND m.alumno_id = fp.alumno_id
  GROUP BY fp.alumno_id, m.grupo_id, s.modulo_id
),
base AS (
  SELECT mm.alumno_id, mm.grupo_id, mm.modulo_id, mm.horas,
         coalesce(fa.horas, 0) AS faltas,
         CAST(mm.horas * (100 - conf.umbral) / 100 AS INTEGER) AS permitidas,
         conf.umbral
  FROM v_matricula_modulo mm
  CROSS JOIN conf
  LEFT JOIN faltas fa ON fa.alumno_id = mm.alumno_id AND fa.grupo_id = mm.grupo_id AND fa.modulo_id = mm.modulo_id
)
SELECT alumno_id, grupo_id, modulo_id, horas, faltas,
       max(horas - faltas, 0)                                  AS asistidas,
       CAST(round(100.0 * max(horas - faltas, 0) / horas) AS INTEGER) AS porcentaje,
       permitidas,
       permitidas - faltas                                     AS margen,
       CASE WHEN 100.0 * max(horas - faltas, 0) / horas < umbral      THEN 'riesgo'
            WHEN 100.0 * max(horas - faltas, 0) / horas < umbral + 10 THEN 'aviso'
            ELSE 'ok' END                                      AS estado
FROM base;

-- Faltas oficiales por alumno, periodo (trimestre) y módulo
CREATE VIEW v_faltas_periodo AS
SELECT f.alumno_id, p.id AS periodo_id, p.nombre AS periodo, s.modulo_id,
       sum(f.tipo = 'injustificada') AS injustificadas,
       sum(f.tipo = 'justificada')   AS justificadas,
       sum(f.tipo = 'retraso')       AS retrasos
FROM falta f
JOIN sesion s        ON s.id = f.sesion_id
JOIN sesion_grupo sg ON sg.sesion_id = s.id
JOIN matricula m     ON m.grupo_id = sg.grupo_id AND m.alumno_id = f.alumno_id
JOIN grupo g         ON g.id = m.grupo_id
JOIN periodo p       ON p.curso_academico_id = g.curso_academico_id AND s.fecha BETWEEN p.inicio AND p.fin
GROUP BY f.alumno_id, p.id, s.modulo_id;

-- Diferencias entre lo que se apunta el alumno y el registro oficial
CREATE VIEW v_faltas_discrepancias AS
SELECT fp.alumno_id, fp.sesion_id, 'solo en el registro personal' AS diferencia
FROM falta_personal fp
WHERE NOT EXISTS (SELECT 1 FROM falta f WHERE f.alumno_id = fp.alumno_id AND f.sesion_id = fp.sesion_id)
UNION ALL
SELECT f.alumno_id, f.sesion_id, 'solo en el registro oficial'
FROM falta f
WHERE f.tipo <> 'retraso'
  AND NOT EXISTS (SELECT 1 FROM falta_personal fp WHERE fp.alumno_id = f.alumno_id AND fp.sesion_id = f.sesion_id);
