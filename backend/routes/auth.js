const express = require("express");
const router = express.Router();
const { checkUser, register, login } = require("../controllers/authController");

router.get("/check-user", checkUser);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
