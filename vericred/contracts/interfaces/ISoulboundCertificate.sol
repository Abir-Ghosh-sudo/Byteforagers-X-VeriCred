// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISoulboundCertificate {
    struct Certificate {
        uint256 tokenId;
        address recipient;
        address issuer;
        string metadataCID;
        uint256 issuedAt;
        bool revoked;
    }

    function addIssuer(address issuer) external;

    function removeIssuer(address issuer) external;

    function mintCertificate(
        address recipient,
        string calldata metadataCID
    ) external returns (uint256);

    function getCertificate(
        uint256 tokenId
    ) external view returns (Certificate memory);

    function verifyCertificate(
        uint256 tokenId
    )
        external
        view
        returns (
            bool valid,
            address recipient,
            address issuer,
            string memory metadataCID,
            uint256 issuedAt,
            bool revoked
        );

    function revokeCertificate(uint256 tokenId) external;

    function authorizedIssuers(
        address issuer
    ) external view returns (bool);

    function tokenURI(
        uint256 tokenId
    ) external view returns (string memory);
}