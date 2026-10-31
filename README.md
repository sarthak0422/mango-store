<div align="center">

🥭 MANGO STORE
Premium Mangoes. Seamless Shopping. Powerful Technology.

A modern full-stack e-commerce platform with secure payments, real-time order management, and an advanced admin dashboard.

<br/>

![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-Visit_Store-orange?style=for-the-badge) ![GitHub](https://img.shields.io/badge/GITHUB-Repository-black?style=for-the-badge&logo=github)

<br/>

!React !Vite !Firebase !Zustand !Docker !Razorpay

</div>

✨ What is Mango Store?

Mango Store is a full-stack online shopping platform built to deliver a smooth and secure e-commerce experience.

🛍️ Shopping	💳 Payments	📦 Orders	🛠️ Administration
Product browsing	Razorpay Checkout	Order tracking	Revenue analytics
Dynamic cart	Secure verification	Order history	Product management
Coupon system	Payment status	Invoice generation	Review moderation
🚀 Features

<table>
<tr>
<td width="50%">

🔐 Authentication
Firebase Authentication
Secure login and signup
User profile management
Role-based access
Protected routes

</td>
<td width="50%">

🛒 Shopping Experience
Dynamic product browsing
Zustand state management
Interactive shopping cart
Coupon and discount system
Automatic shipping calculation

</td>
</tr>
<tr>
<td width="50%">

💳 Payment Infrastructure
Razorpay Checkout
Backend order creation
Payment signature verification
Success and failure handling
Firestore order persistence

</td>
<td width="50%">

📦 Order Management
Customer order history
Invoice modal
Payment status tracking
Order fulfillment workflow
Real-time status updates

</td>
</tr>
<tr>
<td width="50%">

🧑‍💼 Admin Dashboard
Revenue analytics
Product management
Order management
Customer complaints
Review moderation

</td>
<td width="50%">

💬 Reviews & Feedback
Customer review submission
Admin approval system
Review deletion
Real-time Firestore updates
Customer feedback management

</td>
</tr>
</table>

🖥️ Application Preview

<!-- Add your actual screenshots here -->

<div align="center">

🏠 Home Page	🛒 Shopping Cart
Add homepage screenshot	Add cart screenshot
📦 Orders	🧑‍💼 Admin Dashboard
Add orders screenshot	Add dashboard screenshot

</div>

🧰 Tech Stack

<div align="center">

Frontend	Backend & Database	Infrastructure
React.js	Firebase	Docker
Vite	Cloud Firestore	Docker Compose
Tailwind CSS	Firebase Functions	Nginx
React Router	Firebase Auth	Google Cloud Run
Zustand	Razorpay	Firebase Emulator

</div>

Additional Libraries

Lucide React · React Hot Toast · Razorpay Checkout

🏗️ Architecture
text
                  🥭 MANGO STORE
                        |
          +-------------+-------------+
          |             |             |
       FRONTEND       BACKEND      DEPLOYMENT
          |             |             |
        React        Firebase       Docker
        Zustand      Firestore      Nginx
        Router       Functions      Cloud Run
          |             |
          +------ Razorpay ---------+
                  Payments

📁 Project Structure

<details>
<summary><b>📂 View Project Directory</b></summary>

text
mango-store/
│
├── public/
│
├── src/
│   ├── admin/
│   ├── components/
│   ├── pages/
│   ├── firebase/
│   ├── store/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── functions/
│   ├── index.js
│   └── package.json
│
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yml
├── nginx.conf
├── firebase.json
├── firestore.rules
├── .env.example
├── package.json
└── README.md


</details>

⚡ Getting Started
1. Clone Repository
bash
git clone https://github.com/sarthak0422/mango-store.git
cd mango-store

2. Install Dependencies
bash
npm ci

3. Configure Environment Variables

Create a .env file using .env.example.

env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RAZORPAY_KEY_ID=


Configure backend Razorpay credentials separately:

env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

4. Start Development Server
bash
npm run dev


Local URL: http://localhost:5173

🐳 Docker Deployment
bash
# Build and start
docker compose up --build -d web

# Check containers
docker compose ps

# View logs
docker compose logs -f web

# Stop containers
docker compose down


Local production URL: http://localhost:8080

🔥 Firebase Emulator
bash
firebase emulators:start

Service	URL
Functions Emulator	http://127.0.0.1:5001
Emulator UI	http://127.0.0.1:4000

Configure Authentication and Firestore emulators separately if required.

☁️ Google Cloud Run

The project supports container-based deployment using:

Docker
Google Artifact Registry
Google Cloud Run

<details>
<summary><b>View Deployment Commands</b></summary>

bash
gcloud init

gcloud config set project YOUR_PROJECT_ID

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com

gcloud artifacts repositories create mango-store \
  --repository-format=docker \
  --location=asia-south1

gcloud auth configure-docker asia-south1-docker.pkg.dev

docker build -t mango-store .

docker tag mango-store:latest \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest

docker push \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest

gcloud run deploy mango-store \
  --image asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/mango-store/mango-store:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated


</details>

🔒 Security
Firebase Authentication for user identity.
Firestore Security Rules for database access control.
Backend-only Razorpay secret credentials.
Server-side payment signature verification.
Server-side payment amount validation.
Trusted authorization for administrative operations.
HTTPS for production deployment.
📄 License

This project is licensed under the MIT License.

<div align="center">

👨‍💻 Developed By

Sarthak

Full-Stack Developer | React | Firebase | Docker

<br/>

🥭 Mango Store

Bringing Premium Mangoes to Your Doorstep!

<br/>

⭐ If you like this project, consider giving it a star!

</div>
