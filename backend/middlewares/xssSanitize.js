const DOMPurify = require('isomorphic-dompurify');

const sanitizeOptions = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
};

const xssSanitize = (req, res, next) => {
  try {
    if (req.body && Object.keys(req.body).length !== 0)
      req.body = JSON.parse(
        DOMPurify.sanitize(JSON.stringify(req.body), sanitizeOptions)
      );
    if (req.query && Object.keys(req.query).length !== 0)
      req.query = JSON.parse(
        DOMPurify.sanitize(JSON.stringify(req.query), sanitizeOptions)
      );
  } catch (err) {
    return next(err);
  }

  next();
};

module.exports = xssSanitize;
