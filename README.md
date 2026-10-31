🥭 Mango Store
Premium E-Commerce Platform

A modern, full-stack e-commerce platform built for premium mango sales, featuring secure authentication, dynamic shopping cart management, promotional coupons, Razorpay payments, order tracking, and a comprehensive admin dashboard.

<p align="center">
<a href="https://mangoostore.vercel.app/">
<img src="https://img.shields.io/badge/Live%20Demo-Visit%20Store-16A34A?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
</a>
</p>

<p align="center">
Built with React • Firebase • Zustand • Docker • Razorpay
</p>

🚀 Features
🔐 Authentication & User Management
Secure authentication using Firebase Authentication.
User profile management.
Role-based access support (User / Admin).
Protected routes and account management.
🛒 Shopping Experience
Dynamic product browsing.
Global state management with Zustand.
Interactive shopping cart with quantity management.
Promotional coupons and discount system.
Automatic shipping fee calculations.
Dynamic order summaries.
💳 Payment Integration
Razorpay Checkout integration.
Backend-driven Razorpay order creation.
Payment success and failure handling.
Secure payment signature verification.
Payment status tracking.
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
🧰 Tech Stack
Category	Technologies
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
Local Development	Firebase Emulator Suite
🏗️ Application Architecture
text
                    MANGO STORE
                         |
          +--------------+--------------+
          |              |              |
     React Frontend  Firebase       Deployment
          |          Services      Infrastructure
          |              |              |
      React UI       Authentication    Docker
      Zustand        Firestore         Docker Compose
      React Router   Cloud Functions   Nginx
      Payment        Razorpay API      Artifact Registry
      Service                          Cloud Run

Payment Workflow
text
Customer
   |
   v
React Frontend
   |
   v
Firebase Cloud Function
   |
   v
Razorpay Order Creation
   |
   v
Razorpay Checkout
   |
   v
Payment Verification
   |
   v
Firestore Order Persistence

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
├── .env.example
├── package.json
└── README.md

⚙️ Installation & Setup
1. Clone the Repository
bash
git clone https://github.com/sarthak0422/mango-store.git

cd mango-store

2. Install Dependencies

Install dependencies using the lockfile:

bash
npm ci

3. Start Development Server
bash
npm run dev


Open your browser:

text
http://localhost:5173

🔥 Firebase Configuration

Create a Firebase project and enable:

Firebase Authentication
Cloud Firestore
Cloud Functions

Configure your Firebase credentials in:

text
src/firebase/config.js


Example configuration:

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


Start the Firebase Emulator Suite:

bash
firebase emulators:start

Service	Local URL
Functions Emulator	http://127.0.0.1:5001
Emulator UI	http://127.0.0.1:4000
Note: The Functions Emulator does not automatically emulate Authentication or Firestore. Configure those emulators separately when required.
💳 Razorpay Configuration

Create a Razorpay account and obtain your API credentials.

Frontend Environment Variables
env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

Backend Environment Variables
env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

Payment Security

The backend is responsible for:

Creating Razorpay orders.
Validating payment amounts.
Verifying payment signatures.
Confirming payment status before fulfilling orders.
Important: Never expose RAZORPAY_KEY_SECRET in frontend code or client-side environment variables.
🐳 Docker & Nginx Deployment

Mango Store uses Docker to containerize the React application and Nginx to serve the optimized production build.

1. Build the React Application
bash
npm ci
npm run build


Production assets are generated inside:

text
dist/

2. Docker Configuration

The project includes:

File	Responsibility
Dockerfile	Creates the production image
Dockerfile.dev	Development container configuration
.dockerignore	Excludes unnecessary build context files

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

The nginx.conf file serves the React production build and supports client-side routing.

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

Example docker-compose.yml:

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

5. Environment Variables

Create a .env file using .env.example as a reference.

env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RAZORPAY_KEY_ID=

6. Build and Run

Build and start the production container:

bash
docker compose up --build web


Run in detached mode:

bash
docker compose up --build -d web


Useful Docker commands:

bash
# Check running containers
docker compose ps

# View application logs
docker compose logs -f web

# Stop containers
docker compose down


Access the application:

text
http://localhost:8080

☁️ Google Cloud Run Deployment

Google Cloud Run provides managed container hosting for the production application.

1. Configure Google Cloud CLI
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

5. Build and Tag Production Image
bash
docker build -t mango-store .

docker tag mango-store:latest \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest

6. Push Image to Artifact Registry
bash
docker push \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest

7. Deploy to Cloud Run
bash
gcloud run deploy mango-store \
  --image asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated


After deployment, Google Cloud Run provides a public HTTPS URL.

Note: Google Cloud Run and Firebase Cloud Functions deployments may require an eligible Google Cloud billing account. Additional usage can incur charges.
🧪 Development vs Production
Environment	Frontend	Backend
Local Development	Vite (5173)	Firebase Emulators
Docker Production Test	Nginx (8080)	Deployed Backend
Cloud Deployment	Cloud Run	Deployed Backend

Always ensure the frontend connects to the correct backend environment.

🔒 Security Best Practices
Use environment variables for application configuration.
Never expose private payment credentials.
Verify Razorpay payment signatures on the backend.
Implement Firebase Authentication checks.
Enforce Firestore Security Rules.
Validate payment amounts server-side.
Never mark an order as paid based only on frontend callbacks.
Validate user ownership of orders.
Restrict administrative operations using trusted authorization checks.
Use HTTPS for production deployment.
📄 License

This project is licensed under the MIT License.

Copyright © 2026

👨‍💻 Author

Sarthak

Developed as a full-stack e-commerce portfolio project using modern frontend technologies, Firebase services, payment integration, and containerized deployment.

<p align="center">
<b>🥭 Mango Store — Bringing Premium Mangoes to Your Doorstep!</b>
</p>