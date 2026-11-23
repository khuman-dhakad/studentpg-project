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

    it('sends email and returns 200 on valid contact payload', async () => {
      const req = new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Doe',
          email: 'jane@example.com',
          subject: 'PG Inquiry',
          message: 'Hello, I have a question about room amenities.',
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
