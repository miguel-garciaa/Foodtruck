#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifacts/android-debug
diagnostics() {
  result=$?
  if [ "$result" -ne 0 ]; then
    adb logcat -d -t 1000 > artifacts/android-debug/logcat.txt || true
    adb exec-out screencap -p > artifacts/android-debug/screen.png || true
    adb shell uiautomator dump /sdcard/ci-window.xml >/dev/null 2>&1 || true
    adb pull /sdcard/ci-window.xml artifacts/android-debug/window.xml >/dev/null 2>&1 || true
  fi
  exit "$result"
}
trap diagnostics EXIT
adb reverse tcp:8443 tcp:8443
adb install apps/mobile/android/app/build/outputs/apk/release/app-release.apk
maestro test -e APP_ID=com.foodtrucks.ci --debug-output artifacts/android-debug --format junit --output artifacts/android.xml apps/mobile/.maestro
