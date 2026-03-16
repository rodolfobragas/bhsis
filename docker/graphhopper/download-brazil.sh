#!/bin/sh
set -e

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_DIR="$BASE_DIR/data"
mkdir -p "$DATA_DIR"
REGION_PATH=${REGION_PATH:-south-america/brazil-southeast.osm.pbf}
REGION_NAME=$(basename "$REGION_PATH")
FILE="$DATA_DIR/$REGION_NAME"

if [ -f "$FILE" ]; then
  echo "Arquivo ja existe: $FILE"
else
  URL="https://download.geofabrik.de/$REGION_PATH"
  echo "Baixando dados regionais ($REGION_NAME)..."
  curl -L "$URL" -o "$FILE"
fi

MAX_HEAP_SIZE=${MAX_HEAP_SIZE:-6g}
IMPORT_ON_DOWNLOAD=${IMPORT_ON_DOWNLOAD:-0}

if [ "$IMPORT_ON_DOWNLOAD" = "1" ]; then
  echo "Importando $REGION_NAME no GraphHopper com MAX_HEAP_SIZE=$MAX_HEAP_SIZE"
  docker run --rm -e MAX_HEAP_SIZE="$MAX_HEAP_SIZE" -v "$DATA_DIR:/data" swatrider/graphhopper:latest import /data/$REGION_NAME
else
  echo "Importacao manual pendente; rode 'old/minyan.sh -f --file=/graphhopper/data/$REGION_NAME' se precisar regenrar o grafo."
fi
