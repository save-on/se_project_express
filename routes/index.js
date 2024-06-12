const router = require("express").Router();
const itemRouter = require("./items");
const likeRouter = require("./likes");
const userRouter = require("./users");
const NotFoundError = require("../utils/errorclasses/NotFoundError");
const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateUserCredentials,
} = require("../middlewares/validation");

router.post("/signin", validateUserCredentials, login);
router.post("/signup", validateUserBody, createUser);
router.use("/items", itemRouter);
router.use("/items", likeRouter);
router.use("/users", userRouter);

// Defensive code
router.use(() => {
  throw new NotFoundError("The Requested resource was not found.");
});

module.exports = router;
