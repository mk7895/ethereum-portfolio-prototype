# Ethereum Portfolio Prototype

An AI-assisted educational prototype combining a React interface, Node/Express
architecture, SQLite portfolio state, Solidity/Truffle contracts, MetaMask, and
Ethereum testnet interactions. The project experiments with simulated assets,
token transfers, stock-style portfolios, and portfolios of portfolios.

> **Public snapshot status:** intentionally incomplete and non-runnable. The
> original source is preserved unchanged, but three files containing embedded
> service credentials are excluded by `.gitignore`.

## What the public repository demonstrates

- React/Web3 account connection and portfolio interface
- Solidity token and portfolio data structures
- Truffle migration structure and contract ABI integration
- client-side interaction with MetaMask and an Ethereum testnet
- package/dependency structure for the original full-stack prototype

## Deliberately omitted source and state

- `truffle-config.js` — contains embedded service credentials
- `server.js` — contains embedded service credentials and private-wallet runtime
  logic
- `TokenManager.js` — contains embedded service credentials and treasury logic
- `.secret`, `.privateKey`, `.privatekey`, `.env*`, keystores and key files
- `portfolio.db` and all SQLite/runtime state
- `node_modules`, compiled contracts, frontend builds, caches and logs

As a result, the checked-in frontend references backend functionality that is not
present in the public repository. This is a source-code sample, not a reproducible
deployment.

## Security and technical limitations

- The original backend includes server-signed token-transfer routes without
  production authentication. It must not be exposed to the public internet.
- The experimental contract includes an ETH investment function without a
  corresponding withdrawal function. Never send real funds to it.
- Testnet contract and treasury addresses visible in the frontend are public
  blockchain identifiers, not private keys.
- Previously embedded Infura and Etherscan credentials should be revoked or
  rotated even though the files containing them are excluded from this new
  repository.
- This project should be described as an educational Ethereum testnet prototype,
  not as a production trading platform or audited smart-contract system.

## Repository-boundary preparation

`frontend/` currently contains its own legacy `.git` directory. Before creating
one repository at this project root, preserve that history outside the active
path—for example by renaming it to `frontend/.git.frontend-legacy`. The root
`.gitignore` already excludes that backup name. Do not delete the nested history.

Afterward, initialise Git only in this `thirdversion` directory and verify that
the three withheld source files, every credential file, database, build, and
dependency directory remain ignored.

## AI-assistance disclosure

The prototype was built as a learning project with substantial AI assistance
while the author was learning React and Node. Portfolio descriptions should
emphasise product scope, system integration, experimentation, and the ability to
work across unfamiliar technologies—not claim unaided production engineering.

Suggested repository name: `ethereum-portfolio-prototype`

