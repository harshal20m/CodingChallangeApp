# 📘 Coding Challenge App (React Native + Expo)

This is a daily coding challenge app built using **React Native**, **Expo Router**, **Native Notifications**, **Notes**, **Timers (stopwatch, timers with history functionalities)**. It allows users to browse, view, and complete programming problems with daily reminders, notifications, notes management, time management.

---

## 📱 Features

-   📃 **Notes feature** for tracking solutions and thoughts
-   ⏱️ **Timer functionalities**:
-   Stopwatch for tracking solving time
-   Custom timers with history
-   📊 **Stats tracking** for completed challenges
-   🎯 **Progress indicators** for daily goals
-   🔄 **Practice mode** for revisiting completed challenges
-   📱 **Cross-platform** support (iOS & Android)
-   ✅ Daily **coding questions** with detail pages
-   🧠 Tracks **completed questions** using AsyncStorage
-   🔔 Sends **local notifications**:
    -   ⏰ Midnight unlock notification
    -   ⚠️ Evening reminder if question is not completed
-   📁 Drawer Navigation for quick access
-   📦 Ready for **APK export** using EAS or prebuild
-   🌙 Designed with **mobile responsiveness**

---

## 🛠️ Setup

```bash
# 1. Clone this repo
git clone <your-repo-url>
cd <project-folder>

# 2. Install dependencies
npm install

# 3. Run on Android
npx expo run:android

# 4. (Optional) Build APK using EAS
eas build -p android --profile preview
```

---

## 🔔 Notifications

This app uses [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) to send local alerts:

-   **12:00 AM** – "🎯 New coding challenge is available!"
-   **8:00 PM** – "⏳ Don’t forget to complete today’s challenge!" (Only if incomplete)

> Notifications require a **development build** (not Expo Go).

### To Test Locally:

```bash
npx expo install expo-dev-client
eas build:configure
npx expo run:android
```

---

## 💾 Persistent Storage

-   Uses `AsyncStorage` to remember if a user has completed today's question.
-   Data format: `{ "1-Mon May 18 2025": true }`

---

## 🚀 Exporting APK

> Expo Go cannot handle all features (e.g., notifications). Use a custom build:

```bash
# Step 1: Prebuild the native project
npx expo prebuild

# Step 2: Build APK
eas build -p android --profile preview
```

> Requires login to EAS (you can use a free account).

---

## 🧠 Future Improvements

-   🔥 Background sync using Headless JS
-   🌐 Remote question loading via API
-   👤 User auth + profile
-   📊 Daily streak tracking

---

## 📸 Screenshots

---

## 🙌 Acknowledgements

-   [Expo](https://expo.dev/)
-   [React Native](https://reactnative.dev/)
-   [Zustand](https://github.com/pmndrs/zustand) (for future state management)
