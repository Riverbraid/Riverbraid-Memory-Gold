#!/usr/bin/env node
/**
 * Riverbraid Crypt Vault
 * Purpose: Ed25519 enforcement and PEM unification logic.
 */
const crypto = require('crypto');
const { logProof } = require("./proof-scaffold.cjs");

class CryptVault {
    generateSovereignKey() {
        // Enforcing Ed25519 as the protocol standard
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
        logProof('KEY_GENERATION_ED25519', true);
        return { publicKey, privateKey };
    }

    sign(data, privateKey) {
        const signature = crypto.sign(null, Buffer.from(data), privateKey);
        logProof('DATA_SIGNATURE_STATIONARY', true);
        return signature.toString('hex');
    }
}

module.exports = new CryptVault();
