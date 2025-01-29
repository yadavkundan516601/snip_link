import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import {
  googleClientId,
  googleClientSecret,
  googleRedirectUrl,
} from "../config/app.config.js";
import {
  GOOGLE_AUTH_SCOPES,
  REFRESH_TOKEN_EXPIRY_DAYS,
} from "../config/constants.js";
import { models } from "../models/index.js";
import { Op } from "sequelize";
import ApiError from "../utils/ApiError.js";

class AuthService {
  constructor() {
    this.oAuth2Client = new OAuth2Client(
      googleClientId,
      googleClientSecret,
      googleRedirectUrl
    );
  }

  generateAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GOOGLE_AUTH_SCOPES,
      prompt: "consent",
    });
  }

  async handleGoogleCallback(code) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);

    if (!tokens.refresh_token) {
      throw ApiError.badRequest("Refresh token not received");
    }

    const userInfo = await this.getUserInfo(tokens);
    const user = await this.findOrCreateUser(userInfo, tokens.refresh_token);

    return { user, tokens };
  }

  async getUserInfo(tokens) {
    const oauth2 = google.oauth2("v2");
    const response = await oauth2.userinfo.v2.me.get({
      auth: this.oAuth2Client,
    });
    return response.data;
  }

  async findOrCreateUser(userInfo, refreshToken) {
    let user = await models.User.findOne({
      where: { google_id: userInfo.id },
    });

    if (user) {
      await user.setRefreshToken(refreshToken);
    } else {
      user = await models.User.create({
        google_id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
      });
      await user.setRefreshToken(refreshToken);
    }

    return user;
  }

  async refreshAccessToken(refreshToken) {
    const user = await models.User.findOne({
      where: { refresh_token: { [Op.ne]: null } },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const isValid = await user.isRefreshTokenValid(refreshToken);
    if (!isValid) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    this.oAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { tokens } = await this.oAuth2Client.refreshToken(refreshToken);
    this.oAuth2Client.setCredentials(tokens);

    return tokens;
  }

  setAuthCookies(res, tokens) {
    const expiryDate = parseInt(tokens.expiry_date);
    const currentTime = Date.now();
    const timeRemaining = expiryDate - currentTime;

    res.cookie("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: timeRemaining,
    });

    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    });
  }
}

export const authService = new AuthService();
