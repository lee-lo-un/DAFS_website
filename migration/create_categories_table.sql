-- 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  display_order INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 카테고리 추가
INSERT INTO categories (name, slug, description, display_order, is_default)
VALUES 
  ('사례 모음', 'cases', '풍수 적용 사례 모음', 1, true),
  ('명당 소개', 'locations', '풍수 명당 소개', 2, true),
  ('풍수 팁', 'tips', '풍수 활용 팁', 3, true),
  ('풍수 이론', 'theory', '풍수 이론 설명', 4, true)
ON CONFLICT (name) DO NOTHING;

-- blog_posts 테이블에 category_id 컬럼 추가
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 기존 데이터 마이그레이션을 위한 함수 생성
CREATE OR REPLACE FUNCTION migrate_categories() RETURNS void AS $$
DECLARE
  post_record RECORD;
  category_id UUID;
BEGIN
  -- 모든 블로그 포스트를 순회
  FOR post_record IN SELECT id, category FROM blog_posts WHERE category IS NOT NULL LOOP
    -- 해당 카테고리 이름에 맞는 ID 찾기
    SELECT id INTO category_id FROM categories WHERE name = post_record.category;
    
    -- 일치하는 카테고리가 없으면 새로 생성
    IF category_id IS NULL THEN
      INSERT INTO categories (name, slug, display_order)
      VALUES (
        post_record.category, 
        LOWER(REPLACE(post_record.category, ' ', '-')), 
        (SELECT COALESCE(MAX(display_order), 0) + 1 FROM categories)
      )
      RETURNING id INTO category_id;
    END IF;
    
    -- 블로그 포스트 업데이트
    UPDATE blog_posts SET category_id = category_id WHERE id = post_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 마이그레이션 함수 실행
SELECT migrate_categories();
