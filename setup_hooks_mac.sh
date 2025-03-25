#!/bin/bash

echo "🔗 Setting up git hook path..."
git config core.hooksPath .githooks-mac
chmod +x .githooks-mac/pre-commit
echo "✅ Git hook installed!"
