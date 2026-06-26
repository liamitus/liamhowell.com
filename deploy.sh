#!/usr/bin/env bash
#
# Deploy src/ to the liamitus.github.io GitHub Pages repo.
# macOS only (uses BSD `sed -i ''`).
#
# Cache-busting: every deploy stamps the current commit hash onto our own
# CSS/JS links (e.g. main.css?v=abc1234). The URL changes whenever the source
# does, so browsers fetch fresh assets instead of serving a stale cache. Only
# index.html and the arcade page we own are stamped; game builds under
# /games/* and /frostline/* already ship hashed filenames.

MSG=$(git log -1 --format=%s)
VER=$(git rev-parse --short HEAD)
TARGET="$(cd "$(git rev-parse --git-common-dir)/../.." && pwd)/liamitus.github.io"

cp -R src/* "$TARGET"

for f in "$TARGET/index.html" "$TARGET/games/index.html"; do
  [ -f "$f" ] && sed -i '' -E \
    -e "s#(href=\"[^\"]*css/[A-Za-z0-9_.-]+\.css)\"#\1?v=$VER\"#g" \
    -e "s#(src=\"[^\"]*js/[A-Za-z0-9_.-]+\.js)\"#\1?v=$VER\"#g" \
    "$f"
done

cd "$TARGET" && git add . && git commit -am "Deploy: $MSG" && git push
