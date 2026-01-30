import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { clerkClient } from '@clerk/nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// IMPORTANT: This tells Next.js to NOT parse the body
// Stripe webhooks need the raw body to verify signatures
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    console.error('No stripe-signature header found')
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  console.log('✅ Webhook verified:', event.type)

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      console.log('💰 Subscription created:', session.id)
      
      // Save Stripe customer ID to Clerk user metadata
      if (session.metadata?.userId && session.customer) {
        try {
          await clerkClient.users.updateUserMetadata(session.metadata.userId, {
            publicMetadata: {
              stripeCustomerId: session.customer as string,
            },
          })
          console.log('✅ Saved Stripe customer ID to Clerk user:', session.metadata.userId)
        } catch (error: any) {
          console.error('❌ Error updating Clerk user metadata:', error.message)
        }
      } else {
        console.log('⚠️ Missing userId or customer in session metadata')
      }
      
      break

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription
      console.log('🔄 Subscription updated:', subscription.id)
      break

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      console.log('❌ Subscription cancelled:', deletedSubscription.id)
      break

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
