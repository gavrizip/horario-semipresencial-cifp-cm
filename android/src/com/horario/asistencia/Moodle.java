package com.horario.asistencia;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/**
 * Conexión con el Campus (Moodle) de la Consejería. El inicio de sesión es por CAS de Medusa,
 * así que el token se consigue como la app oficial: se abre launch.php en un navegador y Moodle
 * vuelve a moodlemobile://token=... El token solo vive aquí (SharedPreferences); la página nunca
 * lo ve, solo pide llamadas de lectura a la API.
 */
final class Moodle {

    static final String SITE = "https://www3.gobiernodecanarias.org/medusa/eforma/campus";
    static final String SCHEME = "moodlemobile";
    private static final String PREFS = "moodle";

    /** Solo funciones de lectura. */
    private static final Set<String> ALLOWED = new HashSet<>(Arrays.asList(
        "core_webservice_get_site_info",
        "core_enrol_get_users_courses",
        "mod_assign_get_assignments",
        "mod_assign_get_submission_status"
    ));

    private Moodle() {}

    static String newPassport() {
        byte[] b = new byte[16];
        new SecureRandom().nextBytes(b);
        StringBuilder sb = new StringBuilder();
        for (byte x : b) sb.append(String.format("%02x", x));
        return sb.toString();
    }

    static String launchUrl(String passport) {
        return SITE + "/admin/tool/mobile/launch.php?service=moodle_mobile_app&passport=" + passport
            + "&urlscheme=" + SCHEME;
    }

    /** moodlemobile://token=BASE64(md5(SITE + passport) ::: token [::: privatetoken]); null si no cuadra. */
    static String parseToken(String url, String passport) {
        int i = url.indexOf("token=");
        if (i < 0) return null;
        String raw = url.substring(i + 6).replaceAll("[^A-Za-z0-9+/=]", "");
        String[] parts = new String(Base64.decode(raw, Base64.DEFAULT), StandardCharsets.UTF_8).split(":::");
        if (parts.length < 2 || !parts[0].equals(md5(SITE + passport))) return null;
        return parts[1];
    }

    static boolean connected(Context c) { return token(c) != null; }

    static void save(Context c, String token) { prefs(c).edit().putString("token", token).apply(); }

    static void clear(Context c) { prefs(c).edit().remove("token").apply(); }

    /**
     * POST a webservice/rest/server.php. args es un objeto JSON con las claves ya aplanadas
     * al estilo PHP (courseids[0], ...). Devuelve el JSON de Moodle o {"exception":...}.
     */
    static String call(Context c, String fn, String argsJson) {
        try {
            if (!ALLOWED.contains(fn)) return error("forbidden", "Función no permitida: " + fn);
            String token = token(c);
            if (token == null) return error("notconnected", "No has conectado tu cuenta de Moodle");
            StringBuilder body = new StringBuilder()
                .append("wstoken=").append(enc(token))
                .append("&wsfunction=").append(enc(fn))
                .append("&moodlewsrestformat=json");
            JSONObject args = new JSONObject(argsJson == null || argsJson.isEmpty() ? "{}" : argsJson);
            for (Iterator<String> it = args.keys(); it.hasNext(); ) {
                String k = it.next();
                body.append('&').append(enc(k)).append('=').append(enc(args.get(k).toString()));
            }
            HttpURLConnection con = (HttpURLConnection) new URL(SITE + "/webservice/rest/server.php").openConnection();
            con.setConnectTimeout(15000);
            con.setReadTimeout(30000);
            con.setRequestMethod("POST");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
            try (OutputStream out = con.getOutputStream()) { out.write(body.toString().getBytes(StandardCharsets.UTF_8)); }
            int code = con.getResponseCode();
            InputStream in = code < 400 ? con.getInputStream() : con.getErrorStream();
            String text = read(in);
            con.disconnect();
            if (code >= 400) return error("http", "El campus respondió " + code);
            // Token caducado o revocado: se olvida para que la página pida conectar de nuevo
            if (text.contains("\"errorcode\":\"invalidtoken\"")) clear(c);
            return text;
        } catch (Exception e) {
            return error("network", "Sin conexión con el campus (" + e.getClass().getSimpleName() + ")");
        }
    }

    private static String token(Context c) { return prefs(c).getString("token", null); }

    private static SharedPreferences prefs(Context c) { return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }

    private static String error(String code, String msg) {
        try { return new JSONObject().put("exception", code).put("errorcode", code).put("message", msg).toString(); }
        catch (Exception e) { return "{\"exception\":\"error\"}"; }
    }

    private static String enc(String s) throws Exception { return URLEncoder.encode(s, "UTF-8"); }

    private static String read(InputStream in) throws Exception {
        if (in == null) return "";
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        byte[] b = new byte[8192];
        for (int n; (n = in.read(b)) > 0; ) buf.write(b, 0, n);
        in.close();
        return buf.toString("UTF-8");
    }

    private static String md5(String s) {
        try {
            byte[] d = MessageDigest.getInstance("MD5").digest(s.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte x : d) sb.append(String.format("%02x", x));
            return sb.toString();
        } catch (Exception e) { return ""; }
    }
}
