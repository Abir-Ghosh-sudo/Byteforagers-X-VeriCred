// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SoulboundCertificate
 * @dev Non-transferable ERC-721 certificates for educational credentials.
 *
 * Features:
 * - Only authorized issuers can mint certificates
 * - Certificates are permanently bound to the recipient wallet
 * - Certificate metadata is referenced through an IPFS CID
 * - Certificates can be revoked
 * - Anyone can verify a certificate on-chain
 */
contract SoulboundCertificate is ERC721, Ownable {
    // ------------------------------------------------------------
    // Structs
    // ------------------------------------------------------------

    struct Certificate {
        uint256 tokenId;
        address recipient;
        address issuer;
        string metadataCID;
        uint256 issuedAt;
        bool revoked;
    }

    // ------------------------------------------------------------
    // State variables
    // ------------------------------------------------------------

    uint256 private _nextTokenId = 1;

    // Authorized issuer addresses
    mapping(address => bool) public authorizedIssuers;

    // Certificate data by token ID
    mapping(uint256 => Certificate) private _certificates;

    // ------------------------------------------------------------
    // Events
    // ------------------------------------------------------------

    event IssuerAdded(address indexed issuer);

    event IssuerRemoved(address indexed issuer);

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        address indexed issuer,
        string metadataCID,
        uint256 issuedAt
    );

    event CertificateRevoked(
        uint256 indexed tokenId,
        address indexed issuer
    );

    // ------------------------------------------------------------
    // Modifiers
    // ------------------------------------------------------------

    modifier onlyIssuer() {
        require(
            authorizedIssuers[msg.sender],
            "Not an authorized issuer"
        );
        _;
    }

    // ------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------

    constructor()
        ERC721("VeriCred Certificate", "VCERT")
        Ownable(msg.sender)
    {}

    // ------------------------------------------------------------
    // Issuer Management
    // ------------------------------------------------------------

    /**
     * @dev Add an address to the authorized issuer list.
     * Only the contract owner can do this.
     */
    function addIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        require(!authorizedIssuers[issuer], "Issuer already authorized");

        authorizedIssuers[issuer] = true;

        emit IssuerAdded(issuer);
    }

    /**
     * @dev Remove an address from the authorized issuer list.
     */
    function removeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "Issuer not authorized");

        authorizedIssuers[issuer] = false;

        emit IssuerRemoved(issuer);
    }

    // ------------------------------------------------------------
    // Certificate Issuance
    // ------------------------------------------------------------

    /**
     * @dev Mint a new soulbound certificate.
     *
     * @param recipient Student's wallet address
     * @param metadataCID IPFS CID containing certificate metadata
     */
    function mintCertificate(
        address recipient,
        string calldata metadataCID
    )
        external
        onlyIssuer
        returns (uint256)
    {
        require(recipient != address(0), "Invalid recipient");
        require(bytes(metadataCID).length > 0, "Metadata CID required");

        uint256 tokenId = _nextTokenId++;

        _safeMint(recipient, tokenId);

        _certificates[tokenId] = Certificate({
            tokenId: tokenId,
            recipient: recipient,
            issuer: msg.sender,
            metadataCID: metadataCID,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit CertificateIssued(
            tokenId,
            recipient,
            msg.sender,
            metadataCID,
            block.timestamp
        );

        return tokenId;
    }

    // ------------------------------------------------------------
    // Certificate Verification
    // ------------------------------------------------------------

    /**
     * @dev Return complete certificate information.
     */
    function getCertificate(
        uint256 tokenId
    )
        external
        view
        returns (Certificate memory)
    {
        require(_exists(tokenId), "Certificate does not exist");

        return _certificates[tokenId];
    }

    /**
     * @dev Check whether a certificate is valid.
     *
     * A certificate is valid when:
     * - It exists
     * - It has not been revoked
     */
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
        )
    {
        require(_exists(tokenId), "Certificate does not exist");

        Certificate memory certificate = _certificates[tokenId];

        valid = !certificate.revoked;
        recipient = certificate.recipient;
        issuer = certificate.issuer;
        metadataCID = certificate.metadataCID;
        issuedAt = certificate.issuedAt;
        revoked = certificate.revoked;
    }

    // ------------------------------------------------------------
    // Revocation
    // ------------------------------------------------------------

    /**
     * @dev Revoke a certificate.
     *
     * Only the original issuer or contract owner can revoke it.
     */
    function revokeCertificate(uint256 tokenId) external {
        require(_exists(tokenId), "Certificate does not exist");

        Certificate storage certificate = _certificates[tokenId];

        require(
            msg.sender == certificate.issuer ||
                msg.sender == owner(),
            "Not authorized to revoke"
        );

        require(!certificate.revoked, "Certificate already revoked");

        certificate.revoked = true;

        emit CertificateRevoked(tokenId, msg.sender);
    }

    // ------------------------------------------------------------
    // Soulbound Protection
    // ------------------------------------------------------------

    /**
     * @dev Disable certificate transfers.
     *
     * Certificates can only be minted.
     *
     * Any attempt to transfer an existing certificate will revert.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);

        // Allow minting: from == address(0)
        // Block transfers: from != address(0)
        // Allow burning only if explicitly implemented later.
        if (from != address(0)) {
            revert("Soulbound: transfer disabled");
        }

        return super._update(to, tokenId, auth);
    }

    // ------------------------------------------------------------
    // Token URI
    // ------------------------------------------------------------

    /**
     * @dev Return IPFS metadata URI.
     */
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Certificate does not exist");

        return string(
            abi.encodePacked(
                "ipfs://",
                _certificates[tokenId].metadataCID
            )
        );
    }

    // ------------------------------------------------------------
    // Internal Helpers
    // ------------------------------------------------------------

    /**
     * @dev OpenZeppelin v5 removed the old _exists() helper.
     * This helper checks whether a token currently exists.
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}