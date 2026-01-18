'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 숫자 */}
        <div className="relative">
          <h1 className="text-[180px] font-black text-gray-200 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-24 h-24 text-green-500 opacity-50" />
          </div>
        </div>

        {/* 메시지 */}
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나, 이동되었거나, 삭제되었을 수 있습니다.
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            홈으로 가기
          </Link>
          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            이전 페이지
          </button>
        </div>

        {/* 회사 정보 */}
        <div className="mt-12 text-sm text-gray-500">
          <p>
            문의가 필요하신 경우{' '}
            <Link href="/contact" className="text-green-600 hover:underline">
              문의하기
            </Link>
            를 이용해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
