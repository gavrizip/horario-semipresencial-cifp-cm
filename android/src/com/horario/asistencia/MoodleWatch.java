package com.horario.asistencia;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.SystemClock;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Avisos del campus en segundo plano: cada ~3 h mira las tareas del curso escolar y avisa de
 * las nuevas y de los cambios de fecha. Compara con una «foto» {id → fecha de entrega} guardada
 * aquí; la primera vez solo la guarda. La página manda el estado (moodleWatchState): si está
 * activado, el curso escolar, la asignatura de cada curso y las tareas que ya se han visto.
 */
final class MoodleWatch {

    static final String ACTION_CHECK = "com.horario.asistencia.CAMPUS_CHECK";
    static final String EXTRA_OPEN_CAMPUS = "openCampus";
    private static final String PREFS = "moodle_watch";
    private static final String CHANNEL = "campus";
    private static final long EVERY = 3 * AlarmManager.INTERVAL_HOUR;
    private static final int NOTIFICATION_ID = 0x6d6f6f;

    private MoodleWatch() {}

    private static SharedPreferences prefs(Context c) { return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }

    private static PendingIntent alarmIntent(Context c) {
        Intent i = new Intent(c, MoodleWatchReceiver.class).setAction(ACTION_CHECK);
        return PendingIntent.getBroadcast(c, 1, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Programa la comprobación periódica (inexacta: no necesita permiso y respeta la batería). */
    static void schedule(Context c) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        if (!prefs(c).getBoolean("enabled", false) || !Moodle.connected(c)) { am.cancel(alarmIntent(c)); return; }
        am.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + EVERY, EVERY, alarmIntent(c));
    }

    /** Estado desde la página: {enabled, from, to, map: {curso: código}, seen?: {tarea: fecha}}. */
    static void setState(Context c, String json) {
        try {
            JSONObject s = new JSONObject(json);
            SharedPreferences.Editor e = prefs(c).edit()
                .putBoolean("enabled", s.optBoolean("enabled"))
                .putLong("from", s.optLong("from"))
                .putLong("to", s.optLong("to"))
                .putString("map", s.optJSONObject("map") != null ? s.getJSONObject("map").toString() : "{}");
            // Lo que ya se ha visto en la app no se avisa: entra en la foto (y la crea si no había)
            JSONObject seen = s.optJSONObject("seen");
            if (seen != null) {
                Map<String, Long> snap = snapshot(c);
                if (snap == null) snap = new HashMap<>();
                for (Iterator<String> it = seen.keys(); it.hasNext(); ) {
                    String k = it.next();
                    snap.put(k, seen.optLong(k));
                }
                e.putString("snapshot", new JSONObject(snap).toString());
            }
            e.apply();
        } catch (Exception ignored) {}
        schedule(c);
    }

    /** Al desconectar: sin alarma ni foto. */
    static void clear(Context c) {
        c.getSystemService(AlarmManager.class).cancel(alarmIntent(c));
        prefs(c).edit().clear().apply();
    }

    private static Map<String, Long> snapshot(Context c) {
        String raw = prefs(c).getString("snapshot", null);
        if (raw == null) return null;
        Map<String, Long> m = new HashMap<>();
        try {
            JSONObject o = new JSONObject(raw);
            for (Iterator<String> it = o.keys(); it.hasNext(); ) { String k = it.next(); m.put(k, o.optLong(k)); }
        } catch (Exception ignored) {}
        return m;
    }

    /** Comprobación (en un hilo aparte). Devuelve cuántas novedades ha avisado, o -1 si no se pudo. */
    static int check(Context c) {
        SharedPreferences p = prefs(c);
        if (!p.getBoolean("enabled", false) || !Moodle.connected(c)) return -1;
        try {
            JSONObject site = new JSONObject(Moodle.call(c, "core_webservice_get_site_info", "{}"));
            if (site.has("exception")) return -1;
            String coursesRaw = Moodle.call(c, "core_enrol_get_users_courses", new JSONObject().put("userid", site.optLong("userid")).toString());
            if (!coursesRaw.trim().startsWith("[")) return -1;
            JSONArray courses = new JSONArray(coursesRaw);
            JSONObject args = new JSONObject();
            Map<String, String> courseName = new HashMap<>();
            for (int i = 0; i < courses.length(); i++) {
                JSONObject co = courses.getJSONObject(i);
                args.put("courseids[" + i + "]", co.optLong("id"));
                courseName.put(String.valueOf(co.optLong("id")), co.optString("fullname"));
            }
            if (courses.length() == 0) return 0;
            JSONObject res = new JSONObject(Moodle.call(c, "mod_assign_get_assignments", args.toString()));
            if (res.has("exception")) return -1;

            long from = p.getLong("from", 0), to = p.getLong("to", Long.MAX_VALUE);
            Map<String, Long> now = new HashMap<>();
            Map<String, String[]> info = new HashMap<>();   // id → {nombre, curso}
            JSONArray rc = res.optJSONArray("courses");
            for (int i = 0; rc != null && i < rc.length(); i++) {
                JSONObject co = rc.getJSONObject(i);
                JSONArray as = co.optJSONArray("assignments");
                for (int j = 0; as != null && j < as.length(); j++) {
                    JSONObject a = as.getJSONObject(j);
                    long due = a.optLong("duedate");
                    if (due == 0 || due < from || due > to) continue;
                    String id = String.valueOf(a.optLong("id"));
                    now.put(id, due);
                    info.put(id, new String[]{a.optString("name"), String.valueOf(co.optLong("id"))});
                }
            }

            List<String[]> changes = CampusDiff.diff(snapshot(c), now, System.currentTimeMillis() / 1000);
            p.edit().putString("snapshot", new JSONObject(now).toString()).apply();
            if (!changes.isEmpty()) notify(c, changes, now, info, courseName);
            return changes.size();
        } catch (Exception e) {
            return -1;
        }
    }

    private static String when(long sec) {
        return new SimpleDateFormat("EEE d MMM · HH:mm", new Locale("es", "ES")).format(new Date(sec * 1000)).replace(".", "");
    }

    private static void notify(Context c, List<String[]> changes, Map<String, Long> due, Map<String, String[]> info, Map<String, String> courseName) {
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        NotificationChannel ch = new NotificationChannel(CHANNEL, "Campus", NotificationManager.IMPORTANCE_DEFAULT);
        ch.setDescription("Tareas nuevas y cambios de fecha en el campus");
        nm.createNotificationChannel(ch);

        JSONObject map;
        try { map = new JSONObject(prefs(c).getString("map", "{}")); } catch (Exception e) { map = new JSONObject(); }
        String[] lines = new String[changes.size()];
        for (int i = 0; i < changes.size(); i++) {
            String id = changes.get(i)[1];
            String[] a = info.get(id);
            String code = map.optString(a[1], "");
            String subject = code.isEmpty() || "null".equals(code) ? courseName.getOrDefault(a[1], "") : code;
            boolean moved = CampusDiff.MOVED.equals(changes.get(i)[0]);
            lines[i] = (moved ? "Cambio de fecha en " : "Nueva tarea de ") + subject + " · " + a[0] + " · " + (moved ? "ahora " : "") + when(due.get(id));
        }

        Intent open = new Intent(c, MainActivity.class).putExtra(EXTRA_OPEN_CAMPUS, true)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(c, NOTIFICATION_ID, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder b = new Notification.Builder(c, CHANNEL)
            .setSmallIcon(R.drawable.ic_stat)
            .setColor(0xFFE7A94D)
            .setContentIntent(pi)
            .setAutoCancel(true);
        if (lines.length == 1) {
            String[] parts = lines[0].split(" · ", 2);
            b.setContentTitle(parts[0]).setContentText(parts[1]).setStyle(new Notification.BigTextStyle().bigText(parts[1]));
        } else {
            Notification.InboxStyle style = new Notification.InboxStyle();
            for (String l : lines) style.addLine(l);
            b.setContentTitle(lines.length + " novedades en el campus").setContentText(lines[0]).setStyle(style);
        }
        nm.notify(NOTIFICATION_ID, b.build());
    }
}
