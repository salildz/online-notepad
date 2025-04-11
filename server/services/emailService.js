const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailTemplates = {
  en: {
    subject: 'Verify Your Email Address',
    text: (url) => `Please verify your email by clicking the following link: ${url}`,
    html: (url) => `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Email Verification</h2>
          <p>Click the button below to verify your email address:</p>
          <a href="${url}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>If you did not request this, please ignore this email.</p>
      </div>
    `
  },
  tr: {
    subject: 'E-posta Adresinizi Doğrulayın',
    text: (url) => `E-postanızı doğrulamak için aşağıdaki bağlantıya tıklayın: ${url}`,
    html: (url) => `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>E-posta Doğrulama</h2>
          <p>E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>
          <a href="${url}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">E-postayı Doğrula</a>
          <p>Eğer bu isteği siz yapmadıysanız, lütfen bu e-postayı görmezden gelin.</p>
      </div>
    `
  }
};


const sendVerificationEmail = async (to, token, language = 'tr') => {
  const clientURL = process.env.CLIENT_URL || 'http://localhost:9000';
  const url = `${clientURL}/verify-email?token=${token}`;
  const template = emailTemplates[language] || emailTemplates.tr;

  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject: template.subject,
    text: template.text(url),
    html: template.html(url)
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendVerificationEmail };