// src/utils/verifySignature.js
const crypto = require('crypto');

function safeEqual(a, b) {
    const ba = Buffer.from(a || '', 'utf8');
    const bb = Buffer.from(b || '', 'utf8');
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
}

function verifyGiteaSignature(signatureHeader, rawBody, secret) {
    const computed = crypto.createHmac('sha256', secret).update(rawBody || Buffer.alloc(0)).digest('hex');
    return safeEqual(signatureHeader, computed);
}

module.exports = { verifyGiteaSignature };
