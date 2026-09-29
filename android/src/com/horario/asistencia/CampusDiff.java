package com.horario.asistencia;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Qué ha cambiado en el campus entre dos comprobaciones: tareas nuevas y cambios de fecha.
 * Sin dependencias de Android para poder probarla con el JDK a secas.
 */
final class CampusDiff {

    static final String NEW = "new";
    static final String MOVED = "moved";

    private CampusDiff() {}

    /**
     * before: foto anterior {id de la tarea → fecha de entrega (s)}, o null si es la primera
     * comprobación (entonces no se avisa de nada). Solo cuentan las entregas que aún no han pasado.
     * Devuelve pares {tipo, id}.
     */
    static List<String[]> diff(Map<String, Long> before, Map<String, Long> now, long nowSec) {
        List<String[]> out = new ArrayList<>();
        if (before == null) return out;
        for (Map.Entry<String, Long> e : now.entrySet()) {
            long due = e.getValue();
            if (due <= nowSec) continue;
            Long old = before.get(e.getKey());
            if (old == null) out.add(new String[]{NEW, e.getKey()});
            else if (old != due) out.add(new String[]{MOVED, e.getKey()});
        }
        return out;
    }
}
