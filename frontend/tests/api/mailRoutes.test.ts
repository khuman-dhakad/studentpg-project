import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });
const mockVerify = vi.fn().mockResolvedValue(true);

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      verify: mockVerify,
      sendMail: mockSendMail,
    })),
  },
}));

import { POST as contactHandler } from '../../src/app/api/contact/route';
import { POST as reportIssueHandler } from '../../src/app/api/report-issue/route';

describe('Mail Routes with upgraded Nodemailer transport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAIL_HOST = 'smtp.example.com';
    process.env.MAIL_PORT = '587';
    process.env.MAIL_FROM = 'support@studentpg.com';
    process.env.MAIL_USERNAME = 'user@example.com';
    process.env.MAIL_PASSWORD = 'password';
    process.env.EMAIL_USER = 'studentpg.support@gmail.com';
    process.env.EMAIL_PASS = 'app-password';
  });

  describe('POST /api/contact', () => {
    it('returns 400 when required fields are missing', async () => {
      const req = new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'John' }),
      });

      const res = await contactHandler(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('sends email and returns 200 on valid contact payload with HTML escaping', async () => {
      const req = new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '<script>alert("xss")</script>',
          email: 'jane@example.com',
          subject: 'PG Inquiry & Details',
          message: 'Hello, <b>bold</b> & nice.',
        }),
      });

      const res = await contactHandler(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockVerify).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const mailCall = mockSendMail.mock.calls[0][0];
      expect(mailCall.to).toBe('support@studentpg.com');
      expect(mailCall.replyTo).toBe('jane@example.com');
      expect(mailCall.html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(mailCall.html).toContain('PG Inquiry &amp; Details');
      expect(mailCall.html).toContain('&lt;b&gt;bold&lt;/b&gt; &amp; nice.');
    });

    it('rejects CR/LF injection in subject and email with 400 status', async () => {
      const subjectInjectionReq = new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Attacker',
          email: 'attacker@example.com',
          subject: 'Inquiry\r\nBcc: victim@example.com',
          message: 'Spam attack',
        }),
      });

      const resSubject = await contactHandler(subjectInjectionReq);
      expect(resSubject.status).toBe(400);
      const dataSubject = await resSubject.json();
      expect(dataSubject.message).toContain('Invalid characters');

      const emailInjectionReq = new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Attacker',
          email: 'attacker@example.com\nCc: victim@example.com',
          subject: 'Normal Subject',
          message: 'Spam attack',
        }),
      });

      const resEmail = await contactHandler(emailInjectionReq);
      expect(resEmail.status).toBe(400);
      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/report-issue', () => {
    it('returns 400 when issueType or description is missing', async () => {
      const formData = new FormData();
      formData.append('location', 'MP Nagar');

      const req = new Request('http://localhost/api/report-issue', {
        method: 'POST',
        body: formData,
      });

      const res = await reportIssueHandler(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('rejects CR/LF injection in issueType', async () => {
      const formData = new FormData();
      formData.append('issueType', 'Pricing\r\nBcc: attacker@example.com');
      formData.append('description', 'The listed price differs from actual rent.');

      const req = new Request('http://localhost/api/report-issue', {
        method: 'POST',
        body: formData,
      });

      const res = await reportIssueHandler(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('sends email and returns 200 on valid report-issue payload', async () => {
      const formData = new FormData();
      formData.append('issueType', 'Pricing Discrepancy');
      formData.append('pgListing', 'Shree PG');
      formData.append('location', 'MP Nagar');
      formData.append('description', 'The listed price differs from actual rent.');

      const req = new Request('http://localhost/api/report-issue', {
        method: 'POST',
        body: formData,
      });

      const res = await reportIssueHandler(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const mailCall = mockSendMail.mock.calls[0][0];
      expect(mailCall.subject).toContain('Pricing Discrepancy');
    });
  });
});
