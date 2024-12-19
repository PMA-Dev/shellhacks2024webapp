#!/bin/bash

# Run CLI and Frontend simultaneously, ensuring both die if one is killed.

# Start CLI
cd ../cli
bun start listen &
CLI_PID=$!
cd -

# Start Frontend
cd ../frontend
bun run dev &
FRONTEND_PID=$!
cd -

# Handle exit signals to clean up both processes
cleanup() {
    echo "Terminating processes..."
    kill $CLI_PID $FRONTEND_PID
    wait $CLI_PID $FRONTEND_PID 2>/dev/null
    echo "Processes terminated."
    exit 0
}

# Trap signals
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $CLI_PID $FRONTEND_PID