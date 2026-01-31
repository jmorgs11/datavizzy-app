import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { clerkClient } from '@clerk/nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    console.error('❌ No stripe-signature header')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('❌ Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  console.log('✅ Webhook verified:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('💰 Checkout completed for session:', session.id)
        
        const clerkUserId = session.metadata?.clerkUserId
        const stripeCustomerId = session.customer as string

        if (clerkUserId && stripeCustomerId) {
          await clerkClient.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              stripeCustomerId: stripeCustomerId,
              hasActiveSubscription: true,  // ← Cache subscription status!
            },
          })
          console.log('✅ Linked Stripe customer and set active subscription to TRUE')
        }
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        console.log('🔄 Subscription updated:', subscription.id, 'Status:', subscription.status)
        
        // Find the Clerk user with this Stripe customer ID
        const users = await clerkClient.users.getUserList({
          limit: 100,
        })
        
        const user = users.data.find(u => u.publicMetadata?.stripeCustomerId === subscription.customer)
        
        if (user) {
          const isActive = subscription.status === 'active'
          await clerkClient.users.updateUserMetadata(user.id, {
            publicMetadata: {
              stripeCustomerId: subscription.customer,
              hasActiveSubscription: isActive,  // ← Update cache!
            },
          })
          console.log(`✅ Updated subscription status to ${isActive} for user ${user.id}`)
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log('❌ Subscription cancelled:', deletedSubscription.id)
        
        // Find the Clerk user with this Stripe customer ID
        const allUsers = await clerkClient.users.getUserList({
          limit: 100,
        })
        
        const cancelledUser = allUsers.data.find(u => u.publicMetadata?.stripeCustomerId === deletedSubscription.customer)
        
        if (cancelledUser) {
          await clerkClient.users.updateUserMetadata(cancelledUser.id, {
            publicMetadata: {
              stripeCustomerId: deletedSubscription.customer,
              hasActiveSubscription: false,  // ← Set to false!
            },
          })
          console.log(`✅ Set subscription to FALSE for user ${cancelledUser.id}`)
        }
        break

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }
  } catch (handlerError: any) {
    console.error('❌ Error handling webhook event:', handlerError.message)
  }

  return NextResponse.json({ received: true })
}
