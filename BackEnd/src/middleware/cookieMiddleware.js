/**
 * Cookie Middleware - Sets httpOnly cookies after login/register
 *
 * This middleware intercepts GraphQL responses and sets httpOnly cookies
 * for authentication tokens.
 */

const setAuthCookies = (req, res, next) => {
  // Store the original json method
  const originalJson = res.json.bind(res);

  // Override json method
  res.json = function (data) {
    console.log("📤 Response being sent:", {
      hasData: !!data?.data,
      hasErrors: !!data?.errors,
      loginUser: !!data?.data?.loginUser,
      registerUser: !!data?.data?.registerUser,
    });

    try {
      // Handle login/register responses with tokens
      if (
        data?.data?.loginUser?.accessToken ||
        data?.data?.registerUser?.accessToken
      ) {
        const user = data.data.loginUser || data.data.registerUser;
        console.log(
          "🍪 Found tokens in response, setting cookies for:",
          user.email,
        );

        // Set httpOnly cookies
        setTokenCookies(res, user.accessToken, user.refreshToken);

        // Remove tokens from response (don't send to client)
        if (data.data.loginUser) {
          console.log("🔒 Removing tokens from loginUser response (security)");
          delete data.data.loginUser.accessToken;
          delete data.data.loginUser.refreshToken;
          delete data.data.loginUser.expiresIn;
        }
        if (data.data.registerUser) {
          console.log(
            "🔒 Removing tokens from registerUser response (security)",
          );
          delete data.data.registerUser.accessToken;
          delete data.data.registerUser.refreshToken;
          delete data.data.registerUser.expiresIn;
        }
      } else {
        if (data?.data?.loginUser || data?.data?.registerUser) {
          console.log(
            "⚠️ loginUser/registerUser in response but NO accessToken found",
          );
        }
      }

      // Handle token refresh responses
      if (data?.data?.refreshAccessToken?.accessToken) {
        const { accessToken } = data.data.refreshAccessToken;
        console.log("🔄 Refreshing access token cookie");
        res.cookie(
          "accessToken",
          accessToken,
          getCookieOptions("15m", process.env.NODE_ENV === "production"),
        );
      }

      // Clear cookies on logout
      if (data?.data?.logout) {
        console.log("🚪 Clearing cookies on logout");
        res.clearCookie("accessToken", { path: "/", domain: "localhost" });
        res.clearCookie("refreshToken", { path: "/", domain: "localhost" });
      }
    } catch (middlewareError) {
      console.error("🔴 Cookie middleware error:", middlewareError.message);
    }

    // Call original json method
    return originalJson(data);
  };

  next();
};

/**
 * Set both access and refresh token cookies
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = getCookieOptions("15m", isProduction);

  try {
    if (!accessToken || !refreshToken) {
      console.error("❌ CRITICAL: Missing tokens! Cannot set cookies");
      return;
    }

    // Access Token Cookie (15 minutes)
    console.log("🍪 Setting accessToken cookie...");
    res.cookie("accessToken", accessToken, cookieOptions);

    // Refresh Token Cookie (7 days)
    console.log("🍪 Setting refreshToken cookie...");
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions("7d", isProduction),
    );
  } catch (error) {
    console.error("❌ Error setting cookies:", error.message);
    console.error("Stack:", error.stack);
  }
};

/**
 * Get standard cookie options
 */
const getCookieOptions = (expiresIn = "15m", isProduction = false) => {
  const maxAge = parseExpiryToMs(expiresIn);

  // 🔧 Development: Allow cookies across localhost ports
  if (!isProduction) {
    return {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      domain: "localhost",
      maxAge,
      // domain: "localhost" is necessary for cookies to work across localhost:5173 and localhost:4000
    };
  }

  // Production: HTTPS required with strict security
  return {
    httpOnly: true,
    secure: true, // HTTPS only in production
    sameSite: "strict", // Strict CSRF protection (most secure)
    path: "/",
    domain: process.env.COOKIE_DOMAIN || "yourdomain.com",
    maxAge,
  };
};

/**
 * Convert expiry string to milliseconds
 */
const parseExpiryToMs = (expiresIn) => {
  const match = expiresIn.match(/(\d+)([a-z]+)/);
  if (!match) return 15 * 60 * 1000;

  const [, amount, unit] = match;
  const num = parseInt(amount);

  switch (unit) {
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
};

/**
 * Get cookie domain based on environment
 * Important: For localhost development, domain should be undefined (not set)
 * This ensures cookies work across localhost:4000 and localhost:5173
 */
const getCookieDomain = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.COOKIE_DOMAIN || "yourdomain.com";
  }
  // 🔧 For development: Don't set domain (undefined)
  // This makes the cookie apply to the current domain only
  return undefined;
};

/**
 * Middleware to verify and extract token from cookies
 */
const extractTokenFromCookie = (req, res, next) => {
  console.log("\n[COOKIE EXTRACTION]");
  console.log("Request Origin:", req.get("origin"));
  console.log("Request Host:", req.get("host"));
  console.log("Raw Cookie Header:", req.get("cookie") || "NO COOKIES");
  console.log("Parsed Cookies Object:", Object.keys(req.cookies));

  const token = req.cookies.accessToken;

  if (token) {
    const preview =
      token.substring(0, 20) + "..." + token.substring(token.length - 10);
    req.headers.authorization = `Bearer ${token}`;
  } else {
    console.log("NO accessToken cookie found");
    if (Object.keys(req.cookies).length > 0) {
      console.log("Cookies present:", Object.keys(req.cookies));
    } else {
      console.log("NO cookies in request at all");
    }
  }
  console.log("");

  next();
};

export { setAuthCookies, extractTokenFromCookie, getCookieOptions };
