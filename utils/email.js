const nodemailer = require('nodemailer');
const { options } = require('../routes/userRoutes');

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) Define email options
  const emailOptions = {
    from: 'Aakash Shivanshu <aakashshivanshu5@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
    // html:
  };

  //3) Actually send email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;