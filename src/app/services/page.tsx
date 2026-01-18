'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

interface ServiceItem {
  number: string;
  title: string;
  subtitle?: string;
  mediaType: 'youtube' | 'mp4' | 'image';
  videoUrl?: string;
  imageUrl?: string;
}

interface ContentData {
  title: string;
  subtitle: string;
  serviceItems?: ServiceItem[];
  cta?: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
}

// 기본값
const defaultContent: ContentData = {
  title: '광고솔루션',
  subtitle: '지역을 연결하는 가장 효과적인 방법',
  serviceItems: [
    { number: '01', title: '아파트 오프라인 광고', subtitle: '엘리베이터 거울, 게시판, 관리사무소 사인물', mediaType: 'youtube' as const, videoUrl: 'https://www.youtube.com/embed/dlQEluXatMk', imageUrl: '' },
    { number: '02', title: '아파트 엘리베이터 동영상 광고', subtitle: '', mediaType: 'mp4' as const, videoUrl: 'https://video.wixstatic.com/video/3a3909_059e2d8487d3487484086483f05c5f49/1080p/mp4/file.mp4', imageUrl: '' },
    { number: '03', title: '옥외광고', subtitle: '파주시 현수막 게시대, 디지털 사이니지, 큐레이션', mediaType: 'mp4' as const, videoUrl: 'https://video.wixstatic.com/video/3a3909_3dab49a195fa49e89c79a3822f3791a7/720p/mp4/file.mp4', imageUrl: '' },
    { number: '04', title: '거울, 게시판, 안전관리용품', subtitle: '공동주택 용품 (막사창고)', mediaType: 'image' as const, videoUrl: '', imageUrl: 'https://static.wixstatic.com/media/3a3909_390f49d3a00b433bb99f082df7f5b20f~mv2.png/v1/fill/w_400,h_400,al_c,q_85/3a3909_390f49d3a00b433bb99f082df7f5b20f~mv2.png' },
    { number: '05', title: '현수막, 배너, 실사출력, 포맥스, 아크릴, 안내판, SIGN', subtitle: '', mediaType: 'image' as const, videoUrl: '', imageUrl: 'https://static.wixstatic.com/media/3a3909_752d220f1d2144eb90750f3f51f1933f~mv2.jpg/v1/fill/w_500,h_375,al_c,q_80/3a3909_752d220f1d2144eb90750f3f51f1933f~mv2.jpg' },
    { number: '06', title: '홈페이지 제작, 유지보수', subtitle: '', mediaType: 'mp4' as const, videoUrl: 'https://video.wixstatic.com/video/3a3909_f9821158013b463990b737b627f44ef8/360p/mp4/file.mp4', imageUrl: '' },
  ],
  cta: {
    title: '광고 문의가 필요하신가요?',
    subtitle: '전문 상담원이 맞춤형 광고 솔루션을 제안해 드립니다',
    buttonText: '문의하기',
  },
};

export default function ServicesPage() {
  const [content, setContent] = useState<ContentData>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/pages?page=services', { cache: 'no-store' });
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

  const services = Array.isArray(content.serviceItems) ? content.serviceItems : defaultContent.serviceItems!;
  const cta = content.cta || defaultContent.cta!;

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-green-500">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {content.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              {content.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services List - Zigzag Layout */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-40">
            {services.map((service, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <AnimatedSection key={service.number} delay={0.1}>
                  <div className={`grid md:grid-cols-2 gap-16 lg:gap-24 items-center ${isEven ? '' : 'md:grid-flow-dense'}`}>
                    {/* Text Content */}
                    <div className={isEven ? 'md:order-1' : 'md:order-2'}>
                      <span className="text-8xl lg:text-9xl font-bold text-green-500/40 block mb-2">{service.number}</span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        {service.title}
                      </h2>
                      {service.subtitle && (
                        <p className="text-gray-500 text-xl">{service.subtitle}</p>
                      )}
                    </div>

                    {/* Visual Content */}
                    <div className={isEven ? 'md:order-2' : 'md:order-1'}>
                      {service.mediaType === 'youtube' && service.videoUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                          <iframe
                            src={service.videoUrl}
                            title={service.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      )}

                      {service.mediaType === 'mp4' && service.videoUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                          <video
                            src={service.videoUrl}
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {service.mediaType === 'image' && service.imageUrl && (
                        <div className="grid grid-cols-2 gap-6">
                          {[1, 2].map((i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.03 }}
                              className="relative aspect-square rounded-2xl overflow-hidden shadow-xl"
                            >
                              <Image
                                src={service.imageUrl!}
                                alt={`${service.title} ${i}`}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {cta.title}
            </h2>
            <p className="text-gray-600 mb-8">
              {cta.subtitle}
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg"
            >
              {cta.buttonText}
            </motion.a>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
