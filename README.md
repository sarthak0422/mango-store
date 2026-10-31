why this readme is not looking good in github make it 🥭 Mango Store — Premium E-Commerce Platform

A modern, full-stack e-commerce application for premium mango sales, built with React, Zustand, Firebase, Docker, and Razorpay.

Mango Store provides a complete shopping experience with secure authentication, dynamic cart management, promotional coupons, payment processing, order tracking, and an administrative dashboard.

🌐 Live Demo

👉 https://mangoostore.vercel.app/

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
💳 Payment & Financial Transaction Infrastructure
Razorpay Checkout integration.
Backend-driven Razorpay order creation.
Payment success and failure handling.
Payment status tracking.
Secure payment signature verification.
Firestore order persistence.
📦 Order Management & Tracking
Individual customer order history.
Detailed invoice modal.
Order fulfillment workflow: Pending → Processing → Shipped → Delivered
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
State Orchestration	Zustand
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
MANGO STORE
│
├── React Frontend
│   ├── Pages
│   ├── Components
│   ├── Zustand Store
│   ├── React Router
│   └── Payment Service
│
├── Firebase Services
│   ├── Authentication
│   ├── Cloud Firestore
│   └── Cloud Functions
│       └── Razorpay Order Creation
│
├── Payment Infrastructure
│   └── Razorpay Checkout
│
└── Deployment Infrastructure
    ├── Docker
    ├── Docker Compose
    ├── Nginx
    ├── Artifact Registry
    └── Google Cloud Run

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
1. Clone the Repository
bash
git clone https://github.com/sarthak0422/mango-store.git

cd mango-store

2. Install Dependencies

For a reproducible installation using the lockfile:

bash
npm ci


For development:

bash
npm run dev


The Vite development server typically runs at:

text
http://localhost:5173

🔥 3. Firebase Configuration

Create a Firebase project and configure Firebase Authentication and Cloud Firestore.

Update:

text
src/firebase/config.js


Example:

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


Functions Emulator:

text
http://127.0.0.1:5001


Emulator UI:

text
http://127.0.0.1:4000


Important: The Functions Emulator does not automatically emulate Authentication or Firestore. Configure those emulators separately when local development requires them.

💳 4. Razorpay Configuration

Create a Razorpay account and obtain your API credentials.

Configure the frontend environment:

env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id


Configure backend secrets separately:

env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret


Never expose RAZORPAY_KEY_SECRET in frontend code or Docker frontend environment variables.

The backend is responsible for:

Creating Razorpay orders.
Validating payment amounts.
Verifying payment signatures.
Confirming payment status before fulfilling orders.
🐳 Docker & Nginx Deployment Workflow

Mango Store uses Docker to containerize the React application and Nginx to serve the optimized production build.

5. Prepare the React Application

Install dependencies:

bash
npm ci


Generate the optimized production build:

bash
npm run build


The production assets are generated inside:

text
dist/

6. Configure Docker

The project includes:

File	Responsibility
.dockerignore	Excludes unnecessary files from Docker build context
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


Only exclude environment files if their required build values are supplied securely through the build configuration.

7. Configure Nginx

The nginx.conf file configures Nginx to serve the React production build.

It also supports React Router client-side navigation through SPA fallback routing.

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

8. Configure Docker Compose

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

9. Configure Environment Variables & Security Rules

Create .env using .env.example as a reference.

Frontend variables must use the Vite prefix:

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
10. Build and Run Production Container

Build and start the production application:

bash
docker compose up --build web


Run in detached mode:

bash
docker compose up --build -d web


Check running containers:

bash
docker compose ps


View logs:

bash
docker compose logs -f web


Stop containers:

bash
docker compose down

Access the Application
text
http://localhost:8080

<!-- ☁️ 11. Deploy to Google Cloud Run

Google Cloud Run provides managed container hosting for the production application.

Step 1: Configure Google Cloud CLI

Install and initialize the Google Cloud CLI.

bash
gcloud init


Select your Google Cloud project:

bash
gcloud config set project YOUR_PROJECT_ID

Step 2: Enable Required APIs
bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com

Step 3: Create an Artifact Registry Repository
bash
gcloud artifacts repositories create mango-store \
  --repository-format=docker \
  --location=asia-south1 \
  --description="Mango Store production images"

Step 4: Configure Docker Authentication
bash
gcloud auth configure-docker asia-south1-docker.pkg.dev

Step 5: Build Production Image
bash
docker build -t mango-store .

Step 6: Tag the Image
bash
docker tag mango-store:latest \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest

Step 7: Push Image to Artifact Registry
bash
docker push \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest

Step 8: Deploy to Cloud Run
bash
gcloud run deploy mango-store \
  --image asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated -->


After deployment, Google Cloud Run provides a public HTTPS URL.

Important: Cloud Run requires a Google Cloud billing account even though it offers a free usage allowance. Usage beyond the allowance can incur charges. Firebase Cloud Functions also requires an eligible billing account for deployment.

🧪 Development vs Production
Environment	Frontend	Backend
Local development	Vite (5173)	Firebase Emulators (5001)
Docker production test	Nginx (8080)	Deployed backend
Cloud deployment	Cloud Run	Deployed backend

Always ensure the frontend connects to the correct backend environment.

🔒 Security & Best Practices
Use environment variables for application configuration.
Never expose private payment credentials.
Verify Razorpay payment signatures on the backend.
Implement Firebase Authentication checks.
Enforce Firestore Security Rules.
Validate all payment amounts server-side.
Do not mark an order as paid based only on frontend callbacks.
Use HTTPS for production deployment.
📄 License

MIT License © 2026

👨‍💻 Author

Developed as a full-stack e-commerce portfolio project using modern frontend technologies, Firebase services, payment integration, and containerized deployment.

Mango Store — Bringing Premium Mangoes to Your Doorstep! 🥭