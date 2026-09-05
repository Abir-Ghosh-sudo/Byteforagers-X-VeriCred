# 🔐 VeriCred — Decentralized Verifiable Credentials

### **Issue certificates once. Verify them forever.**

VeriCred is a blockchain-powered **verifiable credential and certificate platform** designed to make academic and professional certificates **tamper-resistant, portable, and instantly verifiable**.

Instead of relying on traditional paper certificates or centralized databases, VeriCred combines **Ethereum smart contracts, Soulbound NFTs, IPFS, and a full-stack web application** to create a trusted digital credential ecosystem.

> 🎓 **Issue → Store → Own → Verify → Revoke**
>
> All with transparent blockchain-backed verification.

---

## 🌐 The Problem

Traditional certificates have several limitations:

* 📄 Paper certificates can be lost or damaged
* 🖨️ Certificates can be forged or digitally manipulated
* 🔍 Employers and institutions often depend on manual verification
* 🏢 Verification usually requires contacting the issuing institution
* 🗄️ Centralized databases create a single point of failure
* ⏳ Manual verification can take significant time
* 🔐 Certificate ownership and authenticity are difficult to prove independently

The result is a system where **trust depends heavily on the issuing organization and its records**.

---

# 💡 Our Solution

**VeriCred transforms certificates into blockchain-backed digital credentials.**

An authorized institution can issue a certificate to a recipient's wallet.

The certificate is represented by a **non-transferable ERC-721 token**, while its detailed metadata is stored using **IPFS**.

The blockchain permanently records important verification information such as:

* Certificate ID
* Recipient wallet
* Issuer wallet
* Metadata CID
* Issue timestamp
* Revocation status

Anyone can then independently verify the certificate without relying solely on the institution's internal database.

---

# ✨ Key Features

## 🎓 1. Soulbound Certificates

Certificates are implemented as **non-transferable ERC-721 tokens**.

Once issued to a recipient, the credential cannot simply be transferred to another wallet.

This creates a stronger connection between the credential and its original recipient.

---

## 🏛️ 2. Authorized Issuers

Not everyone can issue certificates.

The smart contract maintains an authorized issuer registry.

Only approved issuer addresses can mint new certificates.

The contract owner can:

* Add issuers
* Remove issuers
* Manage issuer authorization

This creates a controlled issuance layer while keeping verification transparent.

---

## 🔗 3. Blockchain-Based Verification

Certificate information is anchored on-chain.

A verifier can check whether a certificate:

* Exists
* Belongs to the recorded recipient
* Was issued by an authorized issuer
* Has been revoked
* Contains the expected metadata reference

Verification does not depend entirely on trusting a centralized database.

---

## 📦 4. IPFS Metadata Storage

Certificate metadata is referenced through an **IPFS CID**.

The blockchain stores the CID while the actual metadata can be retrieved through IPFS.

This separates:

**On-chain trust + Off-chain decentralized metadata**

while maintaining a cryptographic reference between them.

---

## 🚫 5. Certificate Revocation

Certificates sometimes need to become invalid.

For example:

* A certificate was issued incorrectly
* An institution discovers fraudulent information
* A credential needs to be withdrawn

VeriCred supports certificate revocation.

Once revoked, the certificate remains traceable but is no longer considered valid.

---

## 📱 6. QR-Based Verification

Certificates can be connected to a verification workflow through QR codes.

A verifier can scan a certificate's QR code and access the verification flow without manually entering long blockchain identifiers.

---

## 📄 7. Digital Certificate Generation

The backend supports certificate-related PDF generation, allowing credentials to have a familiar document representation while retaining blockchain-backed verification.

---

## 🌐 8. Full-Stack Architecture

VeriCred is not just a smart contract.

It combines:

* 🖥️ React frontend
* ⚡ Vite development environment
* 🐍 FastAPI backend
* ⛓️ Solidity smart contracts
* 🌐 Ethereum/Web3 integration
* 📦 IPFS metadata
* 🔎 On-chain verification

This creates an end-to-end credential management platform.

---

# 🏗️ How VeriCred Works

```text
                ┌─────────────────────┐
                │     Institution     │
                │   / Authorized      │
                │       Issuer        │
                └──────────┬──────────┘
                           │
                           │ Issue Certificate
                           ▼
                ┌─────────────────────┐
                │    VeriCred App     │
                │      Frontend       │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │    FastAPI Backend  │
                │                     │
                │ • Metadata          │
                │ • IPFS              │
                │ • QR Generation     │
                │ • PDF Generation    │
                │ • Verification      │
                └──────┬─────────┬────┘
                       │         │
              Metadata │         │ Blockchain Call
                       ▼         ▼
                ┌──────────┐  ┌─────────────────────┐
                │   IPFS   │  │  Ethereum Network  │
                │          │  │                     │
                │ Metadata │  │ Soulbound ERC-721   │
                └──────────┘  │ Certificate Record  │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │      Verifier       │
                              │                     │
                              │ Scan / Enter ID     │
                              │        ↓            │
                              │ Verify Certificate  │
                              └─────────────────────┘
```

---

# 🔄 Certificate Lifecycle

```text
        ┌───────────────┐
        │ Create Record │
        └───────┬───────┘
                │
                ▼
       ┌──────────────────┐
       │ Store Metadata   │
       │      on IPFS     │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │ Authorized Issuer│
       │      Mints       │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │ Soulbound        │
       │ Certificate      │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │ Certificate      │
       │ Verification     │
       └────────┬─────────┘
                │
         ┌──────┴───────┐
         │              │
         ▼              ▼
     Valid          Revoked
```

---

# 🧠 Smart Contract

The core contract is:

```text
contracts/
└── SoulboundCertificate.sol
```

The contract uses:

* Solidity `^0.8.24`
* OpenZeppelin ERC-721
* OpenZeppelin Ownable

The contract implements a custom certificate structure containing:

```solidity
struct Certificate {
    uint256 tokenId;
    address recipient;
    address issuer;
    string metadataCID;
    uint256 issuedAt;
    bool revoked;
}
```

The contract provides functionality for:

### Issuer Management

```solidity
addIssuer(address issuer)
removeIssuer(address issuer)
```

### Certificate Issuance

```solidity
mintCertificate(
    address recipient,
    string calldata metadataCID
)
```

### Certificate Verification

```solidity
getCertificate(uint256 tokenId)

verifyCertificate(uint256 tokenId)
```

### Certificate Revocation

```solidity
revokeCertificate(uint256 tokenId)
```

### Soulbound Protection

Certificate transfers are disabled through the ERC-721 `_update()` override.

Therefore, certificates can be minted but cannot be transferred like ordinary NFTs.

The contract also exposes an IPFS-based `tokenURI()`.

---

# 🛠️ Technology Stack

| Layer              | Technology     |
| ------------------ | -------------- |
| Smart Contract     | Solidity       |
| Blockchain         | Ethereum / EVM |
| Contract Framework | Hardhat        |
| Contract Library   | OpenZeppelin   |
| Frontend           | React          |
| Frontend Tooling   | Vite           |
| Web3               | ethers.js      |
| Backend            | Python         |
| API Framework      | FastAPI        |
| Blockchain Backend | Web3.py        |
| Metadata           | IPFS           |
| Validation         | Pydantic       |
| Server             | Uvicorn        |
| Icons/UI           | Lucide React   |

The repository currently uses Hardhat with OpenZeppelin for the contract layer, while the frontend uses React, Vite, ethers.js and React Router.

---

# 📁 Project Structure

```text
vericred/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │
│   │   ├── blockchain/
│   │   │   ├── abi/
│   │   │   ├── contract.py
│   │   │   └── provider.py
│   │   │
│   │   ├── config/
│   │   ├── ipfs/
│   │   │   ├── client.py
│   │   │   └── metadata.py
│   │   │
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── tests/
│   └── README.md
│
├── contracts/
│   ├── interfaces/
│   ├── libraries/
│   └── SoulboundCertificate.sol
│
├── deployments/
│
├── docs/
│   ├── architecture.md
│   ├── backend.md
│   ├── demo-flow.md
│   ├── frontend.md
│   ├── ipfs.md
│   ├── smart-contract.md
│   └── verification.md
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── config/
│       ├── context/
│       ├── contracts/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── scripts/
│   ├── deploy.js
│   ├── setupIssuer.js
│   └── verifyContract.js
│
├── test/
│
├── .env.example
├── hardhat.config.js
├── package.json
└── README.md
```

The repository is organized into separate frontend, backend, contract, deployment, testing and documentation layers.

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Abir-Ghosh-sudo/Byteforagers-X-VeriCred.git
cd Byteforagers-X-VeriCred
```

Move into the project:

```bash
cd vericred
```

---

# ⛓️ Smart Contract Setup

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
copy .env.example .env
```

For Linux/macOS:

```bash
cp .env.example .env
```

Configure the required environment variables inside `.env`.

---

## Compile Contracts

```bash
npm run compile
```

---

## Run Tests

```bash
npm test
```

---

## Deploy

The repository includes a Hardhat deployment script configured for the Sepolia network:

```bash
npm run deploy
```

---

## Configure Issuer

After deployment:

```bash
npm run setup-issuer
```

---

## Verify Contract

```bash
npm run verify
```

The available npm scripts include compilation, testing, Sepolia deployment, issuer setup and contract verification.

---

# 🐍 Backend Setup

Move into the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

On Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the environment variables:

```bash
copy .env.example .env
```

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend is responsible for metadata processing, IPFS integration, blockchain reads, certificate verification, QR generation, PDF generation and issuer-related APIs.

---

# 🎨 Frontend Setup

Move into the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🔐 Security Model

VeriCred uses multiple layers of protection.

### 1. Authorized Issuers

Only approved issuer addresses can mint certificates.

### 2. Soulbound Credentials

Certificates cannot be transferred between wallets.

### 3. On-Chain Verification

Core certificate state can be independently checked against the blockchain.

### 4. Revocation

Invalid credentials can be revoked without deleting their historical record.

### 5. Decentralized Metadata Reference

Certificate metadata is referenced through IPFS CIDs rather than relying exclusively on a centralized storage location.

---

# 🧩 Why Blockchain?

A traditional certificate system generally looks like:

```text
Student
   ↓
Institution Database
   ↓
Verifier
   ↓
Trust Institution
```

VeriCred changes the verification model:

```text
Student
   ↓
Blockchain Credential
   ↓
Verifier
   ↓
Verify On-Chain
```

The institution still controls issuance, but **verification becomes independently auditable**.

This is particularly useful when certificates need to be verified by organizations that do not have direct access to the issuer's internal systems.

---

# 🆚 Traditional Certificates vs VeriCred

| Capability                       | Traditional System | VeriCred |
| -------------------------------- | -----------------: | -------: |
| Digital Certificate              |                 ⚠️ |        ✅ |
| Tamper-resistant Record          |                  ❌ |        ✅ |
| Blockchain Verification          |                  ❌ |        ✅ |
| Decentralized Metadata Reference |                  ❌ |        ✅ |
| Soulbound Credential             |                  ❌ |        ✅ |
| Issuer Authorization             |                 ⚠️ |        ✅ |
| Revocation Tracking              |                 ⚠️ |        ✅ |
| QR Verification Workflow         |                 ⚠️ |        ✅ |
| Independent Verification         |                 ⚠️ |        ✅ |

---

# 🎯 Use Cases

VeriCred can be adapted for multiple credential ecosystems.

### 🎓 Education

* University degrees
* Course certificates
* Academic achievements
* Training certificates
* Skill credentials

### 💼 Employment

* Employee credentials
* Professional certifications
* Internship certificates
* Training completion records

### 🏆 Events & Competitions

* Hackathon certificates
* Competition achievements
* Participation credentials
* Workshop certificates

### 🌐 Web3 Credentials

* DAO memberships
* Contributor credentials
* Community achievements
* Blockchain-native reputation systems

---

# 🚀 Future Scope

VeriCred can be extended with:

* 📱 Mobile verification application
* 🪪 Decentralized identity integration
* 🔐 Zero-knowledge credential verification
* 🌍 Multi-chain support
* 🤖 AI-powered credential fraud detection
* 📊 Institutional analytics dashboard
* 🏫 Multi-institution issuer networks
* 🔑 Wallet-based identity profiles
* 🔄 Automated credential renewal
* 🌐 Public credential explorer
* 📡 Verifiable Credentials / DID standards
* 🧩 Integration with universities and hiring platforms

---

# 🌟 What Makes VeriCred Different?

VeriCred is designed around one simple principle:

> **A certificate should not require blind trust in a document. It should be independently verifiable.**

Instead of treating a certificate as only a PDF or image, VeriCred treats it as a **verifiable digital credential** with:

```text
Identity
   +
Issuer
   +
Blockchain Record
   +
IPFS Metadata
   +
Verification
   +
Revocation
```

This creates a stronger foundation for the future of digital credentials.

---

# 🏆 Hackathon Vision

### **From "Trust Me" to "Verify It."**

VeriCred aims to make digital credentials:

**Portable.
Tamper-resistant.
Transparent.
Verifiable.
Decentralized.**

The goal is not simply to put certificates on a blockchain.

The goal is to build a system where **trust can be verified rather than assumed.**

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "feat: add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Team

### **Byteforagers**

Building practical solutions at the intersection of:

**Blockchain × Web3 × Full-Stack Development × Digital Identity**

---

# 🔗 Repository

**GitHub:**
https://github.com/Abir-Ghosh-sudo/Byteforagers-X-VeriCred

---

<div align="center">

### 🔐 VeriCred

**Issue once. Own forever. Verify anywhere.**

Built with ❤️ by **Byteforagers**

</div>
