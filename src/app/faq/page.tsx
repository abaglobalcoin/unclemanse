'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

interface ContactInfoItem {
  label: string;
  value: string;
  href: string;
  iconType: 'phone' | 'mail' | 'message' | 'mappin';
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ContentData {
  title: string;
  subtitle: string;
  contactInfo?: ContactInfoItem[];
  quickFaqs?: FaqItem[];
  adFaqs?: FaqItem[];
  ctaText?: string;
  ctaSubtext?: string;
  ctaButtonText?: string;
}

// 기본값
const defaultContent: ContentData = {
  title: '"엉클만세와 연결하세요"',
  subtitle: '광고 솔루션 상담부터 막사창고 납품 문의까지,\n궁금한 점이 있다면 언제든 편하게 연락주세요.',
  contactInfo: [
    { iconType: 'phone', label: '대표번호', value: '031-945-1217', href: 'tel:031-945-1217' },
    { iconType: 'mail', label: '이메일', value: 'unclemanse@naver.com', href: 'mailto:unclemanse@naver.com' },
    { iconType: 'message', label: '카카오톡 채널', value: '채팅하기', href: '#' },
    { iconType: 'mappin', label: '주소', value: '경기도 파주시 교하로 421 (동패동)', href: '#' },
  ],
  quickFaqs: [
    {
      question: 'Q. 광고 진행 절차는 어떻게 되나요?',
      answer: '→ 상담 → 제안서 전달 → 계약 → 광고 진행',
    },
    {
      question: 'Q. 막사창고 물품은 어떻게 주문할 수 있나요?',
      answer: '→ 필요 물품 리스트 전달 → 견적 확인 → 발주 → 납품',
    },
    {
      question: 'Q. 최소 계약 기간이 있나요?',
      answer: '→ 광고 유형에 따라 다르며, 1개월 단위 계약도 가능합니다.',
    },
  ],
  adFaqs: [
    {
      question: '광고를 진행하려면 어떻게 신청하나요?',
      answer: '홈페이지 상담신청 또는 카카오톡 채널로 문의해 주세요. 담당 매니저가 가능 단지·위치·예산에 맞춘 제안을 드립니다. \'무료 상담 신청\' 접수 시 1일 이내 연락드립니다.',
    },
    {
      question: '엘리베이터 거울광고는 어떤 아파트에서 가능한가요?',
      answer: '파주시 전역 및 고양시 일부 단지에서 운영합니다. 협력 단지 목록은 상담 시 안내드리며 신규 단지도 계속 확대 중입니다.',
    },
    {
      question: '광고 게재 기간은 얼마나 되나요?',
      answer: '기본 1개월 단위이며, 3/6/12개월 단위로 진행하고 있습니다.',
    },
    {
      question: '광고물 제작과 설치에 따른 추가적인 비용이 발생하나요?',
      answer: '아니요. 광고물 제작과 설치에 따른 추가적인 비용이 발생하지 않습니다. 담당 매니저의 꼼꼼한 제작, 설치가 무료로 진행됩니다.',
    },
    {
      question: '광고 비용은 어떻게 책정되나요?',
      answer: '매체, 단지 세대수, 노출 기간에 따라 달라집니다. 예산을 알려주시면 최적 조합으로 제안드립니다.',
    },
    {
      question: '광고 시작까지 얼마나 걸리나요?',
      answer: '디자인 확정 후 3~5일 이내 설치·노출이 시작됩니다. 행사·오픈 등 긴급은 우선 설치 가능합니다.',
    },
    {
      question: '무료체험 광고가 가능한가요?',
      answer: '예. 신규 광고주 대상 1개월 무료체험을 수시 진행합니다. 가능 단지는 상담 시 안내드립니다.',
    },
    {
      question: '업종별 맞춤 광고가 가능한가요?',
      answer: '가능합니다. 업종 타겟에 맞는 단지·게시 위치·문구 스타일을 맞춤 설계합니다.',
    },
    {
      question: '계약 후 관리(AS)는 어떻게 하나요?',
      answer: '손상·오염 등 이슈 발생 시 무상 교체·청소를 제공합니다. 정기점검으로 광고 상태를 관리합니다. 온오프라인 관리 현황을 공유해 드립니다.',
    },
  ],
  ctaText: '엉클만세는 항상 열린 마음으로 기다리고 있습니다.',
  ctaSubtext: '지금 바로 연락 주세요.',
  ctaButtonText: '문의하기',
};

// 아이콘 컴포넌트 매핑
const iconMap = {
  phone: Phone,
  mail: Mail,
  message: MessageCircle,
  mappin: MapPin,
};

export default function FAQPage() {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [openQuickIndex, setOpenQuickIndex] = useState<number | null>(null);
  const [openAdIndex, setOpenAdIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/pages?page=faq', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.title) setContent({ ...defaultContent, ...data });
        }
      } catch (error) {
        console.error('콘텐츠 로드 실패:', error);
      }
    };
    fetchContent();
  }, []);

  let contactInfo = defaultContent.contactInfo!;
  if (content.contactInfo && Array.isArray(content.contactInfo)) {
    contactInfo = content.contactInfo;
  } else if (content.contactInfo && typeof content.contactInfo === 'object') {
    // Legacy object format conversion
    const legacy = content.contactInfo as { phone?: string; email?: string; kakao?: string; address?: string };
    contactInfo = [
      { iconType: 'phone', label: '대표번호', value: legacy.phone || '031-945-1217', href: legacy.phone ? `tel:${legacy.phone}` : 'tel:031-945-1217' },
      { iconType: 'mail', label: '이메일', value: legacy.email || 'unclemanse@naver.com', href: legacy.email ? `mailto:${legacy.email}` : 'mailto:unclemanse@naver.com' },
      { iconType: 'message', label: '카카오톡 채널', value: legacy.kakao || '채팅하기', href: '#' },
      { iconType: 'mappin', label: '주소', value: legacy.address || '경기도 파주시 교하로 421 (동패동)', href: '#' },
    ] as ContactInfoItem[];
  }
  const quickFaqs = Array.isArray(content.quickFaqs) ? content.quickFaqs : defaultContent.quickFaqs!;
  const adFaqs = Array.isArray(content.adFaqs) ? content.adFaqs : defaultContent.adFaqs!;
  const ctaText = content.ctaText || defaultContent.ctaText!;
  const ctaSubtext = content.ctaSubtext || defaultContent.ctaSubtext!;
  const ctaButtonText = content.ctaButtonText || defaultContent.ctaButtonText!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <span className="inline-block text-white font-bold text-lg md:text-xl mb-6">
                문의하기
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                {content.title}
              </h1>
              <p className="text-base md:text-lg text-white/90 leading-relaxed whitespace-pre-line">
                {content.subtitle}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="text-5xl md:text-6xl font-bold text-green-500">1.</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                  {'"'}연락처 안내{'"'}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {Array.isArray(contactInfo) && contactInfo.map((item) => {
                  const IconComponent = iconMap[item.iconType] || Phone;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      whileHover={{ y: -5 }}
                      className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <IconComponent className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="font-semibold text-gray-900">{item.value}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="text-5xl md:text-6xl font-bold text-green-500">2.</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                  {'"'}문의 남기기{'"'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사명/점포명
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의내용
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors"
                >
                  보내기
                </motion.button>
              </form>
              <div className="text-center mt-6">
                <a
                  href="mailto:unclemanse@naver.com"
                  className="text-green-600 font-medium hover:underline"
                >
                  메일로 문의하기
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Quick FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="text-5xl md:text-6xl font-bold text-green-500">3.</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                  {'"'}자주 묻는 질문{'"'}
                </h2>
              </div>
              {Array.isArray(quickFaqs) && quickFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenQuickIndex(openQuickIndex === index ? null : index)}
                    className="w-full py-6 flex items-center justify-between text-left"
                  >
                    <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openQuickIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="text-green-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openQuickIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-gray-600 whitespace-pre-line">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Detailed FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  광고대행 FAQ
                </h2>
              </div>
              {Array.isArray(adFaqs) && adFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 bg-white first:rounded-t-2xl last:rounded-b-2xl">
                  <button
                    onClick={() => setOpenAdIndex(openAdIndex === index ? null : index)}
                    className="w-full py-6 px-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-green-500 font-bold text-lg">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openAdIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="text-green-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openAdIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 px-6 pl-16 text-gray-600 whitespace-pre-line">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-2">
                {ctaText}
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                {ctaSubtext}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="tel:031-945-1217"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  {ctaButtonText}
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
