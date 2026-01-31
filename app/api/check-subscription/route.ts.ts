import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs'

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

    // Simply read from cached metadata - no Stripe API call!
    const hasActiveSubscription = user.publicMetadata?.hasActiveSubscription === true

    console.log('🔍 Subscription check for user:', userId)
    console.log('📝 Cached status:', hasActiveSubscription)

    return NextResponse.json({ 
      hasActiveSubscription
    })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json({ hasActiveSubscription: false }, { status: 500 })
  }
}
