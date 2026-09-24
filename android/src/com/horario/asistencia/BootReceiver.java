package com.horario.asistencia;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Las alarmas se borran al reiniciar o al actualizar la app: se vuelven a programar. */
public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context c, Intent intent) {
        String a = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(a) || Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)) {
            Reminders.rescheduleAll(c);
        }
    }
}
