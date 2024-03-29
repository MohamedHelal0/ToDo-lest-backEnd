function handleMissingRoute(req, res, next) {
  res.status(404);
}
module.exports = { handleMissingRoute };
