import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

// 공개 설정 읽기 (인증 불필요)
export async function GET() {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

    // 공개해도 되는 설정만 반환
    return NextResponse.json({
      kakaoMapApiKey: settings.kakaoMapApiKey,
      googleAnalyticsId: settings.googleAnalyticsId,
      companyInfo: settings.companyInfo,
    });
  } catch {
    return NextResponse.json({ error: '설정을 불러올 수 없습니다.' }, { status: 500 });
  }
}
