# Blockchain-based Charity Crowdfunding Platform

## Overview
This project presents a decentralized application (DApp) designed to facilitate transparent and secure charitable donations. The system leverages blockchain technology to record financial transactions immutably while utilizing a traditional centralized backend for efficient data management. By integrating a web-based user interface with an Ethereum-based smart contract, the platform enables users to create fundraising campaigns and contribute funds directly, thereby reducing reliance on opaque intermediaries. The primary objective is to demonstrate the feasibility of a hybrid architecture in solving trust issues associated with modern philanthropy.

## Problem Statement
Traditional charitable crowdfunding platforms often suffer from a lack of transparency and accountability. Donors frequently face uncertainty regarding the final destination of their contributions, as funds typically pass through multiple intermediaries before reaching the intended beneficiaries. This opacity can lead to mismanagement of funds, fraud, and a general erosion of public trust in charitable organizations. Furthermore, existing centralized systems are vulnerable to single points of failure and data manipulation, making it difficult to verify the integrity of donation records.

## Motivation
The motivation behind this research is to explore the intersection of social impact and distributed ledger technology. Blockchain offers a unique solution to the trust deficit in philanthropy by providing a public, immutable ledger of all financial transactions. However, fully decentralized solutions often face scalability and usability challenges, particularly regarding the storage of metadata such as images and detailed descriptions. This project aims to bridge the gap by implementing a solution that balances the security of blockchain with the user experience of traditional web applications.

## Proposed Solution
The proposed solution is a hybrid software architecture that segregates financial logic from descriptive data. The core financial mechanism—receiving and recording donations—is governed by a Solidity smart contract deployed on the Ethereum network. This ensures that every donation is cryptographically verifiable and cannot be altered. Conversely, campaign metadata, including titles, descriptions, and categorization, is managed by a centralized Node.js backend and stored in a MongoDB database. This approach optimizes gas costs and system performance while maintaining the integrity of the financial trail.

## System Architecture
The system is composed of three distinct but interconnected layers: the Presentation Layer, the Application Layer, and the Blockchain Layer.
The Presentation Layer consists of a frontend interface developed using standard web technologies. It serves as the access point for users to view campaigns and initiate transactions via their digital wallets.
The Application Layer is powered by a RESTful API built with Express.js. It handles client requests, retrieves campaign data from the database, and serves as a bridge between the user interface and the persistent storage.
The Blockchain Layer comprises the Ethereum network (simulated locally via Hardhat). It executes the smart contract logic, manages the transfer of Ethereum (ETH), and emits events that confirm successful donations.

## How It Works
The workflow begins when a user navigates to the web interface. The frontend initiates an asynchronous request to the backend API to retrieve the list of active charitable campaigns. This data is rendered for the user, displaying information such as the campaign goal and funds raised.
To make a donation, the user connects their MetaMask wallet to the application. When the donation action is triggered, the frontend uses the Ethers.js library to construct a transaction targeting the deployed smart contract. The user signs this transaction within MetaMask. Upon confirmation by the network, the smart contract updates the on-chain balance and emits a donation event. The frontend then communicates with the backend to update the display, ensuring the user sees the immediate impact of their contribution.
<img width="441" height="291" alt="diagramma drawio" src="https://github.com/user-attachments/assets/0db102ee-c543-48b3-bd93-9523784cc449" />


## Technology Stack
The implementation utilizes a modern suite of technologies chosen for their robustness and compatibility.
The smart contract development relies on **Solidity**, the primary language for Ethereum, and **Hardhat**, a development environment for compiling, deploying, and testing contracts.
The backend services are constructed using **Node.js** and **Express.js**, providing a scalable server environment. **MongoDB** is employed as the NoSQL database for flexible data storage.
The frontend is built with semantic **HTML5**, **CSS3**, and **JavaScript**, avoiding heavy frameworks to maintain a lightweight codebase. **Ethers.js** is the critical library enabling communication between the web browser and the Ethereum blockchain.

## Limitations
While the system successfully demonstrates the hybrid concept, several limitations exist.
First, the reliance on a centralized database for campaign information introduces a single point of failure; if the backend server goes offline, users cannot view campaign details even if the blockchain is operational.
Second, the system currently operates on a local test network, meaning real economic factors such as fluctuating gas fees and network congestion are not fully accounted for.
Finally, the requirement for users to possess a digital wallet and cryptocurrency may present a barrier to entry for non-technical donors.

## Team Contribution
This project represents the culmination of research and development efforts focused on blockchain integration. The work involved the design of the smart contract logic, the implementation of the RESTful API architecture, and the creation of the responsive user interface. All components were integrated to ensure seamless data flow between the off-chain and on-chain environments. The codebase reflects a unified effort to adhere to software engineering best practices, including modularization and separation of concerns.

## Conclusion
The Blockchain-based Charity Crowdfunding Platform illustrates the potential of distributed ledgers to enhance transparency in the non-profit sector. By decoupling financial verification from data storage, the system achieves a practical balance between security and performance. The successful execution of this project validates the hybrid architecture as a viable model for future decentralized applications that require both immutable transaction logging and rich user experiences.

## References
Buterin, V. (2013). *Ethereum Whitepaper: A Next-Generation Smart Contract and Decentralized Application Platform*. Ethereum Foundation.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*.

Wood, G. (2014). *Ethereum: A Secure Decentralised Generalised Transaction Ledger*. Ethereum Project Yellow Paper.

Ethereum Foundation. (2024). *Solidity Documentation*. Retrieved from https://docs.soliditylang.org/

Nomic Foundation. (2024). *Hardhat Documentation*. Retrieved from https://hardhat.org/
