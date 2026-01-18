'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn, Filter } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const categories = ['전체', '거울광고', '엘리베이터', '게시판', '전단지'];

const portfolioItems = [
  {
    id: 1,
    title: '강남 럭셔리 아파트 거울광고',
    category: '거울광고',
    image: 'https://static.wixstatic.com/media/3a3909_0237c2393dc84c7f85c725e62533d137~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/3a3909_0237c2393dc84c7f85c725e62533d137~mv2.jpg',
    description: '고급 주거 단지를 위한 프리미엄 거울광고',
  },
  {
    id: 2,
    title: '파주 오피스텔 엘리베이터 광고',
    category: '엘리베이터',
    image: 'https://static.wixstatic.com/media/3a3909_5f3a389c6fc84389ad874b11d7893170~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/3a3909_5f3a389c6fc84389ad874b11d7893170~mv2.jpg',
    description: '젊은 직장인을 타겟으로 한 세련된 광고',
  },
  {
    id: 3,
    title: '교하 아파트 게시판 광고',
    category: '게시판',
    image: 'https://static.wixstatic.com/media/3a3909_78864d6ab0c44291bb95e8b6fa68256e~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/3a3909_78864d6ab0c44291bb95e8b6fa68256e~mv2.jpg',
    description: '지역 주민 대상 효과적인 홍보',
  },
  {
    id: 4,
    title: '학원 홍보 전단지',
    category: '전단지',
    image: 'https://static.wixstatic.com/media/3a3909_752d220f1d2144eb90750f3f51f1933f~mv2.jpg/v1/fill/w_600,h_750,al_c,q_80/3a3909_752d220f1d2144eb90750f3f51f1933f~mv2.jpg',
    description: '신학기 학원 홍보용 고품질 전단지',
  },
  {
    id: 5,
    title: '프리미엄 거울광고 설치',
    category: '거울광고',
    image: 'https://static.wixstatic.com/media/3a3909_20cae4a00b634c57ab7a254f17e2070c~mv2.jpg/v1/fill/w_600,h_1000,al_c,q_80/3a3909_20cae4a00b634c57ab7a254f17e2070c~mv2.jpg',
    description: '엘리베이터 내 거울에 설치된 광고',
  },
  {
    id: 6,
    title: '상가 엘리베이터 광고',
    category: '엘리베이터',
    image: 'https://static.wixstatic.com/media/3a3909_6619fc976e4c460b89e60ad9330143ed~mv2.jpg/v1/fill/w_600,h_1000,al_c,q_80/3a3909_6619fc976e4c460b89e60ad9330143ed~mv2.jpg',
    description: '상가 방문객을 위한 효과적인 광고',
  },
  {
    id: 7,
    title: '병원 홍보 게시판',
    category: '게시판',
    image: 'https://static.wixstatic.com/media/3a3909_a12bd7c59e584b0e9280db1a7272b52a~mv2.jpg/v1/fill/w_600,h_250,al_c,q_80/3a3909_a12bd7c59e584b0e9280db1a7272b52a~mv2.jpg',
    description: '지역 병원 홍보 게시판 광고',
  },
  {
    id: 8,
    title: '부동산 전단지 디자인',
    category: '전단지',
    image: 'https://static.wixstatic.com/media/ed23bc_4e4e3936557e43059d23222b75d7d5f2~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/ed23bc_4e4e3936557e43059d23222b75d7d5f2~mv2.jpg',
    description: '부동산 매물 홍보용 전단지',
  },
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);

  const filteredItems = selectedCategory === '전체'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
              OUR WORKS
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">포트폴리오</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              엉클만세가 진행한 다양한 광고 사례를 확인해보세요
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter size={20} className="text-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center"
                      >
                        <ZoomIn className="text-gray-900" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs text-green-400 font-medium">{item.category}</span>
                      <h3 className="text-white font-bold">{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedItem(null)}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-4 text-center text-white">
                <span className="text-sm text-green-400 font-medium">{selectedItem.category}</span>
                <h3 className="text-2xl font-bold mt-1">{selectedItem.title}</h3>
                <p className="text-gray-300 mt-2">{selectedItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              이런 광고가 필요하신가요?
            </h2>
            <p className="text-gray-600 mb-8">
              지금 바로 상담을 통해 맞춤형 광고를 시작하세요
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg"
            >
              무료 상담 신청
            </motion.a>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
