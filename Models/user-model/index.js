function updateRequestBody(req) {
  let updatedBody = {};
  if (req.body.username) {
    updatedBody.username = req.body.username;
  }
  if (req.body.password) {
    updatedBody.password = req.body.password;
  }
  if (req.body.email) {
    updatedBody.email = req.body.email;
  }
  return updatedBody;
}

module.exports = { updateRequestBody };
