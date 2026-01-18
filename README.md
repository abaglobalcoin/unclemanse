# 엉클만세 웹사이트

아파트 광고 서비스 플랫폼 - Next.js 기반

---

## 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [설치 방법](#설치-방법)
3. [실행 방법](#실행-방법)
4. [관리자 페이지 사용법](#관리자-페이지-사용법)
5. [프로젝트 구조](#프로젝트-구조)
6. [환경 변수 설정](#환경-변수-설정)
7. [배포 방법](#배포-방법)
8. [주요 기능](#주요-기능)
9. [문제 해결](#문제-해결)

---

## 시스템 요구사항

| 항목 | 최소 요구사항 |
|------|-------------|
| Node.js | 18.0.0 이상 |
| npm | 9.0.0 이상 |
| 메모리 | 4GB 이상 권장 |

### Node.js 설치

**Windows/Mac**: https://nodejs.org/ 에서 LTS 버전 다운로드

**버전 확인**:
```bash
node --version  # v18.0.0 이상 출력되어야 함
npm --version   # 9.0.0 이상 출력되어야 함
```

---

## 설치 방법

### 1단계: 압축 해제
```bash
unzip unclemanse-delivery.zip
cd unclemanse-new
```

### 2단계: 패키지 설치
```bash
npm install
```
> 약 1~3분 소요됩니다.

### 3단계: 환경 변수 설정
```bash
cp .env.example .env.local
```

---

## 실행 방법

### 개발 모드 (로컬 테스트)
```bash
npm run dev
```
- 브라우저에서 http://localhost:3000 접속
- 코드 수정 시 자동 새로고침

### 프로덕션 모드 (실제 서비스)
```bash
npm run build   # 빌드 (최초 1회 또는 코드 변경 시)
npm start       # 서버 시작
```
- 브라우저에서 http://localhost:3000 접속

---

## 관리자 페이지 사용법

### 접속 정보

| 항목 | 값 |
|------|-----|
| URL | http://localhost:3000/admin |
| 비밀번호 | `manse1217!` |

### 관리자 메뉴 구성

| 메뉴 | 기능 설명 |
|------|----------|
| **비주얼 편집** | 각 페이지의 텍스트, 이미지 등 콘텐츠 수정 |
| **미디어 관리** | 히어로 이미지, 서비스 이미지, 리뷰 영상 관리 |
| **기본 설정** | 회사명, 전화번호, 주소 등 기본 정보 |
| **API 설정** | 카카오맵 API 키, Google Analytics ID |
| **이메일 설정** | 문의 폼 이메일 수신 설정 |
| **도메인** | 사이트 도메인 설정 |
| **아파트 관리** | 아파트 데이터 등록/수정/삭제, Excel 업로드 |
| **분석** | 방문자 통계 확인 |

### 비주얼 편집 사용법

1. **비주얼 편집** 탭 클릭
2. 상단에서 편집할 페이지 선택 (홈, 회사소개, 서비스 등)
3. 수정하고 싶은 텍스트나 항목 클릭
4. 내용 수정
5. **저장** 버튼 클릭

### 아파트 관리 사용법

**Excel 업로드**:
1. **아파트 관리** 탭 클릭
2. **Excel 업로드** 버튼 클릭
3. 아파트 데이터가 포함된 Excel 파일 선택

**Excel 형식**:
| 아파트명 | 주소 | 위도 | 경도 | 세대수 | 동수 | 거울광고 | 게시판광고 | 엘리베이터광고 |
|---------|------|------|------|--------|------|---------|-----------|---------------|
| 운정힐스테이트 | 경기도 파주시 목동동 | 37.7134 | 126.7575 | 1250 | 15 | 50000 | 30000 | 80000 |

**지역 필터**:
- 도/광역시 선택 → 시/군 선택 → 구/동 선택
- 아파트명 검색 가능

### 비밀번호 변경

`.env.local` 파일 수정:
```
ADMIN_PASSWORD=새비밀번호입력
```

---

## 프로젝트 구조

```
unclemanse-new/
│
├── src/                        # 소스 코드
│   ├── app/                    # 페이지들
│   │   ├── page.tsx            # 메인(홈) 페이지
│   │   ├── about/              # 회사소개 페이지
│   │   ├── services/           # 서비스 소개 페이지
│   │   ├── portfolio/          # 포트폴리오 페이지
│   │   ├── btob/               # B2B (막사창고) 페이지
│   │   ├── blog/               # 블로그 페이지
│   │   ├── faq/                # 자주 묻는 질문 페이지
│   │   ├── contact/            # 문의하기 페이지
│   │   ├── map/                # 아파트 지도 페이지
│   │   ├── admin/              # 관리자 페이지
│   │   │   ├── page.tsx        # 관리자 메인
│   │   │   └── login/          # 관리자 로그인
│   │   └── api/                # API 엔드포인트
│   │       ├── apartments/     # 아파트 데이터 API
│   │       ├── pages/          # 페이지 콘텐츠 API
│   │       ├── settings/       # 설정 API
│   │       ├── media/          # 미디어 API
│   │       ├── contact/        # 문의 폼 API
│   │       └── auth/           # 인증 API
│   │
│   ├── components/             # 재사용 컴포넌트
│   │   ├── admin/              # 관리자용 컴포넌트
│   │   └── ui/                 # UI 컴포넌트
│   │
│   └── lib/                    # 유틸리티 함수
│
├── public/                     # 정적 파일
│   └── images/                 # 이미지, 영상 파일
│
├── data/                       # 데이터 저장소
│   ├── apartments.json         # 아파트 데이터
│   ├── settings.json           # 사이트 설정
│   ├── media.json              # 미디어 설정
│   └── pages.json              # 페이지 콘텐츠
│
├── .env.local                  # 환경 변수 (비공개)
├── .env.example                # 환경 변수 예시
├── package.json                # 프로젝트 설정
└── README.md                   # 이 문서
```

---

## 환경 변수 설정

`.env.local` 파일을 열어 아래 항목들을 설정하세요.

```bash
# ============================================
# 관리자 설정
# ============================================
ADMIN_PASSWORD=manse1217!

# ============================================
# 카카오맵 API (지도 기능)
# ============================================
# 발급 방법: https://developers.kakao.com/
# 1. 카카오 개발자 사이트 가입
# 2. 애플리케이션 추가
# 3. 앱 키 > JavaScript 키 복사
# 4. 플랫폼 > Web 사이트 도메인 등록
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_api_key

# ============================================
# Google Analytics (방문자 분석)
# ============================================
# 발급 방법: https://analytics.google.com/
# 1. 계정/속성 생성
# 2. 데이터 스트림 > 웹 선택
# 3. 측정 ID (G-XXXXXXXXXX) 복사
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ============================================
# 이메일 설정 (문의 폼)
# ============================================
# Gmail 사용 시 앱 비밀번호 필요
# 발급: Google 계정 > 보안 > 2단계 인증 > 앱 비밀번호
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=receive_email@example.com
```

---

## 배포 방법

### 방법 1: Vercel 배포 (권장, 무료)

1. https://vercel.com 가입
2. **New Project** 클릭
3. 프로젝트 폴더 업로드 또는 GitHub 연동
4. **Environment Variables**에 환경 변수 추가
5. **Deploy** 클릭

### 방법 2: 일반 서버 배포

```bash
# 1. 서버에 파일 업로드 후 설치
npm install

# 2. 빌드
npm run build

# 3. PM2로 서버 실행 (권장)
npm install -g pm2
pm2 start npm --name "unclemanse" -- start

# 4. 서버 재시작 시 자동 실행 설정
pm2 startup
pm2 save
```

### 방법 3: Docker 배포

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t unclemanse .
docker run -p 3000:3000 unclemanse
```

### 포트 변경

기본 포트(3000)를 변경하려면:
```bash
PORT=8080 npm start
```

---

## 주요 기능

### 사용자 페이지

| 페이지 | URL | 설명 |
|--------|-----|------|
| 홈 | `/` | 메인 랜딩 페이지 |
| 회사소개 | `/about` | 회사 소개 |
| 서비스 | `/services` | 광고 서비스 안내 |
| 포트폴리오 | `/portfolio` | 시공 사례 |
| 막사창고 | `/btob` | B2B 물품 공급 |
| 블로그 | `/blog` | 블로그/소식 |
| FAQ | `/faq` | 자주 묻는 질문 |
| 문의하기 | `/contact` | 문의 폼 |
| 아파트 지도 | `/map` | 아파트 위치 검색 |

### 반응형 디자인
- 데스크톱 (1024px 이상)
- 태블릿 (768px ~ 1023px)
- 모바일 (767px 이하)

### 아파트 지도 기능
- 카카오맵 연동
- 마커 클릭 시 상세 정보 표시
- 지역별/세대수별 필터링
- 아파트명 검색

### 문의 폼
- 이메일 자동 발송
- 입력값 검증
- 성공/실패 알림

---

## 문제 해결

### 1. npm install 오류

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 2. 포트 충돌 (이미 사용 중)

```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

### 3. 빌드 오류

```bash
# 빌드 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

### 4. 카카오맵이 안 보임

1. `.env.local`에 API 키가 올바르게 입력되었는지 확인
2. 카카오 개발자 사이트에서 도메인 등록 확인
   - 로컬: `http://localhost:3000`
   - 배포: 실제 도메인 주소

### 5. 관리자 로그인 안 됨

1. `.env.local`의 `ADMIN_PASSWORD` 확인
2. 서버 재시작:
   ```bash
   # 개발 모드
   Ctrl+C 로 종료 후 npm run dev

   # 프로덕션 모드
   pm2 restart unclemanse
   ```

### 6. 이미지/영상이 안 보임

- `public/images/` 폴더에 파일이 있는지 확인
- 파일명에 한글이나 특수문자가 있으면 영문으로 변경

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 애니메이션 | Framer Motion |
| 지도 | Kakao Maps SDK |
| 아이콘 | Lucide React |
| Excel 처리 | SheetJS (xlsx) |

---

## 연락처

기술 지원이 필요하시면 개발자에게 문의하세요.

---

**버전**: 1.0.0
**최종 업데이트**: 2025년 1월
