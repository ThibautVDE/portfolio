"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { ArrowUpRight, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"

const gaEvent = ({ action, category, label }: { action: string; category: string; label: string }) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
    })
    console.log(`[GA] ${action} → ${label}`)
  }
}

export default function PortfolioPage() {
  const title = "PORTFOLIO"
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [showTopBtn, setShowTopBtn] = useState(false)
  const router = useRouter()

  const scrollMilestones = useRef<Set<number>>(new Set())
  const pageStartTime = useRef<number>(Date.now())

  useEffect(() => {
    gaEvent({ action: "page_view_portfolio", category: "portfolio", label: "portfolio pagina geladen" })

    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
      gaEvent({ action: "time_on_page", category: "portfolio", label: `${timeSpent} seconden` })
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setDisplayedTitle(title.slice(0, index + 1))
      index++
      if (index === title.length) clearInterval(interval)
    }, 150)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.round((window.scrollY / scrollHeight) * 100)
      setScrollProgress(progress)
      setShowTopBtn(window.scrollY > 400)

      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (progress >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone)
          gaEvent({
            action: `scroll_depth_${milestone}`,
            category: "portfolio",
            label: `${milestone}% gescrolld`,
          })
        }
      })
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleProjectClick = (href: string, label: string, context: string) => {
    const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
    gaEvent({
      action: `project_click_${label}`,
      category: "portfolio",
      label: `${href} via ${context} na ${timeSpent}s`,
    })
    router.push(href)
  }

  const handleFilterClick = (cat: string) => {
    gaEvent({
      action: `filter_click_${cat}`,
      category: "portfolio",
      label: `filter: ${cat} — was: ${activeFilter}`,
    })
    setActiveFilter(cat)
  }

  const handleBackToTop = () => {
    gaEvent({
      action: "back_to_top",
      category: "portfolio",
      label: "terug naar boven geklikt",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Voeg featured: true toe aan het project dat je uitgelicht wil — max 1 per keer
  // De rest wordt automatisch alfabetisch gesorteerd in het grid
  const projects = [
    {
      title: "FOTOGRAFIE FOMU",
      category: "PHOTOGRAPHY",
      year: "2025",
      image: "/IMG/Fotografie_Leporello.jpg",
      link: "/project_1",
      desc: "Een onderzoek naar de essentie van de architecturale lijn in opdracht van het Fotomuseum Antwerpen.",
      tag: "Expositie",
      featured: true,
    },
    {
      title: "STAGE T-SHIRT WEGI",
      category: "GRAPHIC DESIGN",
      year: "2025",
      image: "/IMG/T-shirt_Stage.jpg",
      link: "/project_2",
      desc: "Het vertalen van clubtrots naar een technisch en visueel sterk ontwerp voor volleybalclub WeGi.",
      tag: "Print",
      featured: false,
    },
    {
      title: "IGNITION ENERGY DRINK",
      category: "BRANDING",
      year: "2026",
      image: "/IMG/Ignition3.jpg",
      link: "/project_3",
      desc: "Een integrale merkbeleving waarbij kracht, snelheid en visuele energie de kern vormen.",
      tag: "Brand Identity",
      featured: false,
    },
    {
      title: "TEGEN DEMENTIE",
      category: "GRAPHIC DESIGN",
      year: "2026",
      image: "/IMG/Herinnering1-2.jpg",
      link: "/project_4",
      desc: "Een visuele identiteit die de complexiteit van dementie vertaalt naar een heldere, menselijke en verbindende beeldtaal.",
      tag: "Awareness",
      featured: false,
    },
    {
      title: "CINECITY",
      category: "GRAPHIC DESIGN",
      year: "2026",
      image: "/IMG/affiche-31.png",
      link: "/project_5",
      desc: "Een volledige visuele identiteit voor het fictieve CineCity Filmfestival Antwerpen — van affichereeks en booklet tot locatiekaartjes en digitale tools.",
      tag: "Print Design",
      featured: false,
    },
    {
      title: "DATAVISUALISATIE",
      category: "GRAPHIC DESIGN",
      year: "2025",
      image: "/IMG/datavisualisatie.jpg",
      link: "/project_6",
      desc: "Een infographic die het wasproces stap voor stap visualiseert — ontworpen als praktische handleiding voor studenten op kot.",
      tag: "Infographic",
      featured: false,
    },
    {
      title: "PAWTNER",
      category: "BRANDING",
      year: "2025",
      image: "/IMG/podcast.jpg",
      link: "/project_7",
      desc: "Een submerk voor Jack Wolfskin dat baas en hond samen naar buiten brengt — van merkstrategie tot visuele identiteit.",
      tag: "Brand Identity",
      featured: false,
    },
  ]

  const categories = ["ALL", "PHOTOGRAPHY", "GRAPHIC DESIGN", "BRANDING"]

  const getFilteredProjects = (cat: string) => {
    const filtered = cat === "ALL" ? projects : projects.filter(p => p.category === cat)
    const sorted = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    // Featured project bovenaan, rest alfabetisch
    const featuredIndex = sorted.findIndex(p => p.featured)
    if (featuredIndex > 0) {
      const [featured] = sorted.splice(featuredIndex, 1)
      sorted.unshift(featured)
    }
    return sorted
  }

  const filteredProjects = getFilteredProjects(activeFilter)
  const getCount = (cat: string) =>
    cat === "ALL" ? projects.length : projects.filter(p => p.category === cat).length

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-red-900 selection:text-white relative overflow-x-hidden font-sans">

      {/* SCROLL PROGRESS */}
      <div
        className="fixed top-0 left-0 h-1 bg-red-900 z-50 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── 1. HERO ── */}
      <section className="min-h-[70vh] flex flex-col justify-end px-6 md:px-16 lg:px-24 pt-32 pb-20 border-b border-gray-100">
        <h1 className="text-[clamp(4rem,12vw,10rem)] font-black tracking-tighter text-red-900 uppercase leading-[0.85] mb-10">
          {displayedTitle}<span className="opacity-30 animate-pulse">_</span>
        </h1>

        <div className="w-20 h-0.5 bg-red-900 mb-12 origin-left animate-expand" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <p className="text-gray-400 max-w-xl text-lg md:text-2xl leading-tight font-light italic">
            "Mijn werk wordt gekenmerkt door{" "}
            <span className="text-gray-900 font-bold not-italic uppercase tracking-tight">
              structuur, ritme en visuele impact
            </span>."
          </p>

          {/* Filter */}
          <nav className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterClick(cat)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-200 border ${
                  activeFilter === cat
                    ? "bg-red-900 text-white border-red-900"
                    : "bg-white text-gray-400 border-gray-200 hover:border-red-900/30 hover:text-gray-900"
                }`}
              >
                {cat}
                <span className="ml-1.5 opacity-50 text-[8px]">({getCount(cat)})</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* ── 2. FEATURED PROJECT ── */}
      {filteredProjects.length > 0 && (
        <section className="px-6 md:px-16 lg:px-24 py-24 md:py-32 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-10">
            Uitgelicht project
          </p>
          <div
            onClick={() => handleProjectClick(filteredProjects[0].link, filteredProjects[0].title, "uitgelicht")}
            className="group grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center cursor-pointer"
          >
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-gray-50 shadow-xl shadow-gray-200/60 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-red-900/10 group-hover:-translate-y-1">
              <Image
                src={filteredProjects[0].image}
                alt={filteredProjects[0].title}
                fill
                priority
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-900">
                    {filteredProjects[0].category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-[10px] font-bold text-gray-400">{filteredProjects[0].year}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-gray-900 group-hover:text-red-900 transition-colors duration-300">
                  {filteredProjects[0].title}
                </h2>
              </div>

              <div className="w-16 h-0.5 bg-red-900/30 group-hover:w-full transition-all duration-700 ease-out" />

              <p className="text-gray-500 font-light text-lg leading-relaxed italic">
                {filteredProjects[0].desc}
              </p>

              <div className="inline-flex items-center gap-3 text-[10px] font-black tracking-widest uppercase text-red-900 border border-red-900/30 px-6 py-3 rounded-full group-hover:bg-red-900 group-hover:text-white transition-all duration-300">
                Bekijk project
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. OVERIGE PROJECTEN ── */}
      {filteredProjects.length > 1 && (
        <section className="px-6 md:px-16 lg:px-24 py-24 md:py-32">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-10">
            Alle projecten
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {filteredProjects.slice(1).map((project, index) => (
              <div
                key={project.title}
                onClick={() => handleProjectClick(project.link, project.title, "grid")}
                className="group block animate-fadeIn cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
              >
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-50 shadow-md mb-7 transition-all duration-700 group-hover:shadow-xl group-hover:shadow-red-900/10 group-hover:-translate-y-1">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-[9px] font-black tracking-widest uppercase text-red-900">{project.tag}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-l-2 border-gray-100 pl-6 group-hover:border-red-900 transition-colors duration-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-[0.25em] text-red-900 uppercase">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 group-hover:text-gray-500 transition-colors">
                      {project.year}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase group-hover:text-red-900 transition-colors leading-none">
                      {project.title}
                    </h2>
                    <div className="shrink-0 mt-1 w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-red-900 group-hover:border-red-900 transition-all duration-300">
                      <ArrowUpRight size={14} className="text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <p className="text-gray-400 font-light text-sm leading-relaxed italic">
                    {project.desc}
                  </p>

                  <div className="mt-2 w-0 group-hover:w-full h-px bg-red-900/20 transition-all duration-700 ease-out" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── LEGE STATE ── */}
      {filteredProjects.length === 0 && (
        <section className="px-6 md:px-16 lg:px-24 py-40 text-center">
          <p className="text-gray-300 text-sm font-light uppercase tracking-widest">
            Geen projecten in deze categorie
          </p>
        </section>
      )}

      {/* BACK TO TOP */}
      <button
        onClick={handleBackToTop}
        className={`fixed bottom-10 right-10 p-4 bg-white border border-gray-100 rounded-full shadow-xl text-red-900 transition-all duration-500 z-50 hover:bg-red-900 hover:text-white hover:border-red-900 group ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ChevronUp size={18} />
      </button>

      <style jsx global>{`
        @keyframes expand {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-expand {
          animation: expand 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: left;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #991b1b; border-radius: 10px; }
      `}</style>
    </main>
  )
}