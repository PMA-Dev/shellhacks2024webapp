#!/bin/bash

set -e

# Define required versions
REQUIRED_GH_VERSION="2.63"
REQUIRED_AZ_VERSION="2.58.0"
REQUIRED_BUN_VERSION="1.1.40"
REQUIRED_NODE_VERSION="14.19.0"
REQUIRED_VOLTA_VERSION="2.0.2"

# Check version function
version_compare() {
    printf '%s\n%s\n' "$1" "$2" | sort -V | head -n1
}

# Check if a command exists
check_command() {
    command -v "$1" >/dev/null 2>&1
}

# Install missing components
install_gh_cli() {
    echo "Installing GitHub CLI..."
    brew install gh
}

install_az_cli() {
    echo "Installing Azure CLI..."
    brew install azure-cli
}

install_bun() {
    echo "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
}

install_volta() {
    echo "Installing Volta..."
    curl https://get.volta.sh | bash -s -- --skip-setup
}

install_node_with_volta() {
    echo "Installing Node.js and npm using Volta..."
    export VOLTA_HOME="$HOME/.volta"
    export PATH="$VOLTA_HOME/bin:$PATH"
    volta install node@$REQUIRED_NODE_VERSION
}

# Check and install GH CLI
if check_command gh; then
    CURRENT_GH_VERSION=$(gh --version | head -n 1 | awk '{print $3}')
    if [ "$(version_compare "$CURRENT_GH_VERSION" "$REQUIRED_GH_VERSION")" != "$REQUIRED_GH_VERSION" ]; then
        echo "Updating GitHub CLI..."
        install_gh_cli
    fi
else
    install_gh_cli
fi

# Check and install Azure CLI
if check_command az; then
    CURRENT_AZ_VERSION=$(az --version | head -n 1 | awk '{print $2}')
    if [ "$(version_compare "$CURRENT_AZ_VERSION" "$REQUIRED_AZ_VERSION")" != "$REQUIRED_AZ_VERSION" ]; then
        echo "Updating Azure CLI..."
        install_az_cli
    fi
else
    install_az_cli
fi

# Check and install Bun
if check_command bun; then
    CURRENT_BUN_VERSION=$(bun --version)
    if [ "$(version_compare "$CURRENT_BUN_VERSION" "$REQUIRED_BUN_VERSION")" != "$REQUIRED_BUN_VERSION" ]; then
        echo "Updating Bun..."
        install_bun
    fi
else
    install_bun
fi

# Check and install Volta
if check_command volta; then
    CURRENT_VOLTA_VERSION=$(volta --version | awk '{print $2}')
    if [ "$(version_compare "$CURRENT_VOLTA_VERSION" "$REQUIRED_VOLTA_VERSION")" != "$REQUIRED_VOLTA_VERSION" ]; then
        echo "Updating Volta..."
        install_volta
    fi
else
    install_volta
fi

# Check and install Node.js using Volta
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
if check_command node; then
    CURRENT_NODE_VERSION=$(node --version | sed 's/v//')
    if [ "$(version_compare "$CURRENT_NODE_VERSION" "$REQUIRED_NODE_VERSION")" != "$REQUIRED_NODE_VERSION" ]; then
        echo "Updating Node.js..."
        install_node_with_volta
    fi
else
    install_node_with_volta
fi

# Get the directory where the install script is run
INSTALL_DIR=$(pwd)

# Create custom script
CUSTOM_SCRIPT="/usr/local/bin/galactic"
cat << EOF | sudo tee $CUSTOM_SCRIPT > /dev/null
#!/bin/bash

cd $INSTALL_DIR
ls 

# Run secrets setter
if [ -f set_secrets.sh ]; then
    set -a
    source ./set_secrets.sh
    set +a

    echo "Secrets set successfully"
else
    echo "Error: set_secrets.sh not found"
    exit 1
fi

# Start CLI
cd ./cli
bun start listen &
CLI_PID=\$!
cd -

# Start Frontend
cd ./frontend
bun run dev &
FRONTEND_PID=\$!
cd -

# Handle exit signals to clean up both processes
cleanup() {
    echo "Terminating processes..."
    kill \$CLI_PID \$FRONTEND_PID
    wait \$CLI_PID \$FRONTEND_PID 2>/dev/null
    echo "Processes terminated."
    exit 0
}

# Trap signals
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait \$CLI_PID \$FRONTEND_PID
EOF

# Make the script executable
sudo chmod +x $CUSTOM_SCRIPT

# Source the path
if [[ ":$PATH:" != *":/usr/local/bin:"* ]]; then
    echo "export PATH=/usr/local/bin:\$PATH" >> ~/.bashrc
    source ~/.bashrc
fi

echo "Setup completed successfully. You can now use the script by running 'galactic'."
