'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const blogPosts = [
  {
    id: 1,
    title: '아파트 광고, 거울광고 vs 엘리베이터 광고 비교',
    excerpt: '아파트에서 효과적인 광고 방법을 찾고 계신가요? 거울광고와 엘리베이터 광고의 장단점을 비교해드립니다.',
    image: 'https://static.wixstatic.com/media/ed23bc_72c9e3ea94f54b01a261bcb493541281~mv2.png/v1/fill/w_600,h_400,al_c,q_90/A-2-topaz-upscale-2_8x.png',
    category: '광고 가이드',
    date: '2024.01.15',
    readTime: '5분',
  },
  {
    id: 2,
    title: '2024년 오프라인 광고 트렌드',
    excerpt: '디지털 시대에도 여전히 강력한 오프라인 광고! 2024년 주목해야 할 오프라인 광고 트렌드를 알아봅니다.',
    image: 'https://static.wixstatic.com/media/ed23bc_a95d4fc4bf1a4338a23b0f3e4c5c891f~mv2.png/v1/fill/w_600,h_400,al_c,q_85/A-1-topaz-upscale-2_8x.png',
    category: '트렌드',
    date: '2024.01.10',
    readTime: '7분',
  },
  {
    id: 3,
    title: '효과적인 전단지 디자인 5가지 팁',
    excerpt: '전단지 광고를 준비하고 계신가요? 고객의 시선을 사로잡는 효과적인 전단지 디자인 팁을 공개합니다.',
    image: 'https://static.wixstatic.com/media/ed23bc_2210c16adb7842f3bc68ad4e7ca0afdf~mv2.png/v1/fill/w_600,h_400,al_c,q_85/B-2-topaz-upscale-2_8x.png',
    category: '디자인 팁',
    date: '2024.01.05',
    readTime: '4분',
  },
  {
    id: 4,
    title: '지역 마케팅, 왜 중요한가요?',
    excerpt: '대형 온라인 플랫폼과 경쟁하는 로컬 비즈니스를 위한 지역 마케팅의 중요성과 전략을 알아봅니다.',
    image: 'https://static.wixstatic.com/media/3a3909_0237c2393dc84c7f85c725e62533d137~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/3a3909_0237c2393dc84c7f85c725e62533d137~mv2.jpg',
    category: '마케팅 전략',
    date: '2023.12.28',
    readTime: '6분',
  },
  {
    id: 5,
    title: '게시판 광고로 지역 주민 공략하기',
    excerpt: '아파트 게시판을 활용한 효과적인 지역 광고 방법과 성공 사례를 소개합니다.',
    image: 'https://static.wixstatic.com/media/3a3909_5f3a389c6fc84389ad874b11d7893170~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/3a3909_5f3a389c6fc84389ad874b11d7893170~mv2.jpg',
    category: '광고 가이드',
    date: '2023.12.20',
    readTime: '5분',
  },
  {
    id: 6,
    title: '광고 효과 측정하는 방법',
    excerpt: '오프라인 광고의 효과를 어떻게 측정할 수 있을까요? 실질적인 ROI 측정 방법을 알려드립니다.',
    image: 'https://static.wixstatic.com/media/3a3909_78864d6ab0c44291bb95e8b6fa68256e~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/3a3909_78864d6ab0c44291bb95e8b6fa68256e~mv2.jpg',
    category: '마케팅 전략',
    date: '2023.12.15',
    readTime: '8분',
  },
];

const categories = ['전체', '광고 가이드', '트렌드', '디자인 팁', '마케팅 전략'];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
              BLOG & NEWS
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">블로그</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              광고 트렌드, 마케팅 팁, 성공 사례 등
              <br />
              유용한 정보를 공유합니다
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Tag size={20} className="text-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  category === '전체'
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

      {/* Featured Post */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <motion.article
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video md:aspect-auto">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4 w-fit">
                    {blogPosts[0].category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {blogPosts[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {blogPosts[0].readTime} 읽기
                    </span>
                  </div>
                  <Link
                    href={`/blog/${blogPosts[0].id}`}
                    className="inline-flex items-center gap-2 text-green-500 font-medium hover:gap-3 transition-all"
                  >
                    자세히 보기 <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.article>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">최신 글</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <AnimatedSection key={post.id} delay={index * 0.1}>
                <motion.article
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-full flex flex-col"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium mb-3 w-fit">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </motion.article>
              </AnimatedSection>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-green-500 text-green-500 rounded-full font-medium hover:bg-green-500 hover:text-white transition-colors"
            >
              더 보기
            </motion.button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">뉴스레터 구독</h2>
              <p className="text-gray-400 mb-8">
                광고 트렌드와 마케팅 팁을 이메일로 받아보세요
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 px-6 py-4 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors"
                >
                  구독하기
                </motion.button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
