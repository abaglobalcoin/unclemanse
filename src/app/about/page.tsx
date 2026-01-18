'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

interface ValueItem {
  number: string;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  image: string;
}

interface ContentData {
  title: string;
  content: string;
  values?: ValueItem[];
  summaryText?: string;
  summaryHighlights?: string[];
}

// 기본값
const defaultContent: ContentData = {
  title: '"사람, 마을, 광고를 연결하는 행복기업"',
  content: '엉클만세는 단순한 광고회사가 아닙니다.\n우리는 지역의 소통을 잇는 다리이자, 사람과 마을을 행복으로 연결하는 파트너입니다.',
  values: [
    { number: '1', titleKo: '신뢰와 지역밀착', titleEn: 'Trust and Local Engagement', descriptionKo: '지역 주민과 상생하고, 신뢰받는 광고 파트너로 자리매김하는 것.', descriptionEn: 'Becoming a trusted advertising partner that grows together with the local community', image: 'https://static.wixstatic.com/media/3a3909_592a09de733547c1889a3022078c854b~mv2.png/v1/fill/w_376,h_720,al_c,lg_1,q_85/3a3909_592a09de733547c1889a3022078c854b~mv2.png' },
    { number: '2', titleKo: '창의적 실행', titleEn: 'Creative Execution', descriptionKo: '기존의 광고 방식을 넘어서는 새로운 아이디어와 실천으로 차별화된 성과를 내는 것.', descriptionEn: 'Delivering differentiated results through new ideas and practices', image: 'https://static.wixstatic.com/media/3a3909_7fb02088558b4246ba362b1448321c31~mv2.png/v1/fill/w_670,h_724,al_c,q_90/컴퓨터하는모습.png' },
    { number: '3', titleKo: '사람 중심 성장', titleEn: 'People-Centered Growth', descriptionKo: '팀원, 고객, 지역사회를 아우르는 사람 중심 경영을 통해 함께 성장하는 것.', descriptionEn: 'Growing together through people-centered management', image: 'https://static.wixstatic.com/media/3a3909_452dad8bbf6e499ea66a9fd6dec244e8~mv2.png/v1/fill/w_600,h_558,al_c,q_85/성장.png' },
  ],
  summaryText: '즉, 엉클만세의 핵심은',
  summaryHighlights: ['지역 신뢰 기반', '창의적인 실천력', '사람과 함께하는 성장'],
};

export default function InfoPage() {
  const [content, setContent] = useState<ContentData>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/pages?page=info', { cache: 'no-store' });
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

  const values = Array.isArray(content.values) ? content.values : defaultContent.values!;
  const summaryText = content.summaryText || defaultContent.summaryText!;
  const summaryHighlights = Array.isArray(content.summaryHighlights) ? content.summaryHighlights : defaultContent.summaryHighlights!;

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-green-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <span className="inline-block text-white font-bold text-lg md:text-xl mb-6">
                INFO
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight whitespace-nowrap">
                {content.title}
              </h1>
              <p className="text-base md:text-lg text-white/90 leading-relaxed whitespace-pre-line">
                {content.content}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section - Zigzag Layout */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-24">
            {Array.isArray(values) && values.map((value, index) => {
              const isEven = index % 2 === 0;
              return (
                <AnimatedSection key={value.titleKo} delay={index * 0.1}>
                  <div className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
                    {/* Text Content */}
                    <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                      <div className="text-5xl md:text-6xl font-bold text-green-500 mb-4">
                        {value.number}.
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {value.titleKo}
                      </h3>
                      <p className="text-green-600 font-medium mb-6">
                        {value.titleEn}
                      </p>
                      <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        {value.descriptionKo}
                      </p>
                      <p className="text-gray-400 leading-relaxed">
                        {value.descriptionEn}
                      </p>
                    </div>
                    {/* Image */}
                    <motion.div
                      className={`${isEven ? 'md:order-2' : 'md:order-1'} flex justify-center`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={value.image}
                        alt={value.titleKo}
                        width={300}
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

      {/* Summary Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                {summaryText}<br />
                {Array.isArray(summaryHighlights) && summaryHighlights.map((h, i) => (
                  <span key={i}>
                    <span className="text-green-500 font-bold">{h}</span>
                    {i < summaryHighlights.length - 1 && ', '}
                  </span>
                ))}이에요.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

    </>
  );
}
