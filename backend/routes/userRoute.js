const express = require("express");
const {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticate, restrict } = require("../auth/verifyToken");

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);
router.get("/", authenticate, restrict(["admin"]), getAllUser);
router.post("/update/:id", authenticate, restrict(["patient"]), updateUser);
router.delete("/delete/:id", authenticate, restrict(["patient"]), deleteUser);

module.exports = router;
