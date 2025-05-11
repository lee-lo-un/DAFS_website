-- "풍수교육" 테이블 SQL
CREATE TABLE IF NOT EXISTS fengshui_courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,                      -- 교육 제목
  description TEXT,                         -- 교육 소개
  curriculum TEXT,                          -- 상세 커리큘럼 (선택)
  target_audience TEXT,                     -- 대상자 설명
  start_date DATE NOT NULL,                 -- 시작일
  end_date DATE,                            -- 종료일
  time TEXT,                                -- 시간 정보 (예: 매주 수 10~12시)
  location TEXT,                            -- 장소/줌링크 등
  price INTEGER DEFAULT 0,                  -- 수강료
  max_attendees INTEGER,                    -- 최대 인원
  current_attendees INTEGER DEFAULT 0,      -- 현재 신청 인원
  is_active BOOLEAN DEFAULT TRUE,           -- 신청 가능 여부
  image_url TEXT,                           -- 대표 이미지
  category TEXT DEFAULT '정규과정',         -- 정규/워크숍/세미나 분류
  created_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 수강 신청자 테이블 SQL
CREATE TABLE IF NOT EXISTS course_applications (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES fengshui_courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  memo TEXT,                                 -- 신청 메모
  status TEXT DEFAULT 'pending',             -- pending, approved, rejected, canceled
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 중복 신청 방지 (같은 강좌에 같은 사람이 여러 번 신청하는 것 방지)
CREATE UNIQUE INDEX IF NOT EXISTS idx_course_user_unique
ON course_applications(course_id, user_id);

-- RLS 정책 활성화
ALTER TABLE fengshui_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_applications ENABLE ROW LEVEL SECURITY;

-- fengshui_courses
-- 모두 조회 가능
CREATE POLICY "모두 조회 가능" ON fengshui_courses
  FOR SELECT USING (true);

-- 관리자만 생성/수정/삭제 가능
CREATE POLICY "관리자만 강좌 관리" ON fengshui_courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- course_applications
CREATE POLICY "본인 신청만 생성" ON course_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 신청만 조회" ON course_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "관리자 전체 관리" ON course_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
