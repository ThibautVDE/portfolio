"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi"
import { useRouter } from "next/navigation"

interface Project {
  title: string;
  image: string;
  link: string;
  tag: string;
}

const allProjects: Project[] = [
  { title: "FOTOGRAFIE", image: "/IMG/Fotografie_Leporello.jpg", link: "/project_1", tag: "Visual Arts" },
  { title: "STAGE T-SHIRT", image: "/IMG/T-shirt_Stage.jpg", link: "/project_2", tag: "Branding" },
  { title: "LUMA", image: "/IMG-2/LUMA_zwart.png", link: "/project_8", tag: "Systeem Design" },
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

export default function HomePage() {
  const fullLastName = "VANDEN EYNDEN"
  const [lastName, setLastName] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  const scrollMilestones = useRef<Set<number>>(new Set())
  const pageStartTime = useRef<number>(Date.now())

  useEffect(() => {
    const shuffled = [...allProjects].sort(() => 0.5 - Math.random()).slice(0, 3)
    setProjects(shuffled)

    gaEvent({ action: "page_view_home", category: "home", label: "homepage geladen" })

    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
      gaEvent({ action: "time_on_page", category: "home", label: `${timeSpent} seconden` })
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setLastName(fullLastName.slice(0, index + 1))
      index++
      if (index === fullLastName.length) clearInterval(interval)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.round((currentScrollY / scrollHeight) * 100)
      setScrollProgress(progress)

      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (progress >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone)
          gaEvent({ action: `scroll_depth_${milestone}`, category: "home", label: `${milestone}% gescrolld` })
        }
      })
    }
    window.addEventListener("scroll", updateScrollProgress)
    return () => window.removeEventListener("scroll", updateScrollProgress)
  }, [])

  const nextSlide = () => {
    if (projects.length === 0) return
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
    gaEvent({ action: "slider_next", category: "home", label: "pijl rechts geklikt" })
  }

  const prevSlide = () => {
    if (projects.length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
    gaEvent({ action: "slider_prev", category: "home", label: "pijl links geklikt" })
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    gaEvent({ action: `slider_dot_${index + 1}`, category: "home", label: `slide ${index + 1} via dot` })
  }

  const handleProjectClick = (href: string, label: string) => {
    const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
    gaEvent({ action: `project_click_${label}`, category: "home", label: `${href} na ${timeSpent}s` })
    router.push(href)
  }

  const handleCTAClick = (label: string, href: string) => {
    const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
    gaEvent({ action: `cta_click_${label}`, category: "home", label: `${href} na ${timeSpent}s` })
    router.push(href)
  }

  const handleScrollIndicator = () => {
    gaEvent({ action: "scroll_indicator_click", category: "home", label: "scroll pijl geklikt" })
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
  }

  useEffect(() => {
    if (projects.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev === projects.length - 1 ? 0 : prev + 1
        gaEvent({ action: "slider_autoplay", category: "home", label: `auto naar slide ${next + 1}` })
        return next
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [projects])

  if (projects.length === 0) return null

  return (
    <main className="relative flex flex-col items-center min-h-screen bg-white overflow-x-hidden font-sans selection:bg-red-900 selection:text-white">

      {/* SCROLL PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 h-1 bg-red-900 z-110 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── HERO SECTION ── */}
      <section className="flex flex-col items-center justify-center min-h-[90vh] w-full px-4 sm:px-6 lg:px-12 text-center relative py-16 sm:py-20">
        <div className="flex flex-col items-center relative z-10 w-full max-w-7xl">
          <h1 className="leading-[0.85] mb-4 sm:mb-6 w-full">
            <span className="block font-barlow text-[clamp(2.5rem,10vw,10rem)] font-light tracking-wide uppercase text-gray-900">
              Thibaut
            </span>
            <span className="block text-red-900 text-[clamp(2rem,8vw,10rem)] font-bold tracking-tight min-h-[1.1em] wrap-break-word">
              {lastName}
              <span className="ml-1 opacity-40 animate-pulse"></span>
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-500 max-w-3xl tracking-wide uppercase font-medium px-2 sm:px-4">
            Grafisch ontwerp <span className="mx-1 sm:mx-2 text-red-900/10">|</span> Branding <span className="mx-1 sm:mx-2 text-red-900/10">|</span> Fotografie
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-8 sm:mt-12 animate-fadeIn w-full sm:w-auto px-4 sm:px-6">
            <button
              onClick={() => handleCTAClick("Bekijk Projecten", "/portfolio")}
              className="w-full sm:w-auto px-8 md:px-10 py-4 bg-red-900 text-white rounded-full font-semibold hover:bg-black transition-all duration-300 shadow-xl shadow-red-900/10 text-center text-sm sm:text-base"
            >
              Bekijk Projecten
            </button>
            <button
              onClick={() => handleCTAClick("Over Mij", "/over_mij")}
              className="w-full sm:w-auto px-8 md:px-10 py-4 border-2 border-red-900 text-red-900 rounded-full font-semibold hover:bg-red-900 hover:text-white transition-all duration-300 text-center text-sm sm:text-base"
            >
              Over Mij
            </button>
          </div>
        </div>

        <button
          onClick={handleScrollIndicator}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce hover:opacity-60 transition-opacity"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <div className="w-px h-6 sm:h-8 bg-gray-900"></div>
        </button>
      </section>

      {/* ── PROJECT SLIDER SECTION ── */}
      <section className="w-full max-w-400 mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="flex justify-between items-end mb-8 sm:mb-12 px-1 sm:px-2">
          <div className="space-y-2 flex-1 min-w-0 pr-4">
            <button
              onClick={() => handleCTAClick("Mijn projecten", "/portfolio")}
              className="group relative inline-flex items-center gap-4 sm:gap-6 w-full"
            >
              <div className="relative min-w-0">
                <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none transition-colors group-hover:text-red-900 wrap-break-word">
                  Mijn projecten
                </h2>
                <span className="absolute -bottom-2 left-0 w-full h-1 sm:h-1.5 bg-red-900 origin-left scale-x-[0.3] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </div>
              <FiArrowRight size={28} className="text-red-900 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:block shrink-0" />
            </button>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={prevSlide} className="p-3 sm:p-4 md:p-6 border border-gray-100 rounded-xl sm:rounded-2xl hover:bg-red-900 hover:text-white transition-all shadow-sm active:scale-90">
              <FiChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="p-3 sm:p-4 md:p-6 bg-black text-white rounded-xl sm:rounded-2xl hover:bg-red-900 transition-all shadow-xl active:scale-90">
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.07)] bg-gray-50 aspect-4/5 sm:aspect-4/3 md:aspect-21/9">
          <div
            className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                onClick={() => handleProjectClick(project.link, project.title)}
                className="min-w-full h-full relative group cursor-pointer"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                  priority={index === 0}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent flex flex-col justify-end p-6 sm:p-8 md:p-20">
                  <span className="text-red-900 font-mono text-xs mb-2 sm:mb-4">/ 0{index + 1}</span>
                  <h3 className="text-white text-2xl sm:text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-3 sm:mb-4">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="px-3 py-1 border border-white/20 rounded-full text-[9px] text-white font-bold uppercase tracking-widest">
                      {project.tag}
                    </span>
                    <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest group-hover:text-white transition-colors hidden sm:block">
                      View Project —
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-12">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1 transition-all duration-500 rounded-full ${
                currentIndex === index ? "w-10 sm:w-12 bg-red-900" : "w-3 sm:w-4 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── OVER MIJ TEASER SECTION ── */}
      <section className="w-full px-4 sm:px-6 py-16 sm:py-20 md:py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center">

          {/* Foto — op mobiel kleiner */}
          <div className="relative aspect-4/5 sm:aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 shadow-2xl max-h-[60vh] sm:max-h-none">
            <Image
              src="/IMG/Thibaut2.jpg"
              alt="Thibaut Vanden Eynden"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg">
              <p className="text-[9px] font-black tracking-[0.3em] uppercase text-red-900">Thibaut Vanden Eynden</p>
              <p className="text-[9px] font-light text-gray-400 uppercase tracking-widest mt-0.5">Grafisch ontwerper · Antwerpen</p>
            </div>
          </div>

          {/* Tekst */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-red-900 uppercase tracking-tighter">De Ontwerper</h2>
            <p className="text-gray-700 text-lg sm:text-xl md:text-3xl leading-tight font-light">
              Ik ben <span className="font-bold">Thibaut Vanden Eynden</span>, een creatieve grafisch ontwerper gespecialiseerd in branding, fotografie en visuele communicatie. Mijn stijl combineert esthetiek met een sterk concept.
            </p>
            <button
              onClick={() => handleCTAClick("Ontdek mijn verhaal", "/over_mij")}
              className="mt-8 sm:mt-12 inline-flex items-center gap-3 text-red-900 font-bold border-b-2 border-red-900 pb-2 text-base sm:text-lg hover:text-black hover:border-black transition-all group mx-auto md:mx-0"
            >
              Ontdek mijn verhaal <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}