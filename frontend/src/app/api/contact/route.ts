import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required.',
        },
        { status: 400 }
      );
    }

    // Create SMTP transporter using existing environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      secure: false,

      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Optional: verify SMTP connection before sending
    await transporter.verify();

    // Send email to StudentPG support/owner
    await transporter.sendMail({
      from: `"StudentPG Contact Form" <${process.env.MAIL_FROM}>`,

      to: process.env.MAIL_FROM,

      // When owner clicks Reply, reply goes to the user who submitted the form
      replyTo: email,

      subject: `[Contact Us] ${subject}`,

      text: `
New Support Inquiry - StudentPG

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">

          <h2>New Support Inquiry - StudentPG</h2>

          <hr />

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Subject:</strong>
            ${subject}
          </p>

          <h3>Message:</h3>

          <p>
            ${message}
          </p>

          <hr />

          <p style="color: #666;">
            This message was sent through the StudentPG Contact Form.
          </p>

        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact Form Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send email. Please try again later.',
      },
      { status: 500 }
    );
  }
}