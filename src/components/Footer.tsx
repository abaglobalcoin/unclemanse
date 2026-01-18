'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';

interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const footerLinks = {
  services: [
    { name: '거울광고', href: '/services#mirror' },
    { name: '엘리베이터 광고', href: '/services#elevator' },
    { name: '게시판 광고', href: '/services#board' },
    { name: '전단지 제작', href: '/services#flyer' },
  ],
  company: [
    { name: '회사소개', href: '/about' },
    { name: '포트폴리오', href: '/portfolio' },
    { name: '블로그', href: '/blog' },
    { name: '문의하기', href: '/contact' },
  ],
};

export default function Footer() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '엉클만세',
    phone: '031-945-1217',
    email: 'unclemanse@naver.com',
    address: '경기도 파주시 교하로 421 (동패동)',
  });

  useEffect(() => {
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

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Image
              src="https://static.wixstatic.com/media/ed23bc_ade0480f68f14e7dbf437c5b6bc02ec7~mv2.png/v1/fill/w_258,h_154,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/uncle.png"
              alt="엉클만세 로고"
              width={140}
              height={84}
              className="object-contain mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 mb-6 max-w-md">
              엉클만세는 아파트, 오피스텔, 상가 등 다양한 공간에서
              효과적인 광고 솔루션을 제공합니다. 거울광고, 엘리베이터 광고,
              게시판 광고 등 맞춤형 광고 서비스를 경험해보세요.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">서비스</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">회사 정보</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-green-400 flex-shrink-0" />
                <p className="text-white">{companyInfo.address}</p>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-400 flex-shrink-0" />
                <p className="text-white">T. <a href={`tel:${companyInfo.phone}`} className="hover:text-green-400 transition-colors">{companyInfo.phone}</a></p>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-400 flex-shrink-0" />
                <p className="text-white">E. <a href={`mailto:${companyInfo.email}`} className="hover:text-green-400 transition-colors">{companyInfo.email}</a></p>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <motion.a
                href="https://www.instagram.com/orumnet.kr/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="https://www.youtube.com/@ad-ya"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <Youtube size={20} />
              </motion.a>
              <motion.a
                href="https://blog.naver.com/choibm337"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.568 14.79c0 2.357-1.96 3.455-4.296 3.455H8.28V5.755h4.992c2.156 0 3.96.998 3.96 3.182 0 1.339-.636 2.296-1.716 2.825v.06c1.44.45 2.052 1.631 2.052 2.968zm-4.476-6.18h-1.716v3.12h1.68c1.2 0 1.92-.6 1.92-1.62 0-1.02-.72-1.5-1.884-1.5zm.18 5.76h-1.896v3.36h1.86c1.32 0 2.1-.6 2.1-1.74 0-1.08-.78-1.62-2.064-1.62z"/>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} 엉클만세. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
