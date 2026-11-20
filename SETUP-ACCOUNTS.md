# Turning on Skilly accounts

Skilly uses **Firebase** for accounts and to store each person's progress:

- **Sign-in:** email and password, Google, or phone number with an SMS code.
- **Storage:** one private document per person (`users/{uid}`) in Cloud Firestore.

Until the steps below are done, Skilly works exactly as before. Progress stays in the browser, and the header has no Sign in link.

This takes about 15 minutes, and you only do it once.

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and click **Create a project**. Name it `skilly`. Google Analytics isn't needed, so you can switch it off.
2. On the project home page, click the **Web** icon (`</>`). Register an app called `Skilly web`. You don't need Firebase Hosting, because the site stays on Netlify.
3. Firebase then shows a `firebaseConfig` block. Keep that page open, because you'll copy four of its values in step 5.

## 2. Switch on the sign-in methods

Go to **Build → Authentication → Get started → Sign-in method**, then enable each method:

- **Email/Password:** turn on *Email/Password*. Leave *Email link* off.
- **Google:** turn it on, choose your support email, and save.
- **Phone:** turn it on and save.
  - Phone sign-in sends real SMS messages. Firebase's free plan only allows a small number of texts per day.
  - For more texts, upgrade the project to the pay-as-you-go **Blaze** plan. You can set a budget alert under *Usage and billing*.
  - For testing without sending SMS, add a fake number under **Phone numbers for testing**, for example `+91 99999 00000` with code `123456`.

**Allow SMS to your users' countries.** New projects block SMS everywhere until you choose countries. Otherwise phone sign-in fails with "SMS unable to be sent until this region enabled":

1. Go to **Authentication → Settings → SMS region policy**.
2. Choose **Allow**.
3. Add **India (IN)**, plus any other countries you need. If you use a +1 test number, add **United States (US)** too.
4. Click **Save**.

Then open **Authentication → Settings → Authorized domains** and add your live site's domain:

- your Netlify address, for example `skilly-aarambh.netlify.app`;
- your own domain, if you add one later.

`localhost` is already allowed.

## 3. Create the database

1. Go to **Build → Firestore Database → Create database**.
2. Pick the location closest to your users. For India, that's `asia-south1` (Mumbai). The location can't be changed later.
3. Choose **production mode** and click **Create**.
4. Open the **Rules** tab. Replace everything with the contents of [`firestore.rules`](firestore.rules) from this project, then click **Publish**.

These rules let each person read and write only their own progress document. Everything else is closed.

## 4. Optional: the email templates

Under **Authentication → Templates**, you can change the sender name to "Skilly" for the verification and password-reset emails.

## 5. Add the keys to the project

The four values come from the `firebaseConfig` block in step 1. You can find it again under **Project settings → Your apps**.

**For your Mac** (`npm run dev`), create a file called `.env.local` in the project folder:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=skilly-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skilly-xxxx
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
```

Git ignores `.env.local`.

These web keys aren't passwords: they only tell the app which Firebase project to use. What anyone can read or write is controlled by the rules from step 3.

**For the live site:**

1. In Netlify, go to **Site configuration → Environment variables**.
2. Add the same four variables.
3. Go to **Deploys → Trigger deploy → Deploy site**.

A **Sign in** link appears in the header once the deploy finishes.

## How progress syncing works

- **First sign-in on a device:** anything the person did as a guest is added to their account, so nothing is lost.
  - Reports and roadmaps from both sides are kept.
  - Ticked tasks stay ticked.
  - The better quiz score wins.
- **While signed in:** changes save about a second after they happen. The person's other open devices update live.
- **Offline:** progress keeps working and saves once the connection comes back.
- **Tests in progress** stay on the device where they were started. They're never synced.
- **Signing out:** the person chooses whether to remove their progress from that device. Removing it is recommended on shared computers.
- **Deleting the account:** this removes the account and its saved progress. It needs a sign-in within the last 5 minutes.

## Testing locally without a real project

Firebase's local emulators let you try every sign-in method, including phone (the SMS code is printed in the terminal), without a real project or sending real texts.

1. The database emulator needs Java. Install it once:

   ```bash
   brew install openjdk@21
   ```

2. Start the emulators:

   ```bash
   npm run emulators
   ```

3. In a second terminal, start the site against the emulators:

   ```bash
   VITE_FIREBASE_EMULATORS=1 VITE_FIREBASE_API_KEY=demo VITE_FIREBASE_PROJECT_ID=demo-skilly VITE_FIREBASE_AUTH_DOMAIN=localhost npm run dev
   ```

4. Open <http://localhost:5173/#/account>. The emulator dashboard at <http://localhost:4000> shows the test users and saved data.

## If Google sign-in fails on iPhone or Safari

Skilly opens Google sign-in in a pop-up. When a browser blocks pop-ups (common in in-app browsers like WhatsApp or Instagram), Skilly falls back to redirecting the whole page instead.

Safari's tracking protection can break that redirect when the sign-in domain (`skilly-xxxx.firebaseapp.com`) differs from your site's domain. Firebase's recommended fix is to serve the sign-in pages from your own domain:

1. Add this to `netlify.toml`, replacing `skilly-xxxx` with your project ID:

   ```toml
   [[redirects]]
     from = "/__/auth/*"
     to = "https://skilly-xxxx.firebaseapp.com/__/auth/:splat"
     status = 200
   ```

2. Change `VITE_FIREBASE_AUTH_DOMAIN` to your site's own domain, for example `skilly-aarambh.netlify.app`.
3. In Google Cloud console, go to **APIs & Services → Credentials → OAuth 2.0 Client IDs → Web client**. Add `https://YOUR-SITE/__/auth/handler` to the **Authorized redirect URIs**.

Some in-app browsers block Google sign-in completely, whatever you configure. People who hit that can use phone or email instead, or open the link in Chrome or Safari.
