#!/bin/sh
# Tell Bing (and Yandex, Seznam, Naver) the site changed, instead of waiting
# weeks for a crawl.
#
# Why this exists: on 27 Sept Bing Webmaster Tools still had the homepage as
# "Discovered but not crawled", last crawl attempt 5 Sept and it FAILED, even
# though the sitemap had been imported on the 19th and all five URLs submitted
# on the 18th. The live-URL test passed the same day, so nothing is wrong with
# the site — Bing is simply slow. IndexNow is the push channel that fixes that,
# and it matters most on 20 October, when BOOK_LAUNCHED flips and every page's
# CTA changes in one push.
#
# Run it after any push that changes page content:
#     tools/ping-indexnow.sh
# or with specific paths:
#     tools/ping-indexnow.sh /book.html /index.html
#
# The key is public by design — it lives at /<key>.txt so the search engine can
# confirm we own the host. Nothing to keep secret.

set -e
cd "$(dirname "$0")/.." || exit 1

KEY=289f2671526aa66000422b7c9d0882ce
HOST=maureenacahill.com

if [ ! -f "$KEY.txt" ]; then
  echo "missing $KEY.txt in the repo root — IndexNow will reject the ping" >&2
  exit 1
fi

if [ $# -gt 0 ]; then
  URLS=$(for p in "$@"; do printf 'https://%s%s\n' "$HOST" "$p"; done)
else
  URLS=$(grep -o '<loc>[^<]*</loc>' sitemap.xml | sed 's|</\{0,1\}loc>||g')
fi

BODY=$(printf '%s' "$URLS" | python3 -c '
import json, sys
urls = [u.strip() for u in sys.stdin.read().splitlines() if u.strip()]
print(json.dumps({
    "host": "'"$HOST"'",
    "key": "'"$KEY"'",
    "keyLocation": "https://'"$HOST"'/'"$KEY"'.txt",
    "urlList": urls,
}))')

echo "$URLS" | sed 's/^/  · /'

CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST https://api.indexnow.org/IndexNow \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "$BODY")

case "$CODE" in
  200|202) echo "IndexNow accepted ($CODE)" ;;
  *)       echo "IndexNow returned $CODE — 403 means the key file is not live yet" >&2; exit 1 ;;
esac
