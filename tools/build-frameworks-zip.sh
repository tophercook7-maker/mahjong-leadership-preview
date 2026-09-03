#!/bin/sh
# Rebuilds assets/resources/AGML-Frameworks.zip from whatever is in assets/frameworks/.
# Run after adding a framework PNG, then commit + push.
cd "$(dirname "$0")/.." || exit 1
rm -f assets/resources/AGML-Frameworks.zip
(cd assets/frameworks && zip -q -X ../resources/AGML-Frameworks.zip *.png) && echo "zip: $(unzip -l assets/resources/AGML-Frameworks.zip | tail -1)"
