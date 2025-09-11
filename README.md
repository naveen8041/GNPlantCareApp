# GNPlantCareApp: Firebase Migration & Setup Guide

## 1. Initial Setup
- Expo/React Native project for mobile development.
- Firebase selected for cloud database and authentication.

## 2. Firebase Integration
- Installed Firebase web SDK:
  ```
  npm install firebase
  ```
- Configured Firebase in `services/FirebaseService.ts` with your project’s config values.

## 3. Authentication
- Email/Password Auth enabled in Firebase Console.
- Google Auth enabled and set up:
  - Created OAuth client in Google Cloud Console.
  - Added redirect URI: `https://auth.expo.io/@your-expo-username/bolt-expo-nativewind`
  - Used `expo-auth-session` for Google login in Expo Go:
    ```
    npx expo install expo-auth-session
    ```
  - Updated `clientId` in `login.tsx` with your Google OAuth client ID.

## 4. Firestore Database
- Enabled Firestore in Firebase Console.
- Set development rules:
  ```
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```
- Used Firestore SDK for CRUD operations in `FirebaseService.ts`:
  - `register`, `login`, `addPlant`, `getPlants`, etc.

## 5. Refactoring Screens
- Login/Register: Uses Firebase Auth and Firestore for user management.
- Plants: Fetches user’s plants from Firestore.
- Identify: Adds identified plants to Firestore.
- Profiles: Fetches user profile from Firestore.

## 6. Navigation
- Used Expo Router for navigation.
- Ensured route names match file names (e.g., `profiles` tab).

## 7. Debugging & Error Handling
- Added error handling and debug logs to registration, login, and profile fetch logic.
- Profile screen prompts user to log in if profile data is missing.

## 8. Common Commands Used
- Start Expo project:
  ```
  npx expo start
  ```
- Install dependencies:
  ```
  npm install firebase
  npx expo install expo-auth-session
  ```
- Check Expo username:
  ```
  npx expo whoami
  ```
- Update Firestore rules in Firebase Console.

## 9. Troubleshooting Steps
- If registration/login fails, check Firebase Console for user document.
- If profile screen says "user not found," verify Firestore document exists for the user ID.
- Use debug logs to trace user creation and profile fetch.

## 10. Final Validation
- All screens use dynamic, cloud-synced data.
- Authentication and data management are fully cloud-based.
- Navigation and error handling are robust.

---

**For future reference:**
- Always match route names to file names.
- Secure Firestore rules before production.
- Use debug logs for troubleshooting.
- Keep your Firebase config and OAuth client IDs up to date.

If you need to add new features, update security, or troubleshoot, follow these steps and refer to this document!
