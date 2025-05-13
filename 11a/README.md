# Auth Integration with Firebase

This project demonstrates integration with Firebase Authentication, providing users with the ability to:
- Sign up with email/password
- Log in with email/password
- Sign in with Google
- Reset password
- Update profile information

## Step-by-step Setup Guide

### 1. Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Firebase account

### 2. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>/11a
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Firebase Setup

#### 4.1 Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on "Add project" and follow the instructions to create a new project.
3. Provide a name for your project and click "Continue".
4. Choose whether to enable Google Analytics (recommended) and click "Continue".
5. Select your analytics account or create a new one and click "Create project".

#### 4.2 Register Your Web App

1. From the Firebase project dashboard, click on the web icon (</>) to register a new web app.
2. Provide a nickname for your app (e.g., "Auth Demo") and click "Register app".
3. Copy the Firebase configuration object shown in the setup screen. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

#### 4.3 Configure Authentication Methods

1. In the Firebase console, go to "Authentication" from the left sidebar.
2. Click on "Get started" or "Sign-in method" tab.
3. Enable the authentication methods you want to use:
   - Email/Password: Click on it, toggle "Enable", and click "Save".
   - Google: Click on it, toggle "Enable", add your support email, and click "Save".

### 5. Environment Setup

1. Create a `.env` file in the project root directory:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

2. Replace the placeholder values with your actual Firebase configuration.

### 6. Run the Application

```bash
npm run dev
```

The application should now be running at `http://localhost:5173/`.

## Usage

- Navigate to `/signup` to create a new account.
- Navigate to `/login` to log in with an existing account.
- After logging in, you'll be redirected to the dashboard.
- From the dashboard, you can update your profile or log out.
- If you forgot your password, use the "Forgot Password?" link on the login page.

## Federated Identity Services Research

### Firebase Authentication

**Pros:**
- Easy to set up and integrate with React
- Supports multiple authentication methods (email/password, Google, Facebook, etc.)
- Provides a robust security model
- Free tier is generous for most small to medium applications
- Handles token management, refresh, and expiration
- Well-documented API with strong TypeScript support

**Cons:**
- Limited customization of the authentication flow
- Tied to Google's ecosystem
- May require paid plans for advanced features
- Rate limiting on free tier

### Auth0

**Pros:**
- Enterprise-grade security
- Highly customizable
- Supports social logins, SAML, and custom authentication flows
- Provides user management features
- Advanced features like Multi-factor Authentication

**Cons:**
- More complex to set up than Firebase
- Free tier is limited
- Pricing can get expensive for applications with many users

### Okta

**Pros:**
- Enterprise-focused identity provider
- Robust security features
- Comprehensive user management
- Good for large organizations

**Cons:**
- More expensive
- Steeper learning curve
- Overkill for simple applications

### Amazon Cognito

**Pros:**
- Scalable user management
- Integrates well with AWS services
- Supports custom authentication flows
- Good for mobile applications

**Cons:**
- AWS-specific
- Documentation can be overwhelming
- UI components are limited

### Considerations During Research

1. **User Base Size**: 
   - Firebase and Auth0 are good for small to medium-sized applications
   - Okta and Cognito scale better for large enterprise applications

2. **Required Authentication Methods**:
   - All services support common social logins
   - Enterprise SSO options vary

3. **Budget Constraints**:
   - Firebase has the most generous free tier
   - Auth0 is affordable for small applications but can get expensive
   - Okta and Cognito are typically more expensive

4. **Integration Complexity**:
   - Firebase is the easiest to integrate
   - Auth0 offers more customization but requires more setup
   - Okta and Cognito have steeper learning curves

5. **Vendor Lock-in**:
   - All services create some level of vendor lock-in
   - Firebase is tied to Google's ecosystem
   - Cognito is tied to AWS
   - Auth0 and Okta are more platform-agnostic but have their own ecosystems

Firebase Authentication was chosen for this project due to its ease of implementation, comprehensive documentation, and generous free tier making it ideal for demonstration purposes.