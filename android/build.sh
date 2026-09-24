#!/usr/bin/env bash
# Compila Horario.apk sin Gradle ni Android Studio: aapt2 + javac + d8 + apksigner.
# Requisitos (en la carpeta del usuario): JDK 17 y el SDK de Android con
# platforms;android-34 y build-tools;34.0.0. Rutas por defecto abajo; se pueden cambiar con variables.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
SDK="${ANDROID_HOME:-$HOME/Android/Sdk}"
BT="$SDK/build-tools/34.0.0"
JAR="$SDK/platforms/android-34/android.jar"
JAVA_HOME="${JAVA_HOME:-$(ls -d "$HOME"/.local/opt/jdk-17* 2>/dev/null | head -1)}"
export PATH="$JAVA_HOME/bin:$PATH"

# Cada compilación sube la versión (android/version.txt) para que Android la trate como actualización
VFILE="$HERE/version.txt"
VERSION_CODE="${VERSION_CODE:-$(( $(cat "$VFILE" 2>/dev/null || echo 0) + 1 ))}"
echo "$VERSION_CODE" > "$VFILE"
VERSION_NAME="${VERSION_NAME:-1.$VERSION_CODE}"

OUT="$HERE/build"
rm -rf "$OUT"; mkdir -p "$OUT"/{gen,classes,dex,assets/www}

echo "· Copiando la web a assets/www"
cp "$ROOT/horario.html" "$ROOT/favicon.svg" "$OUT/assets/www/"
cp -r "$ROOT/css" "$ROOT/js" "$ROOT/fonts" "$OUT/assets/www/"

echo "· Recursos (aapt2)"
"$BT/aapt2" compile --dir "$HERE/res" -o "$OUT/res.zip"
"$BT/aapt2" link -o "$OUT/unsigned.apk" -I "$JAR" \
  --manifest "$HERE/AndroidManifest.xml" \
  --java "$OUT/gen" -A "$OUT/assets" \
  --min-sdk-version 26 --target-sdk-version 34 \
  --version-code "$VERSION_CODE" --version-name "$VERSION_NAME" \
  "$OUT/res.zip"

echo "· Java (javac + d8)"
javac -source 11 -target 11 -Xlint:-options -encoding UTF-8 -cp "$JAR" -d "$OUT/classes" \
  $(find "$OUT/gen" "$HERE/src" -name '*.java')
"$BT/d8" --release --min-api 26 --lib "$JAR" --output "$OUT/dex" $(find "$OUT/classes" -name '*.class')
(cd "$OUT/dex" && zip -q -u "$OUT/unsigned.apk" classes.dex)

echo "· Alineado y firma"
"$BT/zipalign" -p -f 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"

KS="$HERE/horario-release.jks"
PROPS="$HERE/keystore.properties"
if [ ! -f "$KS" ]; then
  echo "  (primera vez: creando la clave de firma $KS)"
  PASS="$(head -c 24 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 24)"
  keytool -genkeypair -keystore "$KS" -alias horario -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$PASS" -keypass "$PASS" -dname "CN=Horario" >/dev/null 2>&1
  printf 'storePassword=%s\n' "$PASS" > "$PROPS"
  chmod 600 "$KS" "$PROPS"
fi
PASS="$(sed -n 's/^storePassword=//p' "$PROPS")"
"$BT/apksigner" sign --v4-signing-enabled false --ks "$KS" --ks-key-alias horario --ks-pass "pass:$PASS" \
  --out "$ROOT/Horario.apk" "$OUT/aligned.apk"
"$BT/apksigner" verify "$ROOT/Horario.apk"

echo "Listo: $ROOT/Horario.apk ($(du -h "$ROOT/Horario.apk" | cut -f1)) · versión $VERSION_NAME"
