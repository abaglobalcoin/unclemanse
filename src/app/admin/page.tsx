'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import {
  Building2,
  Upload,
  Download,
  Trash2,
  Save,
  LogOut,
  Settings,
  Key,
  Mail,
  Globe,
  BarChart3,
  RefreshCw,
  FileSpreadsheet,
  MapPin,
  Image,
  Video,
  Plus,
  FileText,
  Home,
  Briefcase,
  Info,
  Warehouse,
  HelpCircle,
  Phone,
  LayoutTemplate,
  PanelBottom,
  Search,
  X,
} from 'lucide-react';
import VisualPageEditor from '@/components/admin/VisualPageEditor';

interface Apartment {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  units: number;
  buildings: number;
  price: {
    mirror: number;
    board: number;
    elevator: number;
  };
}

interface SettingsData {
  adminPassword: string;
  kakaoMapApiKey: string;
  googleAnalyticsId: string;
  contactEmail: string;
  companyInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  customDomain: string;
  smtp: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
}

interface MediaData {
  hero: {
    backgroundImage: string;
    title: string;
    subtitle: string;
  };
  services: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
  reviews: {
    id: string;
    title: string;
    mediaType: 'video' | 'slideshow';
    videoUrl: string;
    images: string[];
    speechBubble: string;
    caption: string;
  }[];
  portfolio: {
    id: string;
    image: string;
    title: string;
  }[];
  logo: string;
  favicon: string;
}

type TabType = 'apartments' | 'media' | 'pages' | 'settings' | 'api' | 'email' | 'domain' | 'analytics';
type MediaSubTab = 'hero' | 'services' | 'reviews' | 'portfolio' | 'logo';
type PageSubTab = 'header' | 'footer' | 'home' | 'services' | 'info' | 'warehouse' | 'faq' | 'contact';

interface PageContent {
  header?: {
    logo: string;
    navItems: Array<{ name: string; url: string; icon: string }>;
    ctaButton: string;
    ctaUrl: string;
  };
  footer?: {
    logo: string;
    description: string;
    serviceLinks: Array<{ name: string; href: string }>;
    companyLinks: Array<{ name: string; href: string }>;
    socialLinks: {
      instagram: string;
      youtube: string;
      blog: string;
    };
    copyright: string;
  };
  home: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      backgroundImage: string;
      characterImage?: string;
      ctaButton1?: string;
      ctaButton2?: string;
    };
    stats: { label: string; value: string }[];
    brandBanner?: {
      title: string;
      subtitle: string;
    };
    characterSection?: {
      labels: string[];
      sloganTitle: string;
      sloganDescription: string;
      characterImage: string;
    };
    reviewBanner?: {
      title: string;
    };
    reviews?: Array<{
      bubble: string;
      caption: string;
      characterImage: string;
      bgColor: string;
    }>;
    servicesSection?: {
      badge: string;
      title: string;
      subtitle: string;
      items: Array<{
        id: string;
        title: string;
        description: string;
      }>;
    };
    whyUsSection?: {
      badge: string;
      title: string;
      subtitle: string;
      description?: string;
      features: Array<{ title: string; desc: string }>;
      ctaText: string;
      characterImage: string;
      statValue: string;
      statLabel: string;
    };
    finalCta?: {
      title: string;
      subtitle: string;
      ctaButton1: string;
      ctaButton2: string;
      phone: string;
    };
  };
  services: {
    title: string;
    subtitle: string;
    serviceItems?: Array<{
      number: string;
      title: string;
      subtitle: string;
      mediaType: 'youtube' | 'mp4' | 'image';
      videoUrl: string;
      imageUrl: string;
    }>;
    items: { id: string; title: string; description: string; image: string; features: string[] }[];
    cta?: {
      title: string;
      subtitle: string;
      buttonText: string;
    };
  };
  info: {
    title: string;
    content: string;
    image: string;
    highlights: string[];
    values?: Array<{
      number: string;
      titleKo: string;
      titleEn: string;
      descriptionKo: string;
      descriptionEn: string;
      image: string;
    }>;
    summaryText?: string;
    summaryHighlights?: string[];
  };
  warehouse: {
    title: string;
    description: string;
    sections?: Array<{
      number: string;
      titleKo: string;
      descriptionKo: string;
      image: string;
      items?: string[];
    }>;
    ctaText?: string;
    ctaSubtext?: string;
    ctaButtons?: Array<{ text: string; url: string }>;
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    address: string;
    businessHours: string;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('pages');
  const [mediaSubTab, setMediaSubTab] = useState<MediaSubTab>('hero');
  const [pageSubTab, setPageSubTab] = useState<PageSubTab>('home');

  // 아파트 데이터
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 아파트 필터 상태
  const [filterDo, setFilterDo] = useState<string>(''); // 도/광역시
  const [filterSi, setFilterSi] = useState<string>(''); // 시/군
  const [filterGu, setFilterGu] = useState<string>(''); // 구/동
  const [filterName, setFilterName] = useState<string>(''); // 아파트명 검색

  // 주소에서 지역 정보 파싱
  const parseAddress = (address: string) => {
    const parts = address.split(' ').filter(p => p.trim());
    return {
      do: parts[0] || '', // 경기도, 서울특별시 등
      si: parts[1] || '', // 파주시, 강남구 등
      gu: parts[2] || '', // 교하동, 역삼동 등
    };
  };

  // 한국 주요 시/도 목록 (미리 정의)
  const koreaProvinces = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
    '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도',
    '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
  ];

  // 필터링된 아파트 목록
  const filteredApartments = apartments.filter(apt => {
    const parsed = parseAddress(apt.address);

    if (filterDo && parsed.do !== filterDo) return false;
    if (filterSi && parsed.si !== filterSi) return false;
    if (filterGu && parsed.gu !== filterGu) return false;
    if (filterName && !apt.name.toLowerCase().includes(filterName.toLowerCase())) return false;

    return true;
  });

  // 고유한 지역 목록 추출 (데이터 기반)
  const dataBasedDos = [...new Set(apartments.map(apt => parseAddress(apt.address).do).filter(Boolean))];
  // 미리 정의된 목록 + 데이터에 있는 목록 합치기 (중복 제거)
  const uniqueDos = [...new Set([...koreaProvinces, ...dataBasedDos])].sort();

  const uniqueSis = [...new Set(
    apartments
      .filter(apt => !filterDo || parseAddress(apt.address).do === filterDo)
      .map(apt => parseAddress(apt.address).si)
      .filter(Boolean)
  )].sort();
  const uniqueGus = [...new Set(
    apartments
      .filter(apt => {
        const parsed = parseAddress(apt.address);
        if (filterDo && parsed.do !== filterDo) return false;
        if (filterSi && parsed.si !== filterSi) return false;
        return true;
      })
      .map(apt => parseAddress(apt.address).gu)
      .filter(Boolean)
  )].sort();

  // 필터 초기화
  const resetFilters = () => {
    setFilterDo('');
    setFilterSi('');
    setFilterGu('');
    setFilterName('');
  };

  // 설정 데이터
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 미디어 데이터
  const [media, setMedia] = useState<MediaData | null>(null);
  const [mediaSaveStatus, setMediaSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 페이지 콘텐츠 데이터
  const [pages, setPages] = useState<PageContent | null>(null);
  const [pageSaveStatus, setPageSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 인증 체크
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // 데이터 로드
  useEffect(() => {
    if (isAuthenticated) {
      fetchApartments();
      fetchSettings();
      fetchMedia();
      fetchPages();
    }
  }, [isAuthenticated]);

  const fetchApartments = async () => {
    try {
      const response = await fetch('/api/apartments');
      const data = await response.json();
      setApartments(data || []);
    } catch (error) {
      console.error('아파트 데이터 로드 실패:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      }
    } catch (error) {
      console.error('미디어 로드 실패:', error);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('페이지 콘텐츠 로드 실패:', error);
    }
  };

  const saveMedia = async () => {
    if (!media) return;
    setMediaSaveStatus('saving');
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(media),
      });
      if (response.ok) {
        setMediaSaveStatus('saved');
        setTimeout(() => setMediaSaveStatus('idle'), 2000);
      } else {
        setMediaSaveStatus('error');
      }
    } catch {
      setMediaSaveStatus('error');
    }
  };

  const savePages = async () => {
    if (!pages) return;
    setPageSaveStatus('saving');
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: pages }),
      });
      if (response.ok) {
        setPageSaveStatus('saved');
        setTimeout(() => setPageSaveStatus('idle'), 2000);
      } else {
        setPageSaveStatus('error');
      }
    } catch {
      setPageSaveStatus('error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  // Excel 업로드
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

      const newApartments: Apartment[] = jsonData.map((row, index) => ({
        id: Date.now() + index,
        name: String(row['아파트명'] || row['name'] || ''),
        address: String(row['주소'] || row['address'] || ''),
        lat: parseFloat(String(row['위도'] || row['lat'] || 37.7134)),
        lng: parseFloat(String(row['경도'] || row['lng'] || 126.7550)),
        units: parseInt(String(row['세대수'] || row['units'] || 0)),
        buildings: parseInt(String(row['동수'] || row['buildings'] || 0)),
        price: {
          mirror: parseInt(String(row['거울광고'] || row['mirror'] || 0)),
          board: parseInt(String(row['게시판광고'] || row['board'] || 0)),
          elevator: parseInt(String(row['엘리베이터광고'] || row['elevator'] || 0)),
        },
      }));

      setApartments(newApartments);
      await saveApartments(newApartments);
      setMessage({ type: 'success', text: `${newApartments.length}개의 아파트 데이터를 불러왔습니다.` });
    } catch {
      setMessage({ type: 'error', text: '엑셀 파일을 읽는 중 오류가 발생했습니다.' });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveApartments = async (data: Apartment[]) => {
    try {
      await fetch('/api/apartments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error('저장 실패:', e);
    }
  };

  // Excel 다운로드
  const handleDownload = () => {
    try {
      const exportData = apartments.length > 0
        ? apartments.map((apt) => ({
            '아파트명': apt.name,
            '주소': apt.address,
            '위도': apt.lat,
            '경도': apt.lng,
            '세대수': apt.units,
            '동수': apt.buildings,
            '거울광고': apt.price.mirror,
            '게시판광고': apt.price.board,
            '엘리베이터광고': apt.price.elevator,
          }))
        : [{
            '아파트명': '예시 아파트',
            '주소': '경기도 파주시 목동동 123',
            '위도': 37.7134,
            '경도': 126.7575,
            '세대수': 1000,
            '동수': 10,
            '거울광고': 50000,
            '게시판광고': 30000,
            '엘리베이터광고': 80000,
          }];

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '아파트목록');

      // Blob으로 변환하여 다운로드 (더 안정적)
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '아파트목록.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Excel 파일이 다운로드되었습니다.' });
    } catch (error) {
      console.error('다운로드 오류:', error);
      setMessage({ type: 'error', text: 'Excel 다운로드 중 오류가 발생했습니다.' });
    }
  };

  const deleteApartment = async (id: number) => {
    const updated = apartments.filter((apt) => apt.id !== id);
    setApartments(updated);
    await saveApartments(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const tabs = [
    { id: 'pages' as TabType, label: '비주얼 편집', icon: FileText },
    { id: 'media' as TabType, label: '미디어 관리', icon: Image },
    { id: 'settings' as TabType, label: '기본 설정', icon: Settings },
    { id: 'api' as TabType, label: 'API 설정', icon: Key },
    { id: 'email' as TabType, label: '이메일 설정', icon: Mail },
    { id: 'domain' as TabType, label: '도메인', icon: Globe },
    { id: 'apartments' as TabType, label: '아파트 관리', icon: Building2 },
    { id: 'analytics' as TabType, label: '분석', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 - 사이트 네비게이션 (클릭시 해당 페이지 편집으로 이동) */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">관리자 페이지</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 메시지 */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* 아파트 관리 탭 */}
        {activeTab === 'apartments' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <Upload size={18} />
                Excel 업로드
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
              </label>
              <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Download size={18} />
                Excel 다운로드
              </button>
              <a href="/map" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <MapPin size={18} />
                지도 보기
              </a>
            </div>

            {/* 지역 필터 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700">지역 필터:</span>

                {/* 도/광역시 선택 */}
                <select
                  value={filterDo}
                  onChange={(e) => {
                    setFilterDo(e.target.value);
                    setFilterSi('');
                    setFilterGu('');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">전체 (도/광역시)</option>
                  {uniqueDos.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* 시/군 선택 */}
                <select
                  value={filterSi}
                  onChange={(e) => {
                    setFilterSi(e.target.value);
                    setFilterGu('');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  disabled={!filterDo && uniqueSis.length === 0}
                >
                  <option value="">전체 (시/군)</option>
                  {uniqueSis.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {/* 구/동 선택 */}
                <select
                  value={filterGu}
                  onChange={(e) => setFilterGu(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  disabled={!filterSi && uniqueGus.length === 0}
                >
                  <option value="">전체 (구/동)</option>
                  {uniqueGus.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                {/* 아파트명 검색 */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="아파트명 검색..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* 필터 초기화 */}
                {(filterDo || filterSi || filterGu || filterName) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                    초기화
                  </button>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              {filterDo || filterSi || filterGu || filterName ? (
                <>필터 결과: <span className="font-medium text-green-600">{filteredApartments.length}개</span> / 전체 {apartments.length}개 아파트</>
              ) : (
                <>총 {apartments.length}개 아파트</>
              )}
            </div>

            {apartments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileSpreadsheet size={40} className="mx-auto mb-4 opacity-50" />
                <p>등록된 아파트가 없습니다.</p>
              </div>
            ) : filteredApartments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Search size={40} className="mx-auto mb-4 opacity-50" />
                <p>검색 결과가 없습니다.</p>
                <button onClick={resetFilters} className="mt-2 text-green-500 hover:underline">
                  필터 초기화
                </button>
              </div>
            ) : (
              <>
                {/* 데스크톱 테이블 */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">아파트명</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">주소</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">세대수</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">거울광고</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">게시판</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">EV</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">삭제</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredApartments.slice(0, 50).map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{apt.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{apt.address}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{apt.units}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{apt.price.mirror.toLocaleString()}원</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{apt.price.board.toLocaleString()}원</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{apt.price.elevator.toLocaleString()}원</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => deleteApartment(apt.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredApartments.length > 50 && (
                    <p className="text-sm text-gray-400 text-center mt-4">
                      상위 50개만 표시 중 (총 {filteredApartments.length}개)
                    </p>
                  )}
                </div>

                {/* 모바일 카드 */}
                <div className="md:hidden space-y-3">
                  {filteredApartments.slice(0, 20).map((apt) => (
                    <div key={apt.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{apt.name}</h3>
                        <button onClick={() => deleteApartment(apt.id)} className="text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{apt.address}</p>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>{apt.units}세대</span>
                        <span>거울 {apt.price.mirror.toLocaleString()}원</span>
                      </div>
                    </div>
                  ))}
                  {filteredApartments.length > 20 && (
                    <p className="text-sm text-gray-400 text-center">
                      상위 20개만 표시 중 (총 {filteredApartments.length}개)
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* 미디어 관리 탭 */}
        {activeTab === 'media' && media && (
          <div className="space-y-4">
            {/* 미디어 서브탭 네비게이션 */}
            <div className="bg-white rounded-xl shadow-sm p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'hero' as MediaSubTab, label: '히어로 섹션', color: 'green' },
                  { id: 'services' as MediaSubTab, label: '서비스', color: 'blue' },
                  { id: 'reviews' as MediaSubTab, label: '리뷰 영상/이미지', color: 'purple' },
                  { id: 'portfolio' as MediaSubTab, label: '포트폴리오', color: 'orange' },
                  { id: 'logo' as MediaSubTab, label: '로고/파비콘', color: 'gray' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMediaSubTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      mediaSubTab === tab.id
                        ? `bg-${tab.color}-500 text-white`
                        : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                    }`}
                    style={mediaSubTab === tab.id ? {
                      backgroundColor: tab.color === 'green' ? '#22c55e' :
                                       tab.color === 'blue' ? '#3b82f6' :
                                       tab.color === 'purple' ? '#a855f7' :
                                       tab.color === 'orange' ? '#f97316' : '#6b7280'
                    } : {}}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* 히어로 섹션 */}
              {mediaSubTab === 'hero' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Image size={20} className="text-green-500" />
                    히어로 섹션 관리
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">메인 페이지 상단의 히어로 영역을 관리합니다.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">배경 이미지 URL</label>
                      <input
                        type="text"
                        value={media.hero.backgroundImage}
                        onChange={(e) => setMedia({ ...media, hero: { ...media.hero, backgroundImage: e.target.value } })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
                        placeholder="/images/background.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">메인 타이틀</label>
                      <input
                        type="text"
                        value={media.hero.title}
                        onChange={(e) => setMedia({ ...media, hero: { ...media.hero, title: e.target.value } })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">서브 타이틀</label>
                      <input
                        type="text"
                        value={media.hero.subtitle}
                        onChange={(e) => setMedia({ ...media, hero: { ...media.hero, subtitle: e.target.value } })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 서비스 섹션 */}
              {mediaSubTab === 'services' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Image size={20} className="text-blue-500" />
                    서비스 섹션 관리
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">메인 페이지의 서비스 소개 영역을 관리합니다. (현재 {media.services.length}개)</p>
                  <div className="space-y-4">
                    {media.services.map((service, index) => (
                      <div key={service.id} className="p-4 bg-blue-50 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-blue-700">서비스 {index + 1}</span>
                          <button
                            onClick={() => {
                              const updated = media.services.filter((_, i) => i !== index);
                              setMedia({ ...media, services: updated });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updated = [...media.services];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setMedia({ ...media, services: updated });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="서비스 타이틀"
                        />
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) => {
                            const updated = [...media.services];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setMedia({ ...media, services: updated });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="서비스 설명"
                        />
                        <input
                          type="text"
                          value={service.image}
                          onChange={(e) => {
                            const updated = [...media.services];
                            updated[index] = { ...updated[index], image: e.target.value };
                            setMedia({ ...media, services: updated });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="이미지 URL"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newService = {
                          id: `service-${Date.now()}`,
                          title: '새 서비스',
                          description: '서비스 설명',
                          image: '/images/service.jpg',
                        };
                        setMedia({ ...media, services: [...media.services, newService] });
                      }}
                      className="flex items-center gap-2 px-4 py-3 text-blue-600 hover:text-blue-700 border-2 border-dashed border-blue-300 rounded-lg w-full justify-center"
                    >
                      <Plus size={18} />
                      서비스 추가
                    </button>
                  </div>
                </div>
              )}

              {/* 리뷰 미디어 섹션 */}
              {mediaSubTab === 'reviews' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Video size={20} className="text-purple-500" />
                    리뷰 영상/이미지 관리
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    고객 리뷰 섹션의 영상 또는 이미지 슬라이드를 관리합니다. (현재 {media.reviews.length}개)
                    <br />각 리뷰마다 영상 링크 또는 이미지 슬라이드 중 선택할 수 있습니다.
                  </p>
                  <div className="space-y-6">
                    {media.reviews.map((review, index) => (
                      <div key={review.id} className="p-5 bg-purple-50 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-purple-700">리뷰 {index + 1}: {review.title}</span>
                          <button
                            onClick={() => {
                              const updated = media.reviews.filter((_, i) => i !== index);
                              setMedia({ ...media, reviews: updated });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={review.title}
                          onChange={(e) => {
                            const updated = [...media.reviews];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setMedia({ ...media, reviews: updated });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                          placeholder="리뷰 타이틀 (예: 부동산 리뷰)"
                        />

                        {/* 미디어 타입 선택 */}
                        <div className="flex gap-4 p-3 bg-white rounded-lg">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`mediaType-${review.id}`}
                              checked={review.mediaType === 'video'}
                              onChange={() => {
                                const updated = [...media.reviews];
                                updated[index] = { ...updated[index], mediaType: 'video' };
                                setMedia({ ...media, reviews: updated });
                              }}
                              className="w-4 h-4 text-purple-600"
                            />
                            <Video size={18} className="text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">영상 링크</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`mediaType-${review.id}`}
                              checked={review.mediaType === 'slideshow'}
                              onChange={() => {
                                const updated = [...media.reviews];
                                updated[index] = { ...updated[index], mediaType: 'slideshow' };
                                setMedia({ ...media, reviews: updated });
                              }}
                              className="w-4 h-4 text-purple-600"
                            />
                            <Image size={18} className="text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">이미지 슬라이드</span>
                          </label>
                        </div>

                        {/* 영상 모드 */}
                        {review.mediaType === 'video' && (
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">영상 URL (mp4, YouTube 링크 등)</label>
                            <input
                              type="text"
                              value={review.videoUrl || ''}
                              onChange={(e) => {
                                const updated = [...media.reviews];
                                updated[index] = { ...updated[index], videoUrl: e.target.value };
                                setMedia({ ...media, reviews: updated });
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                              placeholder="https://youtube.com/... 또는 /images/video.mp4"
                            />
                          </div>
                        )}

                        {/* 이미지 슬라이드 모드 */}
                        {review.mediaType === 'slideshow' && (
                          <div className="space-y-3">
                            <label className="text-xs font-medium text-gray-600">이미지 URL 목록</label>
                            {(review.images || []).map((img, imgIndex) => (
                              <div key={imgIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={img}
                                  onChange={(e) => {
                                    const updated = [...media.reviews];
                                    const newImages = [...(updated[index].images || [])];
                                    newImages[imgIndex] = e.target.value;
                                    updated[index] = { ...updated[index], images: newImages };
                                    setMedia({ ...media, reviews: updated });
                                  }}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                                  placeholder={`이미지 ${imgIndex + 1} URL`}
                                />
                                <button
                                  onClick={() => {
                                    const updated = [...media.reviews];
                                    const newImages = (updated[index].images || []).filter((_, i) => i !== imgIndex);
                                    updated[index] = { ...updated[index], images: newImages };
                                    setMedia({ ...media, reviews: updated });
                                  }}
                                  className="px-3 py-2 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const updated = [...media.reviews];
                                const newImages = [...(updated[index].images || []), ''];
                                updated[index] = { ...updated[index], images: newImages };
                                setMedia({ ...media, reviews: updated });
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 text-sm border border-dashed border-blue-300 rounded-lg"
                            >
                              <Plus size={14} />
                              이미지 추가
                            </button>
                          </div>
                        )}

                        {/* 말풍선 & 캡션 */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">말풍선 텍스트 (리뷰 내용)</label>
                          <textarea
                            value={review.speechBubble || ''}
                            onChange={(e) => {
                              const updated = [...media.reviews];
                              updated[index] = { ...updated[index], speechBubble: e.target.value };
                              setMedia({ ...media, reviews: updated });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                            placeholder="고객 리뷰 내용..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">캡션 (하단 설명)</label>
                          <input
                            type="text"
                            value={review.caption || ''}
                            onChange={(e) => {
                              const updated = [...media.reviews];
                              updated[index] = { ...updated[index], caption: e.target.value };
                              setMedia({ ...media, reviews: updated });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                            placeholder="예: 우리 동네에서 제일 바쁜 ○○부동산 사장님"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newReview = {
                          id: `review-${Date.now()}`,
                          title: '새 리뷰',
                          mediaType: 'video' as const,
                          videoUrl: '',
                          images: [] as string[],
                          speechBubble: '',
                          caption: '',
                        };
                        setMedia({ ...media, reviews: [...media.reviews, newReview] });
                      }}
                      className="flex items-center gap-2 px-4 py-3 text-purple-600 hover:text-purple-700 border-2 border-dashed border-purple-300 rounded-lg w-full justify-center"
                    >
                      <Plus size={18} />
                      리뷰 추가
                    </button>
                  </div>
                </div>
              )}

              {/* 포트폴리오 섹션 */}
              {mediaSubTab === 'portfolio' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Image size={20} className="text-orange-500" />
                    포트폴리오 관리
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">포트폴리오 섹션의 이미지들을 관리합니다. (현재 {media.portfolio.length}개)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {media.portfolio.map((item, index) => (
                      <div key={item.id} className="p-4 bg-orange-50 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-orange-700">포트폴리오 {index + 1}</span>
                          <button
                            onClick={() => {
                              const updated = media.portfolio.filter((_, i) => i !== index);
                              setMedia({ ...media, portfolio: updated });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...media.portfolio];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setMedia({ ...media, portfolio: updated });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                          placeholder="포트폴리오 타이틀"
                        />
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => {
                            const updated = [...media.portfolio];
                            updated[index] = { ...updated[index], image: e.target.value };
                            setMedia({ ...media, portfolio: updated });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                          placeholder="이미지 URL"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const newItem = {
                        id: `portfolio-${Date.now()}`,
                        title: '새 포트폴리오',
                        image: '/images/portfolio.jpg',
                      };
                      setMedia({ ...media, portfolio: [...media.portfolio, newItem] });
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-orange-600 hover:text-orange-700 border-2 border-dashed border-orange-300 rounded-lg w-full justify-center mt-4"
                  >
                    <Plus size={18} />
                    포트폴리오 추가
                  </button>
                </div>
              )}

              {/* 로고 및 파비콘 */}
              {mediaSubTab === 'logo' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Image size={20} className="text-gray-500" />
                    로고 및 파비콘 관리
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">사이트 로고와 파비콘을 관리합니다.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">로고 이미지 URL</label>
                      <input
                        type="text"
                        value={media.logo}
                        onChange={(e) => setMedia({ ...media, logo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-900"
                        placeholder="/images/logo.png"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">파비콘 URL</label>
                      <input
                        type="text"
                        value={media.favicon}
                        onChange={(e) => setMedia({ ...media, favicon: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-900"
                        placeholder="/favicon.ico"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 저장 버튼 - 항상 표시 */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={saveMedia}
                  disabled={mediaSaveStatus === 'saving'}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {mediaSaveStatus === 'saving' ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  {mediaSaveStatus === 'saved' ? '저장됨!' : mediaSaveStatus === 'error' ? '저장 실패' : '변경사항 저장하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 페이지 콘텐츠 탭 - 비주얼 에디터 (전체 너비) */}
        {activeTab === 'pages' && pages && (
          <div className="space-y-4">
            {/* 페이지 선택 탭 */}
            <div>
              <div className="bg-white rounded-xl shadow-sm p-2">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'header' as PageSubTab, label: '헤더', icon: LayoutTemplate, color: '#1f2937' },
                    { id: 'footer' as PageSubTab, label: '푸터', icon: PanelBottom, color: '#374151' },
                    { id: 'home' as PageSubTab, label: '홈', icon: Home, color: '#22c55e' },
                    { id: 'services' as PageSubTab, label: '광고솔루션', icon: Briefcase, color: '#3b82f6' },
                    { id: 'info' as PageSubTab, label: '회사소개', icon: Info, color: '#8b5cf6' },
                    { id: 'warehouse' as PageSubTab, label: '막사창고', icon: Warehouse, color: '#f97316' },
                    { id: 'faq' as PageSubTab, label: 'FAQ', icon: HelpCircle, color: '#ec4899' },
                    { id: 'contact' as PageSubTab, label: '문의하기', icon: Phone, color: '#06b6d4' },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setPageSubTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          pageSubTab === tab.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={pageSubTab === tab.id ? { backgroundColor: tab.color } : {}}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 비주얼 페이지 에디터 - 전체 화면 너비 */}
            <VisualPageEditor
              pages={pages}
              currentPage={pageSubTab}
              onUpdate={setPages}
              onSave={savePages}
              saveStatus={pageSaveStatus}
            />
          </div>
        )}

        {/* 기본 설정 탭 */}
        {activeTab === 'settings' && settings && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">기본 설정</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">관리자 비밀번호</label>
                <input type="password" value={settings.adminPassword} onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">회사명</label>
                <input type="text" value={settings.companyInfo.name} onChange={(e) => setSettings({ ...settings, companyInfo: { ...settings.companyInfo, name: e.target.value } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <input type="text" value={settings.companyInfo.phone} onChange={(e) => setSettings({ ...settings, companyInfo: { ...settings.companyInfo, phone: e.target.value } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input type="email" value={settings.companyInfo.email} onChange={(e) => setSettings({ ...settings, companyInfo: { ...settings.companyInfo, email: e.target.value } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                <input type="text" value={settings.companyInfo.address} onChange={(e) => setSettings({ ...settings, companyInfo: { ...settings.companyInfo, address: e.target.value } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" />
              </div>
              <button onClick={saveSettings} disabled={saveStatus === 'saving'} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                {saveStatus === 'saving' ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {saveStatus === 'saved' ? '저장됨!' : '저장하기'}
              </button>
            </div>
          </div>
        )}

        {/* API 설정 탭 */}
        {activeTab === 'api' && settings && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">API 설정</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카카오맵 API 키</label>
                <input type="text" value={settings.kakaoMapApiKey} onChange={(e) => setSettings({ ...settings, kakaoMapApiKey: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 font-mono text-sm" placeholder="카카오 개발자 콘솔에서 발급받은 JavaScript 키" />
                <p className="mt-2 text-sm text-gray-500">
                  <a href="https://developers.kakao.com/console/app" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">카카오 개발자 콘솔</a>에서 앱을 생성하고 JavaScript 키를 발급받으세요.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                <input type="text" value={settings.googleAnalyticsId} onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 font-mono text-sm" placeholder="G-XXXXXXXXXX" />
                <p className="mt-2 text-sm text-gray-500">Google Analytics 4의 측정 ID를 입력하세요.</p>
              </div>
              <button onClick={saveSettings} disabled={saveStatus === 'saving'} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                {saveStatus === 'saving' ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {saveStatus === 'saved' ? '저장됨!' : '저장하기'}
              </button>
            </div>
          </div>
        )}

        {/* 이메일 설정 탭 */}
        {activeTab === 'email' && settings && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">이메일 설정 (SMTP)</h2>
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">문의 폼에서 이메일을 발송하려면 SMTP 설정이 필요합니다.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">수신 이메일 주소</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" placeholder="문의 메일을 받을 이메일 주소" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 호스트</label>
                <input type="text" value={settings.smtp.host} onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, host: e.target.value } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" placeholder="smtp.naver.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 포트</label>
                <input type="number" value={settings.smtp.port} onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, port: parseInt(e.target.value) } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" placeholder="587" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 사용자명</label>
                <input type="text" value={settings.smtp.user} onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, user: e.target.value } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" placeholder="your-email@naver.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 비밀번호</label>
                <input type="password" value={settings.smtp.password} onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, password: e.target.value } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" placeholder="앱 비밀번호" />
              </div>
              <button onClick={saveSettings} disabled={saveStatus === 'saving'} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                {saveStatus === 'saving' ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {saveStatus === 'saved' ? '저장됨!' : '저장하기'}
              </button>
            </div>
          </div>
        )}

        {/* 도메인 설정 탭 */}
        {activeTab === 'domain' && settings && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">커스텀 도메인 설정</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">커스텀 도메인</label>
                <input type="text" value={settings.customDomain} onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900" placeholder="www.example.com" />
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-3">Vercel 도메인 연결 방법</h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li><a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Vercel 대시보드</a>에 로그인합니다.</li>
                  <li>프로젝트 선택 → Settings → Domains로 이동합니다.</li>
                  <li>도메인을 입력하고 Add를 클릭합니다.</li>
                  <li>표시되는 DNS 레코드를 도메인 등록 업체에서 설정합니다:
                    <ul className="mt-2 ml-4 space-y-1">
                      <li>• A 레코드: 76.76.19.19</li>
                      <li>• CNAME 레코드: cname.vercel-dns.com</li>
                    </ul>
                  </li>
                  <li>DNS 전파까지 최대 48시간이 소요될 수 있습니다.</li>
                </ol>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">현재 배포 URL</h3>
                <a href="https://unclemanse-new.vercel.app" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">https://unclemanse-new.vercel.app</a>
              </div>
              <button onClick={saveSettings} disabled={saveStatus === 'saving'} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                {saveStatus === 'saving' ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {saveStatus === 'saved' ? '저장됨!' : '저장하기'}
              </button>
            </div>
          </div>
        )}

        {/* 분석 탭 */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">분석 및 통계</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-600">{apartments.length}</div>
                <div className="text-gray-600 mt-1">등록된 아파트</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600">{apartments.reduce((sum, apt) => sum + apt.units, 0).toLocaleString()}</div>
                <div className="text-gray-600 mt-1">총 세대수</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-purple-600">{apartments.reduce((sum, apt) => sum + apt.buildings, 0).toLocaleString()}</div>
                <div className="text-gray-600 mt-1">총 동수</div>
              </div>
            </div>
            {settings?.googleAnalyticsId ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">Google Analytics가 연결되어 있습니다. (ID: {settings.googleAnalyticsId})</p>
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm mt-2 inline-block">Google Analytics 대시보드 열기 →</a>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">Google Analytics가 설정되지 않았습니다. API 설정에서 GA ID를 입력하세요.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
