import ApiError from "../utils/ApiError.js";

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        next(ApiError.internal(error?.message || "Internal Server Error"));
      }
    }
  };
};

export default asyncHandler;
