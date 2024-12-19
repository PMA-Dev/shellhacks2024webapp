#!/bin/bash

# fmt CLI
cd ../cli
bun format
cd -

# lint/fmt Frontend
cd ../frontend
bun format
bun lint
cd -