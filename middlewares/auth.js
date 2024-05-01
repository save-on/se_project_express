const jwt = require("jsonwebtoken");
const { jwtToken } = require("../utils/config");

const handleAuthError = (res) => {
  res.status(401).send({ message: "Authorization required" });
};

const extractBearerToken = (authorization) => {
  return authorization.replace("Bearer ", "");
};

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);

  console.log(extractBearerToken("Bearer 03287302897023987"));

  let payload;

  try {
    payload = jwt.verify(token, jwtToken);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
}

module.exports = auth;
