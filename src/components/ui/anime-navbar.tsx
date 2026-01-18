"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
  logo?: string
}

export function AnimeNavBar({ items, defaultActive = "홈", logo }: Omit<NavBarProps, 'className'>) {
  const [activeTab, setActiveTab] = useState<string>(defaultActive)

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo - Left */}
        {logo && (
          <Link href="/">
            <Image
              src={logo}
              alt="로고"
              width={80}
              height={50}
              className="object-contain"
            />
          </Link>
        )}

        {/* Navigation + Contact - Right */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-6 bg-white border border-green-500 px-6 py-1 rounded-full">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200 whitespace-nowrap",
                    isActive
                      ? "text-white bg-gradient-to-r from-green-500 to-emerald-500"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                </Link>
              )
            })}
          </nav>

          <Link
            href="/contact"
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors duration-200"
          >
            문의하기
          </Link>
        </div>
      </div>
    </div>
  )
}
