import nodemailer from "nodemailer";

const sendEmail = async (option) => {
  //CREATE A TRANSPORTER
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //DEFINE EMAIL OPTIONS
  const emailOptions = {
    from: "Cineflix support<support@cineflix.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  try {
    await transporter.sendMail(emailOptions);
  } catch (error) {}
};

export default sendEmail;
