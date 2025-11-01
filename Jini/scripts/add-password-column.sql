-- User 테이블에 password 컬럼 추가
ALTER TABLE User ADD COLUMN password VARCHAR(255) AFTER phone_number;

-- 기존 사용자들에게 임시 비밀번호 설정 (선택사항)
-- UPDATE User SET password = 'temp_password' WHERE password IS NULL;
