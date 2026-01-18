'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Kakao Maps SDK doesn't have official TypeScript definitions

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Building2, MapPin, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';

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

declare global {
  interface Window {
    kakao: any; // Kakao Maps SDK - no official TypeScript definitions
  }
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentArea] = useState('파주시');
  const [apartmentCount, setApartmentCount] = useState(0);
  const overlaysRef = useRef<any[]>([]);
  const clustererRef = useRef<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allApartments, setAllApartments] = useState<Apartment[]>([]);
  const [zoomLevel, setZoomLevel] = useState(6);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [filters, setFilters] = useState({
    minUnits: '',
    minYear: '',
    types: ['all'] as string[],
  });
  const [kakaoApiKey, setKakaoApiKey] = useState<string>('');

  // 설정에서 카카오 API 키 가져오기
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/settings/public');
        const data = await response.json();
        if (data.kakaoMapApiKey) {
          setKakaoApiKey(data.kakaoMapApiKey);
        }
      } catch (error) {
        console.error('Failed to fetch API key:', error);
        // 환경변수 폴백
        if (process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY) {
          setKakaoApiKey(process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY);
        }
      }
    };
    fetchApiKey();
  }, []);

  // API에서 아파트 데이터 가져오기
  useEffect(() => {
    const fetchApartments = async () => {
      setIsDataLoading(true);
      try {
        const response = await fetch('/api/apartments');
        const data = await response.json();
        if (data && data.length > 0) {
          setAllApartments(data);
          setApartments(data);
          setApartmentCount(data.length);
        } else {
          // 데이터가 없으면 시드 데이터 로드
          const seedResponse = await fetch('/api/apartments/seed', { method: 'POST' });
          const seedResult = await seedResponse.json();
          if (seedResult.success) {
            // 시드 후 다시 데이터 가져오기
            const newResponse = await fetch('/api/apartments');
            const newData = await newResponse.json();
            if (newData && newData.length > 0) {
              setAllApartments(newData);
              setApartments(newData);
              setApartmentCount(newData.length);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching apartments:', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchApartments();
  }, []);

  // 필터 적용 함수
  const applyFilters = () => {
    let filtered = [...allApartments];

    // 세대수 필터
    if (filters.minUnits && parseInt(filters.minUnits) > 0) {
      filtered = filtered.filter(apt => apt.units >= parseInt(filters.minUnits));
    }

    // 타입 필터 (all이 선택되어 있으면 모두 표시)
    if (!filters.types.includes('all') && filters.types.length > 0) {
      // 현재는 모든 데이터가 아파트이므로 타입 필터는 나중에 확장 가능
    }

    setApartments(filtered);
    setApartmentCount(filtered.length);
    setIsFilterOpen(false);
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    setFilters({
      minUnits: '',
      minYear: '',
      types: ['all'],
    });
    setApartments(allApartments);
    setApartmentCount(allApartments.length);
  };

  // 타입 체크박스 핸들러
  const handleTypeChange = (type: string) => {
    if (type === 'all') {
      setFilters({ ...filters, types: ['all'] });
    } else {
      let newTypes = filters.types.filter(t => t !== 'all');
      if (newTypes.includes(type)) {
        newTypes = newTypes.filter(t => t !== type);
      } else {
        newTypes.push(type);
      }
      if (newTypes.length === 0) {
        newTypes = ['all'];
      }
      setFilters({ ...filters, types: newTypes });
    }
  };

  const [scriptReady, setScriptReady] = useState(false);

  // 스크립트 로드 완료 시 호출
  const onKakaoScriptLoad = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setScriptReady(true);
      });
    }
  };

  // 스크립트 준비 완료 시 지도 초기화
  useEffect(() => {
    if (scriptReady) {
      if (mapRef.current && window.kakao && window.kakao.maps) {
        const options = {
          center: new window.kakao.maps.LatLng(37.7134, 126.7550),
          level: 6,
        };
        const newMap = new window.kakao.maps.Map(mapRef.current, options);
        setMap(newMap);
        setIsMapLoaded(true);

        window.kakao.maps.event.addListener(newMap, 'zoom_changed', () => {
          const level = newMap.getLevel();
          setZoomLevel(level);
        });
      }
    }
  }, [scriptReady]);

  // 줌 레벨에 따라 마커 표시 방식 변경
  const updateMarkerDisplay = (currentMap: any, currentZoom: number) => {
    if (!currentMap || !window.kakao) return;

    // 기존 오버레이 제거
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current = [];

    // 클러스터러 제거
    if (clustererRef.current) {
      clustererRef.current.clear();
    }

    // 줌인 상태 (레벨 5 이하): 아파트 이름과 가격 표시
    if (currentZoom <= 5) {
      apartments.forEach((apt) => {
        const markerPosition = new window.kakao.maps.LatLng(apt.lat, apt.lng);

        const content = document.createElement('div');
        content.innerHTML = `
          <div style="
            position: relative;
            cursor: pointer;
          ">
            <div style="
              background: white;
              padding: 12px 20px;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.1);
              white-space: nowrap;
              min-width: 120px;
              text-align: center;
              border: 1px solid rgba(0,0,0,0.08);
            ">
              <div style="font-size: 13px; color: #555; margin-bottom: 6px; font-weight: 500;">${apt.name}</div>
              <div style="color: #000; font-weight: 800; font-size: 18px;">${apt.price.mirror.toLocaleString()}원</div>
            </div>
            <div style="
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 10px solid transparent;
              border-right: 10px solid transparent;
              border-top: 12px solid white;
              filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
            "></div>
          </div>
        `;

        content.onclick = () => {
          setSelectedApartment(apt);
        };

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          yAnchor: 1.4,
        });

        customOverlay.setMap(currentMap);
        overlaysRef.current.push(customOverlay);
      });
    } else {
      // 줌아웃 상태 (레벨 6 이상): 초록색 원으로 표시
      apartments.forEach((apt) => {
        const markerPosition = new window.kakao.maps.LatLng(apt.lat, apt.lng);

        const content = document.createElement('div');
        content.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: rgba(34, 197, 94, 0.9);
            border-radius: 50%;
            color: #fff;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            line-height: 40px;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          ">1</div>
        `;

        content.onclick = () => {
          setSelectedApartment(apt);
        };

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          yAnchor: 0.5,
        });

        customOverlay.setMap(currentMap);
        overlaysRef.current.push(customOverlay);
      });
    }
  };

  // 아파트 데이터가 변경되면 마커 다시 그리기
  useEffect(() => {
    if (map && window.kakao) {
      updateMarkerDisplay(map, zoomLevel);
      setApartmentCount(apartments.length);
    }
  }, [apartments, map, zoomLevel]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = apartments.find(apt =>
      apt.name.includes(searchTerm) || apt.address.includes(searchTerm)
    );
    if (found && map) {
      const moveLatLng = new window.kakao.maps.LatLng(found.lat, found.lng);
      map.setCenter(moveLatLng);
      map.setLevel(3);
      setSelectedApartment(found);
    }
  };

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 overflow-hidden">
      {/* 카카오맵 스크립트 - API 키가 있을 때만 로드 */}
      {kakaoApiKey && (
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=clusterer`}
          strategy="afterInteractive"
          onLoad={onKakaoScriptLoad}
        />
      )}

      {/* 전체 화면 지도 */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {/* 로딩 */}
      {(!isMapLoaded || isDataLoading || !kakaoApiKey) && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">
              {!kakaoApiKey ? '설정을 불러오는 중...' : !isMapLoaded ? '지도를 불러오는 중...' : '아파트 데이터를 불러오는 중...'}
            </p>
          </div>
        </div>
      )}

      {/* 상단 검색바 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4">
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              placeholder="지역명, 아파트명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-5 pr-12 py-4 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <Search size={20} className="text-white" />
            </button>
          </form>
          {/* 필터 버튼 */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-5 py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors font-medium"
          >
            <SlidersHorizontal size={18} />
            <span>필터</span>
          </button>
        </div>
      </div>

      {/* 좌측 하단 지역 정보 */}
      <div className="absolute bottom-6 left-4 z-20 bg-white rounded-xl shadow-lg px-5 py-4">
        <div className="flex items-center gap-3">
          <MapPin className="text-green-500" size={20} />
          <div>
            <span className="font-bold text-gray-900">{currentArea}</span>
            <span className="text-green-500 font-bold ml-2">{apartmentCount}개</span>
            <span className="text-gray-500">의 아파트</span>
          </div>
        </div>
      </div>

      {/* 우측 접이식 메뉴 */}
      <div className="absolute top-1/3 right-4 z-20">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-32">
          {/* 메뉴 헤더 - 클릭하면 열고 닫기 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full px-3 py-2 flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-700 text-xs tracking-wider">MENU</span>
            {isMenuOpen ? (
              <ChevronUp size={14} className="text-gray-400" />
            ) : (
              <ChevronDown size={14} className="text-gray-400" />
            )}
          </button>

          {/* 펼쳐지는 메뉴 내용 */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {/* 첫 번째 섹션 */}
                <div className="border-t border-gray-100 py-2">
                  <a href="/map" className="block px-2 py-1.5 text-center text-green-500 font-bold text-xs hover:bg-gray-50">
                    지도에서<br />확인하기
                  </a>
                  <a href="/services#board" className="block px-2 py-1.5 text-center text-gray-600 text-xs hover:bg-gray-50">
                    게시판 광고
                  </a>
                  <a href="/services#elevator" className="block px-2 py-1.5 text-center text-gray-600 text-xs hover:bg-gray-50">
                    EV 광고
                  </a>
                  <a href="/services#mirror" className="block px-2 py-1.5 text-center text-gray-600 text-xs hover:bg-gray-50">
                    우편함 광고
                  </a>
                  <a href="/portfolio" className="block px-2 py-1.5 text-center text-gray-600 text-xs hover:bg-gray-50">
                    우리동네 TV
                  </a>
                </div>

                {/* 두 번째 섹션 */}
                <div className="border-t border-gray-100 py-2">
                  <p className="px-2 py-1.5 text-center text-sky-500 font-bold text-xs">
                    인기 사이트
                  </p>
                  <Link href="/" className="block px-2 py-1.5 text-center text-gray-600 text-xs hover:bg-gray-50">
                    애드플랫 케어
                  </Link>
                  <a href="/contact" className="block px-2 py-1.5 text-center text-gray-600 text-xs hover:bg-gray-50">
                    애드플랫 축제
                  </a>
                </div>

                {/* 카카오톡 버튼 */}
                <div className="border-t border-gray-100 p-2">
                  <a
                    href="https://pf.kakao.com/_jQZHn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-yellow-400 text-yellow-900 rounded py-1.5 px-2 font-medium text-xs hover:bg-yellow-500 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 3C6.477 3 2 6.463 2 10.5c0 2.604 1.731 4.897 4.348 6.192-.192.717-.694 2.597-.794 3.003-.123.5.184.493.387.359.16-.106 2.544-1.727 3.571-2.427.476.065.966.1 1.465.1 5.523 0 10-3.463 10-7.5S17.523 3 12 3z"/>
                    </svg>
                    카카오톡
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 선택된 아파트 모달 */}
      <AnimatePresence>
        {selectedApartment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApartment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedApartment(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
              >
                <X size={18} className="text-gray-500" />
              </button>

              {/* 아이콘 */}
              <div className="pt-8 pb-4 flex justify-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Building2 size={40} className="text-gray-400" />
                </div>
              </div>

              {/* 정보 */}
              <div className="px-6 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {selectedApartment.name}
                </h2>
                <p className="text-gray-500 text-center text-sm mb-4">
                  {selectedApartment.address}
                </p>
                <div className="flex justify-center gap-1 text-sm mb-6">
                  <span className="text-green-600 font-medium">{selectedApartment.units}세대</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">{selectedApartment.buildings}동</span>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">거울광고</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedApartment.price.mirror.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">게시판광고</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedApartment.price.board.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">엘리베이터</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedApartment.price.elevator.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  <a
                    href="/contact"
                    className="block w-full py-4 bg-green-500 text-white text-center rounded-xl font-bold hover:bg-green-600 transition-colors"
                  >
                    광고 문의하기
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 필터 모달 */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="bg-green-500 px-6 py-4">
                <h3 className="text-white text-lg font-bold text-center">필터 설정</h3>
              </div>

              <div className="p-6">
                {/* 세대수 & 준공일 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* 세대수 */}
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">세대수</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={filters.minUnits}
                        onChange={(e) => setFilters({ ...filters, minUnits: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 text-center"
                        placeholder="0"
                      />
                      <span className="text-gray-500 text-sm ml-2 whitespace-nowrap">세대 이상</span>
                    </div>
                  </div>
                  {/* 준공일 */}
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">준공일</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={filters.minYear}
                        onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 text-center"
                        placeholder="2000"
                      />
                      <span className="text-gray-500 text-sm ml-2 whitespace-nowrap">년 이상</span>
                    </div>
                  </div>
                </div>

                {/* 구분 */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-3">구분</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: '전체' },
                      { value: 'apartment', label: '아파트' },
                      { value: 'mixed', label: '주상복합' },
                      { value: 'officetel', label: '빌딩/오피스텔' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleTypeChange(type.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          filters.types.includes(type.value)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 버튼들 */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={applyFilters}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                  >
                    필터 적용
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-5 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
