const accountSid = "AC879de637148f47fd906515dc7fec760b";
const authToken = "87451ef0f20c9499114d0b6f6446dedd";
const client = require("twilio")(accountSid, authToken);

function sendVerification() {
  client.verify
    .services("VA1761433de3278661ad5ef0bbc45cdf54")
    .verifications.create({ to: "masoliman28@gmail.com", channel: "email" })
    .then((verification) => console.log(verification));
}
function checkVerification() {
  client.verify
    .services("VA1761433de3278661ad5ef0bbc45cdf54")
    .verificationChecks.create({ to: "masoliman28@gmail.com", code: "123456" })
    .then((verification_check) => console.log(verification_check));
}
module.exports = { sendVerification, checkVerification };
