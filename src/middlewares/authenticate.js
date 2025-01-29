import { auth, OAuth2Client } from "google-auth-library";
import { googleClientId, googleClientSecret } from "../config/app.config.js";
import ApiError from "../utils/ApiError.js";

// Initialize OAuth2 client
const oAuth2Client = new OAuth2Client(googleClientId, googleClientSecret, "");

const authenticateToken = async (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token is required" });
  }
  try {
    // Verify the token using Google OAuth2 client
    const tokenInfo = await oAuth2Client.getTokenInfo(accessToken);
    req.user = tokenInfo;

    next();
  } catch (error) {
    next(ApiError.unauthorized("Invalid or expired access token"));
  }
};

export default authenticateToken;
