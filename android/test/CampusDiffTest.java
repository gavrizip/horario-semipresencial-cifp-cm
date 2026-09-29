package com.horario.asistencia;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * Prueba de CampusDiff (avisos del campus) con el JDK, sin Android. Desde la raíz del proyecto:
 *   javac -d /tmp/cd android/src/com/horario/asistencia/CampusDiff.java android/test/CampusDiffTest.java
 *   java -cp /tmp/cd com.horario.asistencia.CampusDiffTest
 */
public class CampusDiffTest {
    public static void main(String[] args) {
        long now = 1_000_000;
        Map<String, Long> cur = new HashMap<>(Map.of("1", now + 100, "2", now + 200, "3", now - 50, "4", now + 300));
        check(CampusDiff.diff(null, cur, now).isEmpty(), "primera comprobación: no avisa de nada");
        Map<String, Long> before = new HashMap<>(Map.of("1", now + 100, "2", now + 999, "3", now - 60));
        Set<String> got = new TreeSet<>();
        for (String[] x : CampusDiff.diff(before, cur, now)) got.add(x[0] + ":" + x[1]);
        check(got.equals(new TreeSet<>(List.of("moved:2", "new:4"))), "tarea nueva y cambio de fecha; la vencida no avisa: " + got);
        check(CampusDiff.diff(cur, cur, now).isEmpty(), "sin cambios: no avisa");
        System.out.println("CampusDiff: todas las pruebas superadas");
    }

    private static void check(boolean ok, String msg) {
        if (!ok) throw new AssertionError(msg);
        System.out.println("ok · " + msg);
    }
}
