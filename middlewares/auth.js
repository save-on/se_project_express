const jwt = require("jsonwebtoken");
const { jwtToken } = require("../utils/config");
const { unauthorized } = require("../utils/errors");

const handleAuthError = (res) =>
  res.status(unauthorized.code).send(unauthorized.text);

const extractBearerToken = (authorization) =>
  authorization.replace("Bearer ", "");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);

  let payload;

  try {
    payload = jwt.verify(token, jwtToken);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};

module.exports = auth;
