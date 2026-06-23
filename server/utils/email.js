import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const message = {
    from: `${process.env.FROM_NAME || 'Parki'} <${process.env.FROM_EMAIL || 'noreply@parki.ma'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };
  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
