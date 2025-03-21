#!/bin/bash

echo "🔗 Setting up git hook path..."
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
echo "✅ Git hook installed!"
