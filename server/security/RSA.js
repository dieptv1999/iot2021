const crypto = require("crypto");
// const rsaKeygen = require('rsa-keygen');

/**
 * @returns {'public_key':'','private_key':''}
 */
const genKeys = function () {
  return rsaKeygen.generate();
};

/**
 *
 * @param {base64 string} cipher
 * @param {string} priv
 */
const decrypt = function (cipher, priv) {
  let buffer = Buffer.from(cipher, "base64");
  let plaintext;
  plaintext = crypto.privateDecrypt(
    {
      key: priv,
    },
    buffer
  );
  return plaintext;
};

module.exports = {
  genKeys,
  decrypt,
};
