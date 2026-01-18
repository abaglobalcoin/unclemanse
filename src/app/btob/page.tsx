'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

interface Section {
  number: string;
  titleKo: string;
  descriptionKo: string;
  image: string;
  items?: string[];
}

interface ContentData {
  title: string;
  description: string;
  sections?: Section[];
  ctaText?: string;
  ctaSubtext?: string;
  ctaButtons?: Array<{ text: string; url: string }>;
}

// 기본값
const defaultContent: ContentData = {
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
};

export default function BtoBPage() {
  const [content, setContent] = useState<ContentData>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/pages?page=warehouse', { cache: 'no-store' });
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

  const sections = Array.isArray(content.sections) ? content.sections : defaultContent.sections!;
  const ctaText = content.ctaText || defaultContent.ctaText!;
  const ctaSubtext = content.ctaSubtext || defaultContent.ctaSubtext!;
  const ctaButtons = Array.isArray(content.ctaButtons) ? content.ctaButtons : defaultContent.ctaButtons!;

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <span className="inline-block text-white font-bold text-lg md:text-xl mb-6">
                막사창고
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                {content.title}
              </h1>
              <p className="text-base md:text-lg text-white/90 leading-relaxed">
                {content.description}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Sections - Zigzag Layout */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-24">
            {Array.isArray(sections) && sections.map((section, index) => {
              const isEven = index % 2 === 0;
              return (
                <AnimatedSection key={section.number} delay={index * 0.1}>
                  <div className={`grid md:grid-cols-2 gap-12 items-center`}>
                    {/* Text Content */}
                    <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                      <div className="text-5xl md:text-6xl font-bold text-green-500 mb-4">
                        {section.number}.
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                        {section.titleKo}
                      </h3>
                      {section.descriptionKo && (
                        <p className="text-lg text-gray-600 leading-relaxed mb-4">
                          {section.descriptionKo}
                        </p>
                      )}
                      {Array.isArray(section.items) && section.items.length > 0 && (
                        <ul className="space-y-3">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Image */}
                    <motion.div
                      className={`${isEven ? 'md:order-2' : 'md:order-1'} flex justify-center`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={section.image}
                        alt={section.titleKo}
                        width={350}
                        height={600}
                        className="object-contain drop-shadow-xl"
                      />
                    </motion.div>
                  </div>
                </AnimatedSection>
              );
            })}
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {Array.isArray(ctaButtons) && ctaButtons.map((button, index) => (
                  <motion.a
                    key={index}
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
                  >
                    {button.text} &gt;
                  </motion.a>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

    </>
  );
}
