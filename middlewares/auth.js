const jwt = require("jsonwebtoken");
const { jwtToken } = require("../utils/config");
const UnauthorizedError = require("../utils/errorclasses/UnauthorizedError");

const handleAuthError = () => {
  throw new UnauthorizedError(
    "Unauthorized, you must provide valid credentials to access this resource"
  );
};

const extractBearerToken = (authorization) =>
  authorization.replace("Bearer ", "");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError();
  }

  const token = extractBearerToken(authorization);

  let payload;

  try {
    payload = jwt.verify(token, jwtToken);
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload;

  return next();
};

module.exports = auth;
