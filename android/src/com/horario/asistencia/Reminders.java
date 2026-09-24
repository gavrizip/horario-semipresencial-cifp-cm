package com.horario.asistencia;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Icon;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Avisos de exámenes y tareas. La página manda la lista completa (syncReminders) cada vez
 * que cambian los registros; aquí se guarda y se programa una alarma por registro con la
 * próxima hora de aviso. Las tareas se repiten cada día desde el primer aviso hasta que se
 * marcan como entregadas.
 */
final class Reminders {

    static final String ACTION_FIRE = "com.horario.asistencia.FIRE";
    static final String ACTION_DONE = "com.horario.asistencia.DONE";
    static final String ACTION_SNOOZE = "com.horario.asistencia.SNOOZE";
    static final String EXTRA_ID = "id";

    private static final String PREFS = "reminders";
    private static final String KEY_LIST = "list";
    private static final String KEY_DONE = "done";
    private static final String CHANNEL = "recordatorios";
    private static final long SNOOZE_MS = 60 * 60 * 1000L;   // Posponer: 1 hora
    private static final long DAY_MS = 24 * 60 * 60 * 1000L;

    private Reminders() {}

    private static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static JSONArray load(Context c) {
        try {
            return new JSONArray(prefs(c).getString(KEY_LIST, "[]"));
        } catch (JSONException e) {
            return new JSONArray();
        }
    }

    private static void save(Context c, JSONArray list) {
        prefs(c).edit().putString(KEY_LIST, list.toString()).apply();
    }

    static JSONObject find(Context c, String id) {
        JSONArray list = load(c);
        for (int i = 0; i < list.length(); i++) {
            JSONObject r = list.optJSONObject(i);
            if (r != null && id.equals(r.optString("id"))) return r;
        }
        return null;
    }

    /** Sustituye la lista: cancela lo que ya no está y programa todo lo demás. */
    static void sync(Context c, String json) {
        JSONArray next;
        try {
            next = new JSONArray(json);
        } catch (JSONException e) {
            return;
        }
        JSONArray old = load(c);
        for (int i = 0; i < old.length(); i++) {
            String id = old.optJSONObject(i).optString("id");
            if (indexOf(next, id) < 0) {
                cancelAlarm(c, id);
                nm(c).cancel(id.hashCode());
            }
        }
        save(c, next);
        rescheduleAll(c);
    }

    static void rescheduleAll(Context c) {
        JSONArray list = load(c);
        long now = System.currentTimeMillis();
        for (int i = 0; i < list.length(); i++) {
            JSONObject r = list.optJSONObject(i);
            long at = nextTime(r, now);
            if (at > 0) setAlarm(c, r.optString("id"), at);
            else cancelAlarm(c, r.optString("id"));
        }
    }

    /** Próximo aviso después de "now", o -1 si ya no quedan. */
    static long nextTime(JSONObject r, long now) {
        JSONArray times = r.optJSONArray("times");
        if (times == null || times.length() == 0) return -1;
        long first = Long.MAX_VALUE, next = Long.MAX_VALUE;
        for (int i = 0; i < times.length(); i++) {
            long t = times.optLong(i);
            first = Math.min(first, t);
            if (t > now) next = Math.min(next, t);
        }
        if (r.optBoolean("repeat") && now >= first) {
            // Tarea sin entregar: cada día a la hora de aviso
            Calendar cal = Calendar.getInstance();
            cal.setTimeInMillis(now);
            cal.set(Calendar.HOUR_OF_DAY, r.optInt("hour", 10));
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            if (cal.getTimeInMillis() <= now) cal.add(Calendar.DAY_OF_MONTH, 1);
            return cal.getTimeInMillis();
        }
        return next == Long.MAX_VALUE ? -1 : next;
    }

    /** Suena la alarma: muestra el aviso y programa el siguiente. */
    static void fire(Context c, String id) {
        JSONObject r = find(c, id);
        if (r == null) return;
        show(c, r);
        long at = nextTime(r, System.currentTimeMillis() + 60_000L);
        if (at > 0) setAlarm(c, id, at);
    }

    static void snooze(Context c, String id) {
        nm(c).cancel(id.hashCode());
        if (find(c, id) != null) setAlarm(c, id, System.currentTimeMillis() + SNOOZE_MS);
    }

    /** «Entregada» desde la notificación: deja de avisar y lo apunta para la página. */
    static void markDone(Context c, String id) {
        nm(c).cancel(id.hashCode());
        cancelAlarm(c, id);
        JSONArray list = load(c);
        int i = indexOf(list, id);
        if (i >= 0) {
            list.remove(i);
            save(c, list);
        }
        JSONArray done = doneIds(c);
        if (indexOf(done, id) < 0) done.put(id);
        prefs(c).edit().putString(KEY_DONE, done.toString()).apply();
    }

    private static JSONArray doneIds(Context c) {
        try {
            return new JSONArray(prefs(c).getString(KEY_DONE, "[]"));
        } catch (JSONException e) {
            return new JSONArray();
        }
    }

    /** Entrega a la página las tareas marcadas desde notificaciones y vacía la cola. */
    static String takeDoneIds(Context c) {
        String out = doneIds(c).toString();
        prefs(c).edit().remove(KEY_DONE).apply();
        return out;
    }

    private static int indexOf(JSONArray arr, String id) {
        for (int i = 0; i < arr.length(); i++) {
            Object o = arr.opt(i);
            String v = o instanceof JSONObject ? ((JSONObject) o).optString("id") : String.valueOf(o);
            if (id.equals(v)) return i;
        }
        return -1;
    }

    // ---------- Alarmas ----------

    private static PendingIntent receiverIntent(Context c, String action, String id) {
        Intent i = new Intent(c, ReminderReceiver.class).setAction(action).putExtra(EXTRA_ID, id);
        int code = (action + id).hashCode();
        return PendingIntent.getBroadcast(c, code, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static void setAlarm(Context c, String id, long at) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        PendingIntent pi = receiverIntent(c, ACTION_FIRE, id);
        if (Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms()) {
            am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        } else {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        }
    }

    private static void cancelAlarm(Context c, String id) {
        c.getSystemService(AlarmManager.class).cancel(receiverIntent(c, ACTION_FIRE, id));
    }

    // ---------- Notificación ----------

    private static NotificationManager nm(Context c) {
        return c.getSystemService(NotificationManager.class);
    }

    private static void ensureChannel(Context c) {
        NotificationChannel ch = new NotificationChannel(CHANNEL, "Exámenes y tareas", NotificationManager.IMPORTANCE_HIGH);
        ch.setDescription("Avisos antes de un examen o de la entrega de una tarea");
        nm(c).createNotificationChannel(ch);
    }

    /** Días naturales que faltan hasta la fecha (negativo si ya pasó). */
    private static int daysUntil(long due) {
        Calendar a = Calendar.getInstance();
        Calendar b = Calendar.getInstance();
        b.setTimeInMillis(due);
        for (Calendar k : new Calendar[]{a, b}) {
            k.set(Calendar.HOUR_OF_DAY, 12);
            k.set(Calendar.MINUTE, 0);
            k.set(Calendar.SECOND, 0);
            k.set(Calendar.MILLISECOND, 0);
        }
        return (int) Math.round((b.getTimeInMillis() - a.getTimeInMillis()) / (double) DAY_MS);
    }

    static void show(Context c, JSONObject r) {
        ensureChannel(c);
        String id = r.optString("id");
        boolean task = "task".equals(r.optString("kind"));
        String code = r.optString("code");
        int days = daysUntil(r.optLong("due"));

        String rel = days > 1 ? "en " + days + " días" : days == 1 ? "mañana" : days == 0 ? "hoy" : null;
        String title;
        // Las tareas personales (días sin clase) no tienen asignatura
        String of = code.isEmpty() ? "" : " de " + code;
        if (task) title = rel != null ? "Entrega" + of + " " + rel : "Entrega" + of + " atrasada";
        else title = "Examen de " + code + " " + (rel != null ? rel : "");
        String what = r.optString("what");
        String body = (what.isEmpty() ? "" : what + " · ") + r.optString("when");

        Intent open = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent contentPi = PendingIntent.getActivity(c, id.hashCode(), open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Icon icon = Icon.createWithResource(c, R.drawable.ic_stat);

        Notification.Builder b = new Notification.Builder(c, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat)
                .setColor(0xFFE7A94D)
                .setContentTitle(title.trim())
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setContentIntent(contentPi)
                .setAutoCancel(true)
                .setCategory(Notification.CATEGORY_REMINDER);
        if (task) {
            b.addAction(new Notification.Action.Builder(icon, "Entregada", receiverIntent(c, ACTION_DONE, id)).build());
        }
        b.addAction(new Notification.Action.Builder(icon, "Posponer", receiverIntent(c, ACTION_SNOOZE, id)).build());
        nm(c).notify(id.hashCode(), b.build());
    }
}
