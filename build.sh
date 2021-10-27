npx rollup -c
cat preamble.js output/main.js > ../GenerativeMusic/bundle.js
# This seems to help the Windows VM pick up the change.
touch ../GenerativeMusic/bundle.js
