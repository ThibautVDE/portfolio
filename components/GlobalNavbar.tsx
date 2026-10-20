"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GiHamburgerMenu } from "react-icons/gi"
import { FiX, FiArrowRight } from "react-icons/fi"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const rawProjects = [
  { t: "Fotografie", h: "/project_1" },
  { t: "Ignition", h: "/project_3" },
  { t: "Stage T-shirt", h: "/project_2" },
  { t: "Tegen Dementie", h: "/project_4" },
  { t: "CineCity", h: "/project_5" },
  { t: "Datavisualisatie", h: "/project_6" },
  { t: "Pawtner", h: "/project_7" },
]

const gaEvent = ({ action, category, label }: { action: string; category: string; label: string }) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
    })
    console.log(`[GA] ${action} → ${label}`)
  }
}

export default function GlobalNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const sortedProjects = useMemo(() => {
    return [...rawProjects].sort((a, b) => a.t.localeCompare(b.t))
  }, [])

  const closeMenu = (reason: string = "onbekend") => {
    setIsOpen(false)
    gaEvent({ action: "menu_close", category: "navigation", label: `gesloten via: ${reason}` })
  }

  const handleNavigation = (href: string, label?: string) => {
    gaEvent({
      action: `nav_click_${label ?? href}`,
      category: "navigation",
      label: href,
    })
    setIsOpen(false)
    router.push(href)
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu("escape toets")
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen])

  return (
    <>
      {/* MENU TRIGGER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-8 left-8 z-100">
        <button
          onClick={() => {
            const next = !isOpen
            setIsOpen(next)
            gaEvent({
              action: next ? "menu_open" : "menu_close",
              category: "navigation",
              label: next ? "Menu openen" : "gesloten via: menu knop"
            })
          }}
          className={`p-4 md:p-5 rounded-3xl transition-all duration-500 shadow-2xl flex items-center gap-4 ${
            isOpen ? "bg-red-900 text-white" : "bg-white/90 backdrop-blur-md text-gray-900 border border-white/20 hover:scale-105"
          }`}
        >
          {isOpen ? <FiX size={20} /> : <GiHamburgerMenu size={20} />}
          <span className="text-[10px] font-black uppercase tracking-[0.4em] pr-2">{isOpen ? "Sluiten" : "Menu"}</span>
        </button>
      </motion.div>

      {/* MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-90 flex justify-center overflow-y-auto bg-white/95 backdrop-blur-2xl"
          >
            <div
              className="absolute inset-0 z-0"
              onClick={() => closeMenu("klik buiten menu")}
            />

            <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-12 md:gap-20 px-8 py-32 md:py-40 items-start">

              {/* LINKS: Hoofdmenu */}
              <div className="flex flex-col space-y-2 md:sticky md:top-40">
                {[
                  { name: "Home", path: "/home" },
                  { name: "Over mij", path: "/over_mij" },
                  { name: "Contact", path: "/contact" }
                ].map((item, i) => {
                  const isActive = pathname === item.path
                  return (
                    <motion.div key={item.name} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                      <button
                        onClick={() => handleNavigation(item.path, item.name)}
                        className={`group flex items-center gap-6 text-4xl md:text-6xl font-black uppercase tracking-tighter transition-all ${
                          isActive ? "text-red-900" : "text-gray-900 hover:text-red-900"
                        }`}
                      >
                        <span className="group-hover:translate-x-4 transition-transform duration-500">
                          {item.name}
                        </span>
                        <FiArrowRight className={`transition-all text-3xl md:text-4xl ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                      </button>
                    </motion.div>
                  )
                })}
              </div>

              {/* RECHTS: Projecten Index */}
              <motion.div
                initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)]"
              >
                <button
                  onClick={() => {
                    const next = !isProjectOpen
                    setIsProjectOpen(next)
                    gaEvent({
                      action: next ? "projects_open" : "projects_close",
                      category: "navigation",
                      label: next ? "Projecten openen" : "Projecten sluiten"
                    })
                  }}
                  className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 hover:text-red-900 transition-colors group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Projecten ({sortedProjects.length})</span>
                  <FiArrowRight className={`transition-transform duration-500 text-lg ${isProjectOpen ? "rotate-90" : ""}`} />
                </button>

                <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isProjectOpen ? "grid-rows-[1fr] opacity-100 mt-8" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                  <div className="overflow-hidden">
                    <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                      {sortedProjects.map((p) => (
                        <button
                          key={p.t}
                          onClick={() => handleNavigation(p.h, p.t)}
                          className="w-full flex items-center justify-between py-4 border-b border-gray-50 group transition-all"
                        >
                          <span className={`text-lg md:text-xl font-black uppercase tracking-tight transition-all group-hover:translate-x-2 ${pathname === p.h ? "text-red-900" : "text-gray-800 group-hover:text-red-900"}`}>
                            {p.t}
                          </span>
                          <FiArrowRight size={18} className={`${pathname === p.h ? "text-red-900" : "text-gray-100"} group-hover:text-red-900 transition-colors`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body { 
          overflow: ${isOpen ? 'hidden' : 'auto'}; 
          padding-right: ${isOpen ? 'var(--scrollbar-width, 0px)' : '0px'};
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #7f1d1d; border-radius: 10px; }
      `}</style>
    </>
  )
}