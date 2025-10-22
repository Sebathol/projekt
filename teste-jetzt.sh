#!/bin/bash
echo ""
echo "========================================"
echo "  GROW MASTER APP - SCHNELLSTART"
echo "========================================"
echo ""
echo "Starte Web-Server..."
echo ""
cd grow-master-app/www
python3 -m http.server 8000
