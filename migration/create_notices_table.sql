-- 공지사항 테이블 생성
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE, -- 상단 고정 여부
  published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  author_id UUID REFERENCES auth.users ON DELETE SET NULL
);

-- RLS 정책 활성화
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 공지 읽기: 모두 가능
CREATE POLICY "공지사항 모두 조회 가능" ON notices
  FOR SELECT USING (true);

-- 공지 작성/수정/삭제: 관리자만 가능
CREATE POLICY "관리자만 공지사항 관리 가능" ON notices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
