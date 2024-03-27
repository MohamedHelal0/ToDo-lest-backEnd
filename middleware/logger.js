
const logger = (req, res, next) => {
  console.log(`Request to: ${req.url} with method: ${req.method}`);
  next();
};
exports.logger = logger;
