package com.horario.asistencia;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Alarma periódica de los avisos del campus: la red va en un hilo aparte. */
public class MoodleWatchReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context c, Intent intent) {
        if (!MoodleWatch.ACTION_CHECK.equals(intent.getAction())) return;
        PendingResult result = goAsync();
        Context app = c.getApplicationContext();
        new Thread(() -> {
            try { MoodleWatch.check(app); } finally { result.finish(); }
        }).start();
    }
}
