# GALACTIC

**GALACTIC** is an open-source full-stack bootstrapper that empowers developers to create and manage their projects through an intuitive user interface. By simplifying project setup and configuration, GALACTIC accelerates the development process, allowing you to focus on building features rather than setting up the foundational code.

## Table of Contents

- [Features](#features)
- Getting Started
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- Usage
  - [Creating a New Project](#creating-a-new-project)
  - [Managing Your Project](#managing-your-project)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Use our UI to create a typescript react app with tailwind and shadcn
- Automatic creation of a Node & Express backend
- Local db.json database

## Getting Started

1. Download the GALACTIC package from our download page
2. After installing, open the package

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Project Setup and Run Instructions

### CLI and Frontend Setup

- Prerequisites:
  Ensure your bun and gh cli are installed and updated.
  ```bash
  bun upgrade
  gh upgrade
  ```
  Add the run_secrets.sh script to your scripts folder
  
- Install dependencies:
   ```bash
   cd cli && bun install
   cd ../frontend && bun install

- Run CLI and Frontend in development mode:

  ```bash
  cd cli && bun run start
  cd frontend && bun run dev

- Build the Frontend project:

  ```bash
  cd frontend
  bun run build

- Run linting and formatting:

  ```bash
  cd cli
  bun run format
  bun run lint

- Run tests for CLI:
  ```bash
  cd cli && bun run test

- Preview the Frontend production build:

  ```bash
  cd frontend && bun run preview