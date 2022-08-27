const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// /api/users/........
router.post("/signup", userController.user_register);
router.post("/login", userController.user_login);
router.post("/gethospital", userController.getUserDetails);
router.post("/updateroomstatus", userController.updateUser);
router.post("/getrooms", userController.getRoom);
router.post("/addfloor", userController.addFloor);
// just made it in case we decide to make a admin portal
router.post("/all", userController.getAllUsers);
module.exports = router;