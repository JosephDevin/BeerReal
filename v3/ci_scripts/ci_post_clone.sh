#!/bin/sh
set -e

# Install Node via Homebrew
brew install node

# Go to project root
cd $CI_PRIMARY_REPOSITORY_PATH

# Install dependencies
npm install

# Build your web app
npm run build

# Sync with iOS
npx cap sync ios