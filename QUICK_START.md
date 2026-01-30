# 🚀 QUICK START GUIDE - Datavizzy

Follow these steps IN ORDER to get your site live!

## ✅ Step 1: Buy Your Domain (DO THIS NOW!)
Go to one of these and buy datavizzy.com:
- Namecheap: https://namecheap.com
- Google Domains: https://domains.google.com
- Cloudflare: https://cloudflare.com/products/registrar

**Don't connect it yet** - we'll do that after deployment.

---

## ✅ Step 2: Set Up Clerk (5 minutes)

1. Go to: https://clerk.com
2. Click "Start Building for Free"
3. Create account and verify email
4. Create a new application:
   - Name: "Datavizzy"
   - Click "Create Application"
5. You'll see your dashboard - click "API Keys" in the sidebar
6. Copy these two keys (you'll need them in Step 5):
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

---

## ✅ Step 3: Set Up Stripe (10 minutes)

1. Go to: https://stripe.com
2. Create account (choose "Skip for now" on business questions)
3. Go to: **Developers → API Keys**
4. Copy these keys (you'll need them in Step 5):
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

5. Create your products:
   - Go to: **Products → Add Product**
   
   **Product 1: Starter**
   - Name: "Starter Plan"
   - Price: $299.00
   - Billing: Recurring, Monthly
   - Click "Save Product"
   - **Copy the Price ID** (starts with `price_...`)
   
   **Product 2: Pro**
   - Name: "Pro Plan"
   - Price: $599.00
   - Billing: Recurring, Monthly
   - Click "Save Product"
   - **Copy the Price ID**
   
   **Product 3: Enterprise**
   - Name: "Enterprise Plan"
   - Price: $1,299.00
   - Billing: Recurring, Monthly
   - Click "Save Product"
   - **Copy the Price ID**

---

## ✅ Step 4: Push to GitHub

1. Go to: https://github.com
2. Click "New Repository"
3. Name it "datavizzy-app" (or whatever you want)
4. **Don't** initialize with README
5. Click "Create Repository"

6. In your terminal, navigate to the datavizzy-app folder:
```bash
cd datavizzy-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/datavizzy-app.git
git branch -M main
git push -u origin main
```

---

## ✅ Step 5: Deploy to Vercel

1. Go to: https://vercel.com
2. Click "Sign Up" and choose "Continue with GitHub"
3. Click "Add New..." → "Project"
4. Find your "datavizzy-app" repository and click "Import"
5. Click on "Environment Variables" to expand it
6. Add ALL of these (one at a time):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = [your Clerk publishable key]
CLERK_SECRET_KEY = [your Clerk secret key]
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [your Stripe publishable key]
STRIPE_SECRET_KEY = [your Stripe secret key]
STRIPE_WEBHOOK_SECRET = whsec_placeholder
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID = [your Starter price ID]
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID = [your Pro price ID]
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID = [your Enterprise price ID]
NEXT_PUBLIC_APP_URL = http://localhost:3000
```

7. Click "Deploy"
8. Wait 2-3 minutes for deployment to complete
9. You'll get a URL like: `https://datavizzy-app-xxxxx.vercel.app`

---

## ✅ Step 6: Connect Your Domain

1. In Vercel, click on your project
2. Go to: **Settings → Domains**
3. Type "datavizzy.com" and click "Add"
4. Vercel will show you DNS records to add

5. Go to your domain registrar (Namecheap/GoDaddy/etc.)
6. Find DNS settings
7. Add these records:
   - **Type: A** | **Name: @** | **Value: 76.76.21.21**
   - **Type: CNAME** | **Name: www** | **Value: cname.vercel-dns.com**

8. Wait 10-60 minutes for DNS to propagate

9. Go back to Vercel and update this environment variable:
   - `NEXT_PUBLIC_APP_URL` = `https://datavizzy.com`

---

## ✅ Step 7: Set Up Stripe Webhooks

1. In Stripe dashboard, go to: **Developers → Webhooks**
2. Click "Add Endpoint"
3. Enter: `https://datavizzy.com/api/webhooks/stripe`
4. Click "Select Events" and choose:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add Endpoint"
6. Click to reveal the "Signing Secret" (starts with `whsec_...`)
7. Copy it

8. Go back to Vercel → Settings → Environment Variables
9. Find `STRIPE_WEBHOOK_SECRET` and update it with your real webhook secret
10. Redeploy (click "Deployments" tab → "..." → "Redeploy")

---

## ✅ Step 8: Test Everything!

### Test Sign Up
1. Go to: https://datavizzy.com
2. Click "Sign Up"
3. Create an account
4. Check that you can sign in

### Test Payments (Test Mode)
1. Go to: https://datavizzy.com/pricing
2. Click "Get Started" on any plan
3. Use this test card:
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Zip: Any 5 digits
4. Complete checkout
5. You should be redirected back to your site

### Test Request Submission
1. After subscribing, go to: https://datavizzy.com/submit-request
2. Fill out the form
3. Submit it
4. You should see a success message

---

## 🎉 YOU'RE DONE!

Your site is now live at: **https://datavizzy.com**

## 🔧 Next Steps (Optional)

1. **Switch to Live Mode in Stripe**
   - Go to Stripe dashboard
   - Toggle from "Test Mode" to "Live Mode"
   - Copy your LIVE API keys
   - Update environment variables in Vercel
   - Recreate your webhook with the live endpoint

2. **Add a Database**
   - Sign up for Supabase (free): https://supabase.com
   - Create a new project
   - Add Prisma to store requests and subscriptions

3. **Customize the Design**
   - Update colors, fonts, copy
   - Add your own example projects to the Work page

4. **Set Up Email Notifications**
   - Use Resend or SendGrid
   - Send emails when requests are submitted

---

## 🆘 Troubleshooting

**Site not loading after domain connection?**
- DNS takes time. Wait 30-60 minutes.
- Check your DNS records are correct.

**Sign-up not working?**
- Double-check Clerk keys in Vercel environment variables
- Make sure you added the Clerk URLs correctly

**Payments not working?**
- Verify Stripe keys are correct
- Check you created the price IDs
- Make sure you're in test mode

**Webhook errors?**
- Make sure webhook secret is correct
- Verify the endpoint URL is: https://datavizzy.com/api/webhooks/stripe

---

Need help? The README.md file has more detailed information!
