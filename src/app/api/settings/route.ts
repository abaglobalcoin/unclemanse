import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

// 기본 설정
const defaultSettings = {
  adminPassword: 'unclemanse2026',
  kakaoMapApiKey: 'ca413ee596b953dfcf692de2ccfa82f3',
  googleAnalyticsId: '',
  contactEmail: 'unclemanse@naver.com',
  companyInfo: {
    name: '엉클만세',
    phone: '031-945-1217',
    email: 'unclemanse@naver.com',
    address: '경기도 파주시 교하로 421 (동패동)',
  },
  customDomain: '',
  smtp: {
    host: '',
    port: 587,
    user: '',
    password: '',
  },
};

// data 폴더 확인 및 생성
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 인증 체크
async function isAuthenticated() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');
  return auth?.value === 'authenticated';
}

// 설정 읽기
export async function GET() {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    ensureDataDir();

    let settings = defaultSettings;
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } else {
      fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
    }

    // 비밀번호는 마스킹
    return NextResponse.json({
      ...settings,
      adminPassword: '********',
      smtp: {
        ...settings.smtp,
        password: settings.smtp?.password ? '********' : '',
      },
    });
  } catch (error) {
    console.error('설정 로드 실패:', error);
    return NextResponse.json({ error: '설정을 불러올 수 없습니다.' }, { status: 500 });
  }
}

// 설정 저장
export async function PUT(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    ensureDataDir();

    const newSettings = await request.json();

    let currentSettings = defaultSettings;
    if (fs.existsSync(settingsPath)) {
      currentSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    }

    // 비밀번호가 마스킹된 값이면 기존 값 유지
    if (newSettings.adminPassword === '********') {
      newSettings.adminPassword = currentSettings.adminPassword;
    }
    if (newSettings.smtp?.password === '********') {
      newSettings.smtp.password = currentSettings.smtp?.password || '';
    }

    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('설정 저장 실패:', error);
    return NextResponse.json({ error: '설정 저장 실패' }, { status: 500 });
  }
}
