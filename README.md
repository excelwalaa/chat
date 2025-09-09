# Connect Now

Connect Now is a modern, real-time chat application built with a powerful tech stack to deliver a seamless and interactive communication experience.

## Features

*   **Real-Time Messaging:** Instantaneous message delivery for fluid conversations.
*   **User Authentication:** Secure user sign-up and login functionality powered by Firebase Authentication.
*   **Direct Messaging:** Users can find and start one-on-one conversations with other registered users.
*   **File Attachments:** Send and receive images within your chats, with a convenient preview before sending.
*   **Responsive Design:** A clean and intuitive interface that works beautifully on both desktop and mobile devices.
*   **Online Status:** See when other users are online.
*   **Custom Theme:** Styled with a modern, saffron-orange theme.

## Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) with React and TypeScript (using the App Router).
*   **Backend & Database:** [Firebase](https://firebase.google.com/) for user authentication (Firebase Auth) and a real-time NoSQL database (Firestore).
*   **UI Components:** A beautiful and accessible component library from [shadcn/ui](https://ui.shadcn.com/).
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
*   **AI:** [Genkit](https://firebase.google.com/docs/genkit) is integrated for potential future generative AI features.

## Getting Started

To run this project locally, you will need to configure your Firebase credentials.

1.  **Set up Firebase:**
    *   Create a project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Authentication** (with the Email/Password provider) and **Firestore**.
    *   In your project settings, find your web app's Firebase configuration object.
    *   Copy these credentials into the `firebaseConfig` object in `src/lib/firebase.ts`.

2.  **Install Dependencies:**
    The necessary packages are already listed in `package.json`. In a local environment, you would run:
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application. You can create test users through the sign-up form to start chatting!