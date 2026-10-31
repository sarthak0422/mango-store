🥭 Mango Store — Premium E-Commerce Platform


<p align="center">
A modern, full-stack e-commerce platform built for premium mango sales, featuring secure authentication, real-time shopping cart management, Razorpay payments, order tracking, and a powerful admin dashboard.
</p>

<p align="center">
<a href="https://mangoostore.vercel.app/"><strong>🌐 Live Demo</strong></a>
&nbsp; • &nbsp;
<a href="https://github.com/sarthak0422/mango-store"><strong>📂 GitHub Repository</strong></a>
</p>

📖 Overview

Mango Store is a full-stack e-commerce application designed to provide a seamless online shopping experience.

Built using React, Zustand, Firebase, Docker, and Razorpay, it combines modern frontend architecture with secure backend payment processing and real-time database synchronization.

✨ Key Highlights
🔐 Secure authentication and role-based access.
🛒 Dynamic shopping cart and product browsing.
🎟️ Promotional coupons and automatic discount calculations.
💳 Razorpay payment integration with backend signature verification.
📦 Order history, invoices, and fulfillment tracking.
📊 Admin dashboard with revenue analytics.
💬 Customer reviews, feedback, and moderation.
🐳 Docker-based production deployment with Nginx.
🚀 Features
🔐 Authentication & User Management
Firebase Authentication for secure login and signup.
User profile management.
Role-based access support (User / Admin).
Protected routes and account management.
🛒 Shopping Experience
Dynamic product browsing.
Zustand-powered global state management.
Shopping cart with quantity management.
Coupon and promotional discount system.
Automatic shipping fee calculations.
Dynamic order summary.
💳 Payment Integration
Razorpay Checkout integration.
Backend-driven Razorpay order creation.
Payment success and failure handling.
Payment status tracking.
Secure payment signature verification.
Firestore order persistence.
📦 Order Management
Individual customer order history.
Detailed invoice modal.
Order fulfillment workflow:

Pending → Processing → Shipped → Delivered

Payment and fulfillment status tracking.
🧑‍💼 Admin Dashboard
Revenue analytics.
Order and product management.
Customer complaint management.
Fulfillment status updates.
Review moderation.
Customer feedback management.
💬 Feedback & Reviews
Public customer review submission.
Admin approval and deletion.
Real-time Firestore synchronization using onSnapshot.
🧰 Technology Stack
Category	Technology
Frontend	React.js, Vite
Routing	React Router DOM
State Management	Zustand
Backend Services	Firebase
Authentication	Firebase Authentication
Database	Cloud Firestore
Payment Gateway	Razorpay
Styling	Tailwind CSS
Icons	Lucide React
Notifications	React Hot Toast
Containerization	Docker
Container Orchestration	Docker Compose
Web Server	Nginx
Cloud Deployment	Google Cloud Run
Local Backend Development	Firebase Emulator Suite
🏗️ Application Architecture
text
                    🥭 MANGO STORE
                          |
          +---------------+---------------+
          |               |               |
     React Frontend  Firebase Services  Deployment
          |               |               |
      React Router    Authentication      Docker
      Zustand Store   Cloud Firestore     Nginx
      Components      Cloud Functions     Cloud Run
      Payment UI           |
                           |
                    Razorpay Order
                       Creation
                           |
                     Razorpay Checkout

📁 Project Structure
text
mango-store/
│
├── public/
│
├── src/
│   ├── admin/
│   │
│   ├── components/
│   │   ├── OrderDetailsModal.jsx
│   │   └── Reusable UI Components
│   │
│   ├── pages/
│   │   ├── Profile.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Orders.jsx
│   │   ├── FeedbackReviews.jsx
│   │   └── Cart.jsx
│   │
│   ├── firebase/
│   │   └── config.js
│   │
│   ├── store/
│   │   └── useAppStore.js
│   │
│   ├── services/
│   │   └── payment.js
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── functions/
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── Dockerfile
├── Dockerfile.dev
├── .dockerignore
├── docker-compose.yml
├── nginx.conf
├── firebase.json
├── firestore.rules
├── .env
├── .env.example
├── package.json
└── README.md

⚙️ Installation & Setup
Prerequisites

Make sure you have the following installed:

Node.js and npm
Git
Firebase CLI
Docker and Docker Compose (for containerized deployment)
1. Clone the Repository
bash
git clone https://github.com/sarthak0422/mango-store.git

cd mango-store

2. Install Dependencies

For a reproducible installation:

bash
npm ci


Start the development server:

bash
npm run dev


The application will typically run at:

text
http://localhost:5173

🔥 Firebase Configuration

Create a Firebase project and configure:

Firebase Authentication
Cloud Firestore
Cloud Functions

Update the configuration in:

text
src/firebase/config.js

Example Firebase Configuration
javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const functions = getFunctions(app, "asia-south1");

Firebase Emulator Configuration

For local Cloud Functions development, connect the frontend to the emulator:

javascript
import { connectFunctionsEmulator } from "firebase/functions";

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}


Start the Firebase Emulator Suite:

bash
firebase emulators:start

Service	Local URL
Functions Emulator	http://127.0.0.1:5001
Emulator UI	http://127.0.0.1:4000
Note: The Functions Emulator does not automatically emulate Authentication or Firestore. Configure those emulators separately when local development requires them.
💳 Razorpay Configuration

Create a Razorpay account and obtain your API credentials.

Frontend Environment Variables
env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

Backend Environment Variables
env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

⚠️ Security Warning: Never expose RAZORPAY_KEY_SECRET in frontend code or Docker frontend environment variables.

The backend is responsible for:

Creating Razorpay orders.
Validating payment amounts.
Verifying payment signatures.
Confirming payment status before fulfilling orders.
🐳 Docker & Nginx Deployment

Mango Store uses Docker to containerize the React application and Nginx to serve the optimized production build.

1. Build the React Application

Install dependencies:

bash
npm ci


Generate the production build:

bash
npm run build


Production assets are generated inside:

text
dist/

2. Docker Configuration

The project includes:

File	Responsibility
.dockerignore	Excludes unnecessary files from the build context
Dockerfile	Creates the production image
Dockerfile.dev	Supports development container configuration

Example .dockerignore:

text
node_modules
dist
.git
.env
.env.*
npm-debug.log

Ensure required build-time configuration is supplied securely when environment files are excluded from the Docker build context.
3. Nginx Configuration

The nginx.conf file configures Nginx to serve the React production build and supports React Router client-side navigation through SPA fallback routing.

Example:

nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

4. Docker Compose Configuration

The docker-compose.yml file manages the application container, build configuration, and port mapping.

Example:

yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: mango-store
    ports:
      - "8080:80"
    restart: unless-stopped

5. Environment Variables & Security Rules

Create .env using .env.example as a reference.

Example frontend configuration:

env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RAZORPAY_KEY_ID=


Security considerations:

Never commit .env files containing secrets.
Keep Razorpay secret credentials on the backend.
Configure Firestore Security Rules to restrict unauthorized reads and writes.
Validate user ownership of orders.
Restrict administrative operations using trusted authorization checks.
Verify Razorpay payment signatures on the backend.
6. Build and Run the Production Container

Build and start the application:

bash
docker compose up --build web


Run in detached mode:

bash
docker compose up --build -d web


Useful Docker commands:

Command	Description
docker compose ps	Check running containers
docker compose logs -f web	View application logs
docker compose down	Stop containers

Access the application:

text
http://localhost:8080

☁️ Google Cloud Run Deployment

Google Cloud Run provides managed container hosting for the production application.

This section assumes you have configured Google Cloud CLI and have an active billing account.
1. Initialize Google Cloud CLI
bash
gcloud init

gcloud config set project YOUR_PROJECT_ID

2. Enable Required APIs
bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com

3. Create Artifact Registry Repository
bash
gcloud artifacts repositories create mango-store \
  --repository-format=docker \
  --location=asia-south1 \
  --description="Mango Store production images"

4. Configure Docker Authentication
bash
gcloud auth configure-docker asia-south1-docker.pkg.dev

5. Build Production Image
bash
docker build -t mango-store .

6. Tag the Image
bash
docker tag mango-store:latest \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest

7. Push Image to Artifact Registry
bash
docker push \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest

8. Deploy to Cloud Run
bash
gcloud run deploy mango-store \
  --image asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated


After deployment, Google Cloud Run provides a public HTTPS URL.

Note: Google Cloud Run and Firebase Cloud Functions may incur charges depending on usage and billing eligibility.
🧪 Development vs Production
Environment	Frontend	Backend
Local Development	Vite (5173)	Firebase Emulators (5001)
Docker Production Test	Nginx (8080)	Deployed Backend
Cloud Deployment	Cloud Run	Deployed Backend

Always ensure the frontend connects to the correct backend environment.

🔒 Security & Best Practices
Use environment variables for application configuration.
Never expose private payment credentials.
Verify Razorpay payment signatures on the backend.
Implement Firebase Authentication checks.
Enforce Firestore Security Rules.
Validate all payment amounts server-side.
Never mark an order as paid based only on frontend callbacks.
Use HTTPS for production deployment.
📄 License

This project is licensed under the MIT License.

Copyright © 2026.

👨‍💻 Author

Developed as a full-stack e-commerce portfolio project using modern frontend technologies, Firebase services, payment integration, and containerized deployment.

Mango Store — Bringing Premium Mangoes to Your Doorstep! 🥭

<p align="center">
⭐ If you like this project, consider giving it a star!
</p>