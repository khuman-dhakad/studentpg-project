import nodemailer from 'nodemailer';

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character] ?? character));
}

export function createSupportTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
}

export function getSupportMailAddress() {
  const supportAddress = process.env.MAIL_FROM || process.env.EMAIL_USER;
  if (!supportAddress) {
    throw new Error('MAIL_FROM or EMAIL_USER must be configured');
  }
  return supportAddress;
}
