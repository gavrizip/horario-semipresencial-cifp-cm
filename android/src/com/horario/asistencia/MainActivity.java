package com.horario.asistencia;

import android.app.Activity;
import android.app.Dialog;
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
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.lang.ref.WeakReference;

/** Muestra la página incluida en assets/www a pantalla completa. La única red es la del campus (Moodle). */
public class MainActivity extends Activity {

    private static final String START_URL = "file:///android_asset/www/horario.html";

    private WebView web;
    private boolean askedNotifications;
    private Dialog moodleDialog;
    private boolean openCampus;   // abrir la lista del campus al cargar (desde su notificación)
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
        openCampus = getIntent().getBooleanExtra(MoodleWatch.EXTRA_OPEN_CAMPUS, false);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                // Nada fuera de la app
                return !req.getUrl().toString().startsWith("file:///android_asset/");
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (openCampus) { openCampus = false; showCampus(); }
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
            + "if(document.documentElement.classList.contains('table-full')){closeTableFull();return true;}"
            + "return false;})()";
        web.evaluateJavascript(js, handled -> {
            if (!"true".equals(handled)) finish();
        });
    }

    /** La notificación del campus abre la lista de pendientes (con la app ya abierta). */
    @Override
    protected void onNewIntent(android.content.Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (intent.getBooleanExtra(MoodleWatch.EXTRA_OPEN_CAMPUS, false)) showCampus();
    }

    private void showCampus() {
        web.evaluateJavascript("window.moodleSync && moodleSync()", null);
    }

    /** Al volver a la app se aplican las tareas marcadas como entregadas desde notificaciones. */
    @Override
    protected void onResume() {
        super.onResume();
        applyNativeActions();
        // Al volver de los ajustes de Android, el menú refleja si las notificaciones están permitidas
        if (web != null) web.evaluateJavascript("window.renderNotifySettings && renderNotifySettings()", null);
    }

    static void applyNativeActions() {
        MainActivity a = current.get();
        if (a == null || a.web == null) return;
        a.runOnUiThread(() -> a.web.evaluateJavascript("window.applyNativeActions && applyNativeActions()", null));
    }

    /**
     * Inicio de sesión en el campus: launch.php en un navegador aparte (CAS de Medusa) hasta que
     * Moodle redirige a moodlemobile://token=...; ahí se guarda el token y se cierra.
     */
    private void openMoodleLogin() {
        if (moodleDialog != null) return;
        String passport = Moodle.newPassport();
        WebView login = new WebView(this);
        login.getSettings().setJavaScriptEnabled(true);
        login.getSettings().setDomStorageEnabled(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(login, true);
        Dialog d = new Dialog(this, android.R.style.Theme_DeviceDefault_Light_NoActionBar);
        final boolean[] ok = {false};
        login.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                String url = req.getUrl().toString();
                if (!url.startsWith(Moodle.SCHEME + "://")) return false;
                String token = Moodle.parseToken(url, passport);
                if (token != null) { Moodle.save(getApplicationContext(), token); ok[0] = true; }
                d.dismiss();
                return true;
            }
        });
        d.setContentView(login);
        d.setOnDismissListener(x -> {
            moodleDialog = null;
            login.destroy();
            web.evaluateJavascript("window.moodleLoginDone && moodleLoginDone(" + ok[0] + ")", null);
        });
        moodleDialog = d;
        d.show();
        login.loadUrl(Moodle.launchUrl(passport));
    }

    @Override
    protected void onDestroy() {
        if (moodleDialog != null) moodleDialog.dismiss();
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

    /** Barras del sistema del color de fondo del tema; iconos oscuros en los temas claros (día y rosa). */
    private void applyBars(String theme) {
        boolean light = !"dark".equals(theme);
        Window w = getWindow();
        int color = Color.parseColor("light".equals(theme) ? "#e6d7bd" : "rosa".equals(theme) ? "#ffc0dc" : "#1c1512");
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

        // --- Moodle ---
        @JavascriptInterface
        public boolean moodleConnected() { return Moodle.connected(getApplicationContext()); }

        @JavascriptInterface
        public void moodleLogin() { runOnUiThread(MainActivity.this::openMoodleLogin); }

        /** Olvida el token y la sesión de Medusa guardada en las cookies. */
        @JavascriptInterface
        public void moodleLogout() {
            MoodleWatch.clear(getApplicationContext());
            Moodle.clear(getApplicationContext());
            runOnUiThread(() -> CookieManager.getInstance().removeAllCookies(null));
        }

        /** TEMPORAL: lanza al momento una notificación de ejemplo de cada tipo (barra de pruebas). */
        @JavascriptInterface
        public void testNotification(String kind) {
            runOnUiThread(MainActivity.this::askNotificationPermission);
            android.content.Context c = getApplicationContext();
            long now = System.currentTimeMillis(), day = 24 * 60 * 60 * 1000L;
            try {
                switch (kind) {
                    case "exam":
                        Reminders.show(c, new JSONObject().put("id", "test-exam").put("kind", "exam").put("code", "IMW")
                            .put("what", "Temas 1 a 3").put("when", "miércoles 14 Oct, 18:15").put("due", now + 3 * day));
                        break;
                    case "task":
                        Reminders.show(c, new JSONObject().put("id", "test-task").put("kind", "task").put("code", "SRD")
                            .put("what", "Práctica DNS").put("when", "miércoles 21 Oct, 20:00").put("due", now + day));
                        break;
                    case "personal":
                        Reminders.show(c, new JSONObject().put("id", "test-personal").put("kind", "task").put("code", "")
                            .put("what", "Entregar el proyecto").put("when", "viernes 23 de octubre").put("due", now));
                        break;
                    default:
                        MoodleWatch.testNotify(c, kind);
                }
            } catch (Exception ignored) {}
        }

        /** ¿Deja Android mostrar notificaciones de la app? (el usuario puede bloquearlas en Ajustes) */
        @JavascriptInterface
        public boolean notificationsEnabled() {
            return getSystemService(android.app.NotificationManager.class).areNotificationsEnabled();
        }

        /** Ajustes de notificaciones de la app en Android: permitirlas, sonido y vibración de cada canal. */
        @JavascriptInterface
        public void openNotificationSettings() {
            runOnUiThread(() -> startActivity(new android.content.Intent(android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                .putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, getPackageName())));
        }

        /** Estado de los avisos del campus (activado, curso escolar, asignaturas, tareas vistas). */
        @JavascriptInterface
        public void moodleWatchState(String json) {
            MoodleWatch.setState(getApplicationContext(), json);
            if (json.contains("\"enabled\":true")) runOnUiThread(MainActivity.this::askNotificationPermission);
        }

        /** «Comprobar ahora»: la misma comprobación que en segundo plano; responde moodleWatchDone(n). */
        @JavascriptInterface
        public void moodleWatchNow() {
            new Thread(() -> {
                int n = MoodleWatch.check(getApplicationContext());
                runOnUiThread(() -> web.evaluateJavascript("window.moodleWatchDone && moodleWatchDone(" + n + ")", null));
            }).start();
        }

        /** Llamada a la API en segundo plano; la respuesta vuelve con moodleResult(id, json). */
        @JavascriptInterface
        public void moodleCall(String id, String fn, String argsJson) {
            new Thread(() -> {
                String result = Moodle.call(getApplicationContext(), fn, argsJson);
                String js = "window.moodleResult && moodleResult(" + JSONObject.quote(id) + "," + JSONObject.quote(result) + ")";
                runOnUiThread(() -> web.evaluateJavascript(js, null));
            }).start();
        }

        @JavascriptInterface
        public void setTheme(String theme) {
            runOnUiThread(() -> applyBars(theme));
        }
    }
}
