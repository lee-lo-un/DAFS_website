-- 카테고리 테이블에 is_default 컬럼 추가
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- 기본 카테고리 설정 (예: '미분류' 카테고리를 기본으로 설정)
UPDATE categories SET is_default = true WHERE name = '미분류' OR name = '기타';
