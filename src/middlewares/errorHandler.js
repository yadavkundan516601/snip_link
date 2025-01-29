import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(
        new ApiResponse(err.statusCode, null, err.message, err.errors || null)
      );
  }
  console.error("Unexpected Error:", err);
  return res
    .status(500)
    .json(new ApiResponse(500, null, "Internal Server Error", null));
};

export default errorHandler;
