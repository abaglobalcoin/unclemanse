import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const mediaPath = path.join(process.cwd(), 'data', 'media.json');

// 기본 미디어 설정
const defaultMedia = {
  hero: {
    backgroundImage: '/images/background.jpg',
    title: '아파트 광고의 새로운 기준',
    subtitle: '엉클만세와 함께하세요',
  },
  services: [
    {
      id: 'mirror',
      title: '거울 광고',
      description: '엘리베이터 내 거울 광고',
      image: '/images/mirror-ad.jpg',
    },
    {
      id: 'board',
      title: '게시판 광고',
      description: '아파트 게시판 광고',
      image: '/images/board-ad.jpg',
    },
    {
      id: 'elevator',
      title: '엘리베이터 광고',
      description: '엘리베이터 내부 광고',
      image: '/images/elevator-ad.jpg',
    },
  ],
  reviews: [
    {
      id: 'review1',
      title: '부동산 리뷰',
      mediaType: 'video',
      videoUrl: '/images/review-realestate.mp4',
      images: [],
      speechBubble: '처음 가게 오픈하고, 주변 이웃 분들께 어떻게 알려야 할지 너무 막막했어요. 요즘은 입주민 문의가 끊기지 않네요! 엉클만세가 큰 힘이 되어줬어요!!',
      caption: '요즘 우리 동네에서 제일 바쁜 ○○부동산 사장님',
    },
    {
      id: 'review2',
      title: '학원 리뷰',
      mediaType: 'video',
      videoUrl: '/images/review-academy.mp4',
      images: [],
      speechBubble: '사실 학부모님들 사이에 입소문 나기가 정말 쉽지 않거든요. 항상 고민이었는데.. 엉클만세를 통해 광고를 시작한 이후 아파트 엘리베이터 광고를 보고 왔다는 학부모님이 참 많아졌어요. 신규 등록이 끊임없이 늘어나고 있답니다!',
      caption: '우리 동네 제일 인기 있는 ○○학원 선생님',
    },
    {
      id: 'review3',
      title: '병원 리뷰',
      mediaType: 'video',
      videoUrl: '/images/review-hospital.mp4',
      images: [],
      speechBubble: '곳곳에 병원 광고가 보이니까 입소문이 간다는 이야기를 하는 환자분들이 많아졌어요. 덕분에 신뢰도가 확실히 높아진 것 같아요. 처음엔 반신반의했는데, 효과 보고 나서 이제 광고는 무조건 엉클만세에 맡깁니다!',
      caption: '우리 마을 건강 책임지는 ○○병원 원장님',
    },
  ],
  portfolio: [
    { id: 'portfolio1', image: '/images/portfolio1.jpg', title: '포트폴리오 1' },
    { id: 'portfolio2', image: '/images/portfolio2.jpg', title: '포트폴리오 2' },
    { id: 'portfolio3', image: '/images/portfolio3.jpg', title: '포트폴리오 3' },
    { id: 'portfolio4', image: '/images/portfolio4.jpg', title: '포트폴리오 4' },
  ],
  logo: '/images/unclelogo.png',
  favicon: '/favicon.ico',
};

// data 폴더 확인 및 생성
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// GET: 미디어 설정 조회
export async function GET() {
  try {
    ensureDataDir();

    if (!fs.existsSync(mediaPath)) {
      fs.writeFileSync(mediaPath, JSON.stringify(defaultMedia, null, 2));
      return NextResponse.json(defaultMedia);
    }

    const media = JSON.parse(fs.readFileSync(mediaPath, 'utf-8'));
    return NextResponse.json(media);
  } catch (error) {
    console.error('Error reading media settings:', error);
    return NextResponse.json(defaultMedia);
  }
}

// POST: 미디어 설정 저장
export async function POST(request: NextRequest) {
  try {
    ensureDataDir();

    const media = await request.json();
    fs.writeFileSync(mediaPath, JSON.stringify(media, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving media settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}
