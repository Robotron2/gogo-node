# gogo-node

A high-performance Node.js backend tailored for ride-hailing services, featuring custom routing algorithms and real-time data synchronization.

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-%23000000.svg?style=for-the-badge&logo=Express&logoColor=6DA55F)
![MongoDB](https://img.shields.io/badge/MongoDB-%23000000.svg?style=for-the-badge&logo=MongoDB&logoColor=6DA55F)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## Key Features

- **Custom Mapping Algorithm:** Rebuilt core backend logic to optimize ride allocation and routing entirely from scratch, removing the reliance on expensive external mapping APIs.
- **Scalable API Architecture:** Designed and deployed robust, highly scalable RESTful APIs capable of handling high-volume concurrent requests efficiently.
- **Real-Time Ride Updates:** Engineered seamless, real-time data synchronization to ensure instantaneous ride tracking and status updates between drivers and users.

## Live Application

**Production URL:** [https://gogo-node.vercel.app](https://gogo-node.vercel.app)

## Project Structure

This repository follows a modular Node.js structure:

- `index.js` — The main entry point of the application and server configuration.
- `cronJob.js` — Dedicated script for handling scheduled background tasks and automated ride state management.
- `src/` — Contains the core source code, modularized logic, custom algorithms, and helper functions.
- `package.json` — Project metadata, dependencies, and execution scripts.
