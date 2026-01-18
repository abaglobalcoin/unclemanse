'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const hiddenFooterPaths = ['/map'];

export default function ConditionalFooter() {
  const pathname = usePathname();

  // 관리자 페이지에서는 푸터 숨김
  if (pathname?.startsWith('/admin') || hiddenFooterPaths.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
