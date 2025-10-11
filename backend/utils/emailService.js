const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(to, subject, htmlContent) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        });
        return true;
    } catch (err) {
        console.error("Error sending email:", err);
        throw new Error("Email could not be sent");
    }
}

module.exports = { sendEmail };
