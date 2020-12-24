const crypto = require('crypto');

const verifySignature = (val, signature, public_key) => {

    // Signing
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.write(val);
    verifier.end();

    // Verify file signature ( support formats 'binary', 'hex' or 'base64')
    const result = verifier.verify(public_key, signature, 'base64');

    return result
}


module.exports = {
    verifySignature
}