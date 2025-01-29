import { authService } from "../services/authService.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const initiateGoogleAuth = (req, res) => {
  const authUrl = authService.generateAuthUrl();
  res.redirect(authUrl);
};
  
const handleGoogleCallback = asyncHandler(async (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    return next(ApiError.badRequest("Authorization code is required"));
  }
  const { tokens } = await authService.handleGoogleCallback(code);
  authService.setAuthCookies(res, tokens);

  res.status(200).json(new ApiResponse(200, null, "Login successful"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refresh_token: refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(ApiError.badRequest("Refresh token is required"));
  }

  const tokens = await authService.refreshAccessToken(refreshToken);
  authService.setAuthCookies(res, { ...tokens, refresh_token: refreshToken });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        access_token: tokens.access_token,
        refresh_token: refreshToken,
      },
      "Token refreshed successfully"
    )
  );
});

export { initiateGoogleAuth, handleGoogleCallback, refreshAccessToken };
