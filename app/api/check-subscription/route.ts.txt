import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ hasActiveSubscription: false }, { status: 401 })
    }

    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ hasActiveSubscription: false }, { status: 401 })
    }

    // Get the Stripe customer ID from user metadata
    const stripeCustomerId = user.publicMetadata?.stripeCustomerId as string | undefined

    if (!stripeCustomerId) {
      return NextResponse.json({ hasActiveSubscription: false })
    }

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    })

    const hasActiveSubscription = subscriptions.data.length > 0

    return NextResponse.json({ 
      hasActiveSubscription,
      subscription: hasActiveSubscription ? subscriptions.data[0] : null
    })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json({ hasActiveSubscription: false }, { status: 500 })
  }
}
