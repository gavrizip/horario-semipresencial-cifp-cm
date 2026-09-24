package com.horario.asistencia;

import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationAttributes;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.lang.ref.WeakReference;

/** Muestra la página incluida en assets/www a pantalla completa, sin red. */
public class MainActivity extends Activity {

    private static final String START_URL = "file:///android_asset/www/horario.html";

    private WebView web;
    private boolean askedNotifications;
    private static WeakReference<MainActivity> current = new WeakReference<>(null);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        current = new WeakReference<>(this);

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#1c1512"));
        // El menú de la asignatura lo abre la propia página; sin selección de texto nativa
        web.setOnLongClickListener(v -> true);
        web.setLongClickable(false);
        web.setHapticFeedbackEnabled(false);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);   // localStorage: faltas, exámenes, notas, tema
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);

        web.addJavascriptInterface(new Bridge(), "AndroidApp");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                // Nada fuera de la app
                return !req.getUrl().toString().startsWith("file:///android_asset/");
            }
        });

        setContentView(web);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(START_URL);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    /** Atrás cierra primero la ayuda, el diálogo o el menú abierto; si no hay ninguno, sale. */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        String js = "(function(){"
            + "var p=document.querySelector(':popover-open');"
            + "if(p){p.hidePopover();return true;}"
            + "var d=document.querySelector('dialog[open]');"
            + "if(d){d.dispatchEvent(new Event('cancel',{cancelable:true}));return true;}"
            + "var m=document.getElementById('ctxMenu');"
            + "if(m&&!m.hidden){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return true;}"
            + "return false;})()";
        web.evaluateJavascript(js, handled -> {
            if (!"true".equals(handled)) finish();
        });
    }

    /** Al volver a la app se aplican las tareas marcadas como entregadas desde notificaciones. */
    @Override
    protected void onResume() {
        super.onResume();
        applyNativeActions();
    }

    static void applyNativeActions() {
        MainActivity a = current.get();
        if (a == null || a.web == null) return;
        a.runOnUiThread(() -> a.web.evaluateJavascript("window.applyNativeActions && applyNativeActions()", null));
    }

    @Override
    protected void onDestroy() {
        if (web != null) web.destroy();
        super.onDestroy();
    }

    /** Android 13+: pedir permiso de notificaciones la primera vez que hay avisos. */
    private void askNotificationPermission() {
        if (Build.VERSION.SDK_INT < 33 || askedNotifications) return;
        if (checkSelfPermission("android.permission.POST_NOTIFICATIONS") == PackageManager.PERMISSION_GRANTED) return;
        askedNotifications = true;
        requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 1);
    }

    private void applyBars(boolean light) {
        Window w = getWindow();
        int color = Color.parseColor(light ? "#e6d7bd" : "#1c1512");
        w.setStatusBarColor(color);
        w.setNavigationBarColor(color);
        web.setBackgroundColor(color);
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = w.getInsetsController();
            if (c != null) {
                int mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                         | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                c.setSystemBarsAppearance(light ? mask : 0, mask);
            }
        } else {
            View d = w.getDecorView();
            int flags = d.getSystemUiVisibility();
            int mask = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            d.setSystemUiVisibility(light ? (flags | mask) : (flags & ~mask));
        }
    }

    /** Llamado desde la página (window.AndroidApp) cuando cambia el tema. */
    private class Bridge {
        /** Lista completa de avisos calculada por la página (JSON). */
        @JavascriptInterface
        public void syncReminders(String json) {
            Reminders.sync(getApplicationContext(), json);
            if (json.length() > 2) runOnUiThread(MainActivity.this::askNotificationPermission);
        }

        @JavascriptInterface
        public String takeDoneIds() {
            return Reminders.takeDoneIds(getApplicationContext());
        }

        /**
         * Respuesta háptica corta: "tap" (falta de una hora), "press" (menú al mantener
         * pulsado) y "strong" (falta del día entero). Son los efectos predefinidos del
         * teléfono, clics secos, nunca una vibración larga.
         */
        @JavascriptInterface
        public void haptic(String kind) {
            Vibrator v = getSystemService(Vibrator.class);
            if (v == null || !v.hasVibrator()) return;
            boolean strong = "strong".equals(kind), press = "press".equals(kind);
            VibrationEffect effect;
            if (Build.VERSION.SDK_INT >= 29) {
                effect = VibrationEffect.createPredefined(strong ? VibrationEffect.EFFECT_HEAVY_CLICK
                        : press ? VibrationEffect.EFFECT_CLICK : VibrationEffect.EFFECT_TICK);
            } else {
                int amp = v.hasAmplitudeControl() ? (strong ? 200 : press ? 140 : 70) : VibrationEffect.DEFAULT_AMPLITUDE;
                effect = VibrationEffect.createOneShot(strong ? 30 : press ? 18 : 10, amp);
            }
            // Como toque de interfaz: respeta el ajuste del sistema de «respuesta táctil»
            if (Build.VERSION.SDK_INT >= 33) v.vibrate(effect, VibrationAttributes.createForUsage(VibrationAttributes.USAGE_TOUCH));
            else v.vibrate(effect);
        }

        @JavascriptInterface
        public void setTheme(String theme) {
            final boolean light = "light".equals(theme);
            runOnUiThread(() -> applyBars(light));
        }
    }
}
