// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library CertificateTypes {
    struct Certificate {
        uint256 tokenId;
        address recipient;
        address issuer;
        string metadataCID;
        uint256 issuedAt;
        bool revoked;
    }
}