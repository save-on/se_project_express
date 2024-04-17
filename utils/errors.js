const success = 200;
const created = 201;
const badRequest = {
  code: 400,
  text: {
    message: "The request could not be processed due to invalid input data."
  }
};
const notFound = {
  code: 404,
  text: {
    message: "The Requested resource was not found."
  }
};
const internalError = {
  code: 500,
  text: {
    message: "An unexpected internal problem has occurred, please try again later"
  }
};

module.exports = {
  success,
  created,
  badRequest,
  notFound,
  internalError
}