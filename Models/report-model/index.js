function updateRequestBody(req) {
  let updatedBody = {};
  if (req.body.status) {
    updatedBody.status = req.body.status;
  }
  if (req.body.availability) {
    updatedBody.availability = req.body.availability;
  }
  if (req.body.outages) {
    updatedBody.outages = req.body.outages;
  }
  if (req.body.uptime) {
    updatedBody.uptime = req.body.uptime;
  }
  if (req.body.downtime) {
    updatedBody.downtime = req.body.downtime;
  }
  if (req.body.history) {
    updatedBody.history = req.body.history;
  }
  if (req.body.responsetime) {
    updatedBody.responsetime = req.body.responsetime;
  }
  if (req.body.url) {
    updatedBody.url = req.body.url;
  }
  return updatedBody;
}

module.exports = { updateRequestBody };
