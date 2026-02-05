const nodemailer = require("nodemailer");
// const upload =require('../Middleware/fileupload')

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function SendEmail(toEmail, files) {
  //email and file will be given , file will be an object made by multer

  try {
    const attachments = files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype,
    }));

    await transporter.sendMail({
      ///sendMail is inbuild function of nodemailer
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "File From FileMailer",
      text: "Here is your file you uploaded",
      attachments,
    });

    console.log("Email sent to:", toEmail);
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
}
module.exports = SendEmail;
