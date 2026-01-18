import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const apartmentsPath = path.join(process.cwd(), 'data', 'apartments.json');

// data 폴더 확인 및 생성
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// GET: 아파트 데이터 조회
export async function GET() {
  try {
    ensureDataDir();

    if (!fs.existsSync(apartmentsPath)) {
      return NextResponse.json([]);
    }

    const apartments = JSON.parse(fs.readFileSync(apartmentsPath, 'utf-8'));
    return NextResponse.json(apartments);
  } catch (error) {
    console.error('Error reading apartments:', error);
    return NextResponse.json([]);
  }
}

// POST: 아파트 데이터 저장
export async function POST(request: NextRequest) {
  try {
    ensureDataDir();

    const apartments = await request.json();
    fs.writeFileSync(apartmentsPath, JSON.stringify(apartments, null, 2));

    return NextResponse.json({ success: true, count: apartments.length });
  } catch (error) {
    console.error('Error saving apartments:', error);
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
  }
}
