#!/bin/bash

# ============================================
# 🍒 공통 미션 API 테스트 스크립트
# ============================================

BASE_URL="http://localhost:3000"

echo "======================================"
echo "🍒 공통 미션 API 테스트 시작"
echo "======================================"
echo ""

# ============================================
# 1. 회원가입
# ============================================
echo "1️⃣  회원가입 테스트..."
USER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/users/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "테스트유저",
    "password": "testPassword123!",
    "gender": "M",
    "birth": "1995-05-15",
    "address": "서울시 강남구",
    "detailAddress": "101동 1001호",
    "phoneNumber": "010-1234-5678",
    "preferences": [1, 2]
  }')

echo "응답: $USER_RESPONSE"
echo ""
echo "---"
echo ""

# ============================================
# 2. 가게 추가
# ============================================
echo "2️⃣  가게 추가 테스트..."
STORE_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/stores" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "맛있는 한식당",
    "regionName": "강남구",
    "address": "서울시 강남구 테헤란로 123",
    "description": "정통 한식을 맛볼 수 있는 곳",
    "status": 1
  }')

echo "응답: $STORE_RESPONSE"

# storeId 추출
STORE_ID=$(echo $STORE_RESPONSE | grep -o '"storeId":[0-9]*' | grep -o '[0-9]*')
echo "생성된 Store ID: $STORE_ID"
echo ""
echo "---"
echo ""

# ============================================
# 3. 리뷰 추가
# ============================================
echo "3️⃣  리뷰 추가 테스트 (Store ID: $STORE_ID)..."
REVIEW_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/stores/${STORE_ID}/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "rating": 4.5,
    "content": "음식이 정말 맛있었어요! 재방문 의사 100%",
    "imageUrls": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }')

echo "응답: $REVIEW_RESPONSE"
echo ""
echo "---"
echo ""

# ============================================
# 4. 미션 추가
# ============================================
echo "4️⃣  미션 추가 테스트 (Store ID: $STORE_ID)..."
MISSION_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/stores/${STORE_ID}/missions" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "리뷰 5개 작성하기",
    "description": "이 가게에 리뷰를 5개 작성하면 1000 포인트를 드립니다!",
    "rewardPoint": 1000,
    "status": "waiting"
  }')

echo "응답: $MISSION_RESPONSE"

# missionId 추출
MISSION_ID=$(echo $MISSION_RESPONSE | grep -o '"missionId":[0-9]*' | grep -o '[0-9]*')
echo "생성된 Mission ID: $MISSION_ID"
echo ""
echo "---"
echo ""

# ============================================
# 5. 미션 도전하기
# ============================================
echo "5️⃣  미션 도전 테스트 (Mission ID: $MISSION_ID)..."
CHALLENGE_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/v1/missions/${MISSION_ID}/challenge" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1
  }')

echo "응답: $CHALLENGE_RESPONSE"
echo ""
echo "---"
echo ""

# ============================================
# 6. 중복 도전 테스트 (실패해야 정상)
# ============================================
echo "6️⃣  중복 미션 도전 테스트 (실패해야 정상)..."
DUPLICATE_CHALLENGE=$(curl -s -X POST "${BASE_URL}/api/v1/missions/${MISSION_ID}/challenge" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1
  }')

echo "응답: $DUPLICATE_CHALLENGE"
echo ""

echo "======================================"
echo "✅ 테스트 완료!"
echo "======================================"
