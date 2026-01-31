import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, dataType, userEmail, userName, file } = body

    // Prepare email content
    const emailContent = `
New Visualization Request from Datavizzy

---
Customer Information:
- Name: ${userName}
- Email: ${userEmail}
- User ID: ${user.id}

---
Request Details:
- Project Title: ${title}
- Data Type: ${dataType}
- Description: ${description}

---
Attached File:
- File Name: ${file.name}
- File Type: ${file.type}

---
Submitted: ${new Date().toLocaleString()}

The data file has been included as an attachment.
    `.trim()

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Datavizzy Requests <requests@datavizzy.com>',
            to: process.env.ADMIN_EMAIL || 'your-email@example.com',
            subject: `New Request: ${title}`,
            text: emailContent,
            attachments: [
              {
                filename: file.name,
                content: file.data,
              }
            ]
          }),
        })

        if (!emailResponse.ok) {
          console.error('Failed to send email via Resend')
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }
    } else {
      // Fallback: Log to console if Resend is not configured
      console.log('=== NEW REQUEST SUBMITTED ===')
      console.log(emailContent)
      console.log('File:', file.name)
      console.log('=============================')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Request submitted successfully. We\'ll get back to you within 1-2 business days' 
    })
  } catch (error) {
    console.error('Error submitting request:', error)
    return NextResponse.json(
      { error: 'Error submitting request. Please try again.' },
      { status: 500 }
    )
  }
}