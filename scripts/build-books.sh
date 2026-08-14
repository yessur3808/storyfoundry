#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
npm run books:prepare
mkdir -p public/downloads

for source in work/manuscripts/*.md; do
  [ -e "$source" ] || continue
  slug="$(basename "$source" .md)"
  pandoc "$source" --to=epub3 --toc --css=templates/epub.css --output="public/downloads/$slug.epub"
  pandoc "$source" --to=typst --wrap=none --output="work/manuscripts/$slug.body.typ"
  typst compile "work/manuscripts/$slug.typ" "public/downloads/$slug.pdf" --root .
done

echo "Built downloadable EPUB and PDF editions."
