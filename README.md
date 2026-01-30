# Datavizzy - Professional Data Visualization Platform

A modern, production-ready SaaS platform for data visualization services with authentication, subscription payments, and request management.

## 🚀 Features

- ✅ Modern, responsive design with dark theme
- ✅ User authentication with Clerk (sign up, sign in, user management)
- ✅ Stripe subscription payments (3 tiers: Starter, Pro, Enterprise)
- ✅ Protected routes (submit request page requires authentication)
- ✅ Request submission system
- ✅ Webhook handling for subscription events
- ✅ Mobile-friendly navigation
- ✅ Beautiful animations and transitions

## 📋 Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- A Clerk account (free tier available)
- A Stripe account (free for testing)
- A domain name (datavizzy.com)

## 🛠️ Setup Instructions

### Step 1: Install Dependencies

```bash
cd datavizzy-app
npm install
```

### Step 2: Set Up Clerk Authentication

1. Go to [https://clerk.com](https://clerk.com) and create a free account
2. Create a new application (name it "Datavizzy")
3. In your Clerk dashboard, go to **API Keys**
4. Copy your **Publishable Key** and **Secret Key**

### Step 3: Set Up Stripe

1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Go to **Developers → API Keys**
3. Copy your **Publishable Key** and **Secret Key** (use test keys for now)
4. Create your subscription products:
   - Go to **Products → Add Product**
   - Create 3 products:
     - **Starter**: $299/month
     - **Pro**: $599/month
     - **Enterprise**: $1,299/month
   - Copy each product's **Price ID** (starts with `price_...`)

### Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs (keep these as-is)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe Price IDs (from Step 3)
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_xxxxx
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxx
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/datavizzy.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..." → Project**
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Click **Deploy**

### Step 3: Connect Your Domain

1. In Vercel dashboard, go to **Settings → Domains**
2. Add `datavizzy.com`
3. Follow Vercel's instructions to update your domain's DNS settings
4. Point your domain to Vercel's servers

**In your domain registrar (Namecheap, etc.):**
- Add an **A record** pointing to `76.76.21.21`
- Add a **CNAME record** for `www` pointing to `cname.vercel-dns.com`

### Step 4: Update Environment Variables

After deployment, update these in Vercel:
```env
NEXT_PUBLIC_APP_URL=https://datavizzy.com
```

### Step 5: Set Up Stripe Webhooks

1. In Stripe dashboard, go to **Developers → Webhooks**
2. Click **Add Endpoint**
3. Enter: `https://datavizzy.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel

## 🧪 Testing

### Test Authentication
1. Click "Sign Up" and create a test account
2. Sign in with your new account
3. You should see "Submit Request" in the navigation

### Test Payments (Test Mode)
1. Go to Pricing page
2. Click "Get Started" on any plan
3. Use Stripe test card: `4242 4242 4242 4242`
4. Use any future date and any CVC
5. Complete the checkout

## 📱 Pages Overview

- **/** - Home page with hero and features
- **/work** - Portfolio showcase
- **/pricing** - Subscription plans with Stripe checkout
- **/submit-request** - Protected page for submitting visualization requests
- **/api/create-checkout-session** - Creates Stripe checkout sessions
- **/api/webhooks/stripe** - Handles Stripe webhook events
- **/api/submit-request** - Handles request submissions

## 🔒 Security Features

- Authentication required for request submission
- Secure webhook signature verification
- Environment variables for sensitive keys
- Protected API routes with Clerk auth

## 🎨 Customization

### Change Colors
Edit `app/globals.css` and component files to modify the color scheme.

### Add Database
To persist user requests and subscriptions:
1. Choose a database (Supabase, PlanetScale, MongoDB)
2. Install Prisma: `npm install prisma @prisma/client`
3. Set up your schema
4. Update API routes to save data

### Add Email Notifications
Integrate services like:
- SendGrid
- Resend
- Postmark

## 📞 Support

If you run into issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Make sure Clerk and Stripe are in test mode initially
4. Check Vercel deployment logs

## 🚀 Next Steps

1. Set up a database (Supabase recommended)
2. Add email notifications for new requests
3. Create an admin dashboard to manage requests
4. Add customer portal for managing subscriptions
5. Implement file upload for data files
6. Add analytics tracking

## 📝 License

MIT License - feel free to use this for your business!

---

Built with Next.js, Clerk, Stripe, and Tailwind CSS
