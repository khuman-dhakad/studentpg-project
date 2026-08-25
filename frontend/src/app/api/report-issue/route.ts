import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const issueType = formData.get('issueType') as string;
    const pgListing = formData.get('pgListing') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File | null;

    // Nodemailer Transporter Setup (Use your App Password from Google)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g. studentpg.support@gmail.com
        pass: process.env.EMAIL_PASS, // Google App Password
      },
    });

    // Attachment setup if file is uploaded
    const attachments = [];
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // HTML Email Template to received in your Inbox
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'studentpg.support@gmail.com',
      subject: `🚨 NEW ISSUE REPORTED: ${issueType.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #e11d48;">🚨 New Issue Reported on StudentPG</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Issue Category:</strong> ${issueType}</p>
          <p><strong>Location/Area:</strong> ${location}</p>
          <p><strong>PG Listing Reference:</strong> ${pgListing || 'N/A'}</p>
          <p><strong>Description:</strong></p>
          <blockquote style="background: #f8fafc; padding: 12px; border-left: 4px solid #6366f1;">
            ${description}
          </blockquote>
          ${file ? `<p><strong>Attachment:</strong> Attached with this email (${file.name})</p>` : ''}
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 11px; color: #64748b;">This issue was reported via StudentPG Report Portal.</p>
        </div>
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Report sent to email successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send report email' },
      { status: 500 }
    );
  }
}