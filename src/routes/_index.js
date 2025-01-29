import express from "express";
import auth from "../middlewares/authenticate.js";
import ApiError from "../utils/ApiError.js";

import authRoutes from "./auth.routes.js";
// import shortenRoutes from "./shorten.routes.js";
// import analyticsRoutes from "./analytics.routes.js";

const router = express.Router();

// Authentication Routes
router.use("/", authRoutes);

// Authentication middleware for Protected Routes
// router.use(auth);

//Application routes
// router.use("/shorten");
// router.use("/analytics");

// Universal Router
router.use("*", (req, res, next) => {
  next(ApiError.notFound("Invalid Route"));
});

export default router;
