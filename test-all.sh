#!/bin/bash

# Von der Idee zum Prototyp - Comprehensive Test Suite
# Version 3.0.0

set -e

API_BASE="http://localhost:3000"
TEST_EMAIL="test$(date +%s)@example.com"
TOKEN=""
TESTS_PASSED=0
TESTS_FAILED=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🧪 Von der Idee zum Prototyp - Test Suite   ║${NC}"
echo -e "${BLUE}║  Version 3.0.0 - Full System Tests           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if server is running
echo -e "${YELLOW}🔍 Checking if server is running...${NC}"
if ! curl -s $API_BASE/api/health > /dev/null 2>&1; then
  echo -e "${RED}❌ Server is not running on port 3000${NC}"
  echo -e "${YELLOW}Starting server...${NC}"

  cd /home/user/projekt
  node backend/server.js > /tmp/server.log 2>&1 &
  SERVER_PID=$!

  sleep 3

  if ! curl -s $API_BASE/api/health > /dev/null 2>&1; then
    echo -e "${RED}❌ Failed to start server${NC}"
    echo "Check logs: tail /tmp/server.log"
    exit 1
  fi

  echo -e "${GREEN}✅ Server started (PID: $SERVER_PID)${NC}"
else
  echo -e "${GREEN}✅ Server is running${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TEST 1: Health Check & Version${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

HEALTH=$(curl -s $API_BASE/api/health)
VERSION=$(echo $HEALTH | python3 -c "import sys, json; print(json.load(sys.stdin).get('version', 'unknown'))" 2>/dev/null)

if [ "$VERSION" == "3.0.0" ]; then
  echo -e "${GREEN}✅ Health Check passed - Version 3.0.0${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${RED}❌ Health Check failed - Version: $VERSION${NC}"
  ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TEST 2: Subscription Plans (Weekly Plan)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

PLANS=$(curl -s $API_BASE/api/subscriptions/plans)
WEEKLY_EXISTS=$(echo $PLANS | grep -c "weekly" || true)

if [ $WEEKLY_EXISTS -gt 0 ]; then
  echo -e "${GREEN}✅ Weekly plan exists${NC}"

  # Check weekly plan details
  WEEKLY_WORKFLOWS=$(echo $PLANS | python3 -c "import sys, json; print(json.load(sys.stdin)['plans']['weekly']['workflows'])" 2>/dev/null)
  WEEKLY_PRICE=$(echo $PLANS | python3 -c "import sys, json; print(json.load(sys.stdin)['plans']['weekly']['price'])" 2>/dev/null)

  echo "   Workflows: $WEEKLY_WORKFLOWS"
  echo "   Price: €$WEEKLY_PRICE"

  if [ "$WEEKLY_WORKFLOWS" == "8" ] && [ "$WEEKLY_PRICE" == "15" ]; then
    echo -e "${GREEN}✅ Weekly plan configured correctly${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ Weekly plan configuration incorrect${NC}"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${RED}❌ Weekly plan not found${NC}"
  ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TEST 3: User Registration (V3 Format)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

REGISTER_RESPONSE=$(curl -s -X POST $API_BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"test123\"}")

TOKEN=$(echo $REGISTER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))" 2>/dev/null)

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✅ Registration successful${NC}"
  echo "   Email: $TEST_EMAIL"
  echo "   Token: ${TOKEN:0:30}..."

  # Check V3 response format
  HAS_TOOL_USAGE=$(echo $REGISTER_RESPONSE | grep -c "toolUsage" || true)

  if [ $HAS_TOOL_USAGE -gt 0 ]; then
    echo -e "${GREEN}✅ V3 response format (toolUsage)${NC}"

    # Check tool limits
    IDEAS_LIMIT=$(echo $REGISTER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['toolUsage']['ideas']['limit'])" 2>/dev/null)
    PROTO_LIMIT=$(echo $REGISTER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['toolUsage']['prototype']['limit'])" 2>/dev/null)

    echo "   Ideas limit: $IDEAS_LIMIT"
    echo "   Prototype limit: $PROTO_LIMIT"

    if [ "$IDEAS_LIMIT" == "2" ] && [ "$PROTO_LIMIT" == "1" ]; then
      echo -e "${GREEN}✅ Free plan tool limits correct${NC}"
      ((TESTS_PASSED++))
    else
      echo -e "${RED}❌ Tool limits incorrect${NC}"
      ((TESTS_FAILED++))
    fi
  else
    echo -e "${RED}❌ Missing toolUsage in response${NC}"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${RED}❌ Registration failed${NC}"
  echo "$REGISTER_RESPONSE"
  ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TEST 4: Promo Code System${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

if [ -n "$TOKEN" ]; then
  PROMO_RESPONSE=$(curl -s -X POST $API_BASE/api/promo/redeem \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"code":"INFLUENCER-2025-FREE"}')

  SUCCESS=$(echo $PROMO_RESPONSE | grep -c "success" || true)

  if [ $SUCCESS -gt 0 ]; then
    echo -e "${GREEN}✅ Promo code redeemed successfully${NC}"

    WORKFLOWS=$(echo $PROMO_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['bonus']['workflows'])" 2>/dev/null)
    DURATION=$(echo $PROMO_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['bonus']['durationDays'])" 2>/dev/null)

    echo "   Workflows: $WORKFLOWS"
    echo "   Duration: $DURATION days"

    if [ "$WORKFLOWS" == "30" ] && [ "$DURATION" == "14" ]; then
      echo -e "${GREEN}✅ Influencer code benefits correct${NC}"
      ((TESTS_PASSED++))
    else
      echo -e "${RED}❌ Code benefits incorrect${NC}"
      ((TESTS_FAILED++))
    fi

    # Try to redeem again (should fail)
    REDEEM_AGAIN=$(curl -s -X POST $API_BASE/api/promo/redeem \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"code":"INFLUENCER-2025-FREE"}')

    ALREADY_REDEEMED=$(echo $REDEEM_AGAIN | grep -c "Bereits eingelöst" || true)

    if [ $ALREADY_REDEEMED -gt 0 ]; then
      echo -e "${GREEN}✅ Duplicate redemption prevented${NC}"
      ((TESTS_PASSED++))
    else
      echo -e "${RED}❌ Duplicate redemption not prevented${NC}"
      ((TESTS_FAILED++))
    fi
  else
    echo -e "${RED}❌ Promo code redemption failed${NC}"
    echo "$PROMO_RESPONSE"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${YELLOW}⚠️  Skipping promo code test (no token)${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TEST 5: Database Schema V3${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

DB_PATH="/home/user/projekt/database/app.db"

if [ -f "$DB_PATH" ]; then
  echo -e "${GREEN}✅ Database exists${NC}"

  # Check for promo_codes table
  PROMO_TABLE=$(sqlite3 $DB_PATH "SELECT name FROM sqlite_master WHERE type='table' AND name='promo_codes';" 2>/dev/null || echo "")

  if [ -n "$PROMO_TABLE" ]; then
    echo -e "${GREEN}✅ promo_codes table exists${NC}"

    # Count codes
    CODE_COUNT=$(sqlite3 $DB_PATH "SELECT COUNT(*) FROM promo_codes;" 2>/dev/null || echo "0")
    echo "   Promo codes in DB: $CODE_COUNT"

    if [ "$CODE_COUNT" -gt 0 ]; then
      echo -e "${GREEN}✅ Promo codes generated${NC}"
      ((TESTS_PASSED++))
    else
      echo -e "${YELLOW}⚠️  No promo codes in database${NC}"
    fi
  else
    echo -e "${RED}❌ promo_codes table not found${NC}"
    ((TESTS_FAILED++))
  fi

  # Check for tool_limits table
  TOOL_LIMITS=$(sqlite3 $DB_PATH "SELECT name FROM sqlite_master WHERE type='table' AND name='tool_limits';" 2>/dev/null || echo "")

  if [ -n "$TOOL_LIMITS" ]; then
    echo -e "${GREEN}✅ tool_limits table exists${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ tool_limits table not found${NC}"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${RED}❌ Database not found${NC}"
  ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TEST SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

echo ""
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✅ ALL TESTS PASSED!                         ║${NC}"
  echo -e "${GREEN}║  System is ready for deployment               ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
  exit 0
else
  echo ""
  echo -e "${RED}╔════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ❌ SOME TESTS FAILED                         ║${NC}"
  echo -e "${RED}║  Please review errors above                   ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════╝${NC}"
  exit 1
fi
