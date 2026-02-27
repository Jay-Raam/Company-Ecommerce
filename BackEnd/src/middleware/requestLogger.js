// Simple request logger middleware for GraphQL
export default function requestLogger(req, res, next) {
  try {
    const headers = req.headers;
    const cookies = req.cookies;
    const origin = headers.origin || headers.referer || "unknown";
    const previewBody =
      req.body && typeof req.body === "object"
        ? JSON.stringify(req.body).slice(0, 512)
        : String(req.body || "");

    console.log("\n-- Incoming Request --");
    console.log("host:", headers.host);
    console.log("connection:", headers.connection || "");
    console.log("'content-length':", headers["content-length"]);
    console.log("'sec-ch-ua-platform':", headers["sec-ch-ua-platform"]);
    console.log("user-agent:", headers["user-agent"]);
    console.log("'sec-ch-ua':", headers["sec-ch-ua"]);
    console.log("'content-type':", headers["content-type"]);
    console.log("sec-ch-ua-mobile:", headers["sec-ch-ua-mobile"]);
    console.log("accept:", headers.accept);
    console.log("origin:", origin);
    console.log("'sec-fetch-site':", headers["sec-fetch-site"]);
    console.log("'sec-fetch-mode':", headers["sec-fetch-mode"]);
    console.log("'sec-fetch-dest':", headers["sec-fetch-dest"]);
    console.log("referer:", headers.referer);
    console.log("accept-encoding:", headers["accept-encoding"]);
    console.log("accept-language:", headers["accept-language"]);

    console.log("\nRaw cookies:", cookies ?? "undefined");

    console.log("\nRequest body preview:", previewBody);
    console.log("-- End Request --\n");
  } catch (err) {
    console.error("Request logger error:", err.message);
  }

  return next();
}
