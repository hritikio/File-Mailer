// const nodemailer=require('nodemailer');
// // const upload =require('../Middleware/fileupload')

// const transporter=nodemailer.createTransport({
//     service:"gmail",
//     host:"smtp.gmail.com",
//     port:587,
//     secure:false,
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }
// });


// async function SendEmail(toEmail,files){  //email and file will be given , file will be an object made by multer 
    
//     try{

//     const attachments = files.map((file) => ({
//       filename: file.originalname,
//       content: file.buffer,
//       contentType: file.mimetype,
//     }));


//     await transporter.sendMail({ ///sendMail is inbuild function of nodemailer
//         from:process.env.EMAIL_USER,
//         to:toEmail,
//         subject:"File From FileMailer",
//         text:"Here is your file you uploaded",
//         attachments

//     })

//     console.log("Email sent to:", toEmail);
//     }
//     catch(err){
//         console.error("Email sending failed:", err);
//         throw err; 
//     }



// }
// module.exports=SendEmail;

//above code is using nodemailer to send mail
//below code is using brevo to send mail (use above to run locally and delete below code, its for online deployment only )

const axios = require("axios");

async function SendEmail(toEmail, files) {
  try {
    if (!toEmail || !files || files.length === 0) {
      throw new Error("Email or files missing");
    }

    // Convert files to Brevo-compatible attachments
    const attachments = files.map((file) => ({
      content: file.buffer.toString("base64"),
      name: file.originalname,
    }));

    const payload = {
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "FileMailer",
      },
      to: [
        {
          email: toEmail,
        },
      ],
      subject: "File from FileMailer",
      htmlContent: "<p>Your uploaded file(s) are attached.</p>",
      attachment: attachments,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    console.log("Email sent successfully to:", toEmail);
  } catch (err) {
    console.error("Brevo email failed:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = SendEmail;
