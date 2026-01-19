const express = require("express");
const router = express.Router();
const { userUpload } = require("../middlewares/uploads.middleware");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require("../controllers/users.controller");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", userUpload.single("userImage"), createUser);
router.put("/:id", userUpload.single("userImage"), updateUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
