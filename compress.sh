tmp=$(mktemp -d)
./node_modules/.bin/esbuild dist/esm/index.js \
  --bundle --minify --legal-comments=none \
  --platform=neutral --format=esm \
  --outfile="$tmp/bundle.js"

gzip -c "$tmp/bundle.js" > "$tmp/bundle.js.gz"
wc -c "$tmp/bundle.js" "$tmp/bundle.js.gz"
rm -rf "$tmp"
