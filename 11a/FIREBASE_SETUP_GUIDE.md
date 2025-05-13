# Detailed Firebase Authentication Setup Guide

This guide provides step-by-step instructions for setting up Firebase Authentication for your web application.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on "Add project" to create a new Firebase project.
3. Enter a project name and click "Continue".
4. Choose whether to enable Google Analytics for your project (recommended).
5. If you enabled Analytics, select or create a Google Analytics account.
6. Click "Create project" and wait for your project to be provisioned.

## 2. Register Your Web Application

1. From your Firebase project dashboard, click on the web icon (`</>`) to add a web app.
2. Provide a nickname for your app (e.g., "Auth Demo Web App").
3. Optionally check the "Also set up Firebase Hosting" option if you plan to deploy with Firebase Hosting.
4. Click "Register app".
5. You'll be shown the Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

6. Save this information for later use in your application.
7. Click "Continue to console".

## 3. Set Up Authentication Methods

### 3.1 Email/Password Authentication

1. In the Firebase console, navigate to "Authentication" from the left sidebar.
2. Click on the "Sign-in method" tab.
3. Click on "Email/Password" in the list of providers.
4. Toggle the "Enable" switch to enable email/password authentication.
5. Optionally, enable "Email link (passwordless sign-in)" if you want to allow users to sign in without a password.
6. Click "Save".

### 3.2 Google Authentication

1. In the "Sign-in method" tab, click on "Google".
2. Toggle the "Enable" switch to enable Google authentication.
3. Add a support email for the project (usually your email).
4. Click "Save".

## 4. Configure Firebase in Your React Application

### 4.1 Create Environment Variables

Create a `.env` file in the root of your project with the Firebase configuration:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 4.2 Initialize Firebase in Your Application

Create a `firebase.ts` file in your project's source directory:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

## 5. Security Rules (Optional)

If you're using Firebase Firestore or Realtime Database with your authentication, you'll want to set up security rules:

1. In the Firebase console, navigate to "Firestore Database" or "Realtime Database".
2. Go to the "Rules" tab.
3. Update your rules to check for authenticated users. For example:

```
// Firestore example
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

// Realtime Database example
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

These basic rules allow any authenticated user to read and write data. In a production application, you'd want more granular rules.

## 6. Testing Authentication

After setting up your React components to handle authentication (sign-up, login, etc.), you can test your implementation:

1. Run your application with `npm run dev`.
2. Try creating a new account with email and password.
3. Try logging in with the created account.
4. Try the social login methods (Google, GitHub).
5. Test forgotten password functionality.

## 7. Deployment Considerations

When deploying your application to production:

1. **Environment Variables**: Ensure your production environment has the correct Firebase configuration variables set.

2. **Authorized Domains**: In the Firebase console, under "Authentication" > "Settings" > "Authorized domains", add all domains from which your application will be accessed.

3. **Security**: Review your Firebase security rules to ensure they're appropriate for your application's needs.

4. **Error Handling**: Make sure your application handles authentication errors gracefully.

## 8. Advanced Configuration (Optional)

### 8.1 Custom Email Templates

You can customize the emails sent by Firebase for password resets and email verification:

1. In the Firebase console, go to "Authentication" > "Templates".
2. Select the template you want to customize (Password reset, Email verification, etc.).
3. Modify the template to match your branding and requirements.
4. Click "Save".

### 8.2 Multi-Factor Authentication

To enable multi-factor authentication:

1. In the Firebase console, go to "Authentication" > "Sign-in method".
2. Scroll down to "Multi-factor authentication" and click "Enable".
3. Choose the second factor methods you want to allow (phone, authenticator apps, etc.).
4. Update your application code to handle the multi-factor authentication flow.

### 8.3 CAPTCHA Verification

For additional security, you can enable CAPTCHA verification:

1. In the Firebase console, go to "Authentication" > "Settings".
2. Under "Security", enable "CAPTCHA verification".
3. Configure the CAPTCHA settings according to your preferences.

## 9. Troubleshooting Common Issues

### Issue: Social Login Failing

- Verify your OAuth credentials (Client ID, Client Secret) are correct.
- Check that your authorized domains in Firebase settings include your app's domain.
- Ensure callback URLs are correctly configured.

### Issue: CORS Errors

- Make sure your Firebase project's authorized domains include all domains your app is running on.
- For local development, include `localhost` in the authorized domains list.

### Issue: Authentication Persistence

- Firebase offers different persistence options: `LOCAL` (default), `SESSION`, and `NONE`.
- You can set persistence using:
  ```typescript
  import { browserLocalPersistence, setPersistence } from 'firebase/auth';
  
  await setPersistence(auth, browserLocalPersistence);
  ```

### Issue: Rate Limiting

- Firebase has rate limits for authentication operations.
- If you're hitting rate limits, consider implementing client-side throttling.

## 10. Next Steps

After setting up basic authentication, consider these enhancements:

- Implement role-based access control using Firebase custom claims.
- Add multi-factor authentication for sensitive operations.
- Set up user profile management with Firestore or Realtime Database.
- Implement email verification requirements.
- Add session timeouts for added security.

## Conclusion

You now have a fully functional Firebase Authentication system integrated with your React application. This setup provides secure, scalable authentication that can be customized to meet your application's specific needs. 