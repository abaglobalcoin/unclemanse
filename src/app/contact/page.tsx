'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface ContentData {
  title: string;
  subtitle: string;
  businessHours?: string;
  serviceOptions?: string[];
  kakaoTitle?: string;
  kakaoSubtitle?: string;
  faqTeaser?: string[];
}

// 기본값
const defaultContent: ContentData = {
  title: '문의하기',
  subtitle: '궁금한 점이 있으시면 언제든지 문의해주세요.\n빠른 시간 내에 답변 드리겠습니다.',
  businessHours: '평일 09:00 - 18:00',
  serviceOptions: [
    '거울광고',
    '엘리베이터 광고',
    '게시판 광고',
    '전단지 제작',
    '기타',
  ],
  kakaoTitle: '카카오톡 상담',
  kakaoSubtitle: '실시간 1:1 상담을 받으세요',
  faqTeaser: [
    '광고 비용은 어떻게 되나요?',
    '광고 설치 기간은 얼마나 걸리나요?',
    '어떤 지역에서 광고가 가능한가요?',
  ],
};

export default function ContactPage() {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '엉클만세',
    phone: '031-945-1217',
    email: 'unclemanse@naver.com',
    address: '경기도 파주시 교하로 421 (동패동)',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/pages?page=contact', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.title) setContent({ ...defaultContent, ...data });
        }
      } catch (error) {
        console.error('콘텐츠 로드 실패:', error);
      }
    };
    fetchContent();

    const fetchCompanyInfo = async () => {
      try {
        const res = await fetch('/api/settings/public');
        const data = await res.json();
        if (data.companyInfo) {
          setCompanyInfo(data.companyInfo);
        }
      } catch (error) {
        console.error('회사 정보 로드 실패:', error);
      }
    };
    fetchCompanyInfo();
  }, []);

  const serviceOptions = Array.isArray(content.serviceOptions) ? content.serviceOptions : defaultContent.serviceOptions!;
  const businessHours = content.businessHours || defaultContent.businessHours!;
  const kakaoTitle = content.kakaoTitle || defaultContent.kakaoTitle!;
  const kakaoSubtitle = content.kakaoSubtitle || defaultContent.kakaoSubtitle!;
  const faqTeaser = Array.isArray(content.faqTeaser) ? content.faqTeaser : defaultContent.faqTeaser!;

  const contactInfo = [
    {
      icon: Phone,
      title: '전화',
      content: companyInfo.phone,
      link: `tel:${companyInfo.phone}`,
    },
    {
      icon: Mail,
      title: '이메일',
      content: companyInfo.email,
      link: `mailto:${companyInfo.email}`,
    },
    {
      icon: MapPin,
      title: '주소',
      content: companyInfo.address,
      link: 'https://maps.google.com',
    },
    {
      icon: Clock,
      title: '영업시간',
      content: businessHours,
      link: null,
    },
  ];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    location: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: '',
          adType: formData.service,
          message: `[광고 희망 지역: ${formData.location || '미입력'}]\n\n${formData.message}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            phone: '',
            email: '',
            service: '',
            location: '',
            message: '',
          });
        }, 3000);
      } else {
        setError(data.error || '문의 전송에 실패했습니다.');
      }
    } catch {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
              CONTACT US
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{content.title}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto whitespace-pre-line">
              {content.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white relative -mt-12 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(contactInfo) && contactInfo.map((info, index) => (
              <AnimatedSection key={info.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <info.icon className="text-green-500" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-green-500 transition-colors"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.content}</p>
                  )}
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <AnimatedSection direction="left">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">온라인 문의</h2>
                <p className="text-gray-600 mb-8">
                  아래 양식을 작성해주시면 빠른 시간 내에 연락 드리겠습니다.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      문의가 접수되었습니다!
                    </h3>
                    <p className="text-gray-600">
                      빠른 시간 내에 연락 드리겠습니다.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          이름 *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                          placeholder="홍길동"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          연락처 *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                          placeholder="010-1234-5678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          문의 서비스 *
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white"
                        >
                          <option value="">선택해주세요</option>
                          {serviceOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          광고 희망 지역
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                          placeholder="예: 파주시 교하동"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        문의 내용 *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none"
                        placeholder="문의하실 내용을 자세히 작성해주세요"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          전송 중...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          문의하기
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Quick Contact */}
            <AnimatedSection direction="right">
              <div className="space-y-6">
                {/* Kakao Talk */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  className="block bg-yellow-400 rounded-2xl p-6 text-gray-900"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center">
                      <MessageCircle size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{kakaoTitle}</h3>
                      <p className="text-yellow-800">{kakaoSubtitle}</p>
                    </div>
                  </div>
                </motion.a>

                {/* Phone */}
                <motion.a
                  href={`tel:${companyInfo.phone}`}
                  whileHover={{ scale: 1.02 }}
                  className="block bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Phone size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">전화 상담</h3>
                      <p className="text-green-100">{companyInfo.phone}</p>
                    </div>
                  </div>
                </motion.a>

                {/* Map */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="aspect-video bg-gray-200 relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.8424073285097!2d126.7416!3d37.7516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ1JzA1LjgiTiAxMjbCsDQ0JzI5LjgiRQ!5e0!3m2!1sko!2skr!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">찾아오시는 길</h3>
                    <p className="text-gray-600 text-sm">{companyInfo.address}</p>
                  </div>
                </div>

                {/* FAQ Teaser */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">자주 묻는 질문</h3>
                  <ul className="space-y-3">
                    {Array.isArray(faqTeaser) && faqTeaser.map((question, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-green-500 transition-colors"
                      >
                        <span className="w-6 h-6 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-sm font-medium">
                          Q
                        </span>
                        {question}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
