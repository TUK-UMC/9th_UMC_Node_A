# Chapter 05 API 테스트 가이드 (Postman)

## 📦 Postman Collection 설정

### Base URL
```
http://localhost:3000
```

---

## 🧪 테스트 순서

### 1️⃣ 가게 추가 (POST /api/v1/stores)

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/v1/stores`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "맛있는 떡볶이집",
  "regionName": "강남구",
  "address": "서울시 강남구 테헤란로 123",
  "description": "최고의 떡볶이 맛집입니다",
  "status": 1
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "가게가 성공적으로 추가되었습니다.",
  "result": {
    "storeId": 1,
    "name": "맛있는 떡볶이집",
    "regionName": "강남구",
    "address": "서울시 강남구 테헤란로 123",
    "description": "최고의 떡볶이 맛집입니다",
    "status": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

📝 **Notes:**
- 응답에서 `storeId`를 저장해두세요. 다음 API에서 사용됩니다.

---

### 2️⃣ 리뷰 추가 (POST /api/v1/stores/:storeId/reviews)

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/v1/stores/1/reviews` (storeId를 위에서 받은 값으로 변경)  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1,
  "rating": 4.5,
  "content": "정말 맛있었어요! 떡볶이가 정말 쫄깃하고 양념이 환상적이에요.",
  "imageUrls": [
    "https://example.com/tteokbokki1.jpg",
    "https://example.com/tteokbokki2.jpg"
  ]
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "리뷰가 성공적으로 추가되었습니다.",
  "result": {
    "reviewId": 1,
    "storeId": 1,
    "userId": 1,
    "rating": 4.5,
    "content": "정말 맛있었어요! 떡볶이가 정말 쫄깃하고 양념이 환상적이에요.",
    "images": [
      {
        "imageId": 1,
        "imageUrl": "https://example.com/tteokbokki1.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "imageId": 2,
        "imageUrl": "https://example.com/tteokbokki2.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (존재하지 않는 가게):**
```json
{
  "success": false,
  "message": "존재하지 않는 가게입니다."
}
```

📝 **Notes:**
- `userId`는 실제로 존재하는 사용자 ID를 사용해야 합니다.
- `imageUrls`는 선택사항입니다. 없으면 빈 배열로 보내도 됩니다.

---

### 3️⃣ 미션 추가 (POST /api/v1/stores/:storeId/missions)

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/v1/stores/1/missions` (storeId를 위에서 받은 값으로 변경)  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "첫 방문 미션",
  "description": "처음 방문해서 떡볶이 주문하고 리뷰 남기기",
  "rewardPoint": 1000,
  "bossCode": 12345
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "미션이 성공적으로 추가되었습니다.",
  "result": {
    "missionId": 1,
    "storeId": 1,
    "userId": null,
    "rewardPoint": 1000,
    "title": "첫 방문 미션",
    "description": "처음 방문해서 떡볶이 주문하고 리뷰 남기기",
    "status": "waiting",
    "bossCode": 12345,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

📝 **Notes:**
- 응답에서 `missionId`를 저장해두세요. 다음 API에서 사용됩니다.
- `userId`는 null입니다 (아직 아무도 도전하지 않은 상태).
- `status`는 "waiting"입니다.

---

### 4️⃣ 미션 도전하기 (POST /api/v1/missions/:missionId/challenge)

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/v1/missions/1/challenge` (missionId를 위에서 받은 값으로 변경)  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "미션 도전이 시작되었습니다.",
  "result": {
    "missionId": 1,
    "storeId": 1,
    "userId": 1,
    "rewardPoint": 1000,
    "title": "첫 방문 미션",
    "description": "처음 방문해서 떡볶이 주문하고 리뷰 남기기",
    "status": "ongoing",
    "bossCode": 12345,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:01.000Z"
  }
}
```

**Error Response (이미 도전 중):**
```json
{
  "success": false,
  "message": "이미 도전 중인 미션입니다."
}
```

**Error Response (이미 완료됨):**
```json
{
  "success": false,
  "message": "이미 도전 중이거나 완료된 미션입니다."
}
```

📝 **Notes:**
- `userId`가 할당되고 `status`가 "ongoing"으로 변경됩니다.
- 동일한 미션에 같은 사용자가 다시 도전할 수 없습니다.

---

## 🧪 에러 케이스 테스트

### 1. 존재하지 않는 가게에 리뷰 추가
**URL:** `{{baseUrl}}/api/v1/stores/999/reviews`
```json
{
  "userId": 1,
  "rating": 5.0,
  "content": "테스트"
}
```
**Expected:** 400 Bad Request - "존재하지 않는 가게입니다."

---

### 2. 존재하지 않는 가게에 미션 추가
**URL:** `{{baseUrl}}/api/v1/stores/999/missions`
```json
{
  "title": "테스트 미션",
  "rewardPoint": 500
}
```
**Expected:** 400 Bad Request - "존재하지 않는 가게입니다."

---

### 3. userId 없이 리뷰 추가
**URL:** `{{baseUrl}}/api/v1/stores/1/reviews`
```json
{
  "rating": 5.0,
  "content": "테스트"
}
```
**Expected:** 400 Bad Request - "userId는 필수입니다."

---

### 4. userId 없이 미션 도전
**URL:** `{{baseUrl}}/api/v1/missions/1/challenge`
```json
{}
```
**Expected:** 400 Bad Request - "userId는 필수입니다."

---

### 5. 이미 도전 중인 미션에 다시 도전
**URL:** `{{baseUrl}}/api/v1/missions/1/challenge`
```json
{
  "userId": 1
}
```
(동일한 요청을 두 번 보내기)
**Expected:** 400 Bad Request - "이미 도전 중이거나 완료된 미션입니다."

---

## 📊 Postman Environment 설정

Postman에서 Environment를 만들어서 사용하면 편리합니다.

**Environment Variables:**
```
baseUrl: http://localhost:3000
userId: 1
storeId: (가게 추가 후 자동으로 설정)
missionId: (미션 추가 후 자동으로 설정)
```

**Tests 스크립트 예시 (가게 추가 API):**
```javascript
// 성공 시 storeId를 Environment에 저장
if (pm.response.code === 201) {
    const responseJson = pm.response.json();
    pm.environment.set("storeId", responseJson.result.storeId);
}
```

---

## 🔄 전체 플로우 테스트

1. **가게 추가** → `storeId` 저장
2. **미션 추가** (위에서 받은 `storeId` 사용) → `missionId` 저장
3. **리뷰 추가** (위에서 받은 `storeId` 사용)
4. **미션 도전** (위에서 받은 `missionId` 사용)
5. **미션 재도전 시도** (에러 확인)

---

## 💡 Tips

1. **Postman Collection 저장**: 모든 요청을 Collection으로 저장하여 재사용
2. **Pre-request Script**: 필요한 데이터를 자동으로 생성
3. **Tests**: 응답을 자동으로 검증하고 데이터 추출
4. **Environment**: 여러 환경(개발, 운영)에서 쉽게 전환

---

## ❗ 주의사항

- **userId**: 실제로 DB에 존재하는 사용자 ID를 사용해야 합니다.
- **storeId**: 가게를 먼저 추가한 후 받은 ID를 사용해야 합니다.
- **missionId**: 미션을 먼저 추가한 후 받은 ID를 사용해야 합니다.
- **Port**: 기본 포트는 3000이지만, .env 파일의 PORT 설정을 확인하세요.
