#!/bin/bash
# Compiles the React app and styles, then writes the page shells. Needs Node (npm install) and Python 3.
set -e
cd "$(dirname "$0")/.."
cat src/fonts.css src/input.css src/custom.css > src/all.css
npx esbuild src/app.jsx --bundle --minify --format=iife --target=es2019 --jsx-factory=React.createElement --jsx-fragment=React.Fragment --outfile=js/app.js --log-level=warning
npx tailwindcss -c tailwind.config.js -i src/all.css -o css/site.css --minify
python3 build/build.py
