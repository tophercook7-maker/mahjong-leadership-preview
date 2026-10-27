#!/bin/sh
# Rebuilds assets/resources/Ancient-Game-Modern-Leadership-Frameworks.zip from whatever is in assets/frameworks/.
# Run after adding a framework PNG, then commit + push.
cd "$(dirname "$0")/.." || exit 1
rm -f assets/resources/Ancient-Game-Modern-Leadership-Frameworks.zip
(cd assets/frameworks && if ls pdf/*.pdf >/dev/null 2>&1; then cd pdf && zip -q -X ../../resources/Ancient-Game-Modern-Leadership-Frameworks.zip *.pdf; else zip -q -X ../resources/Ancient-Game-Modern-Leadership-Frameworks.zip *.png; fi) && echo "zip: $(unzip -l assets/resources/Ancient-Game-Modern-Leadership-Frameworks.zip | tail -1)"
