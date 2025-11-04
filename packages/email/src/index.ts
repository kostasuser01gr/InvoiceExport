import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(params: {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
  }>;
}) {
  return resend.emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    attachments: params.attachments,
  });
}
