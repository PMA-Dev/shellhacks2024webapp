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

1. Down the GALATIC package from our download page
2. After installing, open the package

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Project Setup and Run Instructions

### CLI and Frontend Setup

1. **Install dependencies**:
   ```bash
   cd cli && bun install
   cd ../frontend && bun install

2. Run CLI and Frontend in development mode:

```bash
bun run start --cwd cli
bun run dev --cwd frontend
```

- Build the Frontend project:

```bash
bun run build --cwd frontend
```

- Run linting and formatting:

```bash
bun run format --cwd cli
bun run lint --cwd frontend
bun run format --cwd frontend
```

- Run tests for CLI:
```bash
bun run test --cwd cli
```

- Preview the Frontend production build:

```bash
bun run preview --cwd frontend
```