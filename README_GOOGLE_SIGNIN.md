In Order for Google SignIn to work we need hte following:

Configure Google OAuth in Google Cloud Console

Follow these steps to get GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for your NextAuth setup in 
src/lib/auth.ts
.

1) Create/Select a Project
Open https://console.cloud.google.com/
Select your project or click New Project.

2) Configure OAuth Consent Screen
Go to: APIs & Services → OAuth consent screen.
User type: External.
App information: App name, support email.
Scopes: You can keep defaults (openid, email, profile are auto-handled by NextAuth).
Test users: Add your Google account while the app is in Testing mode.
Save.
Note: While in Testing, only test users can sign in. Publish to Production if you want anyone to sign in.

3) Create OAuth Client ID
Go to: APIs & Services → Credentials → Create Credentials → OAuth client ID.
Application type: Web application.
Name: e.g., Veda Kosh NextAuth.
Authorized Javascript
Local development:http://localhost:3000
Production https://veda-kosh.vercel.app

Authorized redirect URIs:
Local dev: http://localhost:3000/api/auth/callback/google
Production: https://veda-kosh.vercel.app/api/auth/callback/google

Click Create. Copy the generated:
Client ID
Client Secret
(Authorized JavaScript origins are not required for NextAuth; only Redirect URIs matter.)

4) Add to .env.local
In /.env.local set:

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-strong-random-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string

Restart your dev server after saving.

5) Verify
Start dev server and open the sign-in page.
Click “Sign in with Google”.
If nothing happens, check:
Browser Network tab for requests to /api/auth/signin/google (302 expected).
Console/server logs for errors like redirect URI mismatch.
Ensure the exact redirect URI matches what you configured in Google Cloud.
Common Pitfalls
Redirect URI mismatch: Must match exactly, including scheme and path: /api/auth/callback/google.
Testing mode: Add your account to Test users or publish app.
Missing env vars: Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET are set and server restarted.
Production: Set NEXTAUTH_URL=https://your-domain.com and add production redirect URI in Google Cloud.
Status
Once the consent screen and OAuth client are set with the correct redirect URI and env vars added to /.env.local, 
handleGoogleSignIn
 should redirect to Google as expected.


Env Variables in Production (hosting provider dashboard)
On Vercel: Project → Settings → Environment Variables.
Set for Environment = Production (and Preview if needed).