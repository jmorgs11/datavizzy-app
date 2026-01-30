import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { clerkClient } from '@clerk/nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Subscription created:', session)
      
      // Save Stripe customer ID to Clerk user metadata
      if (session.metadata?.userId && session.customer) {
        try {
          await clerkClient.users.updateUserMetadata(session.metadata.userId, {
            publicMetadata: {
              stripeCustomerId: session.customer,
            },
          })
          console.log('Saved Stripe customer ID to Clerk user:', session.metadata.userId)
        } catch (error) {
          console.error('Error updating Clerk user metadata:', error)
        }
      }
      
      // TODO: Save subscription to database
      break

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription updated:', subscription)
      // TODO: Update subscription in database
      break

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      console.log('Subscription cancelled:', deletedSubscription)
      // TODO: Mark subscription as cancelled in database
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
