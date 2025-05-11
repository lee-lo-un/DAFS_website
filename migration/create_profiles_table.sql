-- profiles 테이블 생성 (아직 없는 경우)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 profiles를 볼 수 있도록 정책 설정
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

-- 사용자가 자신의 profile만 업데이트할 수 있도록 정책 설정
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 사용자가 회원가입할 때 자동으로 profile 생성하는 트리거 함수
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 설정 (아직 없는 경우)
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_user();
