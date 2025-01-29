// list of required environment variables
const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "DB_URL",
  "GOOGLE_REDIRECT_URL",
];

const GOOGLE_AUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const appConstants = {
  requiredEnvVars,
  GOOGLE_AUTH_SCOPES,
  REFRESH_TOKEN_EXPIRY_DAYS,
};

export default appConstants;

export { requiredEnvVars, GOOGLE_AUTH_SCOPES, REFRESH_TOKEN_EXPIRY_DAYS };
