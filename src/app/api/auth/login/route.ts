import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
const DEFAULT_PASSWORD = 'unclemanse2026';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // 파일에서 설정 읽기
    let adminPassword = DEFAULT_PASSWORD;
    try {
      if (fs.existsSync(settingsPath)) {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
        adminPassword = settings?.adminPassword || DEFAULT_PASSWORD;
      }
    } catch {
      // 파일 읽기 실패 시 기본 비밀번호 사용
    }

    if (password === adminPassword) {
      // 쿠키 설정 (24시간)
      const cookieStore = await cookies();
      cookieStore.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24시간
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: '비밀번호가 틀렸습니다.' }, { status: 401 });
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
  }
}
