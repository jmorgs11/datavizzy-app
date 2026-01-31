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

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('💰 Checkout completed for session:', session.id)
        
        const clerkUserId = session.metadata?.clerkUserId
        const stripeCustomerId = session.customer as string

        console.log('📝 Clerk User ID:', clerkUserId)
        console.log('📝 Stripe Customer ID:', stripeCustomerId)

        if (clerkUserId && stripeCustomerId) {
          try {
            await clerkClient.users.updateUserMetadata(clerkUserId, {
              publicMetadata: {
                stripeCustomerId: stripeCustomerId,
              },
            })
            console.log('✅ Successfully linked Stripe customer to Clerk user!')
            console.log(`   Clerk: ${clerkUserId} → Stripe: ${stripeCustomerId}`)
          } catch (clerkError: any) {
            console.error('❌ Error updating Clerk user:', clerkError.message)
          }
        } else {
          console.warn('⚠️ Missing clerkUserId or stripeCustomerId in session')
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
  } catch (handlerError: any) {
    console.error('❌ Error handling webhook event:', handlerError.message)
  }

  return NextResponse.json({ received: true })
}
