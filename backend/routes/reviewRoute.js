const express = require("express");
const {
  createReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { authenticate, restrict } = require("../auth/verifyToken");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(authenticate, restrict(["patient"]), createReview);
// router.post("/", authenticate, restrict(["patient"]), createReview);
// router.get("/", getAllReviews);

module.exports = router;
