# Blockchain-based Charity Crowdfunding Platform

## Overview
This project presents a decentralized application (DApp) for transparent and secure charitable donations. The platform leverages Ethereum blockchain technology to immutably record financial transactions while combining it with a web-based interface for user interaction. Users can create fundraising campaigns and donate directly via smart contracts, reducing reliance on non-transparent intermediaries. The goal of the project is to demonstrate how a hybrid blockchain-based architecture can address trust issues in modern philanthropy.

## Problem Statement
Traditional charity crowdfunding platforms often lack transparency and accountability. Donors cannot reliably verify how funds are handled once they pass through centralized intermediaries, which increases the risk of mismanagement and fraud. Additionally, centralized systems are vulnerable to data manipulation and single points of failure, making independent verification of donation records difficult.

## Motivation
This project explores the application of blockchain technology to improve trust in charitable systems. Blockchain provides an immutable and publicly verifiable ledger, making financial transactions transparent by design. However, fully decentralized systems face challenges related to usability and data storage. This work aims to balance decentralization and practicality by combining blockchain-based financial logic with conventional web technologies.

## Proposed Solution
The proposed solution adopts a hybrid architecture that separates financial logic from descriptive data. Donation processing and verification are handled by a Solidity smart contract deployed on Ethereum, ensuring immutability and transparency. Non-financial campaign metadata is managed off-chain through a centralized backend, reducing gas costs and improving performance while preserving on-chain financial integrity.

## System Architecture
The system consists of three layers.
The Presentation Layer is a web-based frontend that allows users to view campaigns and initiate donations via MetaMask.
The Application Layer provides API services that manage campaign data and support frontend interactions.
The Blockchain Layer executes smart contracts on the Ethereum network, processes donations, and emits events confirming transactions.

## How It Works
Users access the platform through a web interface and retrieve available campaigns. To donate, they connect their MetaMask wallet and approve a transaction created using Ethers.js. Once the transaction is confirmed on the blockchain, the smart contract updates the on-chain state and emits an event. The frontend then reflects the updated donation data to the user.
<img width="1920" height="1080" alt="BLOCKCHAIN" src="https://github.com/user-attachments/assets/b639c2fc-6373-4a21-b370-0e40aa9d5469" />



## Technology Stack
The project uses Solidity and Hardhat for smart contract development and testing. The frontend is implemented using HTML5, CSS3, and JavaScript, with Ethers.js enabling blockchain interaction. Supporting services are built using Node.js and Express.js, while MongoDB is used for off-chain data storage.

## Limitations
The reliance on centralized storage for campaign metadata introduces a potential point of failure. The platform currently operates on a local test network, which does not reflect real-world conditions such as network congestion or variable gas fees. Additionally, the requirement for cryptocurrency wallets may limit accessibility for non-technical users.

## Team Contribution
This project represents the culmination of research and development efforts focused on blockchain integration. The work involved the design of the smart contract logic, the implementation of the RESTful API architecture, and the creation of the responsive user interface. All components were integrated to ensure seamless data flow between the off-chain and on-chain environments. The codebase reflects a unified effort to adhere to software engineering best practices, including modularization and separation of concerns.

## Conclusion
This project demonstrates how blockchain technology can enhance transparency and trust in charitable crowdfunding. By separating immutable financial logic from flexible off-chain data storage, the platform achieves a practical balance between security and usability. The results confirm that hybrid blockchain architectures are a viable approach for decentralized applications requiring both transparency and user-friendly design.

## References
Buterin, V. (2013). Ethereum Whitepaper: A Next-Generation Smart Contract and Decentralized Application Platform. Ethereum Foundation.

Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System.

Wood, G. (2014). Ethereum: A Secure Decentralised Generalised Transaction Ledger. Ethereum Project Yellow Paper.

Ethereum Foundation. (2024). Solidity Documentation. Retrieved from https://docs.soliditylang.org/

Nomic Foundation. (2024). Hardhat Documentation. Retrieved from https://hardhat.org/
