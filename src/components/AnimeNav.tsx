"use client"

import { usePathname } from "next/navigation"
import { Home, Megaphone, Info, Warehouse, HelpCircle, MapPin } from "lucide-react"
import { AnimeNavBar } from "@/components/ui/anime-navbar"

const navItems = [
  {
    name: "홈",
    url: "/",
    icon: Home,
  },
  {
    name: "광고솔루션",
    url: "/services",
    icon: Megaphone,
  },
  {
    name: "info",
    url: "/about",
    icon: Info,
  },
  {
    name: "막사창고",
    url: "/btob",
    icon: Warehouse,
  },
  {
    name: "자주 묻는 질문",
    url: "/faq",
    icon: HelpCircle,
  },
  {
    name: "지도검색",
    url: "/map",
    icon: MapPin,
  },
]

const logoUrl = "/images/unclelogo.png"

export default function AnimeNav() {
  const pathname = usePathname()

  // 관리자 페이지에서는 네비게이션 숨김
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return <AnimeNavBar items={navItems} defaultActive="홈" logo={logoUrl} />
}
