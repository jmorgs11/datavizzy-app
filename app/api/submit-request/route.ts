import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, deadline, dataType, userEmail } = body

    // Here you would save to your database
    // For now, we'll just log it and return success
    console.log('New request:', {
      userId,
      userEmail,
      title,
      description,
      deadline,
      dataType,
      createdAt: new Date().toISOString()
    })

    // TODO: Save to database
    // Example:
    // await prisma.request.create({
    //   data: {
    //     userId,
    //     userEmail,
    //     title,
    //     description,
    //     deadline,
    //     dataType,
    //   }
    // })

    return NextResponse.json({ success: true, message: 'Request submitted successfully' })
  } catch (error) {
    console.error('Error submitting request:', error)
    return NextResponse.json(
      { error: 'Error submitting request' },
      { status: 500 }
    )
  }
}
