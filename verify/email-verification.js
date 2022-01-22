const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
const msg = {
  to: "masoliman28@gmail.com", // Change to your recipient
  from: "testersendgrid97@gmail.com", // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<body><p> Example 1 - just the code (no localization in the message):</p>The verification code is: <strong>{{twilio_code}}</strong><p></p></body>",
};

function sendEmail() {
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
module.exports = sendEmail;
