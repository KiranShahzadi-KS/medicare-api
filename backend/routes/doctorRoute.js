const express = require("express");
const {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
} = require("../controllers/doctorController");
const { authenticate, restrict } = require("../auth/verifyToken");
const reviewRouter = require("./reviewRoute");

const router = express.Router();

//nested route
router.use("/:doctorId/reviews", reviewRouter);

router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctor);
router.post("/update/:id", authenticate, restrict(["doctor"]), updateDoctor);
router.delete("/delete/:id", authenticate, restrict(["doctor"]), deleteDoctor);

module.exports = router;
