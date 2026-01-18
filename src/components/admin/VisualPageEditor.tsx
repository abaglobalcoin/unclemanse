'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Save, X, Check, Edit3, Image as ImageIcon, CheckCircle, Award, ChevronRight, Megaphone, Phone, Sparkles, Zap, Target, Shield, ArrowRight, Video, Images, Plus, Trash2, ChevronLeft, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

// 페이지 콘텐츠 타입 - 확장된 버전 (새 필드는 optional)
interface PageContent {
  header?: {
    logo: string;
    navItems: Array<{
      name: string;
      url: string;
      icon: string;
    }>;
    ctaButton: string;
    ctaUrl: string;
  };
  footer?: {
    logo: string;
    description: string;
    serviceLinks: Array<{ name: string; href: string }>;
    companyLinks: Array<{ name: string; href: string }>;
    socialLinks: {
      instagram: string;
      youtube: string;
      blog: string;
    };
    copyright: string;
  };
  home: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      backgroundImage: string;
      characterImage?: string;
      ctaButton1?: string;
      ctaButton2?: string;
    };
    stats: Array<{ label: string; value: string }>;
    brandBanner?: {
      title: string;
      subtitle: string;
    };
    characterSection?: {
      labels: string[];
      sloganTitle: string;
      sloganDescription: string;
      characterImage: string;
    };
    reviewBanner?: {
      title: string;
    };
    reviews?: Array<{
      bubble: string;
      caption: string;
      characterImage: string;
      bgColor: string;
      mediaType?: 'video' | 'images' | 'none';
      videoUrl?: string;
      images?: string[];
    }>;
    servicesSection?: {
      badge: string;
      title: string;
      subtitle: string;
      items: Array<{
        id: string;
        title: string;
        description: string;
      }>;
    };
    whyUsSection?: {
      badge: string;
      title: string;
      subtitle: string;
      description?: string;
      features: Array<{ title: string; desc: string }>;
      ctaText: string;
      characterImage: string;
      statValue: string;
      statLabel: string;
    };
    finalCta?: {
      title: string;
      subtitle: string;
      ctaButton1: string;
      ctaButton2: string;
      phone: string;
    };
  };
  services: {
    title: string;
    subtitle: string;
    serviceItems?: Array<{
      number: string;
      title: string;
      subtitle: string;
      mediaType: 'youtube' | 'mp4' | 'image';
      videoUrl: string;
      imageUrl: string;
      images?: string[];
    }>;
    items: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      features: string[];
    }>;
    cta?: {
      title: string;
      subtitle: string;
      buttonText: string;
    };
  };
  info: {
    title: string;
    content: string;
    image: string;
    highlights: string[];
    values?: Array<{
      number: string;
      titleKo: string;
      titleEn: string;
      descriptionKo: string;
      descriptionEn: string;
      image: string;
    }>;
    summaryText?: string;
    summaryHighlights?: string[];
  };
  warehouse: {
    title: string;
    description: string;
    sections?: Array<{
      number: string;
      titleKo: string;
      descriptionKo: string;
      image: string;
      items?: string[];
    }>;
    ctaText?: string;
    ctaSubtext?: string;
    ctaButtons?: Array<{ text: string; url: string }>;
  };
  faq: {
    title: string;
    subtitle?: string;
    items: Array<{ question: string; answer: string }>;
    quickFaqs?: Array<{ question: string; answer: string }>;
    adFaqs?: Array<{ question: string; answer: string }>;
    contactInfo?: {
      phone: string;
      email: string;
      kakao: string;
      address: string;
    };
    ctaText?: string;
    ctaSubtext?: string;
    ctaButtonText?: string;
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    address: string;
    businessHours: string;
    kakaoTitle?: string;
    kakaoSubtitle?: string;
    faqTeaser?: string[];
  };
}

type PageSubTab = 'header' | 'footer' | 'home' | 'services' | 'info' | 'warehouse' | 'faq' | 'contact';

interface VisualPageEditorProps {
  pages: PageContent;
  currentPage: PageSubTab;
  onUpdate: (pages: PageContent) => void;
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

// 인라인 편집 가능한 텍스트 컴포넌트
function EditableText({
  value,
  onChange,
  className = '',
  multiline = false,
  placeholder = '텍스트를 입력하세요',
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="relative inline-block w-full z-50">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border-2 border-green-500 rounded bg-white text-gray-900 text-base"
            rows={4}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border-2 border-green-500 rounded bg-white text-gray-900 text-base"
            autoFocus
          />
        )}
        <div className="absolute -top-8 right-0 flex gap-1">
          <button onClick={handleSave} className="p-1 bg-green-500 text-white rounded hover:bg-green-600">
            <Check size={16} />
          </button>
          <button onClick={handleCancel} className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      onClick={() => { setTempValue(value); setIsEditing(true); }}
      className={`cursor-pointer hover:outline hover:outline-2 hover:outline-green-500 hover:outline-dashed rounded transition-all inline-block ${className}`}
      title="클릭하여 편집"
    >
      {value || placeholder}
    </span>
  );
}

// 인라인 편집 가능한 이미지 컴포넌트
function EditableImage({
  src,
  onChange,
  className = '',
  alt = '',
}: {
  src: string;
  onChange: (src: string) => void;
  className?: string;
  alt?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSrc, setTempSrc] = useState(src);

  if (isEditing) {
    return (
      <div className="relative p-4 bg-white border-2 border-green-500 rounded-lg z-50">
        <input
          type="text"
          value={tempSrc}
          onChange={(e) => setTempSrc(e.target.value)}
          placeholder="이미지 URL을 입력하세요"
          className="w-full p-2 border rounded text-gray-900 mb-2"
          autoFocus
        />
        <div className="flex gap-2">
          <button onClick={() => { onChange(tempSrc); setIsEditing(false); }} className="px-3 py-1 bg-green-500 text-white rounded">저장</button>
          <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-500 text-white rounded">취소</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => { setTempSrc(src); setIsEditing(true); }} className={`relative cursor-pointer group ${className}`} title="클릭하여 이미지 변경">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <ImageIcon size={40} className="text-gray-400" />
        </div>
      )}
      <div className="absolute inset-0 bg-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <ImageIcon size={14} /> 변경
        </div>
      </div>
    </div>
  );
}

// 편집 가능한 미디어 컴포넌트 (영상 또는 이미지 슬라이드)
function EditableMedia({
  mediaType,
  videoUrl,
  images,
  onChangeType,
  onChangeVideoUrl,
  onChangeImages,
  className = '',
}: {
  mediaType: 'video' | 'images' | 'none';
  videoUrl: string;
  images: string[];
  onChangeType: (type: 'video' | 'images' | 'none') => void;
  onChangeVideoUrl: (url: string) => void;
  onChangeImages: (images: string[]) => void;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempType, setTempType] = useState(mediaType);
  const [tempVideoUrl, setTempVideoUrl] = useState(videoUrl);
  const [tempImages, setTempImages] = useState(Array.isArray(images) ? images : []);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSave = () => {
    onChangeType(tempType);
    onChangeVideoUrl(tempVideoUrl);
    onChangeImages(tempImages);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempType(mediaType);
    setTempVideoUrl(videoUrl);
    setTempImages(images);
    setIsEditing(false);
  };

  const addImage = () => {
    setTempImages([...tempImages, '']);
  };

  const removeImage = (index: number) => {
    setTempImages(tempImages.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...tempImages];
    newImages[index] = url;
    setTempImages(newImages);
  };

  // 편집 모드
  if (isEditing) {
    return (
      <div className="relative p-4 bg-white border-2 border-green-500 rounded-lg z-50 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTempType('none')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${tempType === 'none' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            없음
          </button>
          <button
            onClick={() => setTempType('video')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${tempType === 'video' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <Video size={16} /> 영상
          </button>
          <button
            onClick={() => setTempType('images')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${tempType === 'images' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <Images size={16} /> 이미지
          </button>
        </div>

        {tempType === 'video' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">영상 URL (YouTube 또는 MP4)</label>
            <input
              type="text"
              value={tempVideoUrl}
              onChange={(e) => setTempVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/... 또는 .mp4 URL"
              className="w-full p-2 border rounded text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">YouTube: embed URL 사용 (예: https://www.youtube.com/embed/VIDEO_ID)</p>
          </div>
        )}

        {tempType === 'images' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">이미지 URL 목록</label>
            {tempImages.map((img, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="이미지 URL"
                  className="flex-1 p-2 border rounded text-gray-900 text-sm"
                />
                <button onClick={() => removeImage(index)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button onClick={addImage} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-500 flex items-center justify-center gap-2">
              <Plus size={16} /> 이미지 추가
            </button>
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t">
          <button onClick={handleSave} className="flex-1 py-2 bg-green-500 text-white rounded-lg font-medium">저장</button>
          <button onClick={handleCancel} className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">취소</button>
        </div>
      </div>
    );
  }

  // 미리보기 모드
  return (
    <div
      onClick={() => {
        setTempType(mediaType);
        setTempVideoUrl(videoUrl);
        setTempImages(images);
        setIsEditing(true);
      }}
      className={`relative cursor-pointer group ${className}`}
      title="클릭하여 미디어 편집"
    >
      {mediaType === 'none' && (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">리뷰 영상/이미지 영역</span>
        </div>
      )}

      {mediaType === 'video' && videoUrl && (
        <>
          {videoUrl.includes('youtube') ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={videoUrl} controls className="w-full h-full object-cover" />
          )}
        </>
      )}

      {mediaType === 'images' && Array.isArray(images) && images.length > 0 && (
        <div className="relative w-full h-full">
          <img src={images[currentSlide] || ''} alt={`슬라이드 ${currentSlide + 1}`} className="w-full h-full object-cover" />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {Array.isArray(images) && images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          {mediaType === 'video' ? <Video size={14} /> : <Images size={14} />} 미디어 편집
        </div>
      </div>
    </div>
  );
}

// 서비스 이미지 슬라이더 컴포넌트
function ServiceImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || !Array.isArray(images) || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-full group">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// 서비스 아이콘 매핑
const serviceIcons: { [key: string]: { icon: any; color: string } } = {
  'mirror': { icon: Sparkles, color: 'from-emerald-500 to-green-600' },
  'elevator': { icon: Zap, color: 'from-green-500 to-emerald-600' },
  'board': { icon: Target, color: 'from-teal-500 to-green-600' },
  'flyer': { icon: Shield, color: 'from-emerald-600 to-teal-600' },
};

// 기본 홈 데이터 (pages.json에 없을 경우 사용)
const defaultHomeData = {
  hero: {
    badge: '15년 전통의 광고 전문 기업',
    title: '사람, 마을, 광고를\n연결하는 행복기업\n엉클만세',
    subtitle: '엉클만세는 파주라는 동네 안에서 좋은 가게, 괜찮은 병원, 믿을 수 있는 학원을 진짜 "필요한 사람"들에게 연결해주는 일을 해요',
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
    { bubble: '처음 가게 오픈하고, 주변 이웃 분들께 어떻게 알려야 할지 너무 막막했어요...', caption: '요즘 우리 동네에서 제일 바쁜 ○○부동산 사장님', characterImage: 'https://static.wixstatic.com/media/ed23bc_72c9e3ea94f54b01a261bcb493541281~mv2.png/v1/fill/w_400,h_800,al_c,q_90/A-2-topaz-upscale-2_8x.png', bgColor: 'bg-sky-400', mediaType: 'none' as 'video' | 'images' | 'none', videoUrl: '', images: [] as string[] },
    { bubble: '학부모님들 사이에 입소문 나기가 정말 쉽지 않거든요...', caption: '우리 동네 제일 인기 있는 ○○학원 선생님', characterImage: 'https://static.wixstatic.com/media/ed23bc_a95d4fc4bf1a4338a23b0f3e4c5c891f~mv2.png/v1/fill/w_400,h_800,al_c,q_90/A-1-topaz-upscale-2_8x.png', bgColor: 'bg-orange-400', mediaType: 'none' as 'video' | 'images' | 'none', videoUrl: '', images: [] as string[] },
    { bubble: '곳곳에 병원 광고가 보이니까 입소문이 간다는 이야기를 하는 환자분들이 많아졌어요...', caption: '우리 마을 건강 책임지는 ○○병원 원장님', characterImage: 'https://static.wixstatic.com/media/ed23bc_bc0d15f53e6747928439199e49d9e740~mv2.png/v1/fill/w_400,h_730,al_c,q_90/A-4-topaz-upscale-2_8x.png', bgColor: 'bg-green-400', mediaType: 'none' as 'video' | 'images' | 'none', videoUrl: '', images: [] as string[] },
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
    description: '',
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
};

// 홈 페이지 에디터 - 모든 요소 편집 가능
function HomeEditor({ pages, onUpdate }: { pages: PageContent; onUpdate: (pages: PageContent) => void }) {
  // 기본 데이터와 병합
  const home: typeof defaultHomeData = {
    hero: { ...defaultHomeData.hero, ...pages.home.hero },
    stats: pages.home.stats?.length ? pages.home.stats : defaultHomeData.stats,
    brandBanner: { ...defaultHomeData.brandBanner, ...(pages.home as any).brandBanner },
    characterSection: { ...defaultHomeData.characterSection, ...(pages.home as any).characterSection },
    reviewBanner: { ...defaultHomeData.reviewBanner, ...(pages.home as any).reviewBanner },
    reviews: (pages.home as any).reviews?.length ? (pages.home as any).reviews : defaultHomeData.reviews,
    servicesSection: { ...defaultHomeData.servicesSection, ...(pages.home as any).servicesSection },
    whyUsSection: { ...defaultHomeData.whyUsSection, ...(pages.home as any).whyUsSection },
    finalCta: { ...defaultHomeData.finalCta, ...(pages.home as any).finalCta },
  };

  // 업데이트 함수들
  const updateHero = (field: string, value: string) => {
    onUpdate({ ...pages, home: { ...pages.home, hero: { ...home.hero, [field]: value } } as any });
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...home.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onUpdate({ ...pages, home: { ...pages.home, stats: newStats } as any });
  };

  const updateBrandBanner = (field: string, value: string) => {
    onUpdate({ ...pages, home: { ...pages.home, brandBanner: { ...home.brandBanner, [field]: value } } as any });
  };

  const updateCharacterSection = (field: string, value: any) => {
    onUpdate({ ...pages, home: { ...pages.home, characterSection: { ...home.characterSection, [field]: value } } as any });
  };

  const updateCharacterLabel = (index: number, value: string) => {
    const newLabels = [...home.characterSection.labels];
    newLabels[index] = value;
    updateCharacterSection('labels', newLabels);
  };

  const updateReviewBanner = (field: string, value: string) => {
    onUpdate({ ...pages, home: { ...pages.home, reviewBanner: { ...home.reviewBanner, [field]: value } } as any });
  };

  const updateReview = (index: number, field: string, value: string) => {
    const newReviews = [...home.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    onUpdate({ ...pages, home: { ...pages.home, reviews: newReviews } as any });
  };

  const updateReviewMediaType = (index: number, type: 'video' | 'images' | 'none') => {
    const newReviews = [...home.reviews];
    newReviews[index] = { ...newReviews[index], mediaType: type };
    onUpdate({ ...pages, home: { ...pages.home, reviews: newReviews } as any });
  };

  const updateReviewImages = (index: number, images: string[]) => {
    const newReviews = [...home.reviews];
    newReviews[index] = { ...newReviews[index], images };
    onUpdate({ ...pages, home: { ...pages.home, reviews: newReviews } as any });
  };

  const updateServicesSection = (field: string, value: any) => {
    onUpdate({ ...pages, home: { ...pages.home, servicesSection: { ...home.servicesSection, [field]: value } } as any });
  };

  const updateServiceItem = (index: number, field: string, value: string) => {
    const newItems = [...home.servicesSection.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateServicesSection('items', newItems);
  };

  const updateWhyUsSection = (field: string, value: any) => {
    onUpdate({ ...pages, home: { ...pages.home, whyUsSection: { ...home.whyUsSection, [field]: value } } as any });
  };

  const updateWhyUsFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...home.whyUsSection.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateWhyUsSection('features', newFeatures);
  };

  const updateFinalCta = (field: string, value: string) => {
    onUpdate({ ...pages, home: { ...pages.home, finalCta: { ...home.finalCta, [field]: value } } as any });
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* ===== Hero Section ===== */}
      <section className="relative min-h-[700px] bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-50/80 to-transparent" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[700px] py-12">
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <EditableText value={home.hero.badge} onChange={(v) => updateHero('badge', v)} className="text-green-700 text-sm font-medium" />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                <span>{'"'}</span>
                <EditableText value={home.hero.title} onChange={(v) => updateHero('title', v)} multiline className="whitespace-pre-line" />
                <span className="text-green-600">{'"'}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
                <EditableText value={home.hero.subtitle} onChange={(v) => updateHero('subtitle', v)} multiline />
              </p>

              {/* CTA Buttons - 편집 가능 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <span className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full font-semibold">
                  <EditableText value={home.hero.ctaButton1} onChange={(v) => updateHero('ctaButton1', v)} className="text-white" />
                  <ArrowRight size={18} />
                </span>
                <span className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-7 py-3.5 rounded-full font-semibold border border-gray-200">
                  <EditableText value={home.hero.ctaButton2} onChange={(v) => updateHero('ctaButton2', v)} />
                </span>
              </div>

              {/* Stats - 편집 가능 */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-gray-100">
                {Array.isArray(home.stats) && home.stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl md:text-3xl font-bold text-green-600">
                      <EditableText value={stat.value} onChange={(v) => updateStat(index, 'value', v)} />
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      <EditableText value={stat.label} onChange={(v) => updateStat(index, 'label', v)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Character - 이미지 편집 가능 */}
            <div className="order-1 lg:order-2 relative flex justify-center items-end">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <EditableImage src={home.hero.characterImage} onChange={(v) => updateHero('characterImage', v)} className="w-[320px] h-[640px]" alt="엉클만세 캐릭터" />
              </motion.div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[280px] h-[150px] bg-gradient-to-t from-green-500/60 via-emerald-500/40 to-transparent blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Brand Banner - 편집 가능 ===== */}
      <section className="py-8 bg-green-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide italic">
            <EditableText value={home.brandBanner.title} onChange={(v) => updateBrandBanner('title', v)} className="text-white" />
          </h2>
          <p className="text-white/90 text-sm md:text-base mt-1">
            <EditableText value={home.brandBanner.subtitle} onChange={(v) => updateBrandBanner('subtitle', v)} className="text-white/90" />
          </p>
        </div>
      </section>

      {/* ===== Character Section with Labels - 모두 편집 가능 ===== */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="relative max-w-5xl mx-auto mb-16" style={{ minHeight: '700px' }}>
            {/* Character - 이미지 편집 가능 */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10">
              <EditableImage src={home.characterSection.characterImage} onChange={(v) => updateCharacterSection('characterImage', v)} className="w-[300px] h-[665px]" alt="엉클만세 캐릭터" />
            </div>

            {/* Labels - 모두 편집 가능 */}
            <div className="hidden md:block">
              <div className="absolute" style={{ top: '2%', left: '5%' }}>
                <p className="text-green-600 font-bold text-xl italic">
                  <EditableText value={home.characterSection.labels[0]} onChange={(v) => updateCharacterLabel(0, v)} className="text-green-600" />
                </p>
              </div>
              <div className="absolute" style={{ top: '-2%', right: '5%' }}>
                <p className="text-green-600 font-bold text-xl italic">
                  <EditableText value={home.characterSection.labels[1]} onChange={(v) => updateCharacterLabel(1, v)} className="text-green-600" />
                </p>
              </div>
              <div className="absolute" style={{ top: '35%', left: '0%' }}>
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">
                  <EditableText value={home.characterSection.labels[2]} onChange={(v) => updateCharacterLabel(2, v)} multiline className="text-green-600" />
                </p>
              </div>
              <div className="absolute" style={{ top: '42%', right: '5%' }}>
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">
                  <EditableText value={home.characterSection.labels[3]} onChange={(v) => updateCharacterLabel(3, v)} multiline className="text-green-600" />
                </p>
              </div>
              <div className="absolute" style={{ top: '62%', left: '0%' }}>
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">
                  <EditableText value={home.characterSection.labels[4]} onChange={(v) => updateCharacterLabel(4, v)} multiline className="text-green-600" />
                </p>
              </div>
              <div className="absolute" style={{ top: '62%', right: '5%' }}>
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">
                  <EditableText value={home.characterSection.labels[5]} onChange={(v) => updateCharacterLabel(5, v)} multiline className="text-green-600" />
                </p>
              </div>
            </div>
          </div>

          {/* Slogan - 편집 가능 */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-green-600 mb-8 leading-tight whitespace-pre-line">
              <EditableText value={home.characterSection.sloganTitle} onChange={(v) => updateCharacterSection('sloganTitle', v)} multiline className="text-green-600" />
            </h2>
            <div className="border-l-4 border-green-500 pl-6 text-left inline-block mb-8">
              <p className="text-gray-700 text-lg leading-relaxed text-center whitespace-pre-line">
                <EditableText value={home.characterSection.sloganDescription} onChange={(v) => updateCharacterSection('sloganDescription', v)} multiline />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Review Banner - 편집 가능 ===== */}
      <section className="bg-green-600 py-6 overflow-hidden">
        <div className="text-center">
          <div className="overflow-hidden whitespace-nowrap mb-3">
            <motion.div className="inline-block" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <span className="text-white/80 text-sm font-medium tracking-wider">
                {home.brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {home.brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {home.brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {home.brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </motion.div>
          </div>
          <h2 className="text-white text-5xl md:text-6xl font-black tracking-wide">
            <EditableText value={home.reviewBanner.title} onChange={(v) => updateReviewBanner('title', v)} className="text-white" />
          </h2>
          <div className="overflow-hidden whitespace-nowrap mt-3">
            <motion.div className="inline-block" animate={{ x: ['-50%', '0%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <span className="text-white/80 text-sm font-medium tracking-wider">
                {home.brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {home.brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {home.brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {home.brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Review Cards - 모두 편집 가능 ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {Array.isArray(home.reviews) && home.reviews.map((review, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 ${index < 2 ? 'mb-20' : ''}`}>
              <div className="relative w-full lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <EditableMedia
                    mediaType={review.mediaType || 'none'}
                    videoUrl={review.videoUrl || ''}
                    images={review.images || []}
                    onChangeType={(type) => updateReviewMediaType(index, type)}
                    onChangeVideoUrl={(url) => updateReview(index, 'videoUrl', url)}
                    onChangeImages={(images) => updateReviewImages(index, images)}
                    className="aspect-video"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white p-4 rounded-2xl max-w-[280px] text-sm leading-relaxed z-20">
                    <EditableText value={review.bubble} onChange={(v) => updateReview(index, 'bubble', v)} multiline className="text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                    <p className="text-green-400 text-sm font-medium">
                      <EditableText value={review.caption} onChange={(v) => updateReview(index, 'caption', v)} className="text-green-400" />
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative w-full lg:w-1/2 flex justify-center">
                <div className="relative">
                  <div className={`absolute inset-0 flex items-center justify-center`}>
                    <div className={`w-[300px] h-[300px] ${review.bgColor} rounded-full blur-sm`} />
                  </div>
                  <EditableImage src={review.characterImage} onChange={(v) => updateReview(index, 'characterImage', v)} className="relative z-10 w-[280px] h-[560px]" alt="캐릭터" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Services Section - 모두 편집 가능 ===== */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              <EditableText value={home.servicesSection.badge} onChange={(v) => updateServicesSection('badge', v)} className="text-green-600" />
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <EditableText value={home.servicesSection.title} onChange={(v) => updateServicesSection('title', v)} />
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              <EditableText value={home.servicesSection.subtitle} onChange={(v) => updateServicesSection('subtitle', v)} />
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(home.servicesSection.items) && home.servicesSection.items.map((service, index) => {
              const iconData = serviceIcons[service.id] || { icon: Sparkles, color: 'from-emerald-500 to-green-600' };
              const IconComponent = iconData.icon;
              return (
                <div key={service.id} className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
                  <div className={`w-14 h-14 bg-gradient-to-br ${iconData.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <EditableText value={service.title} onChange={(v) => updateServiceItem(index, 'title', v)} />
                  </h3>
                  <p className="text-gray-600 mb-6">
                    <EditableText value={service.description} onChange={(v) => updateServiceItem(index, 'description', v)} />
                  </p>
                  <span className="inline-flex items-center gap-2 text-green-600 font-semibold">자세히 보기 <ChevronRight size={18} /></span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Why Choose Us - 모두 편집 가능 ===== */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold mb-6">
                <EditableText value={home.whyUsSection.badge} onChange={(v) => updateWhyUsSection('badge', v)} className="text-green-400" />
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight whitespace-pre-line">
                <EditableText value={home.whyUsSection.title} onChange={(v) => updateWhyUsSection('title', v)} multiline className="text-white" />
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                <EditableText value={home.whyUsSection.subtitle} onChange={(v) => updateWhyUsSection('subtitle', v)} multiline className="text-gray-400" />
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {Array.isArray(home.whyUsSection.features) && home.whyUsSection.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="text-green-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">
                        <EditableText value={feature.title} onChange={(v) => updateWhyUsFeature(index, 'title', v)} className="text-white" />
                      </h4>
                      <p className="text-gray-400 text-sm">
                        <EditableText value={feature.desc} onChange={(v) => updateWhyUsFeature(index, 'desc', v)} className="text-gray-400" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="/about" className="inline-flex items-center gap-2 mt-10 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg">
                <EditableText value={home.whyUsSection.ctaText} onChange={(v) => updateWhyUsSection('ctaText', v)} className="text-white" />
                <ArrowRight size={20} />
              </a>
            </div>

            <div className="relative flex justify-center">
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                <EditableImage src={home.whyUsSection.characterImage} onChange={(v) => updateWhyUsSection('characterImage', v)} className="w-[400px] h-[800px]" alt="엉클만세" />
              </motion.div>
              <div className="absolute bottom-10 -left-4 bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <Award className="text-green-600" size={28} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      <EditableText value={home.whyUsSection.statValue} onChange={(v) => updateWhyUsSection('statValue', v)} />
                    </div>
                    <div className="text-gray-600 text-sm">
                      <EditableText value={home.whyUsSection.statLabel} onChange={(v) => updateWhyUsSection('statLabel', v)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Final CTA - 모두 편집 가능 ===== */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Megaphone size={40} />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <EditableText value={home.finalCta.title} onChange={(v) => updateFinalCta('title', v)} className="text-white" />
            </h2>
            <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-2xl mx-auto">
              <EditableText value={home.finalCta.subtitle} onChange={(v) => updateFinalCta('subtitle', v)} className="text-green-100" />
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center justify-center gap-3 bg-white text-green-600 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl">
                <EditableText value={home.finalCta.ctaButton1} onChange={(v) => updateFinalCta('ctaButton1', v)} className="text-green-600" />
                <ArrowRight size={24} />
              </a>
              <a href={`tel:${home.finalCta.phone}`} className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-bold text-xl border border-white/30">
                <Phone size={24} />
                <EditableText value={home.finalCta.ctaButton2} onChange={(v) => updateFinalCta('ctaButton2', v)} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 광고솔루션 페이지 에디터 - 실제 디자인 (완전 편집 가능)
function ServicesEditor({ pages, onUpdate }: { pages: PageContent; onUpdate: (pages: PageContent) => void }) {
  // pages.json에서 serviceItems 가져오기 (없으면 기본값)
  const serviceItems = Array.isArray(pages.services.serviceItems) ? pages.services.serviceItems : [];

  // 서비스 항목 업데이트 함수
  const updateServiceItem = (index: number, field: string, value: string) => {
    const updatedItems = [...serviceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onUpdate({
      ...pages,
      services: { ...pages.services, serviceItems: updatedItems }
    });
  };

  // 서비스 항목 추가
  const addServiceItem = () => {
    const newNumber = String(serviceItems.length + 1).padStart(2, '0');
    const newItem = {
      number: newNumber,
      title: '새 서비스',
      subtitle: '',
      mediaType: 'image' as const,
      videoUrl: '',
      imageUrl: ''
    };
    onUpdate({
      ...pages,
      services: { ...pages.services, serviceItems: [...serviceItems, newItem] }
    });
  };

  // 서비스 항목 삭제
  const removeServiceItem = (index: number) => {
    const updatedItems = serviceItems.filter((_, i) => i !== index);
    // 번호 재정렬
    const renumberedItems = updatedItems.map((item, i) => ({
      ...item,
      number: String(i + 1).padStart(2, '0')
    }));
    onUpdate({
      ...pages,
      services: { ...pages.services, serviceItems: renumberedItems }
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="py-24 bg-green-500">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <EditableText value={pages.services.title} onChange={(v) => onUpdate({ ...pages, services: { ...pages.services, title: v } })} />
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            <EditableText value={pages.services.subtitle} onChange={(v) => onUpdate({ ...pages, services: { ...pages.services, subtitle: v } })} />
          </p>
        </div>
      </section>

      {/* Services List - Zigzag Layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* 서비스 추가 버튼 */}
          <div className="mb-8 text-center">
            <button
              onClick={addServiceItem}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus size={20} />
              서비스 항목 추가
            </button>
          </div>

          <div className="space-y-24">
            {Array.isArray(serviceItems) && serviceItems.map((service, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative">
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => removeServiceItem(idx)}
                    className="absolute -top-4 right-0 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="삭제"
                  >
                    <X size={16} />
                  </button>

                  <div className={`grid md:grid-cols-2 gap-16 lg:gap-24 items-start ${isEven ? '' : 'md:grid-flow-dense'}`}>
                    {/* Text Content */}
                    <div className={isEven ? 'md:order-1' : 'md:order-2'}>
                      <span className="text-8xl lg:text-9xl font-bold text-green-500/40 block mb-2">{service.number}</span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        <EditableText
                          value={service.title}
                          onChange={(v) => updateServiceItem(idx, 'title', v)}
                        />
                      </h2>
                      <p className="text-gray-500 text-xl mb-6">
                        <EditableText
                          value={service.subtitle || ''}
                          onChange={(v) => updateServiceItem(idx, 'subtitle', v)}
                        />
                      </p>

                      {/* 미디어 설정 패널 */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Settings size={16} />
                          미디어 설정
                        </h4>

                        {/* 미디어 타입 선택 */}
                        <div className="mb-4">
                          <label className="block text-sm text-gray-600 mb-2">미디어 타입</label>
                          <select
                            value={service.mediaType}
                            onChange={(e) => updateServiceItem(idx, 'mediaType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="youtube">YouTube 영상</option>
                            <option value="mp4">MP4 영상</option>
                            <option value="image">이미지 (슬라이드)</option>
                          </select>
                        </div>

                        {/* 동적 URL 입력 */}
                        {(service.mediaType === 'youtube' || service.mediaType === 'mp4') && (
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">
                              {service.mediaType === 'youtube' ? 'YouTube 임베드 URL' : 'MP4 영상 URL'}
                            </label>
                            <input
                              type="text"
                              value={service.videoUrl || ''}
                              onChange={(e) => updateServiceItem(idx, 'videoUrl', e.target.value)}
                              placeholder={service.mediaType === 'youtube' ? 'https://www.youtube.com/embed/...' : 'https://...mp4'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            />
                          </div>
                        )}

                        {service.mediaType === 'image' && (
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">이미지 URL 목록</label>

                            {/* 기존 단일 이미지 호환성 처리 */}
                            {(!service.images || service.images.length === 0) && service.imageUrl && (
                              <div className="mb-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                                기존 단일 이미지가 있습니다. 아래 목록에 추가해주세요.
                                <br />URL: {service.imageUrl}
                              </div>
                            )}

                            <div className="space-y-2">
                              {(Array.isArray(service.images) ? service.images : []).map((img, imgIdx) => (
                                <div key={imgIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={img}
                                    onChange={(e) => {
                                      const newImages = [...(service.images || [])];
                                      newImages[imgIdx] = e.target.value;
                                      // 단일 이미지 호환성을 위해 첫번째 이미지는 imageUrl에도 저장
                                      if (imgIdx === 0) updateServiceItem(idx, 'imageUrl', e.target.value);
                                      // 전체 배열 업데이트
                                      const updatedItems = [...serviceItems];
                                      updatedItems[idx] = { ...updatedItems[idx], images: newImages };
                                      onUpdate({
                                        ...pages,
                                        services: { ...pages.services, serviceItems: updatedItems }
                                      });
                                    }}
                                    placeholder="이미지 URL"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                  />
                                  <button
                                    onClick={() => {
                                      const newImages = (service.images || []).filter((_, i) => i !== imgIdx);
                                      const updatedItems = [...serviceItems];
                                      // 첫번째 이미지가 삭제되면 imageUrl도 업데이트
                                      const firstImage = newImages.length > 0 ? newImages[0] : '';

                                      updatedItems[idx] = {
                                        ...updatedItems[idx],
                                        images: newImages,
                                        imageUrl: firstImage
                                      };
                                      onUpdate({
                                        ...pages,
                                        services: { ...pages.services, serviceItems: updatedItems }
                                      });
                                    }}
                                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const newImages = [...(service.images || []), ''];
                                  const updatedItems = [...serviceItems];
                                  updatedItems[idx] = { ...updatedItems[idx], images: newImages };
                                  onUpdate({
                                    ...pages,
                                    services: { ...pages.services, serviceItems: updatedItems }
                                  });
                                }}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-500 flex items-center justify-center gap-2 text-sm"
                              >
                                <Plus size={16} /> 이미지 추가
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual Content Preview */}
                    <div className={isEven ? 'md:order-2' : 'md:order-1'}>
                      {service.mediaType === 'youtube' && service.videoUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
                          <iframe
                            src={service.videoUrl}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      {service.mediaType === 'youtube' && !service.videoUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-200">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <div className="text-6xl mb-2">▶</div>
                              <p>YouTube URL을 입력하세요</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {service.mediaType === 'mp4' && service.videoUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                          <video
                            src={service.videoUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            controls
                            muted
                          />
                        </div>
                      )}
                      {service.mediaType === 'mp4' && !service.videoUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-800">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <div className="text-6xl mb-2">▶</div>
                              <p>MP4 URL을 입력하세요</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {service.mediaType === 'image' && (Array.isArray(service.images) && service.images.length > 0 ? (
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group/slider">
                          <ServiceImageSlider images={service.images} />
                        </div>
                      ) : (
                        // Fallback for no images or legacy single image
                        service.imageUrl ? (
                          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                            <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-200">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              <ImageIcon size={48} />
                              <p className="ml-2">이미지를 추가해주세요</p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {serviceItems.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-4">서비스 항목이 없습니다.</p>
              <button
                onClick={addServiceItem}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={20} />
                첫 번째 서비스 추가
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            <EditableText
              value={pages.services.cta?.title || '광고 문의가 필요하신가요?'}
              onChange={(v) => onUpdate({
                ...pages,
                services: {
                  ...pages.services,
                  cta: { ...(pages.services.cta || { title: '', subtitle: '', buttonText: '문의하기' }), title: v }
                }
              })}
            />
          </h2>
          <p className="text-gray-600 mb-8">
            <EditableText
              value={pages.services.cta?.subtitle || '전문 상담원이 맞춤형 광고 솔루션을 제안해 드립니다'}
              onChange={(v) => onUpdate({
                ...pages,
                services: {
                  ...pages.services,
                  cta: { ...(pages.services.cta || { title: '', subtitle: '', buttonText: '문의하기' }), subtitle: v }
                }
              })}
            />
          </p>
          <span className="inline-flex items-center justify-center bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg">
            <EditableText
              value={pages.services.cta?.buttonText || '문의하기'}
              onChange={(v) => onUpdate({
                ...pages,
                services: {
                  ...pages.services,
                  cta: { ...(pages.services.cta || { title: '', subtitle: '', buttonText: '' }), buttonText: v }
                }
              })}
            />
          </span>
        </div>
      </section>
    </div>
  );
}

// 회사소개 페이지 에디터 - 완전 편집 가능
function InfoEditor({ pages, onUpdate }: { pages: PageContent; onUpdate: (pages: PageContent) => void }) {
  const defaultValues = [
    { number: '1', titleKo: '신뢰와 지역밀착', titleEn: 'Trust and Local Engagement', descriptionKo: '지역 주민과 상생하고, 신뢰받는 광고 파트너로 자리매김하는 것.', descriptionEn: 'Becoming a trusted advertising partner that grows together with the local community', image: 'https://static.wixstatic.com/media/3a3909_592a09de733547c1889a3022078c854b~mv2.png/v1/fill/w_376,h_720,al_c,lg_1,q_85/3a3909_592a09de733547c1889a3022078c854b~mv2.png' },
    { number: '2', titleKo: '창의적 실행', titleEn: 'Creative Execution', descriptionKo: '기존의 광고 방식을 넘어서는 새로운 아이디어와 실천으로 차별화된 성과를 내는 것.', descriptionEn: 'Delivering differentiated results through new ideas and practices', image: 'https://static.wixstatic.com/media/3a3909_7fb02088558b4246ba362b1448321c31~mv2.png/v1/fill/w_670,h_724,al_c,q_90/컴퓨터하는모습.png' },
    { number: '3', titleKo: '사람 중심 성장', titleEn: 'People-Centered Growth', descriptionKo: '팀원, 고객, 지역사회를 아우르는 사람 중심 경영을 통해 함께 성장하는 것.', descriptionEn: 'Growing together through people-centered management', image: 'https://static.wixstatic.com/media/3a3909_452dad8bbf6e499ea66a9fd6dec244e8~mv2.png/v1/fill/w_600,h_558,al_c,q_85/성장.png' },
  ];

  const values = Array.isArray(pages.info.values) ? pages.info.values : defaultValues;
  const summaryText = pages.info.summaryText || '즉, 엉클만세의 핵심은';
  const summaryHighlights = Array.isArray(pages.info.summaryHighlights) ? pages.info.summaryHighlights : ['지역 신뢰 기반', '창의적인 실천력', '사람과 함께하는 성장'];

  const updateValue = (index: number, field: string, value: string) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: value };
    onUpdate({ ...pages, info: { ...pages.info, values: newValues } });
  };

  const addValue = () => {
    const newValue = { number: String(values.length + 1), titleKo: '새 가치', titleEn: 'New Value', descriptionKo: '설명을 입력하세요', descriptionEn: 'Enter description', image: '' };
    onUpdate({ ...pages, info: { ...pages.info, values: [...values, newValue] } });
  };

  const removeValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index).map((v, i) => ({ ...v, number: String(i + 1) }));
    onUpdate({ ...pages, info: { ...pages.info, values: newValues } });
  };

  const updateSummaryHighlight = (index: number, value: string) => {
    const newHighlights = [...summaryHighlights];
    newHighlights[index] = value;
    onUpdate({ ...pages, info: { ...pages.info, summaryHighlights: newHighlights } });
  };

  return (
    <div className="bg-white overflow-hidden">
      <section className="py-24 md:py-32 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-white font-bold text-lg md:text-xl mb-6">INFO</span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              <EditableText value={pages.info.title} onChange={(v) => onUpdate({ ...pages, info: { ...pages.info, title: v } })} />
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed">
              <EditableText value={pages.info.content} onChange={(v) => onUpdate({ ...pages, info: { ...pages.info, content: v } })} multiline />
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <button onClick={addValue} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <Plus size={20} /> 회사 가치 추가
              </button>
            </div>
            <div className="space-y-16">
              {values.map((value, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={index} className="relative">
                    <button onClick={() => removeValue(index)} className="absolute -top-4 right-0 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600" title="삭제"><X size={16} /></button>
                    <div className={`grid md:grid-cols-2 gap-12 items-start ${isEven ? '' : 'md:flex-row-reverse'}`}>
                      <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                        <div className="text-5xl md:text-6xl font-bold text-green-500 mb-4">{value.number}.</div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          <EditableText value={value.titleKo} onChange={(v) => updateValue(index, 'titleKo', v)} />
                        </h3>
                        <p className="text-green-600 font-medium mb-6">
                          <EditableText value={value.titleEn} onChange={(v) => updateValue(index, 'titleEn', v)} />
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed mb-4">
                          <EditableText value={value.descriptionKo} onChange={(v) => updateValue(index, 'descriptionKo', v)} multiline />
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                          <EditableText value={value.descriptionEn} onChange={(v) => updateValue(index, 'descriptionEn', v)} multiline />
                        </p>
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                          <label className="block text-sm text-gray-600 mb-2">이미지 URL</label>
                          <input type="text" value={value.image} onChange={(e) => updateValue(index, 'image', e.target.value)} placeholder="이미지 URL" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                      </div>
                      <div className={`${isEven ? 'md:order-2' : 'md:order-1'} flex justify-center`}>
                        {value.image ? <img src={value.image} alt={value.titleKo} className="max-h-80 object-contain drop-shadow-xl" /> : <div className="w-64 h-80 bg-gray-200 rounded-xl flex items-center justify-center"><ImageIcon size={48} className="text-gray-400" /></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              <EditableText value={summaryText} onChange={(v) => onUpdate({ ...pages, info: { ...pages.info, summaryText: v } })} /><br />
              {Array.isArray(summaryHighlights) && summaryHighlights.map((h, i) => (
                <span key={i}><span className="text-green-500 font-bold"><EditableText value={h} onChange={(v) => updateSummaryHighlight(i, v)} /></span>{i < summaryHighlights.length - 1 && ', '}</span>
              ))}이에요.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// 막사창고 페이지 에디터 - 실제 btob 페이지와 동일한 구조 (완전 편집 가능)
function WarehouseEditor({ pages, onUpdate }: { pages: PageContent; onUpdate: (pages: PageContent) => void }) {
  // 기본값 설정 (pages.json에서 가져오거나 기본값 사용)
  const sections = Array.isArray(pages.warehouse.sections) ? pages.warehouse.sections : [
    {
      number: '1',
      titleKo: '막사창고란?',
      descriptionKo: '막사창고는 아파트 단지, 주거 커뮤니티에 꼭 필요한 물품을 안정적으로 공급하는 B2B 전문 서비스입니다.',
      image: 'https://static.wixstatic.com/media/3a3909_4397f04234a54068ae4bdf5c2b125215~mv2.png/v1/fill/w_410,h_720,al_c,lg_1,q_85,enc_avif,quality_auto/3a3909_4397f04234a54068ae4bdf5c2b125215~mv2.png',
    },
  ];

  const ctaText = pages.warehouse.ctaText || '막사창고와 함께라면 아파트 운영이 더 쉬워집니다.';
  const ctaSubtext = pages.warehouse.ctaSubtext || '필요한 모든 것을 안정적으로, 합리적인 비용으로 공급받으세요.';
  const ctaButtons = pages.warehouse.ctaButtons || [
    { text: '블로그(막사창고)', url: '#' },
    { text: '막사창고 홈페이지', url: '#' },
  ];

  // 섹션 업데이트 함수
  const updateSection = (index: number, field: string, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, sections: updated } });
  };

  const addSection = () => {
    const newNumber = String(sections.length + 1);
    const updated = [...sections, {
      number: newNumber,
      titleKo: '새 섹션 제목',
      descriptionKo: '섹션 설명을 입력하세요',
      image: 'https://via.placeholder.com/400x600',
    }];
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, sections: updated } });
  };

  const removeSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index).map((s, i) => ({ ...s, number: String(i + 1) }));
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, sections: updated } });
  };

  // 섹션 아이템 (목록) 업데이트 함수
  const updateSectionItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const updated = [...sections];
    const items = [...(updated[sectionIndex].items || [])];
    items[itemIndex] = value;
    updated[sectionIndex] = { ...updated[sectionIndex], items };
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, sections: updated } });
  };

  const addSectionItem = (sectionIndex: number) => {
    const updated = [...sections];
    const items = [...(updated[sectionIndex].items || []), '새 항목을 입력하세요'];
    updated[sectionIndex] = { ...updated[sectionIndex], items };
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, sections: updated } });
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    const updated = [...sections];
    const items = (updated[sectionIndex].items || []).filter((_, i) => i !== itemIndex);
    updated[sectionIndex] = { ...updated[sectionIndex], items: items.length > 0 ? items : undefined };
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, sections: updated } });
  };

  // CTA 버튼 업데이트 함수
  const updateCtaButton = (index: number, field: 'text' | 'url', value: string) => {
    const updated = [...ctaButtons];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, ctaButtons: updated } });
  };

  const addCtaButton = () => {
    const updated = [...ctaButtons, { text: '새 버튼', url: '#' }];
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, ctaButtons: updated } });
  };

  const removeCtaButton = (index: number) => {
    const updated = ctaButtons.filter((_, i) => i !== index);
    onUpdate({ ...pages, warehouse: { ...pages.warehouse, ctaButtons: updated } });
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-white font-bold text-lg md:text-xl mb-6">
              막사창고
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              <EditableText value={pages.warehouse.title} onChange={(v) => onUpdate({ ...pages, warehouse: { ...pages.warehouse, title: v } })} />
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed">
              <EditableText value={pages.warehouse.description} onChange={(v) => onUpdate({ ...pages, warehouse: { ...pages.warehouse, description: v } })} />
            </p>
          </div>
        </div>
      </section>

      {/* Sections - Zigzag Layout (편집 가능) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-24">
            {sections.map((section, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="relative group">
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => removeSection(index)}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center"
                    title="섹션 삭제"
                  >
                    ×
                  </button>

                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                      <div className="text-5xl md:text-6xl font-bold text-green-500 mb-4">
                        <EditableText
                          value={section.number}
                          onChange={(v) => updateSection(index, 'number', v)}
                        />.
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                        <EditableText
                          value={section.titleKo}
                          onChange={(v) => updateSection(index, 'titleKo', v)}
                        />
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        <EditableText
                          value={section.descriptionKo || ''}
                          onChange={(v) => updateSection(index, 'descriptionKo', v)}
                          placeholder="설명을 입력하세요 (선택사항)"
                        />
                      </p>
                      {/* 아이템 목록 (있는 경우) */}
                      {(Array.isArray(section.items) && section.items.length > 0) && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-gray-500 font-medium">목록 항목:</p>
                          {section.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2 group/item">
                              <span className="text-green-500">•</span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => updateSectionItem(index, itemIndex, e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded hover:border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                              />
                              <button
                                onClick={() => removeSectionItem(index, itemIndex)}
                                className="w-6 h-6 bg-red-100 text-red-500 rounded opacity-0 group-hover/item:opacity-100 transition-opacity text-xs flex items-center justify-center hover:bg-red-200"
                                title="항목 삭제"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* 아이템 추가 버튼 */}
                      <button
                        onClick={() => addSectionItem(index)}
                        className="mt-3 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                      >
                        + 목록 항목 추가
                      </button>
                    </div>
                    {/* Image */}
                    <div className={`${isEven ? 'md:order-2' : 'md:order-1'} flex flex-col items-center gap-2`}>
                      <img
                        src={section.image}
                        alt={section.titleKo}
                        className="max-h-96 object-contain drop-shadow-xl"
                      />
                      <input
                        type="text"
                        value={section.image}
                        onChange={(e) => updateSection(index, 'image', e.target.value)}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded text-gray-500"
                        placeholder="이미지 URL"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 섹션 추가 버튼 */}
            <div className="flex justify-center">
              <button
                onClick={addSection}
                className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
              >
                + 새 섹션 추가
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (편집 가능) */}
      <section className="py-24 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-2">
              <EditableText
                value={ctaText}
                onChange={(v) => onUpdate({ ...pages, warehouse: { ...pages.warehouse, ctaText: v } })}
              />
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              <EditableText
                value={ctaSubtext}
                onChange={(v) => onUpdate({ ...pages, warehouse: { ...pages.warehouse, ctaSubtext: v } })}
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              {Array.isArray(ctaButtons) && ctaButtons.map((button, index) => (
                <div key={index} className="relative group">
                  <button
                    onClick={() => removeCtaButton(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
                    title="버튼 삭제"
                  >
                    ×
                  </button>
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg">
                      <EditableText
                        value={button.text}
                        onChange={(v) => updateCtaButton(index, 'text', v)}
                      /> &gt;
                    </span>
                    <input
                      type="text"
                      value={button.url}
                      onChange={(e) => updateCtaButton(index, 'url', e.target.value)}
                      className="text-xs px-2 py-1 border border-white/30 rounded bg-white/10 text-white placeholder-white/50"
                      placeholder="버튼 링크 URL"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addCtaButton}
                className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-colors border-2 border-dashed border-white/50"
              >
                + 버튼 추가
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// FAQ 페이지 에디터 - 실제 디자인 (문의하기 페이지와 결합)
function FAQEditor({ pages, onUpdate }: { pages: PageContent; onUpdate: (pages: PageContent) => void }) {
  // 기본값 설정
  const contactInfo = pages.faq.contactInfo || {
    phone: '031-945-1217',
    email: 'unclemanse@naver.com',
    kakao: '채팅하기',
    address: '경기도 파주시 교하로 421 (동패동)',
  };

  const quickFaqs = pages.faq.quickFaqs || [
    { question: 'Q. 광고 진행 절차는 어떻게 되나요?', answer: '→ 상담 → 제안서 전달 → 계약 → 광고 진행' },
    { question: 'Q. 막사창고 물품은 어떻게 주문할 수 있나요?', answer: '→ 필요 물품 리스트 전달 → 견적 확인 → 발주 → 납품' },
    { question: 'Q. 최소 계약 기간이 있나요?', answer: '→ 광고 유형에 따라 다르며, 1개월 단위 계약도 가능합니다.' },
  ];

  const adFaqs = pages.faq.adFaqs || [
    { question: '광고를 진행하려면 어떻게 신청하나요?', answer: '홈페이지 상담신청 또는 카카오톡 채널로 문의해 주세요.' },
    { question: '엘리베이터 거울광고는 어떤 아파트에서 가능한가요?', answer: '파주시 전역 및 고양시 일부 단지에서 운영합니다.' },
    { question: '광고 게재 기간은 얼마나 되나요?', answer: '기본 1개월 단위이며, 3/6/12개월 단위로 진행합니다.' },
    { question: '광고물 제작과 설치에 따른 추가적인 비용이 발생하나요?', answer: '아니요. 담당 매니저의 꼼꼼한 제작, 설치가 무료로 진행됩니다.' },
    { question: '광고 비용은 어떻게 책정되나요?', answer: '매체, 단지 세대수, 노출 기간에 따라 달라집니다.' },
  ];

  // 연락처 정보 업데이트
  const updateContactInfo = (field: string, value: string) => {
    onUpdate({
      ...pages,
      faq: {
        ...pages.faq,
        contactInfo: { ...contactInfo, [field]: value },
      },
    });
  };

  // 빠른 FAQ 업데이트
  const updateQuickFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...quickFaqs];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...pages, faq: { ...pages.faq, quickFaqs: updated } });
  };

  const addQuickFaq = () => {
    const updated = [...quickFaqs, { question: 'Q. 새 질문을 입력하세요', answer: '답변을 입력하세요' }];
    onUpdate({ ...pages, faq: { ...pages.faq, quickFaqs: updated } });
  };

  const removeQuickFaq = (index: number) => {
    const updated = quickFaqs.filter((_, i) => i !== index);
    onUpdate({ ...pages, faq: { ...pages.faq, quickFaqs: updated } });
  };

  // 광고대행 FAQ 업데이트
  const updateAdFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...adFaqs];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...pages, faq: { ...pages.faq, adFaqs: updated } });
  };

  const addAdFaq = () => {
    const updated = [...adFaqs, { question: '새 질문을 입력하세요', answer: '답변을 입력하세요' }];
    onUpdate({ ...pages, faq: { ...pages.faq, adFaqs: updated } });
  };

  const removeAdFaq = (index: number) => {
    const updated = adFaqs.filter((_, i) => i !== index);
    onUpdate({ ...pages, faq: { ...pages.faq, adFaqs: updated } });
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-white font-bold text-lg md:text-xl mb-6">
              문의하기
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              <EditableText value={pages.faq.title} onChange={(v) => onUpdate({ ...pages, faq: { ...pages.faq, title: v } })} />
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed">
              <EditableText
                value={pages.faq.subtitle || '광고 솔루션 상담부터 막사창고 납품 문의까지,\n궁금한 점이 있다면 언제든 편하게 연락주세요.'}
                onChange={(v) => onUpdate({ ...pages, faq: { ...pages.faq, subtitle: v } })}
                multiline
              />
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-5xl md:text-6xl font-bold text-green-500">1.</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                &quot;연락처 안내&quot;
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Phone className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">대표번호</p>
                  <EditableText value={contactInfo.phone} onChange={(v) => updateContactInfo('phone', v)} className="font-semibold text-gray-900" />
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">✉</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">이메일</p>
                  <EditableText value={contactInfo.email} onChange={(v) => updateContactInfo('email', v)} className="font-semibold text-gray-900" />
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">💬</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">카카오톡 채널</p>
                  <EditableText value={contactInfo.kakao} onChange={(v) => updateContactInfo('kakao', v)} className="font-semibold text-gray-900" />
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">📍</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">주소</p>
                  <EditableText value={contactInfo.address} onChange={(v) => updateContactInfo('address', v)} className="font-semibold text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-5xl md:text-6xl font-bold text-green-500">2.</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                {'"'}문의 남기기{'"'}
              </h2>
            </div>
            <div className="space-y-6 bg-white p-8 rounded-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 <span className="text-red-500">*</span></label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-400">이름을 입력하세요</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">회사명/점포명</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-400">회사명을 입력하세요</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일 <span className="text-red-500">*</span></label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-400">이메일을 입력하세요</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">문의내용</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-400 h-32">문의내용을 입력하세요</div>
              </div>
              <div className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg text-center">보내기</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-5xl md:text-6xl font-bold text-green-500">3.</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                &quot;자주 묻는 질문&quot;
              </h2>
            </div>
            {Array.isArray(quickFaqs) && quickFaqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 py-6 group relative">
                <button
                  onClick={() => removeQuickFaq(index)}
                  className="absolute -left-8 top-6 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center justify-between">
                  <EditableText
                    value={faq.question}
                    onChange={(v) => updateQuickFaq(index, 'question', v)}
                    className="text-lg font-semibold text-gray-900 flex-1"
                  />
                  <ChevronRight className="text-green-500 ml-2 flex-shrink-0" />
                </div>
                <EditableText
                  value={faq.answer}
                  onChange={(v) => updateQuickFaq(index, 'answer', v)}
                  className="text-gray-600 mt-2"
                />
              </div>
            ))}
            <button
              onClick={addQuickFaq}
              className="w-full mt-4 py-4 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              빠른 FAQ 추가
            </button>
          </div>
        </div>
      </section>

      {/* Detailed FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                광고대행 FAQ
              </h2>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden">
              {Array.isArray(adFaqs) && adFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0 group relative">
                  <button
                    onClick={() => removeAdFaq(index)}
                    className="absolute left-2 top-6 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="py-6 px-6">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-green-500 font-bold text-lg flex-shrink-0">{String(index + 1).padStart(2, '0')}</span>
                      <EditableText
                        value={faq.question}
                        onChange={(v) => updateAdFaq(index, 'question', v)}
                        className="text-lg font-semibold text-gray-900 flex-1"
                      />
                      <ChevronRight className="text-green-500 flex-shrink-0" />
                    </div>
                    <div className="pl-12">
                      <EditableText
                        value={faq.answer}
                        onChange={(v) => updateAdFaq(index, 'answer', v)}
                        className="text-gray-600"
                        multiline
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addAdFaq}
              className="w-full mt-4 py-4 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              광고대행 FAQ 추가
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section (편집 가능) */}
      <section className="py-24 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-2">
              <EditableText
                value={pages.faq.ctaText || '엉클만세는 항상 열린 마음으로 기다리고 있습니다.'}
                onChange={(v) => onUpdate({ ...pages, faq: { ...pages.faq, ctaText: v } })}
              />
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              <EditableText
                value={pages.faq.ctaSubtext || '지금 바로 연락 주세요.'}
                onChange={(v) => onUpdate({ ...pages, faq: { ...pages.faq, ctaSubtext: v } })}
              />
            </p>
            <span className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg">
              <EditableText
                value={pages.faq.ctaButtonText || '문의하기'}
                onChange={(v) => onUpdate({ ...pages, faq: { ...pages.faq, ctaButtonText: v } })}
              />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

// 문의하기 페이지 에디터 - 실제 디자인
function ContactEditor({ pages, onUpdate }: { pages: PageContent; onUpdate: (pages: PageContent) => void }) {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            CONTACT US
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <EditableText value={pages.contact.title} onChange={(v) => onUpdate({ ...pages, contact: { ...pages.contact, title: v } })} />
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            <EditableText value={pages.contact.subtitle} onChange={(v) => onUpdate({ ...pages, contact: { ...pages.contact, subtitle: v } })} multiline />
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white relative -mt-12 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📞', title: '전화', field: 'phone' as const },
              { icon: '✉️', title: '이메일', field: 'email' as const },
              { icon: '📍', title: '주소', field: 'address' as const },
              { icon: '🕐', title: '영업시간', field: 'businessHours' as const },
            ].map((info) => (
              <div key={info.title} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-xl">
                  {info.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-gray-600">
                  <EditableText value={pages.contact[info.field]} onChange={(v) => onUpdate({ ...pages, contact: { ...pages.contact, [info.field]: v } })} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">온라인 문의</h2>
              <p className="text-gray-600 mb-8">
                아래 양식을 작성해주시면 빠른 시간 내에 연락 드리겠습니다.
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-400">홍길동</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-400">010-1234-5678</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-400">example@email.com</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">문의 서비스 *</label>
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-400">선택해주세요</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">광고 희망 지역</label>
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-400">예: 파주시 교하동</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">문의 내용 *</label>
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-400 h-32">문의하실 내용을 자세히 작성해주세요</div>
                </div>

                <div className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                  <ArrowRight size={20} /> 문의하기
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="space-y-6">
              {/* Kakao Talk (편집 가능) */}
              <div className="bg-yellow-400 rounded-2xl p-6 text-gray-900">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl">
                      <EditableText
                        value={pages.contact.kakaoTitle || '카카오톡 상담'}
                        onChange={(v) => onUpdate({ ...pages, contact: { ...pages.contact, kakaoTitle: v } })}
                      />
                    </h3>
                    <p className="text-yellow-800">
                      <EditableText
                        value={pages.contact.kakaoSubtitle || '실시간 1:1 상담을 받으세요'}
                        onChange={(v) => onUpdate({ ...pages, contact: { ...pages.contact, kakaoSubtitle: v } })}
                      />
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">전화 상담</h3>
                    <p className="text-green-100">{pages.contact.phone}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-video bg-gray-200 relative flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">🗺️</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">찾아오시는 길</h3>
                  <p className="text-gray-600 text-sm">{pages.contact.address}</p>
                </div>
              </div>

              {/* FAQ Teaser (편집 가능) */}
              <div className="bg-gray-100 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">자주 묻는 질문</h3>
                <ul className="space-y-3">
                  {(pages.contact.faqTeaser || ['광고 비용은 어떻게 되나요?', '광고 설치 기간은 얼마나 걸리나요?', '어떤 지역에서 광고가 가능한가요?']).map((question, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600 group relative">
                      <button
                        onClick={() => {
                          const updated = (pages.contact.faqTeaser || ['광고 비용은 어떻게 되나요?', '광고 설치 기간은 얼마나 걸리나요?', '어떤 지역에서 광고가 가능한가요?']).filter((_, i) => i !== index);
                          onUpdate({ ...pages, contact: { ...pages.contact, faqTeaser: updated } });
                        }}
                        className="absolute -left-6 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className="w-6 h-6 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">Q</span>
                      <EditableText
                        value={question}
                        onChange={(v) => {
                          const updated = [...(pages.contact.faqTeaser || ['광고 비용은 어떻게 되나요?', '광고 설치 기간은 얼마나 걸리나요?', '어떤 지역에서 광고가 가능한가요?'])];
                          updated[index] = v;
                          onUpdate({ ...pages, contact: { ...pages.contact, faqTeaser: updated } });
                        }}
                        className="flex-1"
                      />
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    const updated = [...(pages.contact.faqTeaser || ['광고 비용은 어떻게 되나요?', '광고 설치 기간은 얼마나 걸리나요?', '어떤 지역에서 광고가 가능한가요?']), '새 질문을 입력하세요'];
                    onUpdate({ ...pages, contact: { ...pages.contact, faqTeaser: updated } });
                  }}
                  className="w-full mt-4 py-2 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  질문 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 헤더 에디터 컴포넌트
function HeaderEditor({ pages, onUpdate }: { pages: PageContent; onUpdate: (pages: PageContent) => void }) {
  const defaultHeader = {
    logo: '/images/unclelogo.png',
    navItems: [
      { name: '홈', url: '/', icon: 'Home' },
      { name: '광고솔루션', url: '/services', icon: 'Megaphone' },
      { name: 'info', url: '/about', icon: 'Info' },
      { name: '막사창고', url: '/btob', icon: 'Warehouse' },
      { name: '자주 묻는 질문', url: '/faq', icon: 'HelpCircle' },
      { name: '지도검색', url: '/map', icon: 'MapPin' },
    ],
    ctaButton: '문의하기',
    ctaUrl: '/contact',
  };

  const header = { ...defaultHeader, ...pages.header };

  const updateHeader = (field: string, value: any) => {
    onUpdate({ ...pages, header: { ...header, [field]: value } } as any);
  };

  const updateNavItem = (index: number, field: string, value: string) => {
    const newNavItems = [...header.navItems];
    newNavItems[index] = { ...newNavItems[index], [field]: value };
    updateHeader('navItems', newNavItems);
  };

  const addNavItem = () => {
    const newNavItems = [...header.navItems, { name: '새 메뉴', url: '/', icon: 'Home' }];
    updateHeader('navItems', newNavItems);
  };

  const removeNavItem = (index: number) => {
    const newNavItems = header.navItems.filter((_, i) => i !== index);
    updateHeader('navItems', newNavItems);
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* 헤더 미리보기 */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">헤더 미리보기</h2>

          {/* 실제 헤더 모양 미리보기 */}
          <div className="bg-white shadow-lg rounded-xl p-4 flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-4">
              <EditableImage src={header.logo} onChange={(v) => updateHeader('logo', v)} className="w-20 h-12" alt="로고" />
            </div>

            {/* 네비게이션 */}
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2 bg-white border border-green-500 px-4 py-1 rounded-full">
                {Array.isArray(header.navItems) && header.navItems.map((item, index) => (
                  <span key={index} className="px-4 py-2 text-sm font-semibold text-gray-600 rounded-full hover:bg-gray-100">
                    {item.name}
                  </span>
                ))}
              </nav>
              <span className="bg-green-500 text-white text-sm font-semibold px-6 py-2 rounded-full">
                {header.ctaButton}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 헤더 설정 편집 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 로고 설정 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">로고 설정</h3>
              <div className="flex items-center gap-6">
                <EditableImage src={header.logo} onChange={(v) => updateHeader('logo', v)} className="w-24 h-16" alt="로고" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">로고 이미지 URL</label>
                  <input
                    type="text"
                    value={header.logo}
                    onChange={(e) => updateHeader('logo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="로고 이미지 URL"
                  />
                </div>
              </div>
            </div>

            {/* 네비게이션 메뉴 설정 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">네비게이션 메뉴</h3>
                <button
                  onClick={addNavItem}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Plus size={16} /> 메뉴 추가
                </button>
              </div>

              <div className="space-y-4">
                {Array.isArray(header.navItems) && header.navItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                    <span className="text-gray-400 font-bold">{index + 1}</span>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">메뉴 이름</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateNavItem(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">링크 URL</label>
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => updateNavItem(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">아이콘</label>
                        <select
                          value={item.icon}
                          onChange={(e) => updateNavItem(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="Home">Home</option>
                          <option value="Megaphone">Megaphone</option>
                          <option value="Info">Info</option>
                          <option value="Warehouse">Warehouse</option>
                          <option value="HelpCircle">HelpCircle</option>
                          <option value="MapPin">MapPin</option>
                          <option value="Phone">Phone</option>
                          <option value="Mail">Mail</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => removeNavItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA 버튼 설정 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CTA 버튼 설정</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">버튼 텍스트</label>
                  <input
                    type="text"
                    value={header.ctaButton}
                    onChange={(e) => updateHeader('ctaButton', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">링크 URL</label>
                  <input
                    type="text"
                    value={header.ctaUrl}
                    onChange={(e) => updateHeader('ctaUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 푸터 에디터 컴포넌트
function FooterEditor({ pages, onUpdate }: { pages: PageContent; onUpdate: (pages: PageContent) => void }) {
  const defaultFooter = {
    logo: 'https://static.wixstatic.com/media/ed23bc_ade0480f68f54e7dbf437c5b6bc02ec7~mv2.png/v1/fill/w_258,h_154,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/uncle.png',
    description: '엉클만세는 아파트, 오피스텔, 상가 등 다양한 공간에서 효과적인 광고 솔루션을 제공합니다.',
    serviceLinks: [
      { name: '거울광고', href: '/services#mirror' },
      { name: '엘리베이터 광고', href: '/services#elevator' },
      { name: '게시판 광고', href: '/services#board' },
      { name: '전단지 제작', href: '/services#flyer' },
    ],
    companyLinks: [
      { name: '회사소개', href: '/about' },
      { name: '포트폴리오', href: '/portfolio' },
      { name: '블로그', href: '/blog' },
      { name: '문의하기', href: '/contact' },
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/orumnet.kr/',
      youtube: 'https://www.youtube.com/@ad-ya',
      blog: 'https://blog.naver.com/choibm337',
    },
    copyright: '엉클만세. All rights reserved.',
  };

  const footer = { ...defaultFooter, ...pages.footer };

  const updateFooter = (field: string, value: any) => {
    onUpdate({ ...pages, footer: { ...footer, [field]: value } } as any);
  };

  const updateServiceLink = (index: number, field: string, value: string) => {
    const newLinks = [...footer.serviceLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateFooter('serviceLinks', newLinks);
  };

  const updateCompanyLink = (index: number, field: string, value: string) => {
    const newLinks = [...footer.companyLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateFooter('companyLinks', newLinks);
  };

  const updateSocialLink = (platform: string, value: string) => {
    updateFooter('socialLinks', { ...footer.socialLinks, [platform]: value });
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* 푸터 미리보기 */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">푸터 미리보기</h2>

          {/* 실제 푸터 모양 미리보기 */}
          <div className="bg-black text-white rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* 회사 정보 */}
              <div className="md:col-span-2">
                <img src={footer.logo} alt="로고" className="w-36 h-auto mb-4 brightness-0 invert" />
                <p className="text-gray-400 text-sm">{footer.description}</p>
              </div>

              {/* 서비스 링크 */}
              <div>
                <h4 className="text-lg font-bold mb-4">서비스</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {Array.isArray(footer.serviceLinks) && footer.serviceLinks.map((link, index) => (
                    <li key={index}>{link.name}</li>
                  ))}
                </ul>
              </div>

              {/* 회사 링크 */}
              <div>
                <h4 className="text-lg font-bold mb-4">회사</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {Array.isArray(footer.companyLinks) && footer.companyLinks.map((link, index) => (
                    <li key={index}>{link.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 저작권 */}
            <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} {footer.copyright}
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 설정 편집 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 기본 정보 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">기본 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">로고 이미지 URL</label>
                  <input
                    type="text"
                    value={footer.logo}
                    onChange={(e) => updateFooter('logo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">회사 설명</label>
                  <textarea
                    value={footer.description}
                    onChange={(e) => updateFooter('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">저작권 문구</label>
                  <input
                    type="text"
                    value={footer.copyright}
                    onChange={(e) => updateFooter('copyright', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* 서비스 링크 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">서비스 링크</h3>
              <div className="space-y-4">
                {Array.isArray(footer.serviceLinks) && footer.serviceLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">링크 이름</label>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => updateServiceLink(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">URL</label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateServiceLink(index, 'href', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 회사 링크 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">회사 링크</h3>
              <div className="space-y-4">
                {Array.isArray(footer.companyLinks) && footer.companyLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">링크 이름</label>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => updateCompanyLink(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">URL</label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateCompanyLink(index, 'href', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 소셜 링크 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">소셜 미디어 링크</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                  <input
                    type="text"
                    value={footer.socialLinks.instagram}
                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                  <input
                    type="text"
                    value={footer.socialLinks.youtube}
                    onChange={(e) => updateSocialLink('youtube', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">네이버 블로그 URL</label>
                  <input
                    type="text"
                    value={footer.socialLinks.blog}
                    onChange={(e) => updateSocialLink('blog', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function VisualPageEditor({ pages, currentPage, onUpdate, onSave, saveStatus }: VisualPageEditorProps) {
  return (
    <div className="space-y-4">
      {/* 상단 툴바 */}
      <div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Edit3 size={16} className="text-green-500" />
            <span>텍스트를 클릭하면 직접 수정할 수 있습니다</span>
          </div>
          <button onClick={onSave} disabled={saveStatus === 'saving'} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${saveStatus === 'saved' ? 'bg-green-100 text-green-700' : saveStatus === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-500 text-white hover:bg-green-600'}`}>
            <Save size={18} />
            {saveStatus === 'saving' ? '저장 중...' : saveStatus === 'saved' ? '저장됨!' : saveStatus === 'error' ? '저장 실패' : '변경사항 저장'}
          </button>
        </div>
      </div>

      {/* 실제 화면 크기로 미리보기 - 전체 너비 사용 */}
      <div>
        <div className="bg-gray-800 p-2 text-center text-xs text-gray-300 border-b border-gray-700">
          미리보기 - 텍스트를 클릭하여 편집
        </div>
        <div className="border-2 border-gray-800 bg-white overflow-auto" style={{ maxHeight: '80vh' }}>
          {currentPage === 'header' && <HeaderEditor pages={pages} onUpdate={onUpdate} />}
          {currentPage === 'footer' && <FooterEditor pages={pages} onUpdate={onUpdate} />}
          {currentPage === 'home' && <HomeEditor pages={pages} onUpdate={onUpdate} />}
          {currentPage === 'services' && <ServicesEditor pages={pages} onUpdate={onUpdate} />}
          {currentPage === 'info' && <InfoEditor pages={pages} onUpdate={onUpdate} />}
          {currentPage === 'warehouse' && <WarehouseEditor pages={pages} onUpdate={onUpdate} />}
          {currentPage === 'faq' && <FAQEditor pages={pages} onUpdate={onUpdate} />}
          {currentPage === 'contact' && <ContactEditor pages={pages} onUpdate={onUpdate} />}
        </div>
      </div>
    </div>
  );
}
