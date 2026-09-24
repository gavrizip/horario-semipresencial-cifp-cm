package com.horario.asistencia;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Alarma de aviso y botones de la notificación («Entregada», «Posponer»). */
public class ReminderReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context c, Intent intent) {
        String id = intent.getStringExtra(Reminders.EXTRA_ID);
        String action = intent.getAction();
        if (id == null || action == null) return;

        switch (action) {
            case Reminders.ACTION_FIRE:
                Reminders.fire(c, id);
                break;
            case Reminders.ACTION_SNOOZE:
                Reminders.snooze(c, id);
                break;
            case Reminders.ACTION_DONE:
                Reminders.markDone(c, id);
                // Si la app está abierta, la tarea se marca ya en pantalla
                MainActivity.applyNativeActions();
                break;
            default:
                break;
        }
    }
}
