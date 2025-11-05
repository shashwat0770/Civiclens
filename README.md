# 🏙️ CivicLens — Smart Civic Complaint & Tracking Platform

![CivicLens Banner]

> **CivicLens** is a next-generation civic engagement platform that empowers citizens to report local issues directly to municipal authorities.  
> Whether it’s a pothole, broken streetlight, or garbage overflow — CivicLens ensures your voice is heard, tracked, and resolved transparently.

---

## 🌐 Live Demo

🔗 **Visit the Deployed Website:**  
👉 [https://view-civic.lovable.app/](https://view-civic.lovable.app/)

> Explore the live version hosted on **Lovable**, featuring real-time updates, map-based reporting, and Supabase-backed infrastructure.

---

## 🧠 Project Overview

CivicLens bridges the gap between **citizens** and **local authorities** through a modern, intuitive, and transparent complaint management system.  
Citizens can log issues with geolocation and photos, while authorities can manage, resolve, and update complaints in real time.

### ✨ Key Highlights
- 🗺️ **Map-based complaint reporting** using Google Maps API  
- 📸 **Photo uploads** for visual evidence  
- 🔔 **Real-time updates** for status tracking  
- 🏛️ **Role-based dashboards** for users, authorities, and admins  
- ⚡ **Supabase backend** for secure authentication and storage  
- 🔄 **Keep-alive integration** to prevent Supabase from pausing on Free Tier  

---

### ✨ Key Highlights

Below are screenshots of demonstration of live project of our website:

<h2>Home Page of our website Civiclens</h2>
<img width="1914" height="1022" alt="Screenshot 2025-11-05 123124" src="https://github.com/user-attachments/assets/b7020f58-c1b5-4fac-8f06-6d485c9eceff" />
<br>
<br>
<h2>Footer of website Civiclens/h2>
<img width="1910" height="1027" alt="Screenshot 2025-11-05 123135" src="https://github.com/user-attachments/assets/77037be0-f29f-433b-87ae-a8f313dc1f02" />
<br>
<br>
<h2>Signin/Signup page</h2>
<img width="1919" height="1022" alt="Screenshot 2025-11-05 123200" src="https://github.com/user-attachments/assets/d6e1d46d-5e09-4a7d-8f8e-d6c730203c61" />
<br>
<br>
<h2>Page where complaint registration happens</h2>
<img width="1916" height="1026" alt="Screenshot 2025-11-05 123213" src="https://github.com/user-attachments/assets/20e679e4-33e5-4036-b23c-11bb89b657fc" />
<br>
<br>
<h2>Submitting the complaint via Civiclens</h2>
<img width="1916" height="1025" alt="Screenshot 2025-11-05 123443" src="https://github.com/user-attachments/assets/eac94ce3-ddeb-4bc0-96bd-d2bc0baa12f0" />
<br>
<br>
<h2>Viewing of registered complaints</h2>
<img width="1917" height="1026" alt="Screenshot 2025-11-05 123511" src="https://github.com/user-attachments/assets/a77a31d1-36d9-419f-b2b6-8a9f84e4f5aa" />
<br>
<br>



---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | Next.js 14 (App Router) · TypeScript · TailwindCSS · shadcn/ui · React Query · Axios |
| **Backend** | Next.js API Routes + Supabase (Auth, DB, Storage) |
| **Database** | Supabase Postgres with RLS (Row-Level Security) |
| **Maps** | Google Maps API (`@react-google-maps/api`) |
| **Deployment** | Lovable (Full-stack hosting) |
| **Keep Alive** | Supabase Edge Function + Cron job |
| **Version Control** | Git + GitHub |

---

## ⚙️ Local Setup Guide

### 1️⃣ Clone the Repository

"bash
<br>
<br>
git clone https://github.com/your-username/civiclens.git
cd civiclens

### 2️⃣ Install Dependencies
"bash
<br>
<br>
npm install



### 3️⃣ Configure Environment Variables
<br>
Create a .env.local file in the project root:
<br>
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_MAPS_KEY


### 4️⃣ Run Locally
<br>
npm run dev


