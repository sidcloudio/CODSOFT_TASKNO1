# NeoCartX Deployment Guide

This guide details steps to deploy **NeoCartX** as a production-grade live web application.
We will deploy the **Frontend on Netlify** and the **Backend on Render**, utilizing a remote **MongoDB Atlas** database cluster.

---

## 🗄️ Step 1: Provisioning MongoDB Atlas Cluster

Since local MongoDB instances are inaccessible to cloud-deployed services, you must provision a cloud database:

1.  Sign up/login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Deploy a new **M0 (Free Tier)** Shared Cluster.
3.  Under **Database Access**, create a user account with a secure password (make sure to choose `Read and Write to any database` permissions).
4.  Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Render servers can bind to it.
5.  Navigate to your cluster dashboard, click **Connect** -> **Drivers** (Node.js), and copy the Connection String:
    `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/neocartx?retryWrites=true&w=majority`

---

## 🖥️ Step 2: Deploying the Backend on Render

Render is a modern cloud provider ideal for Express APIs.

1.  Push your code changes to a remote repository (e.g. GitHub or GitLab).
2.  Sign in to [Render](https://render.com) using your Git provider.
3.  Click **New +** -> **Web Service**.
4.  Connect your Git repository containing the NeoCartX source code.
5.  Configure the Web Service options:
    *   **Name:** `neocartx-api` (or any unique identifier)
    *   **Region:** Select the region closest to your target audience.
    *   **Branch:** `main` (or your active development branch)
    *   **Root Directory:** `backend` (crucial since backend is in a subfolder!)
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
6.  Click **Advanced** to add the required Environment Variables:
    *   `PORT`: `10000` (Render binds automatically, but Express will fall back to it)
    *   `MONGODB_URI`: *Your copied MongoDB Atlas connection string (replace `<password>` with actual password!)*
    *   `JWT_SECRET`: *A high-entropy random string (e.g. `neocartx_super_production_secret_key_2026`)*
    *   `NODE_ENV`: `production`
7.  Click **Create Web Service**. Render will build and deploy the container. Copy the live service URL (e.g. `https://neocartx-api.onrender.com`).

---

## 🌐 Step 3: Deploying the Frontend on Netlify

Netlify is standard for Vite/React applications.

### 1. Configure production URL matching
Before building the frontend, configure the base API route to point to your live Render backend URL in production. 
We can handle this dynamically on the client by pointing to the relative path `/api` when developing, and pointing to the full Render URL in production.
To make it completely dynamic, update your API calls or set up Netlify's redirects.

> [!TIP]
> Netlify supports a redirect rule to route `/api/*` requests to your backend Web Service. We have configured this using a standard `_redirects` file in the build path.

Let's write a `_redirects` file in `frontend/public/` so Netlify automatically routes frontend API requests to your live Render backend server without CORS issues!

Create `frontend/public/_redirects`:
```text
/api/*  https://YOUR_RENDER_BACKEND_URL/api/:splat  200
/*      /index.html                                 200
```
*(Remember to replace `YOUR_RENDER_BACKEND_URL` with your actual Render API service domain)*

### 2. Deploying on Netlify Dashboard

1.  Login to [Netlify](https://www.netlify.com).
2.  Click **Add new site** -> **Import from an existing project**.
3.  Link your Git repository.
4.  Configure the site deployment settings:
    *   **Root Directory:** `frontend`
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `frontend/dist` (or `dist` relative to the root directory, Netlify automatically figures this out when root directory is set to `frontend`)
5.  Click **Deploy site**.
6.  Once deployed, Netlify will allocate a random URL (e.g. `https://neocartx.netlify.app`).

---

## 🛠️ Diagnostics & Maintenance
*   **Database Seeding in Production:** To seed the database Atlas cluster, you can temporarily change the `.env` file of your local backend to point to the Atlas cluster, and run `npm run seed` in your local terminal.
*   **Cold Starts:** Render's free tier services automatically spin down after 15 minutes of inactivity. The first API request after spin down may take 30-50 seconds to respond as the server spins back up.
