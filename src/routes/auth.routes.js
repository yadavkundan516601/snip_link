import express from "express";
import {
  initiateGoogleAuth,
  handleGoogleCallback,
  refreshAccessToken,
} from "../handlers/authHandlers.js";

const router = express.Router();

router.get("/auth", initiateGoogleAuth);
router.get("/auth/callback", handleGoogleCallback);
router.post("/refresh-token", refreshAccessToken);

export default router;
