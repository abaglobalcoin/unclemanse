import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { promises as fs } from 'fs';
import path from 'path';

// 로컬 개발용 파일 경로
const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'data', 'pages.json');

// KV 사용 가능 여부 확인
const isKvAvailable = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// 로컬 파일에서 읽기
async function readLocalStorage(): Promise<typeof defaultPages | null> {
  try {
    const data = await fs.readFile(LOCAL_STORAGE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// 로컬 파일에 저장
async function writeLocalStorage(data: typeof defaultPages): Promise<void> {
  const dir = path.dirname(LOCAL_STORAGE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(LOCAL_STORAGE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// 실제 메인 페이지 콘텐츠 (기본값)
const defaultPages = {
  home: {
    hero: {
      badge: '15년 전통의 광고 전문 기업',
      title: '사람, 마을, 광고를\n연결하는 행복기업\n엉클만세',
      subtitle: '엉클만세는 파주라는 동네 안에서 좋은 가게, 괜찮은 병원, 믿을 수 있는 학원을 진짜 \'필요한 사람\'들에게 연결해주는 일을 해요',
      backgroundImage: '/images/background.jpg',
      characterImage: 'https://static.wixstatic.com/media/ed23bc_72c9e3ea94f54b01a261bcb493541281~mv2.png/v1/fill/w_500,h_1000,al_c,q_90,enc_avif,quality_auto/A-2-topaz-upscale-2_8x.png',
      ctaButton1: '카카오톡 채널',
      ctaButton2: '우리동네',
    },
    stats: [
      { label: '제휴 아파트', value: '500+' },
      { label: '광고 만족도', value: '98%' },
      { label: '누적 광고주', value: '1,000+' },
      { label: '업계 경력', value: '15년+' },
    ],
    brandBanner: {
      title: 'UNCLEMANSE',
      subtitle: 'Community-Based Advertising Company',
    },
    characterSection: {
      labels: [
        '가게 이름 알리고,',
        '손님 발길 늘려주는 광고.',
        '동네와 사람을 이어주는\n광고,',
        '그것이\n진짜 광고입니다.',
        '엉클만세는 천천히,\n꾸준히, 진심으로',
        '오래가는 이미지를 함께\n만듭니다.',
      ],
      sloganTitle: '"지역을 밝히는 광고,\n엉클만세가 합니다."',
      sloganDescription: '지역광고요?\n그냥 "파주에 이런 곳 있어요~" 하고 알려주는 거예요.\n그 한마디가 필요한 사장님들과 고객님들을 위해,\n진심으로 광고합니다.',
      characterImage: 'https://static.wixstatic.com/media/ed23bc_e99e6ae7faad4f04a516ef892991a984~mv2.png/v1/fill/w_299,h_663,al_c,q_85/A-3-topaz-upscale-2_8x.png',
    },
    reviewBanner: {
      title: 'REVIEW',
    },
    reviews: [
      { bubble: '처음 가게 오픈하고, 주변 이웃 분들께 어떻게 알려야 할지 너무 막막했어요. 요즘은 입주민 문의가 끊기지 않네요! 엉클만세가 큰 일이 되어줬어요!!', caption: '요즘 우리 동네에서 제일 바쁜 ○○부동산 사장님', characterImage: 'https://static.wixstatic.com/media/ed23bc_72c9e3ea94f54b01a261bcb493541281~mv2.png/v1/fill/w_400,h_800,al_c,q_90/A-2-topaz-upscale-2_8x.png', bgColor: 'bg-sky-400', mediaType: 'none', videoUrl: '', images: [] },
      { bubble: '학부모님들 사이에 입소문 나기가 정말 쉽지 않거든요. 항상 고민이었는데.. 엉클만세를 통해 광고를 시작한 이후 아파트 엘리베이터 광고를 보고 왔다는 학부모님이 참 많아졌어요.', caption: '우리 동네 제일 인기 있는 ○○학원 선생님', characterImage: 'https://static.wixstatic.com/media/ed23bc_a95d4fc4bf1a4338a23b0f3e4c5c891f~mv2.png/v1/fill/w_400,h_800,al_c,q_90/A-1-topaz-upscale-2_8x.png', bgColor: 'bg-orange-400', mediaType: 'none', videoUrl: '', images: [] },
      { bubble: '곳곳에 병원 광고가 보이니까 입소문이 간다는 이야기를 하는 환자분들이 많아졌어요. 덕분에 신뢰도가 확실히 높아진 것 같아요.', caption: '우리 마을 건강 책임지는 ○○병원 원장님', characterImage: 'https://static.wixstatic.com/media/ed23bc_bc0d15f53e6747928439199e49d9e740~mv2.png/v1/fill/w_400,h_730,al_c,q_90/A-4-topaz-upscale-2_8x.png', bgColor: 'bg-green-400', mediaType: 'none', videoUrl: '', images: [] },
    ],
    servicesSection: {
      badge: 'SERVICES',
      title: '맞춤형 광고 솔루션',
      subtitle: '비즈니스 목표에 맞는 최적의 광고 방법을 제안합니다',
      items: [
        { id: 'mirror', title: '거울광고', description: '엘리베이터 거울에 자연스럽게 노출되는 프리미엄 광고' },
        { id: 'elevator', title: '엘리베이터 광고', description: '매일 반복 노출로 강력한 브랜드 인지도 구축' },
        { id: 'board', title: '게시판 광고', description: '지역 주민에게 직접 다가가는 타겟 마케팅' },
        { id: 'flyer', title: '전단지 제작', description: '전문 디자인팀의 고품질 인쇄물 제작' },
      ],
    },
    whyUsSection: {
      badge: 'WHY US',
      title: '왜 엉클만세를\n선택해야 할까요?',
      subtitle: '15년간 쌓아온 신뢰와 전문성으로 고객의 성공을 함께 만들어갑니다.',
      features: [
        { title: '전문 디자인팀', desc: '15년 경력의 전문가가 제작합니다' },
        { title: '합리적인 가격', desc: '투명한 견적으로 신뢰를 드립니다' },
        { title: '빠른 설치', desc: '계약 후 3일 이내 설치 완료' },
        { title: '철저한 A/S', desc: '문제 발생 시 24시간 내 대응' },
      ],
      ctaText: '회사 소개 보기',
      characterImage: 'https://static.wixstatic.com/media/ed23bc_a95d4fc4bf1a4338a23b0f3e4c5c891f~mv2.png/v1/fill/w_739,h_1500,al_c,q_90/A-1-topaz-upscale-2_8x.png',
      statValue: '98%',
      statLabel: '고객 만족도',
    },
    finalCta: {
      title: '지금 바로 시작하세요',
      subtitle: '무료 상담을 통해 최적의 광고 솔루션을 제안받으세요.',
      ctaButton1: '온라인 문의하기',
      ctaButton2: '031-945-1217',
      phone: '031-945-1217',
    },
  },
  services: {
    title: '광고솔루션',
    subtitle: '지역을 연결하는 가장 효과적인 방법',
    items: [
      {
        id: 'mirror',
        title: '거울 광고',
        description: '엘리베이터 내 거울에 부착하는 프리미엄 광고',
        image: '/images/mirror-ad.jpg',
        features: ['높은 주목도', '세련된 디자인', '장기 노출'],
      },
      {
        id: 'board',
        title: '게시판 광고',
        description: '아파트 게시판에 게시하는 효과적인 광고',
        image: '/images/board-ad.jpg',
        features: ['넓은 면적', '정보 전달력', '비용 효율'],
      },
      {
        id: 'elevator',
        title: '엘리베이터 광고',
        description: '엘리베이터 내부 벽면 광고',
        image: '/images/elevator-ad.jpg',
        features: ['반복 노출', '집중도 높음', '다양한 형태'],
      },
    ],
    serviceItems: [
      { number: '01', title: '아파트 오프라인 광고', subtitle: '엘리베이터 거울, 게시판, 관리사무소 사인물', mediaType: 'youtube', videoUrl: 'https://www.youtube.com/embed/dlQEluXatMk', imageUrl: '' },
      { number: '02', title: '아파트 엘리베이터 동영상 광고', subtitle: '', mediaType: 'mp4', videoUrl: 'https://video.wixstatic.com/video/3a3909_059e2d8487d3487484086483f05c5f49/1080p/mp4/file.mp4', imageUrl: '' },
      { number: '03', title: '옥외광고', subtitle: '파주시 현수막 게시대, 디지털 사이니지, 큐레이션', mediaType: 'mp4', videoUrl: 'https://video.wixstatic.com/video/3a3909_3dab49a195fa49e89c79a3822f3791a7/720p/mp4/file.mp4', imageUrl: '' },
      { number: '04', title: '거울, 게시판, 안전관리용품', subtitle: '공동주택 용품 (막사창고)', mediaType: 'image', videoUrl: '', imageUrl: 'https://static.wixstatic.com/media/3a3909_390f49d3a00b433bb99f082df7f5b20f~mv2.png/v1/fill/w_400,h_400,al_c,q_85/3a3909_390f49d3a00b433bb99f082df7f5b20f~mv2.png' },
      { number: '05', title: '현수막, 배너, 실사출력, 포맥스, 아크릴, 안내판, SIGN', subtitle: '', mediaType: 'image', videoUrl: '', imageUrl: 'https://static.wixstatic.com/media/3a3909_752d220f1d2144eb90750f3f51f1933f~mv2.jpg/v1/fill/w_500,h_375,al_c,q_80/3a3909_752d220f1d2144eb90750f3f51f1933f~mv2.jpg' },
      { number: '06', title: '홈페이지 제작, 유지보수', subtitle: '', mediaType: 'mp4', videoUrl: 'https://video.wixstatic.com/video/3a3909_f9821158013b463990b737b627f44ef8/360p/mp4/file.mp4', imageUrl: '' },
    ],
    cta: {
      title: '광고 문의가 필요하신가요?',
      subtitle: '전문 상담원이 맞춤형 광고 솔루션을 제안해 드립니다',
      buttonText: '문의하기',
    },
  },
  info: {
    title: '"사람, 마을, 광고를 연결하는 행복기업"',
    content: '엉클만세는 단순한 광고회사가 아닙니다.\n우리는 지역의 소통을 잇는 다리이자, 사람과 마을을 행복으로 연결하는 파트너입니다.',
    image: '/images/company-info.jpg',
    highlights: [
      '15년 이상의 업계 경험',
      '500개 이상 아파트 제휴',
      '98% 이상 고객 만족도',
    ],
    values: [
      { number: '1', titleKo: '신뢰와 지역밀착', titleEn: 'Trust and Local Engagement', descriptionKo: '지역 주민과 상생하고, 신뢰받는 광고 파트너로 자리매김하는 것.', descriptionEn: 'Becoming a trusted advertising partner that grows together with the local community', image: 'https://static.wixstatic.com/media/3a3909_592a09de733547c1889a3022078c854b~mv2.png/v1/fill/w_376,h_720,al_c,lg_1,q_85/3a3909_592a09de733547c1889a3022078c854b~mv2.png' },
      { number: '2', titleKo: '창의적 실행', titleEn: 'Creative Execution', descriptionKo: '기존의 광고 방식을 넘어서는 새로운 아이디어와 실천으로 차별화된 성과를 내는 것.', descriptionEn: 'Delivering differentiated results through new ideas and practices', image: 'https://static.wixstatic.com/media/3a3909_7fb02088558b4246ba362b1448321c31~mv2.png/v1/fill/w_670,h_724,al_c,q_90/컴퓨터하는모습.png' },
      { number: '3', titleKo: '사람 중심 성장', titleEn: 'People-Centered Growth', descriptionKo: '팀원, 고객, 지역사회를 아우르는 사람 중심 경영을 통해 함께 성장하는 것.', descriptionEn: 'Growing together through people-centered management', image: 'https://static.wixstatic.com/media/3a3909_452dad8bbf6e499ea66a9fd6dec244e8~mv2.png/v1/fill/w_600,h_558,al_c,q_85/성장.png' },
    ],
    summaryText: '즉, 엉클만세의 핵심은',
    summaryHighlights: ['지역 신뢰 기반', '창의적인 실천력', '사람과 함께하는 성장'],
  },
  warehouse: {
    title: '"아파트가 필요로 하는 모든 것을, 한 곳에서"',
    description: '안전용품부터 생활 소모품까지, 막사창고가 책임집니다.',
    sections: [
      {
        number: '1',
        titleKo: '막사창고란?',
        descriptionKo: '막사창고는 아파트 단지, 주거 커뮤니티에 꼭 필요한 물품을 안정적으로 공급하는 B2B 전문 서비스입니다. 한 번의 주문으로 필요한 물품을 빠르게, 합리적인 가격으로 공급합니다.',
        image: 'https://static.wixstatic.com/media/3a3909_4397f04234a54068ae4bdf5c2b125215~mv2.png/v1/fill/w_410,h_720,al_c,lg_1,q_85,enc_avif,quality_auto/3a3909_4397f04234a54068ae4bdf5c2b125215~mv2.png',
      },
      {
        number: '2',
        titleKo: '주요 공급 품목',
        descriptionKo: '',
        items: [
          '현수막/배너 : 주차금지, 단지내서행, 어린이보호구역 등',
          '안내판/표지판 : 금연구역, CCTV, 통행금지, 미끄럼주의 등',
          '인쇄물/스티커 : 관리규약, 명함, 봉투, 각종일지 등',
          '입간판/안전용품 : 장애인주차금지, 외부차량출입금지 등',
          '생활용품 : 우편함, 음식물 쓰레기, 분리수거함 등',
        ],
        image: 'https://static.wixstatic.com/media/3a3909_fa042aceaee14a87b14fd301f91ccc31~mv2.png/v1/fill/w_328,h_840,al_c,lg_1,q_85,enc_avif,quality_auto/3a3909_fa042aceaee14a87b14fd301f91ccc31~mv2.png',
      },
      {
        number: '3',
        titleKo: '막사창고가 선택받는 이유',
        descriptionKo: '원스톱 공급 – 필요한 물품을 한 번에 해결',
        image: 'https://static.wixstatic.com/media/3a3909_f6af16820e7f4052ad003c6a437a8fe5~mv2.png/v1/fill/w_446,h_720,al_c,lg_1,q_85,enc_avif,quality_auto/3a3909_f6af16820e7f4052ad003c6a437a8fe5~mv2.png',
      },
      {
        number: '4',
        titleKo: '거울, 게시판, 안전관리용품',
        descriptionKo: '',
        image: 'https://static.wixstatic.com/media/3a3909_132d07d43bb24448ac957e70cec0e5dd~mv2.png/v1/fill/w_497,h_720,al_c,lg_1,q_85,enc_avif,quality_auto/3a3909_132d07d43bb24448ac957e70cec0e5dd~mv2.png',
      },
      {
        number: '5',
        titleKo: '현수막, 배너, 실사출력, 포맥스',
        descriptionKo: '',
        image: 'https://static.wixstatic.com/media/3a3909_d44a9d961a68448e8b53251a7b9813cd~mv2.png/v1/fill/w_553,h_720,al_c,lg_1,q_90,enc_avif,quality_auto/3a3909_d44a9d961a68448e8b53251a7b9813cd~mv2.png',
      },
    ],
    ctaText: '막사창고와 함께라면 아파트 운영이 더 쉬워집니다.',
    ctaSubtext: '필요한 모든 것을 안정적으로, 합리적인 비용으로 공급받으세요.',
    ctaButtons: [
      { text: '블로그(막사창고)', url: 'https://blog.naver.com/gyhappyman' },
      { text: '막사창고 홈페이지', url: 'https://www.unclemanse.kr/' },
    ],
  },
  faq: {
    title: '"엉클만세와 연결하세요"',
    subtitle: '광고 솔루션 상담부터 막사창고 납품 문의까지,\n궁금한 점이 있다면 언제든 편하게 연락주세요.',
    items: [
      {
        question: '광고 비용은 어떻게 되나요?',
        answer: '아파트 규모, 광고 종류, 기간에 따라 다릅니다. 상담을 통해 맞춤 견적을 받아보세요.',
      },
      {
        question: '광고 기간은 얼마나 되나요?',
        answer: '최소 1개월부터 가능하며, 장기 계약 시 할인 혜택이 있습니다.',
      },
      {
        question: '광고 디자인도 해주시나요?',
        answer: '네, 전문 디자이너가 무료로 광고 디자인을 제작해 드립니다.',
      },
    ],
    quickFaqs: [
      { question: 'Q. 광고 진행 절차는 어떻게 되나요?', answer: '→ 상담 → 제안서 전달 → 계약 → 광고 진행' },
      { question: 'Q. 막사창고 물품은 어떻게 주문할 수 있나요?', answer: '→ 필요 물품 리스트 전달 → 견적 확인 → 발주 → 납품' },
      { question: 'Q. 최소 계약 기간이 있나요?', answer: '→ 광고 유형에 따라 다르며, 1개월 단위 계약도 가능합니다.' },
    ],
    adFaqs: [
      { question: '광고를 진행하려면 어떻게 신청하나요?', answer: '홈페이지 상담신청 또는 카카오톡 채널로 문의해 주세요. 담당 매니저가 가능 단지·위치·예산에 맞춘 제안을 드립니다.' },
      { question: '엘리베이터 거울광고는 어떤 아파트에서 가능한가요?', answer: '파주시 전역 및 고양시 일부 단지에서 운영합니다. 협력 단지 목록은 상담 시 안내드립니다.' },
      { question: '광고 게재 기간은 얼마나 되나요?', answer: '기본 1개월 단위이며, 3/6/12개월 단위로 진행하고 있습니다.' },
      { question: '광고물 제작과 설치에 따른 추가적인 비용이 발생하나요?', answer: '아니요. 광고물 제작과 설치에 따른 추가적인 비용이 발생하지 않습니다. 담당 매니저의 꼼꼼한 제작, 설치가 무료로 진행됩니다.' },
      { question: '광고 비용은 어떻게 책정되나요?', answer: '매체, 단지 세대수, 노출 기간에 따라 달라집니다. 예산을 알려주시면 최적 조합으로 제안드립니다.' },
    ],
    contactInfo: {
      phone: '031-945-1217',
      email: 'unclemanse@naver.com',
      kakao: '채팅하기',
      address: '경기도 파주시 교하로 421 (동패동)',
    },
  },
  contact: {
    title: '문의하기',
    subtitle: '광고 상담 및 견적 문의',
    phone: '031-945-1217',
    email: 'unclemanse@naver.com',
    address: '경기도 파주시 교하로 421 (동패동)',
    businessHours: '평일 09:00 - 18:00',
  },
};

const PAGES_KEY = 'pages_content';

// 깊은 병합 함수 - 저장된 데이터와 기본값을 병합하여 새 필드가 누락되지 않도록 함
function deepMerge<T extends Record<string, unknown>>(defaults: T, stored: Partial<T>): T {
  const result = { ...defaults };

  for (const key in stored) {
    if (stored[key] !== undefined) {
      if (
        typeof defaults[key] === 'object' &&
        defaults[key] !== null &&
        !Array.isArray(defaults[key]) &&
        typeof stored[key] === 'object' &&
        stored[key] !== null &&
        !Array.isArray(stored[key])
      ) {
        // 객체인 경우 재귀적으로 병합
        result[key] = deepMerge(
          defaults[key] as Record<string, unknown>,
          stored[key] as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        // 배열이나 기본값은 저장된 값으로 덮어씀
        result[key] = stored[key] as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

// GET: 페이지 콘텐츠 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    let storedPages: typeof defaultPages | null = null;

    // Vercel KV 또는 로컬 스토리지에서 데이터 조회
    if (isKvAvailable()) {
      storedPages = await kv.get<typeof defaultPages>(PAGES_KEY);
    } else {
      storedPages = await readLocalStorage();
    }

    // 저장된 데이터와 기본값 병합 (새 필드가 누락되지 않도록)
    const pages = storedPages ? deepMerge(defaultPages, storedPages) : defaultPages;

    // 특정 페이지만 요청한 경우
    if (page && page in pages) {
      return NextResponse.json(pages[page as keyof typeof defaultPages]);
    }

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error reading page contents:', error);
    return NextResponse.json(defaultPages);
  }
}

// POST: 페이지 콘텐츠 저장
export async function POST(request: NextRequest) {
  try {
    const { page, content } = await request.json();

    // 기존 데이터 조회 (KV 또는 로컬)
    let pages: typeof defaultPages | null = null;
    if (isKvAvailable()) {
      pages = await kv.get<typeof defaultPages>(PAGES_KEY);
    } else {
      pages = await readLocalStorage();
    }
    if (!pages) {
      pages = defaultPages;
    }

    // 특정 페이지 업데이트
    if (page && content) {
      (pages as Record<string, unknown>)[page] = content;

      if (isKvAvailable()) {
        await kv.set(PAGES_KEY, pages);
      } else {
        await writeLocalStorage(pages);
      }
      return NextResponse.json({ success: true });
    }

    // 전체 업데이트
    const dataToSave = content || pages;
    if (isKvAvailable()) {
      await kv.set(PAGES_KEY, dataToSave);
    } else {
      await writeLocalStorage(dataToSave);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving page contents:', error);
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}
