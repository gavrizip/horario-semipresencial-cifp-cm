#!/usr/bin/env python3
"""Pruebas del modelo de datos (SQLite en memoria, solo biblioteca estándar).

Carga schema.sql, views.sql y seed_2asir.sql y comprueba que los datos coinciden con la
app y que la base de datos rechaza lo que debe rechazar. Uso, desde la raíz del proyecto:
    python3 db/pruebas.py
Devuelve código de salida 1 si alguna prueba falla.
"""
import sqlite3
import sys
from pathlib import Path

DB = Path(__file__).parent
fallos = 0


def nueva_bd():
    bd = sqlite3.connect(':memory:')
    bd.execute('PRAGMA foreign_keys = ON')
    for f in ('schema.sql', 'views.sql', 'seed_2asir.sql'):
        bd.executescript((DB / f).read_text())
    return bd


def ok(nombre, condicion, detalle=''):
    global fallos
    print(f"{'OK   ' if condicion else 'FALLO'}  {nombre}{f'  ({detalle})' if detalle and not condicion else ''}")
    if not condicion:
        fallos += 1


def rechaza(nombre, bd, sql, params=(), contiene=''):
    """La sentencia debe fallar (y, si se indica, con ese mensaje)."""
    try:
        bd.execute('SAVEPOINT p')
        bd.execute(sql, params)
        ok(nombre, False, 'se aceptó')
    except sqlite3.DatabaseError as e:
        ok(nombre, contiene.lower() in str(e).lower(), str(e))
    finally:
        bd.execute('ROLLBACK TO p')
        bd.execute('RELEASE p')


def uno(bd, sql, params=()):
    return bd.execute(sql, params).fetchone()


def sesion(bd, grupo, fecha, modulo):
    """Id de la sesión de ese módulo, ese día, para ese grupo."""
    return uno(bd, """SELECT s.id FROM sesion s
                      JOIN sesion_grupo sg ON sg.sesion_id = s.id
                      JOIN grupo g ON g.id = sg.grupo_id
                      JOIN modulo m ON m.id = s.modulo_id
                      WHERE g.nombre = ? AND s.fecha = ? AND m.codigo = ?
                      ORDER BY s.franja_id LIMIT 1""", (grupo, fecha, modulo))[0]


def asistencia(bd, vista, alumno, modulo):
    return uno(bd, f"""SELECT a.horas, a.faltas, a.porcentaje, a.margen, a.estado FROM {vista} a
                       JOIN modulo m ON m.id = a.modulo_id WHERE a.alumno_id = ? AND m.codigo = ?""",
               (alumno, modulo))


bd = nueva_bd()
ALUMNO_A = uno(bd, "SELECT usuario_id FROM alumno WHERE nia = 'PRUEBA-A'")[0]
ALUMNO_B = uno(bd, "SELECT usuario_id FROM alumno WHERE nia = 'PRUEBA-B'")[0]
JEFATURA = uno(bd, "SELECT id FROM usuario WHERE email = 'jefatura@cifp.example'")[0]

print('— Carga y datos')
ok('sin claves ajenas rotas', bd.execute('PRAGMA foreign_key_check').fetchall() == [])
horas = dict(((g, m), h) for g, m, h in bd.execute(
    """SELECT g.nombre, m.codigo, h.horas FROM v_horas_modulo h
       JOIN grupo g ON g.id = h.grupo_id JOIN modulo m ON m.id = h.modulo_id"""))
# Horas presenciales del PDF oficial del curso (2ASIR-SEMI-1), iguales en los dos grupos
pdf = {'ADD': 26, 'ADE': 10, 'CC3': 10, 'EIB': 14, 'IMW': 21, 'IPW': 14, 'SGY': 26, 'SOJ': 5, 'SRD': 26}
esperadas = {(g, m): h for g in 'AB' for m, h in pdf.items()}
ok('horas por módulo iguales que en el PDF', horas == esperadas,
   str({k: (horas.get(k), v) for k, v in esperadas.items() if horas.get(k) != v}))
por_confirmar = uno(bd, "SELECT count(*) FROM sesion s JOIN modulo m ON m.id = s.modulo_id WHERE s.aula_id IS NULL AND m.codigo NOT IN ('IPW', 'TUO')")[0]
ok('3 clases con el aula por confirmar (Aula 235 ocupada por el otro grupo)', por_confirmar == 3, str(por_confirmar))

print('— Asistencia (mismo cálculo que la app)')
ok('SOJ al 100 % sin faltas', asistencia(bd, 'v_asistencia', ALUMNO_A, 'SOJ') == (5, 0, 100, 1, 'ok'),
   str(asistencia(bd, 'v_asistencia', ALUMNO_A, 'SOJ')))
soj = sesion(bd, 'A', '2027-05-05', 'SOJ')
bd.execute('INSERT INTO falta (sesion_id, alumno_id, registrada_por) VALUES (?, ?, ?)', (soj, ALUMNO_A, JEFATURA))
ok('una falta en SOJ (5 h en el curso): 80 %, sin margen',
   asistencia(bd, 'v_asistencia', ALUMNO_A, 'SOJ') == (5, 1, 80, 0, 'aviso'),
   str(asistencia(bd, 'v_asistencia', ALUMNO_A, 'SOJ')))
imw = sesion(bd, 'A', '2026-09-23', 'IMW')
bd.execute('INSERT INTO falta_personal (sesion_id, alumno_id) VALUES (?, ?)', (imw, ALUMNO_A))
ok('IMW 21 h con una falta personal: 95 %, margen 3 (como la app)',
   asistencia(bd, 'v_asistencia_personal', ALUMNO_A, 'IMW') == (21, 1, 95, 3, 'ok'),
   str(asistencia(bd, 'v_asistencia_personal', ALUMNO_A, 'IMW')))
ok('la falta personal no cuenta como oficial', asistencia(bd, 'v_asistencia', ALUMNO_A, 'IMW')[1] == 0)
dif = bd.execute('SELECT sesion_id, diferencia FROM v_faltas_discrepancias WHERE alumno_id = ? ORDER BY sesion_id',
                 (ALUMNO_A,)).fetchall()
ok('discrepancias personal / oficial', dif == sorted([(imw, 'solo en el registro personal'), (soj, 'solo en el registro oficial')]), str(dif))
periodo = uno(bd, """SELECT v.periodo, v.injustificadas FROM v_faltas_periodo v JOIN modulo m ON m.id = v.modulo_id
                     WHERE v.alumno_id = ? AND m.codigo = 'SOJ'""", (ALUMNO_A,))
ok('la falta del 5 may cae en el 3.er trimestre', periodo == ('3.er trimestre', 1), str(periodo))

print('— Justificaciones')
bd.execute("""INSERT INTO solicitud_justificacion (id, alumno_id, desde, hasta, motivo)
              VALUES (1, ?, '2027-05-05', '2027-05-05', 'Cita médica')""", (ALUMNO_A,))
bd.execute("""UPDATE solicitud_justificacion SET estado = 'aprobada', resuelta_por = ?,
              resuelta_en = '2027-05-06T10:00:00Z' WHERE id = 1""", (JEFATURA,))
ok('aprobar la solicitud justifica la falta',
   uno(bd, 'SELECT tipo FROM falta WHERE sesion_id = ? AND alumno_id = ?', (soj, ALUMNO_A))[0] == 'justificada')
ok('con «cuenta_justificadas» sigue contando', asistencia(bd, 'v_asistencia', ALUMNO_A, 'SOJ')[2] == 80)
bd.execute('UPDATE configuracion SET cuenta_justificadas = 0')
ok('sin «cuenta_justificadas» vuelve al 100 %', asistencia(bd, 'v_asistencia', ALUMNO_A, 'SOJ')[2] == 100)
bd.execute('UPDATE configuracion SET cuenta_justificadas = 1')
rechaza('solicitud resuelta sin quién ni cuándo', bd,
        "UPDATE solicitud_justificacion SET estado = 'rechazada', resuelta_por = NULL, resuelta_en = NULL WHERE id = 1",
        contiene='CHECK')

print('— Horario: choques y calendario')
s = uno(bd, "SELECT fecha, franja_id, modulo_id, profesor_id, aula_id FROM sesion WHERE aula_id IS NOT NULL LIMIT 1")
otro_prof = uno(bd, 'SELECT usuario_id FROM profesor WHERE usuario_id <> ? LIMIT 1', (s[3],))[0]
rechaza('misma aula a la misma hora', bd,
        'INSERT INTO sesion (fecha, franja_id, modulo_id, profesor_id, aula_id) VALUES (?, ?, ?, ?, ?)',
        (s[0], s[1], s[2], otro_prof, s[4]), contiene='aula ya está ocupada')
rechaza('mismo profesor a la misma hora', bd,
        'INSERT INTO sesion (fecha, franja_id, modulo_id, profesor_id) VALUES (?, ?, ?, ?)',
        (s[0], s[1], s[2], s[3]), contiene='profesor ya tiene clase')
rechaza('clase en el descanso', bd,
        "INSERT INTO sesion (fecha, franja_id, modulo_id, profesor_id) VALUES ('2026-09-23', 4, 1, ?)",
        (otro_prof,), contiene='descanso')
rechaza('clase en un festivo (Reyes)', bd,
        "INSERT INTO sesion (fecha, franja_id, modulo_id, profesor_id) VALUES ('2027-01-06', 1, 1, ?)",
        (otro_prof,), contiene='festivo')
# Clase nueva el 23 sep en la 1.ª hora, con un profesor libre: el grupo A ya tiene IMW
libre = uno(bd, """SELECT usuario_id FROM profesor WHERE usuario_id NOT IN
                   (SELECT profesor_id FROM sesion WHERE fecha = '2026-09-23' AND franja_id = 1) LIMIT 1""")[0]
bd.execute("INSERT INTO sesion (id, fecha, franja_id, modulo_id, profesor_id) VALUES (9999, '2026-09-23', 1, 1, ?)", (libre,))
rechaza('un grupo con dos clases a la vez', bd,
        'INSERT INTO sesion_grupo (sesion_id, grupo_id) VALUES (9999, 1)', contiene='grupo ya tiene clase')
bd.execute('DELETE FROM sesion WHERE id = 9999')
rechaza('trimestres solapados', bd,
        "INSERT INTO periodo (curso_academico_id, orden, nombre, inicio, fin) VALUES (1, 4, 'Extra', '2027-04-01', '2027-05-01')",
        contiene='solapa')

print('— Faltas y matrícula')
rechaza('falta de un alumno que no es del grupo', bd,
        'INSERT INTO falta (sesion_id, alumno_id) VALUES (?, ?)', (soj, ALUMNO_B), contiene='matriculado')
rechaza('dos faltas en la misma sesión', bd,
        'INSERT INTO falta (sesion_id, alumno_id) VALUES (?, ?)', (soj, ALUMNO_A), contiene='UNIQUE')
# Clase conjunta A+B: el 16 jun ninguno de los dos grupos tiene la 3.ª hora
bd.execute("""INSERT INTO sesion (id, fecha, franja_id, modulo_id, profesor_id)
              VALUES (9998, '2027-06-16', 3, (SELECT id FROM modulo WHERE codigo = 'CC3'),
                      (SELECT profesor_id FROM imparticion i JOIN modulo m ON m.id = i.modulo_id WHERE m.codigo = 'CC3' LIMIT 1))""")
bd.executemany('INSERT INTO sesion_grupo (sesion_id, grupo_id) VALUES (9998, ?)', [(1,), (2,)])
ok('clase conjunta A+B', uno(bd, 'SELECT count(*) FROM sesion_grupo WHERE sesion_id = 9998')[0] == 2)
bd.execute('INSERT INTO falta (sesion_id, alumno_id) VALUES (9998, ?)', (ALUMNO_B,))
ok('falta de B en la clase conjunta A+B', True)

print('— Registros personales y avisos')
rechaza('registro de una hora con otra fecha', bd,
        "INSERT INTO registro_personal (alumno_id, tipo, fecha, sesion_id, modulo_id, texto) VALUES (?, 'nota', '2026-10-01', ?, (SELECT modulo_id FROM sesion WHERE id = ?), 'x')",
        (ALUMNO_A, imw, imw), contiene='su sesión')
rechaza('nota personal con calificación', bd,
        "INSERT INTO registro_personal (alumno_id, tipo, fecha, texto, nota) VALUES (?, 'nota', '2026-10-03', 'x', 7)",
        (ALUMNO_A,), contiene='CHECK')
rechaza('tarea sin estado', bd,
        "INSERT INTO registro_personal (alumno_id, tipo, fecha, texto) VALUES (?, 'tarea', '2026-10-03', 'x')",
        (ALUMNO_A,), contiene='CHECK')
bd.execute("INSERT INTO registro_personal (id, alumno_id, tipo, fecha, texto, estado) VALUES (1, ?, 'tarea', '2026-10-03', 'Comprar material', 'pendiente')",
           (ALUMNO_A,))
ok('tarea personal en un sábado sin clase', True)
rechaza('aviso sin destino', bd, 'INSERT INTO aviso (usuario_id) VALUES (?)', (ALUMNO_A,), contiene='CHECK')
bd.execute('INSERT INTO aviso (id, usuario_id, registro_personal_id) VALUES (1, ?, 1)', (ALUMNO_A,))
rechaza('aviso con 45 días de antelación', bd, 'INSERT INTO aviso_dia VALUES (1, 45)', contiene='CHECK')

print('— Tipos (tablas STRICT) y formatos')
rechaza('fecha con formato inválido', bd,
        "INSERT INTO dia_calendario VALUES ('2027-02-30', 1, 'festivo', 'x')", contiene='CHECK')
rechaza('texto en una columna numérica', bd,
        "UPDATE configuracion SET umbral_asistencia = 'ochenta'", contiene='cannot store')

print()
print('Todas las pruebas superadas' if not fallos else f'{fallos} prueba(s) fallida(s)')
sys.exit(1 if fallos else 0)
