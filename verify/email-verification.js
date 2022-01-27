const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

function sendEmail(msg) {
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
