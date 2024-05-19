/**
 * Creates a JSON Web Token (JWT) using HMAC with SHA-256 algorithm.
 * @param {Object} options - The options object.
 * @param {string} options.privateKey - The private key used to sign the token.
 * @param {number} options.expiresInHours - The number of hours until the token expires.
 * @param {Object} [options.data={}] - The user payload to include in the token.
 * @returns {string} The JWT.
 */
const createJwt_ = ({ privateKey, expiresInHours, data = {} }) => {
  // Sign token using HMAC with SHA-256 algorithm
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Date.now();
  const expires = new Date(now);
  expires.setHours(expires.getHours() + expiresInHours);

  // iat = issued time, exp = expiration time
  const payload = {
    exp: Math.round(expires.getTime() / 1000),
    iat: Math.round((now - 50 * 1000) / 1000),
  };

  // add user payload
  Object.keys(data).forEach(function (key) {
    payload[key] = data[key];
  });

  /**
   * Base64 encodes the given text.
   * @param {string} text - The text to encode.
   * @param {boolean} [json=true] - Whether to encode the text as JSON.
   * @returns {string} The base64 encoded text.
   */
  const base64Encode = (text, json = true) => {
    const data = json ? JSON.stringify(text) : text;
    return Utilities.base64EncodeWebSafe(data).replace(/=+$/, "");
  };

  const toSign = `${base64Encode(header)}.${base64Encode(payload)}`;
  const signatureBytes = Utilities.computeHmacSha256Signature(
    toSign,
    privateKey
  );
  const signature = base64Encode(signatureBytes, false);
  return `${toSign}.${signature}`;
};

/**
 * Generates an access token using the provided data and private key.
 * @param {Object} data - The data to be included in the access token.
 * @returns {string} - The generated access token.
 */
const generateAccessToken_ = (data = {}) => {
  const accessToken = createJwt_({
    privateKey: PRIVATE_KEY,
    expiresInHours: 12,
    data,
  });

  return accessToken;
};

/**
 * Parses a JSON Web Token and returns the payload data.
 * @param {string} jsonWebToken - The JSON Web Token to parse.
 * @returns {object} - The payload data of the JSON Web Token.
 * @throws {Error} - If the token has expired or has an invalid signature.
 */
const parseJwt_ = (jsonWebToken) => {
  const [header, payload, signature] = jsonWebToken.split(".");
  const signatureBytes = Utilities.computeHmacSha256Signature(
    `${header}.${payload}`,
    PRIVATE_KEY
  );
  const validSignature = Utilities.base64EncodeWebSafe(signatureBytes);
  if (signature === validSignature.replace(/=+$/, "")) {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(payload)
    ).getDataAsString();
    const { exp, ...data } = JSON.parse(blob);
    if (new Date(exp * 1000) < new Date()) {
      throw new Error("The token has expired");
    }
    return data;
  } else {
    throw new Error("Invalid Signature");
  }
};
