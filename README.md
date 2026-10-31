🥭 Mango Store — Premium E-Commerce Platform

A modern, full-stack e-commerce application for premium mango sales, built with React, Zustand, Firebase, Docker, Nginx, and Razorpay.

Mango Store delivers a complete shopping experience with secure authentication, dynamic cart management, promotional coupons, payment processing, order tracking, and an administrative dashboard.

<p align="center">
<a href="https://mangoostore.vercel.app/">
<img src="https://img.shields.io/badge/Live-Demo-orange?style=for-the-badge" alt="Live Demo" />
</a>
<img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
<img src="https://img.shields.io/badge/Firebase-Backend-yellow?style=for-the-badge&logo=firebase" alt="Firebase" />
<img src="https://img.shields.io/badge/Docker-Containerized-blue?style=for-the-badge&logo=docker" alt="Docker" />
</p>

🌐 Live Demo

Live Application: https://mangoostore.vercel.app/

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
💳 Payment & Financial Infrastructure
Razorpay Checkout integration.
Backend-driven Razorpay order creation.
Payment success and failure handling.
Payment status tracking.
Firestore order persistence.
Backend payment signature verification.
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
State Management	Zustand
Backend Services	Firebase
Authentication	Firebase Authentication
Database	Cloud Firestore
Cloud Functions	Firebase Cloud Functions
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
├── .env.example
├── package.json
└── README.md

⚙️ Installation & Setup
1. Clone the Repository
bash
git clone https://github.com/sarthak0422/mango-store.git

cd mango-store

2. Install Dependencies
bash
npm ci

3. Configure Environment Variables

Create a .env file in the project root using .env.example as a reference.

Add your Firebase configuration:

env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_RAZORPAY_KEY_ID=

4. Start Development Server
bash
npm run dev


Vite development server:

text
http://localhost:5173

🔥 Firebase Configuration

Create a Firebase project and enable:

Firebase Authentication
Cloud Firestore
Firebase Cloud Functions (if using the deployed payment backend)

Configure Firebase in:

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

For local Cloud Functions development:

javascript
import { connectFunctionsEmulator } from "firebase/functions";

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}


Start the emulator:

bash
firebase emulators:start

Service	Local URL
Functions Emulator	http://127.0.0.1:5001
Emulator UI	http://127.0.0.1:4000

Note: Start the Auth and Firestore emulators separately if your local development requires them.

💳 Razorpay Payment Configuration

Create a Razorpay account and obtain your API credentials.

Frontend Environment
env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

Backend Environment

Configure these credentials in your Firebase Functions environment:

env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret


Security considerations:

Never expose RAZORPAY_KEY_SECRET in frontend code.
Create Razorpay orders through the backend.
Validate payment amounts on the server.
Verify Razorpay payment signatures on the backend.
Confirm payment status before marking orders as paid.
🐳 Docker & Nginx Deployment

Mango Store uses Docker to containerize the React application and Nginx to serve the optimized production build.

1. Production Build

Install dependencies:

bash
npm ci


Generate the production build:

bash
npm run build


The optimized application is generated inside:

text
dist/

2. Docker Configuration

The project includes:

File	Responsibility
Dockerfile	Production multi-stage Docker build
Dockerfile.dev	Development container configuration
.dockerignore	Excludes unnecessary build files
docker-compose.yml	Container orchestration
nginx.conf	Production web server configuration
3. Nginx Configuration

Nginx serves the production React application and supports client-side routing through SPA fallback.

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

The docker-compose.yml file manages the production container.

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

5. Build and Run Production Container

Build and start:

bash
docker compose up --build web


Run in detached mode:

bash
docker compose up --build -d web


Check running containers:

bash
docker compose ps


View container logs:

bash
docker compose logs -f web


Stop containers:

bash
docker compose down


Access the application:

http://localhost:8080

<!-- ☁️ Google Cloud Run Deployment

The production Docker image can be deployed to Google Cloud Run.

Prerequisites:

Google Cloud CLI
Docker
Google Cloud project with billing enabled
Artifact Registry permissions
1. Initialize Google Cloud
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
  --allow-unauthenticated -->


After deployment, Google Cloud Run provides a public HTTPS URL.

Note: Google Cloud Run requires a billing-enabled Google Cloud project. Usage may incur charges beyond applicable free allowances. Firebase Cloud Functions deployment also requires an eligible billing plan.

🧪 Development vs Production
Environment	Frontend	Backend
Local Development	Vite (5173)	Firebase Emulators (5001)
Docker Production Test	Nginx (8080)	Deployed Firebase Backend
Cloud Deployment	Cloud Run	Deployed Firebase Backend

Always ensure the frontend connects to the correct backend environment.

🔒 Security & Best Practices
Use environment variables for application configuration.
Never commit .env files containing secrets.
Keep Razorpay private credentials on the backend.
Implement Firebase Authentication checks.
Enforce Firestore Security Rules.
Validate payment amounts server-side.
Verify Razorpay payment signatures on the backend.
Do not mark orders as paid based only on frontend callbacks.
Validate user ownership of orders.
Restrict administrative operations using trusted authorization checks.
Use HTTPS for production deployment.
📄 License

MIT License © 2026

👨‍💻 Author

Developed as a full-stack e-commerce portfolio project using modern frontend technologies, Firebase services, payment integration, and containerized deployment.

Mango Store — Bringing Premium Mangoes to Your Doorstep! 🥭