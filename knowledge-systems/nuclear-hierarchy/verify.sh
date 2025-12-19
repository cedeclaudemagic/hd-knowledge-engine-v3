#!/bin/bash

# Nuclear Hierarchy Knowledge System Verification
# Run from the knowledge-systems/nuclear-hierarchy directory

echo "Verifying Nuclear Hierarchy Knowledge System..."
echo ""

cd "$(dirname "$0")"

# Run tests
node tests/nuclear-hierarchy-tests.js

exit $?
