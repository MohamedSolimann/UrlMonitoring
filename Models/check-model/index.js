function updateRequestBody(req) {
  let updatedBody = {};
  if (req.body.checkname) {
    updatedBody.checkname = req.body.checkname;
  }
  if (req.body.url) {
    updatedBody.url = req.body.url;
  }
  if (req.body.protocol) {
    updatedBody.protocol = req.body.protocol;
  }
  if (req.body.path) {
    updatedBody.path = req.body.path;
  }
  if (req.body.webhook) {
    updatedBody.webhook = req.body.webhook;
  }
  if (req.body.port) {
    updatedBody.port = req.body.port;
  }
  if (req.body.status) {
    updatedBody.status = req.body.status;
  }
  if (req.body.timeout) {
    updatedBody.timeout = req.body.timeout;
  }
  if (req.body.interval) {
    updatedBody.interval = req.body.interval;
  }
  return updatedBody;
}

module.exports = { updateRequestBody };
