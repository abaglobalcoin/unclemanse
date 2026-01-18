'use client';

import { motion, useScroll, useTransform, useInView, animate, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowRight, CheckCircle, Award, ChevronRight, Sparkles, Zap, Shield, Target, Megaphone, Phone, ChevronLeft } from 'lucide-react';

// 미디어 데이터 타입
interface ReviewMedia {
  id: string;
  title: string;
  mediaType: 'video' | 'slideshow';
  videoUrl: string;
  images: string[];
  speechBubble: string;
  caption: string;
}

// MediaData interface removed - unused

// HomeContent interface removed - unused

// 이미지 슬라이드쇼 컴포넌트
function ImageSlideshow({ images, className }: { images: string[]; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // 자동 슬라이드
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [images.length, nextSlide]);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">이미지가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`슬라이드 ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          {/* 네비게이션 버튼 */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight size={20} />
          </button>

          {/* 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// YouTube URL을 embed URL로 변환
function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}`;
  }
  return null;
}

// 리뷰 미디어 렌더러
function ReviewMediaRenderer({ review }: { review: ReviewMedia }) {
  if (review.mediaType === 'slideshow' && review.images && review.images.length > 0) {
    return <ImageSlideshow images={review.images} className="w-full h-auto aspect-video" />;
  }

  // 영상 모드
  const videoUrl = review.videoUrl || '';
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  if (youtubeEmbedUrl) {
    return (
      <iframe
        src={youtubeEmbedUrl}
        className="w-full h-auto aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // mp4 등 일반 비디오
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-auto object-cover"
    >
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}

// Animated Counter Component
function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          setCount(Math.floor(latest));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
import AnimatedSection from '@/components/AnimatedSection';

// 기본 통계 데이터 (API 실패 시 폴백)
const defaultStats = [
  { value: 500, suffix: '+', label: '제휴 아파트' },
  { value: 98, suffix: '%', label: '광고 만족도' },
  { value: 1000, suffix: '+', label: '누적 광고주' },
  { value: 15, suffix: '년+', label: '업계 경력' },
];

// 기본 히어로 콘텐츠 (API 실패 시 폴백)
const defaultHero = {
  badge: '15년 전통의 광고 전문 기업',
  title: '사람, 마을, 광고를\n연결하는 행복기업\n엉클만세',
  subtitle: '엉클만세는 파주라는 동네 안에서 좋은 가게, 괜찮은 병원, 믿을 수 있는 학원을 진짜 \'필요한 사람\'들에게 연결해주는 일을 해요',
  backgroundImage: '/images/background.jpg',
  characterImage: 'https://static.wixstatic.com/media/ed23bc_72c9e3ea94f54b01a261bcb493541281~mv2.png/v1/fill/w_500,h_1000,al_c,q_90,enc_avif,quality_auto/A-2-topaz-upscale-2_8x.png',
  ctaButton1: '카카오톡 채널',
  ctaButton2: '우리동네',
};

const defaultBrandBanner = {
  title: 'UNCLEMANSE',
  subtitle: 'Community-Based Advertising Company',
};

const defaultCharacterSection = {
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
};

const defaultReviewBanner = { title: 'REVIEW' };

const defaultServicesSection = {
  badge: 'SERVICES',
  title: '맞춤형 광고 솔루션',
  subtitle: '비즈니스 목표에 맞는 최적의 광고 방법을 제안합니다',
  items: [
    { id: 'mirror', title: '거울광고', description: '엘리베이터 거울에 자연스럽게 노출되는 프리미엄 광고' },
    { id: 'elevator', title: '엘리베이터 광고', description: '매일 반복 노출로 강력한 브랜드 인지도 구축' },
    { id: 'board', title: '게시판 광고', description: '지역 주민에게 직접 다가가는 타겟 마케팅' },
    { id: 'flyer', title: '전단지 제작', description: '전문 디자인팀의 고품질 인쇄물 제작' },
  ],
};

const defaultWhyUsSection = {
  badge: 'WHY US',
  title: '왜 엉클만세를\n선택해야 할까요?',
  subtitle: '15년간 쌓아온 신뢰와 전문성으로 고객의 성공을 함께 만들어갑니다.\n합리적인 가격, 빠른 서비스, 철저한 사후관리까지.',
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
};

const defaultFinalCta = {
  title: '지금 바로 시작하세요',
  subtitle: '무료 상담을 통해 최적의 광고 솔루션을 제안받으세요.\n전문 상담원이 친절하게 안내해 드립니다.',
  ctaButton1: '온라인 문의하기',
  ctaButton2: '031-945-1217',
  phone: '031-945-1217',
};

// 기본 리뷰 데이터 (API 실패 시 폴백)
const defaultReviews: ReviewMedia[] = [
  {
    id: 'review1',
    title: '부동산 리뷰',
    mediaType: 'video',
    videoUrl: '/images/review-realestate.mp4',
    images: [],
    speechBubble: '처음 가게 오픈하고, 주변 이웃 분들께 어떻게 알려야 할지 너무 막막했어요. 요즘은 입주민 문의가 끊기지 않네요! 엉클만세가 큰 일이 되어줬어요!!',
    caption: '요즘 우리 동네에서 제일 바쁜 ○○부동산 사장님',
  },
  {
    id: 'review2',
    title: '학원 리뷰',
    mediaType: 'video',
    videoUrl: '/images/review-academy.mp4',
    images: [],
    speechBubble: '사실 학부모님들 사이에 입소문 나기가 정말 쉽지 않거든요. 항상 고민이었는데.. 엉클만세를 통해 광고를 시작한 이후 좋아요깅에 아파트 엘리베이터 광고를 보고 왔다는 학부모님이 참 많아졌어요. 신규 등록이 끊없이 늘어나고 있답니다!',
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
];

// 리뷰별 캐릭터 이미지와 배경 스타일
const reviewStyles = [
  {
    character: 'https://static.wixstatic.com/media/ed23bc_72c9e3ea94f54b01a261bcb493541281~mv2.png/v1/fill/w_400,h_800,al_c,q_90,enc_avif,quality_auto/A-2-topaz-upscale-2_8x.png',
    background: <div className="w-[300px] h-[300px] bg-sky-400 rounded-full blur-sm" style={{ borderRadius: '60% 40% 50% 50%' }}></div>,
    width: 280,
    height: 560,
  },
  {
    character: 'https://static.wixstatic.com/media/ed23bc_a95d4fc4bf1a4338a23b0f3e4c5c891f~mv2.png/v1/fill/w_400,h_800,al_c,q_90,enc_avif,quality_auto/A-1-topaz-upscale-2_8x.png',
    background: (
      <svg viewBox="0 0 100 100" className="w-[300px] h-[300px]">
        <polygon points="10,100 30,20 50,60 70,20 90,100" fill="#f97316" />
      </svg>
    ),
    width: 250,
    height: 500,
  },
  {
    character: 'https://static.wixstatic.com/media/ed23bc_bc0d15f53e6747928439199e49d9e740~mv2.png/v1/fill/w_400,h_730,al_c,q_90,enc_avif,quality_auto/A-4-topaz-upscale-2_8x.png',
    background: <div className="w-[280px] h-[280px] bg-green-400 rounded-tl-full rounded-tr-full"></div>,
    width: 280,
    height: 510,
  },
];

// 통계 값에서 숫자와 접미사 파싱
function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (match) {
    return { num: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] };
  }
  return { num: 0, suffix: '' };
}

export default function Home() {
  const heroRef = useRef(null);
  const brandBannerRef = useRef(null);
  const [reviews, setReviews] = useState<ReviewMedia[]>(defaultReviews);
  const [hero, setHero] = useState(defaultHero);
  const [stats, setStats] = useState(defaultStats);
  const [brandBanner, setBrandBanner] = useState(defaultBrandBanner);
  const [characterSection, setCharacterSection] = useState(defaultCharacterSection);
  const [reviewBanner, setReviewBanner] = useState(defaultReviewBanner);
  const [servicesSection, setServicesSection] = useState(defaultServicesSection);
  const [whyUsSection, setWhyUsSection] = useState(defaultWhyUsSection);
  const [finalCta, setFinalCta] = useState(defaultFinalCta);

  // 페이지 콘텐츠 로드
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch('/api/pages?page=home', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data.hero) {
            setHero({ ...defaultHero, ...data.hero });
          }
          if (data.stats && data.stats.length > 0) {
            // API 데이터 형식 변환 (value가 문자열일 경우 처리)
            const parsedStats = data.stats.map((stat: { label: string; value: string }) => {
              const parsed = parseStatValue(stat.value);
              return {
                value: parsed.num,
                suffix: parsed.suffix,
                label: stat.label,
              };
            });
            setStats(parsedStats);
          }
          if (data.brandBanner) {
            setBrandBanner({ ...defaultBrandBanner, ...data.brandBanner });
          }
          if (data.characterSection) {
            setCharacterSection({ ...defaultCharacterSection, ...data.characterSection });
          }
          if (data.reviewBanner) {
            setReviewBanner({ ...defaultReviewBanner, ...data.reviewBanner });
          }
          if (data.servicesSection) {
            setServicesSection({ ...defaultServicesSection, ...data.servicesSection });
          }
          if (data.whyUsSection) {
            setWhyUsSection({ ...defaultWhyUsSection, ...data.whyUsSection });
          }
          if (data.finalCta) {
            setFinalCta({ ...defaultFinalCta, ...data.finalCta });
          }
        }
      } catch (error) {
        console.error('페이지 콘텐츠 로드 실패:', error);
      }
    };
    fetchPageContent();
  }, []);

  // 미디어 데이터 로드
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('/api/media', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch (error) {
        console.error('미디어 데이터 로드 실패:', error);
      }
    };
    fetchMedia();
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const { scrollYProgress: brandScrollProgress } = useScroll({
    target: brandBannerRef,
    offset: ['start end', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const brandRotateY = useTransform(brandScrollProgress, [0, 1], [0, 360]);

  return (
    <>
      {/* Hero Section - Two Column Layout */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-120px)] bg-white overflow-hidden"
      >
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Subtle Gradient Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-50/80 to-transparent" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full">
          <div className="container mx-auto px-4 h-full">
            <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-120px)] py-12">
              {/* Left - Text Content */}
              <div className="order-2 lg:order-1">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-6"
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-green-700 text-sm font-medium">{hero.badge}</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight relative"
                >
                  <span className="absolute -left-4 md:-left-6 lg:-left-8">{'"'}</span>
                  {hero.title.split('\n').map((line, idx, arr) => (
                    <span key={idx}>
                      {idx === arr.length - 1 ? (
                        <span className="text-green-600">{line}</span>
                      ) : (
                        line
                      )}
                      {idx < arr.length - 1 && <br />}
                    </span>
                  ))}
                  <span className="text-green-600">{'"'}</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed"
                >
                  {hero.subtitle.includes("'필요한 사람'") ? (
                    <>
                      {hero.subtitle.split("'필요한 사람'")[0]}
                      <span className="text-gray-900 font-medium">{'\u0027'}필요한 사람{'\u0027'}</span>
                      {hero.subtitle.split("'필요한 사람'")[1]}
                    </>
                  ) : (
                    hero.subtitle
                  )}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.a
                    href="https://pf.kakao.com/_jQZHn"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                  >
                    {hero.ctaButton1 || '카카오톡 채널'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                  <motion.a
                    href="/map"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-7 py-3.5 rounded-full font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    {hero.ctaButton2 || '우리동네'}
                  </motion.a>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex gap-8 mt-12 pt-8 border-t border-gray-100"
                >
                  {Array.isArray(stats) && stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="cursor-default"
                    >
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">
                        <AnimatedCounter
                          value={stat.value}
                          suffix={stat.suffix}
                          duration={2 + index * 0.3}
                        />
                      </div>
                      <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right - Character Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="order-1 lg:order-2 relative flex justify-center items-end"
              >
                <div className="relative">
                  {/* Character Image */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10"
                  >
                    <Image
                      src={hero.characterImage || defaultHero.characterImage}
                      alt="엉클만세 캐릭터"
                      width={320}
                      height={640}
                      className="object-contain"
                      style={{ filter: 'drop-shadow(0 25px 50px rgba(34, 197, 94, 0.4)) drop-shadow(0 10px 20px rgba(16, 185, 129, 0.3))' }}
                      priority
                    />
                  </motion.div>
                  {/* Glow Effect Behind Character */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[280px] h-[150px] bg-gradient-to-t from-green-500/60 via-emerald-500/40 to-transparent blur-2xl -z-10" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1 h-2 bg-green-500 rounded-full"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Brand Banner */}
      <section ref={brandBannerRef} className="py-8 bg-green-500 overflow-hidden" style={{ perspective: '1000px' }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div style={{ rotateY: brandRotateY }}>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide italic">
              {brandBanner.title}
            </h2>
            <p className="text-white/90 text-sm md:text-base mt-1">
              {brandBanner.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Character Section with Labels */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          {/* Character with surrounding labels */}
          <div className="relative max-w-5xl mx-auto mb-16" style={{ minHeight: '700px' }}>
            {/* Character Image - Center */}
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={characterSection.characterImage}
                alt="엉클만세 캐릭터"
                width={300}
                height={665}
                className="object-contain"
              />
            </motion.div>

            {/* SVG Lines with animation */}
            <motion.svg
              className="absolute inset-0 w-full h-full hidden md:block"
              style={{ zIndex: 5 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* Top Left line */}
              <motion.line
                x1="22%" y1="8%" x2="42%" y2="18%"
                stroke="#16a34a" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              {/* Top Right line */}
              <motion.line
                x1="58%" y1="8%" x2="78%" y2="2%"
                stroke="#16a34a" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              {/* Middle Left line */}
              <motion.line
                x1="28%" y1="42%" x2="42%" y2="35%"
                stroke="#16a34a" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              {/* Middle Right line */}
              <motion.line
                x1="58%" y1="42%" x2="72%" y2="48%"
                stroke="#16a34a" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
              {/* Bottom Left line */}
              <motion.line
                x1="28%" y1="68%" x2="42%" y2="58%"
                stroke="#16a34a" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              />
              {/* Bottom Right line */}
              <motion.line
                x1="58%" y1="62%" x2="72%" y2="68%"
                stroke="#16a34a" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </motion.svg>

            {/* Labels - Desktop with animations */}
            <div className="hidden md:block">
              {/* Top Left */}
              <motion.div
                className="absolute"
                style={{ top: '2%', left: '5%' }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">{characterSection.labels[0]}</p>
              </motion.div>

              {/* Top Right */}
              <motion.div
                className="absolute"
                style={{ top: '-2%', right: '5%' }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">{characterSection.labels[1]}</p>
              </motion.div>

              {/* Middle Left */}
              <motion.div
                className="absolute"
                style={{ top: '35%', left: '0%' }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">{characterSection.labels[2]}</p>
              </motion.div>

              {/* Middle Right */}
              <motion.div
                className="absolute"
                style={{ top: '42%', right: '5%' }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">{characterSection.labels[3]}</p>
              </motion.div>

              {/* Bottom Left */}
              <motion.div
                className="absolute"
                style={{ top: '62%', left: '0%' }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">{characterSection.labels[4]}</p>
              </motion.div>

              {/* Bottom Right */}
              <motion.div
                className="absolute"
                style={{ top: '62%', right: '5%' }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <p className="text-green-600 font-bold text-xl italic whitespace-pre-line">{characterSection.labels[5]}</p>
              </motion.div>
            </div>

            {/* Labels - Mobile */}
            <div className="md:hidden pt-[680px] space-y-4 text-center">
              <p className="text-green-600 font-bold text-lg italic">{characterSection.labels[0]} {characterSection.labels[1]}</p>
              <p className="text-green-600 font-bold text-lg italic whitespace-pre-line">{characterSection.labels[2].replace('\n', ' ')} {characterSection.labels[3].replace('\n', ' ')}</p>
              <p className="text-green-600 font-bold text-lg italic whitespace-pre-line">{characterSection.labels[4].replace('\n', ' ')} {characterSection.labels[5].replace('\n', ' ')}</p>
            </div>
          </div>

          {/* Slogan Section */}
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-green-600 mb-8 leading-tight whitespace-pre-line">
              {characterSection.sloganTitle}
            </h2>

            <div className="border-l-4 border-green-500 pl-6 text-left inline-block mb-8">
              <p className="text-gray-700 text-lg leading-relaxed text-center whitespace-pre-line">
                {characterSection.sloganDescription}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <span className="text-gray-700 text-lg">&ldquo;우리는</span>
              <div className="flex items-center border-2 border-green-500 px-4 py-2">
                <span className="bg-green-500 text-white font-bold px-2 py-1 mr-2">N</span>
                <span className="text-green-600 font-bold text-xl">엉클만세</span>
              </div>
              <span className="text-gray-700 text-lg">입니다.&rdquo;</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Review Banner with Marquee */}
      <section className="bg-green-600 py-6 overflow-hidden">
        <div className="text-center">
          {/* Top marquee - moving left */}
          <div className="overflow-hidden whitespace-nowrap mb-3">
            <motion.div
              className="inline-block"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-white/80 text-sm font-medium tracking-wider">
                {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </motion.div>
          </div>

          <h2 className="text-white text-5xl md:text-6xl font-black tracking-wide">
            {reviewBanner.title}
          </h2>

          {/* Bottom marquee - moving right */}
          <div className="overflow-hidden whitespace-nowrap mt-3">
            <motion.div
              className="inline-block"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-white/80 text-sm font-medium tracking-wider">
                {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp; {brandBanner.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Review Cards Section - 동적 렌더링 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {Array.isArray(reviews) && reviews.map((review, index) => {
            const style = reviewStyles[index % reviewStyles.length];
            const isReversed = index % 2 === 1;

            return (
              <motion.div
                key={review.id}
                className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 ${index < reviews.length - 1 ? 'mb-20' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Scene Media */}
                <div className="relative w-full lg:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <ReviewMediaRenderer review={review} />
                    {/* Speech Bubble */}
                    {review.speechBubble && (
                      <div className="absolute top-4 left-4 bg-green-600 text-white p-4 rounded-2xl max-w-[280px] text-sm leading-relaxed">
                        {review.speechBubble}
                      </div>
                    )}
                    {/* Caption */}
                    {review.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-green-400 text-sm font-medium">{review.caption}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Character */}
                <div className="relative w-full lg:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {style.background}
                    </div>
                    <Image
                      src={style.character}
                      alt="엉클만세 캐릭터"
                      width={style.width}
                      height={style.height}
                      className="relative z-10 object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              {servicesSection.badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {servicesSection.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {servicesSection.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(servicesSection.items) && servicesSection.items.map((item, index) => {
              const serviceIcons = [Sparkles, Zap, Target, Shield];
              const serviceColors = [
                'from-emerald-500 to-green-600',
                'from-green-500 to-emerald-600',
                'from-teal-500 to-green-600',
                'from-emerald-600 to-teal-600',
              ];
              const IconComponent = serviceIcons[index % serviceIcons.length];
              const colorClass = serviceColors[index % serviceColors.length];

              return (
                <AnimatedSection key={item.id} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                    <div className="relative z-10">
                      <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors`}>
                        <IconComponent className="text-white" size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-white/90 transition-colors mb-6">
                        {item.description}
                      </p>
                      <Link
                        href={`/services#${item.id}`}
                        className="inline-flex items-center gap-2 text-green-600 font-semibold group-hover:text-white transition-colors"
                      >
                        자세히 보기
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold mb-6">
                {whyUsSection.badge}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                {whyUsSection.title.split('\n').map((line, idx, arr) => (
                  <span key={idx}>
                    {line.includes('엉클만세') ? (
                      <>
                        {line.split('엉클만세')[0]}
                        <span className="text-green-400">엉클만세</span>
                        {line.split('엉클만세')[1]}
                      </>
                    ) : (
                      line
                    )}
                    {idx < arr.length - 1 && <br />}
                  </span>
                ))}
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed whitespace-pre-line">
                {whyUsSection.subtitle}
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {Array.isArray(whyUsSection.features) && whyUsSection.features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="text-green-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                      <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href="/about"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 mt-10 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors"
              >
                {whyUsSection.ctaText}
                <ArrowRight size={20} />
              </motion.a>
            </AnimatedSection>

            <AnimatedSection direction="right" className="relative">
              <div className="relative flex justify-center">
                {/* Decorative Elements */}
                <motion.div
                  className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/30 to-emerald-500/20 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-500/30 to-green-500/20 rounded-full blur-2xl"
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />

                {/* Character Image */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <Image
                    src={whyUsSection.characterImage}
                    alt="엉클만세 광고"
                    width={400}
                    height={800}
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* Floating Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="absolute bottom-10 -left-4 bg-white rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                      <Award className="text-green-600" size={28} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{whyUsSection.statValue}</div>
                      <div className="text-gray-600 text-sm">{whyUsSection.statLabel}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <Megaphone size={40} />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {finalCta.title}
            </h2>
            <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-2xl mx-auto whitespace-pre-line">
              {finalCta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-white text-green-600 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-white/30 transition-all"
              >
                {finalCta.ctaButton1}
                <ArrowRight size={24} />
              </motion.a>
              <motion.a
                href={`tel:${finalCta.phone}`}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-bold text-xl border border-white/30 hover:bg-white/30 transition-all"
              >
                <Phone size={24} />
                {finalCta.ctaButton2}
              </motion.a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
