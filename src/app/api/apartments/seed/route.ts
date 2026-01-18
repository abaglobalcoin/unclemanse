import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const apartmentsPath = path.join(process.cwd(), 'data', 'apartments.json');

// 파주시 아파트 초기 데이터
const defaultApartments = [
  // 운정신도시 지역
  { id: 1, name: '운정신도시 힐스테이트', address: '경기도 파주시 목동동', lat: 37.7134, lng: 126.7575, units: 1250, buildings: 15, price: { mirror: 50000, board: 30000, elevator: 80000 } },
  { id: 2, name: '운정 센트럴파크 푸르지오', address: '경기도 파주시 야당동', lat: 37.7089, lng: 126.7612, units: 980, buildings: 12, price: { mirror: 45000, board: 28000, elevator: 75000 } },
  { id: 3, name: '운정 호수공원 e편한세상', address: '경기도 파주시 동패동', lat: 37.7012, lng: 126.7534, units: 850, buildings: 10, price: { mirror: 42000, board: 25000, elevator: 70000 } },
  { id: 4, name: '한빛마을 LG자이', address: '경기도 파주시 다율동', lat: 37.7198, lng: 126.7398, units: 1100, buildings: 14, price: { mirror: 48000, board: 30000, elevator: 78000 } },
  { id: 5, name: '운정 아이파크', address: '경기도 파주시 와동동', lat: 37.7145, lng: 126.7489, units: 1320, buildings: 16, price: { mirror: 52000, board: 32000, elevator: 85000 } },
  { id: 6, name: '운정 래미안', address: '경기도 파주시 목동동', lat: 37.7167, lng: 126.7523, units: 1450, buildings: 18, price: { mirror: 55000, board: 35000, elevator: 90000 } },
  { id: 7, name: '운정 더샵', address: '경기도 파주시 야당동', lat: 37.7078, lng: 126.7645, units: 890, buildings: 11, price: { mirror: 44000, board: 27000, elevator: 72000 } },
  { id: 8, name: '운정 SK뷰', address: '경기도 파주시 동패동', lat: 37.7034, lng: 126.7498, units: 760, buildings: 9, price: { mirror: 40000, board: 24000, elevator: 68000 } },
  { id: 9, name: '운정 롯데캐슬', address: '경기도 파주시 와동동', lat: 37.7112, lng: 126.7556, units: 1180, buildings: 14, price: { mirror: 49000, board: 30000, elevator: 79000 } },
  { id: 10, name: '운정 대방노블랜드', address: '경기도 파주시 목동동', lat: 37.7189, lng: 126.7601, units: 650, buildings: 8, price: { mirror: 38000, board: 22000, elevator: 65000 } },

  // 교하지구
  { id: 11, name: '교하 자이 아파트', address: '경기도 파주시 교하동', lat: 37.7256, lng: 126.7489, units: 1500, buildings: 18, price: { mirror: 55000, board: 35000, elevator: 90000 } },
  { id: 12, name: '교하 센트럴 푸르지오', address: '경기도 파주시 교하동', lat: 37.7289, lng: 126.7534, units: 1200, buildings: 15, price: { mirror: 50000, board: 30000, elevator: 82000 } },
  { id: 13, name: '교하 힐스테이트', address: '경기도 파주시 교하동', lat: 37.7234, lng: 126.7445, units: 980, buildings: 12, price: { mirror: 46000, board: 28000, elevator: 76000 } },
  { id: 14, name: '교하 e편한세상', address: '경기도 파주시 교하동', lat: 37.7312, lng: 126.7512, units: 850, buildings: 10, price: { mirror: 43000, board: 26000, elevator: 72000 } },
  { id: 15, name: '교하 래미안', address: '경기도 파주시 교하동', lat: 37.7267, lng: 126.7567, units: 1100, buildings: 13, price: { mirror: 48000, board: 29000, elevator: 78000 } },
  { id: 16, name: '교하 더샵 레이크파크', address: '경기도 파주시 교하동', lat: 37.7298, lng: 126.7423, units: 1350, buildings: 16, price: { mirror: 52000, board: 32000, elevator: 85000 } },

  // 금촌동 지역
  { id: 17, name: '금촌 주공아파트 1단지', address: '경기도 파주시 금촌동', lat: 37.7623, lng: 126.7834, units: 1200, buildings: 20, price: { mirror: 35000, board: 20000, elevator: 55000 } },
  { id: 18, name: '금촌 주공아파트 2단지', address: '경기도 파주시 금촌동', lat: 37.7645, lng: 126.7856, units: 1100, buildings: 18, price: { mirror: 34000, board: 19000, elevator: 53000 } },
  { id: 19, name: '금촌 현대아파트', address: '경기도 파주시 금촌동', lat: 37.7589, lng: 126.7812, units: 650, buildings: 8, price: { mirror: 32000, board: 18000, elevator: 50000 } },
  { id: 20, name: '금촌 삼성래미안', address: '경기도 파주시 금촌동', lat: 37.7612, lng: 126.7789, units: 890, buildings: 11, price: { mirror: 40000, board: 24000, elevator: 65000 } },
  { id: 21, name: '금촌 롯데캐슬', address: '경기도 파주시 금촌동', lat: 37.7567, lng: 126.7867, units: 720, buildings: 9, price: { mirror: 38000, board: 22000, elevator: 60000 } },
  { id: 22, name: '금촌역 푸르지오', address: '경기도 파주시 금촌동', lat: 37.7634, lng: 126.7901, units: 1050, buildings: 13, price: { mirror: 45000, board: 27000, elevator: 72000 } },

  // 문산읍 지역
  { id: 23, name: '문산 주공아파트', address: '경기도 파주시 문산읍', lat: 37.8589, lng: 126.7856, units: 800, buildings: 12, price: { mirror: 30000, board: 17000, elevator: 48000 } },
  { id: 24, name: '문산 신원아파트', address: '경기도 파주시 문산읍', lat: 37.8612, lng: 126.7823, units: 450, buildings: 6, price: { mirror: 28000, board: 15000, elevator: 45000 } },
  { id: 25, name: '문산 현대아파트', address: '경기도 파주시 문산읍', lat: 37.8567, lng: 126.7889, units: 520, buildings: 7, price: { mirror: 29000, board: 16000, elevator: 46000 } },
  { id: 26, name: '문산 우성아파트', address: '경기도 파주시 문산읍', lat: 37.8634, lng: 126.7912, units: 380, buildings: 5, price: { mirror: 27000, board: 14000, elevator: 43000 } },
  { id: 27, name: '문산역 e편한세상', address: '경기도 파주시 문산읍', lat: 37.8601, lng: 126.7867, units: 950, buildings: 12, price: { mirror: 42000, board: 25000, elevator: 68000 } },

  // 파주읍 지역
  { id: 28, name: '파주읍 주공아파트', address: '경기도 파주시 파주읍', lat: 37.8312, lng: 126.8123, units: 600, buildings: 8, price: { mirror: 28000, board: 15000, elevator: 45000 } },
  { id: 29, name: '파주 봉서산 힐스테이트', address: '경기도 파주시 파주읍', lat: 37.8289, lng: 126.8089, units: 1100, buildings: 14, price: { mirror: 48000, board: 29000, elevator: 78000 } },
  { id: 30, name: '파주읍 대림아파트', address: '경기도 파주시 파주읍', lat: 37.8334, lng: 126.8156, units: 420, buildings: 5, price: { mirror: 26000, board: 14000, elevator: 42000 } },

  // 탄현면 지역
  { id: 31, name: '탄현 성원아파트', address: '경기도 파주시 탄현면', lat: 37.7823, lng: 126.7234, units: 350, buildings: 4, price: { mirror: 25000, board: 13000, elevator: 40000 } },
  { id: 32, name: '탄현 현대아파트', address: '경기도 파주시 탄현면', lat: 37.7856, lng: 126.7267, units: 280, buildings: 3, price: { mirror: 24000, board: 12000, elevator: 38000 } },
  { id: 33, name: '헤이리마을 타운하우스', address: '경기도 파주시 탄현면', lat: 37.7789, lng: 126.7189, units: 150, buildings: 10, price: { mirror: 35000, board: 20000, elevator: 55000 } },

  // 조리읍 지역
  { id: 34, name: '조리읍 주공아파트', address: '경기도 파주시 조리읍', lat: 37.7456, lng: 126.8234, units: 480, buildings: 6, price: { mirror: 27000, board: 15000, elevator: 44000 } },
  { id: 35, name: '봉일천 현대아파트', address: '경기도 파주시 조리읍', lat: 37.7489, lng: 126.8267, units: 320, buildings: 4, price: { mirror: 25000, board: 13000, elevator: 40000 } },
  { id: 36, name: '조리 삼부아파트', address: '경기도 파주시 조리읍', lat: 37.7423, lng: 126.8201, units: 250, buildings: 3, price: { mirror: 23000, board: 12000, elevator: 37000 } },

  // 운정3지구 (신규)
  { id: 37, name: '운정3지구 A1블록 힐스테이트', address: '경기도 파주시 운정3지구', lat: 37.6923, lng: 126.7345, units: 1800, buildings: 22, price: { mirror: 58000, board: 36000, elevator: 95000 } },
  { id: 38, name: '운정3지구 A2블록 자이', address: '경기도 파주시 운정3지구', lat: 37.6945, lng: 126.7378, units: 2100, buildings: 25, price: { mirror: 60000, board: 38000, elevator: 98000 } },
  { id: 39, name: '운정3지구 A3블록 래미안', address: '경기도 파주시 운정3지구', lat: 37.6901, lng: 126.7312, units: 1650, buildings: 20, price: { mirror: 56000, board: 35000, elevator: 92000 } },
  { id: 40, name: '운정3지구 B1블록 푸르지오', address: '경기도 파주시 운정3지구', lat: 37.6967, lng: 126.7401, units: 1950, buildings: 24, price: { mirror: 59000, board: 37000, elevator: 96000 } },
  { id: 41, name: '운정3지구 B2블록 e편한세상', address: '경기도 파주시 운정3지구', lat: 37.6889, lng: 126.7289, units: 1400, buildings: 17, price: { mirror: 54000, board: 33000, elevator: 88000 } },
  { id: 42, name: '운정3지구 C1블록 더샵', address: '경기도 파주시 운정3지구', lat: 37.6934, lng: 126.7423, units: 1550, buildings: 19, price: { mirror: 55000, board: 34000, elevator: 90000 } },

  // 월롱면 지역
  { id: 43, name: '월롱 주공아파트', address: '경기도 파주시 월롱면', lat: 37.7956, lng: 126.8012, units: 420, buildings: 5, price: { mirror: 26000, board: 14000, elevator: 42000 } },
  { id: 44, name: '월롱역 푸르지오', address: '경기도 파주시 월롱면', lat: 37.7989, lng: 126.8045, units: 780, buildings: 10, price: { mirror: 40000, board: 24000, elevator: 65000 } },

  // 법원읍 지역
  { id: 45, name: '법원읍 주공아파트', address: '경기도 파주시 법원읍', lat: 37.8456, lng: 126.8567, units: 350, buildings: 4, price: { mirror: 24000, board: 13000, elevator: 39000 } },
  { id: 46, name: '법원 현대아파트', address: '경기도 파주시 법원읍', lat: 37.8478, lng: 126.8534, units: 280, buildings: 3, price: { mirror: 23000, board: 12000, elevator: 37000 } },

  // 적성면 지역
  { id: 47, name: '적성 주공아파트', address: '경기도 파주시 적성면', lat: 37.9234, lng: 126.9123, units: 220, buildings: 3, price: { mirror: 20000, board: 10000, elevator: 32000 } },

  // 광탄면 지역
  { id: 48, name: '광탄 주공아파트', address: '경기도 파주시 광탄면', lat: 37.7834, lng: 126.8678, units: 180, buildings: 2, price: { mirror: 19000, board: 9000, elevator: 30000 } },
  { id: 49, name: '광탄 신원아파트', address: '경기도 파주시 광탄면', lat: 37.7856, lng: 126.8701, units: 150, buildings: 2, price: { mirror: 18000, board: 9000, elevator: 29000 } },

  // 추가 운정 지역
  { id: 50, name: '운정 파크푸르지오', address: '경기도 파주시 야당동', lat: 37.7056, lng: 126.7678, units: 1280, buildings: 16, price: { mirror: 51000, board: 31000, elevator: 83000 } },
  { id: 51, name: '운정 센트럴 자이', address: '경기도 파주시 동패동', lat: 37.7001, lng: 126.7589, units: 1420, buildings: 17, price: { mirror: 53000, board: 33000, elevator: 87000 } },
  { id: 52, name: '운정 레이크 힐스테이트', address: '경기도 파주시 와동동', lat: 37.7178, lng: 126.7512, units: 1150, buildings: 14, price: { mirror: 49000, board: 30000, elevator: 80000 } },
  { id: 53, name: '운정 스카이뷰 자이', address: '경기도 파주시 목동동', lat: 37.7201, lng: 126.7545, units: 980, buildings: 12, price: { mirror: 47000, board: 29000, elevator: 77000 } },
  { id: 54, name: '운정 그린파크 래미안', address: '경기도 파주시 다율동', lat: 37.7223, lng: 126.7367, units: 1350, buildings: 16, price: { mirror: 52000, board: 32000, elevator: 85000 } },
  { id: 55, name: '운정 리버파크 e편한세상', address: '경기도 파주시 야당동', lat: 37.7045, lng: 126.7701, units: 890, buildings: 11, price: { mirror: 44000, board: 27000, elevator: 73000 } },
];

// data 폴더 확인 및 생성
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// POST: 초기 데이터 시드
export async function POST() {
  try {
    ensureDataDir();
    fs.writeFileSync(apartmentsPath, JSON.stringify(defaultApartments, null, 2));
    return NextResponse.json({
      success: true,
      message: '초기 데이터가 성공적으로 저장되었습니다.',
      count: defaultApartments.length
    });
  } catch (error) {
    console.error('Error seeding apartments:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed data'
    }, { status: 500 });
  }
}

// GET: 현재 데이터 확인
export async function GET() {
  try {
    ensureDataDir();

    if (!fs.existsSync(apartmentsPath)) {
      return NextResponse.json({ exists: false, count: 0 });
    }

    const apartments = JSON.parse(fs.readFileSync(apartmentsPath, 'utf-8'));
    return NextResponse.json({
      exists: true,
      count: apartments.length
    });
  } catch (error) {
    console.error('Error checking apartments:', error);
    return NextResponse.json({ exists: false, count: 0 });
  }
}
