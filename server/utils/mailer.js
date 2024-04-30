const nodemailer = require('nodemailer');

// Configure the mail transporter based on environment variables
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Function to send email
function sendEmail(to, subject, text) {
  let mailOptions = {
    from: process.env.EMAIL_USERNAME, // Use the email configured in .env as the sender
    to: to,                           //Recipient email
    subject: subject,                 // theme
    text: text                        // text
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('An error occurred while sending email:', error);
    } else {
      console.log('Mail sent successfully:', info.response);
    }
  });
}

// Save verification code to database
function saveVerificationCode(email, code) {
    const verificationCode = new VerificationCode({
        code: code,
        email: email
    });
    return verificationCode.save().then(() => {
        // Send an email after successfully saving the verification code
        sendEmail(email, 'Verification code', `Your verification code is:${code}`);
    }).catch(err => {
        console.error('An error occurred while saving the verification code:', err);
    });
}

module.exports = sendEmail;


