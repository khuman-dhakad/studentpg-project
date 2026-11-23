import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character] ?? character));
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields and length limits
    if (!name || typeof name !== 'string' || name.trim().length > 100 ||
        !email || typeof email !== 'string' || email.trim().length > 254 ||
        !subject || typeof subject !== 'string' || subject.trim().length > 140 ||
        !message || typeof message !== 'string' || message.trim().length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required and must not exceed length limits.',
        },
        { status: 400 }
      );
    }

    // Reject CR/LF characters in subject and email to prevent SMTP header injection
    if (/[\r\n]/.test(subject) || /[\r\n]/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid characters detected in email or subject.',
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
      replyTo: email.trim(),

      subject: `[Contact Us] ${subject.trim()}`,

      text: `
New Support Inquiry - StudentPG

Name: ${name.trim()}
Email: ${email.trim()}
Subject: ${subject.trim()}

Message:
${message.trim()}
      `,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">

          <h2>New Support Inquiry - StudentPG</h2>

          <hr />

          <p>
            <strong>Name:</strong>
            ${escapeHtml(name.trim())}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHtml(email.trim())}
          </p>

          <p>
            <strong>Subject:</strong>
            ${escapeHtml(subject.trim())}
          </p>

          <h3>Message:</h3>

          <p>
            ${escapeHtml(message.trim())}
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