"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, X, ZoomIn, LayoutList, BookOpen, Lightbulb, Users } from "lucide-react"
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

export default function Project6Page() {
  const title = "Datavisualisatie"
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeHighlight, setActiveHighlight] = useState(0)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const router = useRouter()

  const scrollMilestones = useRef<Set<number>>(new Set())
  const pageStartTime = useRef<number>(Date.now())

  useEffect(() => {
    gaEvent({ action: "page_view", category: "project_6", label: "project 6 geladen" })
    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
      gaEvent({ action: "time_on_page", category: "project_6", label: `${timeSpent} seconden` })
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
      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (progress >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone)
          gaEvent({ action: `scroll_depth_${milestone}`, category: "project_6", label: `${milestone}% gescrolld` })
        }
      })
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  const highlights = [
    {
      number: "01",
      label: "Doelgroep",
      desc: "Studenten op kot die voor het eerst zelfstandig wonen en nog nooit zelf de was hebben gedaan. De infographic geeft hen een houvast zonder voorkennis.",
      icon: <Users size={18} />,
    },
    {
      number: "02",
      label: "Structuur",
      desc: "Zes stappen van sorteren tot opbergen — lineaire opbouw die het volledige wasproces van begin tot einde dekt in één oogopslag.",
      icon: <LayoutList size={18} />,
    },
    {
      number: "03",
      label: "Visuele taal",
      desc: "Zachte, illustratieve stijl met een coherent kleurenpallet. Icoontjes en pijlen ondersteunen de tekst zodat de info snel en intuïtief wordt opgenomen.",
      icon: <BookOpen size={18} />,
    },
    {
      number: "04",
      label: "Inzicht",
      desc: "Data over een alledaagse handeling omzetten in een toegankelijke visuele handleiding — niet abstract, maar direct toepasbaar in het dagelijkse leven.",
      icon: <Lightbulb size={18} />,
    },
  ]

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-red-900 selection:text-white relative overflow-x-hidden font-sans">

      {/* SCROLL PROGRESS */}
      <div
        className="fixed top-0 left-0 h-1 bg-red-900 z-50 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── 1. HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-16 lg:px-24 pt-16 pb-20">

        {/* Terugknop — absoluut linksboven */}
        <div className="absolute top-8 left-6 md:left-12">
          <button
            onClick={() => {
              gaEvent({ action: "cta_terug_portfolio", category: "project_6", label: "/portfolio" })
              router.push("/portfolio")
            }}
            className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-red-900 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Terug naar portfolio
          </button>
        </div>

        <div className="w-full">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-red-900 mb-8">
            Information Essentials · 2025 · AP Hogeschool Antwerpen
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-black uppercase tracking-tighter text-gray-900 leading-[0.85] mb-4 text-center">
            {displayedTitle}<span className="opacity-30 animate-pulse">_</span>
          </h1>

          <div className="w-16 h-[3px] bg-red-900 mx-auto mb-8 animate-expand" />

          <p className="text-gray-500 text-xl md:text-2xl font-light italic leading-relaxed mb-12 max-w-2xl mx-auto">
            "Een datavisualisatie die een alledaagse handeling omzet in een heldere, stapsgewijze infographic — ontworpen voor studenten die voor het eerst zelfstandig wonen."
          </p>

          <button
            onClick={() => {
              gaEvent({ action: "cta_ontdek_project", category: "project_6", label: "scroll naar highlights" })
              document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-8 py-3 text-[11px] font-black tracking-[0.25em] uppercase text-gray-700 hover:border-red-900 hover:text-red-900 transition-all duration-300"
          >
            Ontdek het project <span className="text-base">↓</span>
          </button>

          {/* Hero image */}
          <div
            className="mt-16 relative w-full max-w-sm mx-auto bg-black rounded-2xl overflow-hidden cursor-zoom-in group shadow-2xl shadow-gray-200/60"
            style={{ aspectRatio: "3/4" }}
            onClick={() => {
              gaEvent({ action: "lightbox_open", category: "project_6", label: "hero infographic" })
              setLightboxSrc("/IMG/datavisualisatie.jpg")
            }}
          >
            <Image
              src="/IMG/datavisualisatie.jpg"
              alt="Hoe doe je de was — infographic"
              fill
              priority
              className="object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                <ZoomIn size={16} className="text-red-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. HIGHLIGHTS ── */}
      <section id="highlights" className="px-6 md:px-16 lg:px-24 py-24 md:py-32 border-b border-gray-100">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-16">
          Over het project
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {highlights.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveHighlight(i)
                gaEvent({ action: "highlight_click", category: "project_6", label: item.label })
              }}
              className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                activeHighlight === i
                  ? "bg-red-900 text-white border-red-900"
                  : "bg-white text-gray-900 border-gray-100 hover:border-red-900/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] font-black tracking-widest ${activeHighlight === i ? "text-white/60" : "text-red-900"}`}>
                  {item.number}
                </span>
                <span className={activeHighlight === i ? "text-white/60" : "text-red-900"}>
                  {item.icon}
                </span>
              </div>
              <p className={`text-sm font-black uppercase tracking-widest mb-2 ${activeHighlight === i ? "text-white" : "text-gray-900"}`}>
                {item.label}
              </p>
              <p className={`text-sm font-light leading-relaxed ${activeHighlight === i ? "text-white/80" : "text-gray-400"}`}>
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. INFOGRAPHIC GROOT ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-32 border-b border-gray-100">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-10">
          De infographic
        </p>

        <div
          className="relative w-full max-w-2xl mx-auto bg-[#d4e0c8] rounded-3xl overflow-hidden cursor-zoom-in group shadow-xl shadow-gray-200/60"
          style={{ aspectRatio: "3/4" }}
          onClick={() => {
            gaEvent({ action: "lightbox_open", category: "project_6", label: "infographic groot" })
            setLightboxSrc("/IMG/datavisualisatie.jpg")
          }}
        >
          <Image
            src="/IMG/datavisualisatie.jpg"
            alt="Hoe doe je de was — volledige infographic"
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 flex items-end justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <ZoomIn size={18} className="text-red-900" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. TEKST: CONCEPT ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-32 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-6">Concept</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-8">
              Alledaags<br />toegankelijk gemaakt
            </h2>
          </div>
          <div className="space-y-6 text-gray-500 font-light leading-relaxed">
            <p>
              Voor het vak Information Essentials kregen we de opdracht om een datavisualisatie te maken over een onderwerp naar eigen keuze. Ik koos voor iets concreet en praktisch: de was doen. Een alledaagse handeling die veel studenten op kot voor het eerst volledig zelfstandig moeten uitvoeren — zonder de hulp van thuis.
            </p>
            <p>
              Het doel was niet om complexe data te visualiseren, maar om een proces inzichtelijk te maken. Zes stappen, van het sorteren van vuile kleren tot het opbergen van de schone was. Elke stap wordt ondersteund door een illustratie en korte tekst, zodat de infographic ook zonder verdere uitleg bruikbaar is.
            </p>
            <p>
              De zachte, illustratieve stijl en het warme kleurenpallet maken het ontwerp uitnodigend en laagdrempelig — geen technisch schema, maar een visuele handleiding die je ook aan de muur kan hangen.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. TEKST: VISUELE KEUZES ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-32 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-6">Visuele aanpak</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-8">
              Stijl als<br />communicatiemiddel
            </h2>
          </div>
          <div className="space-y-6 text-gray-500 font-light leading-relaxed">
            <p>
              De illustratieve stijl is bewust gekozen: het maakt de informatie toegankelijker dan een strak grafisch schema. Icoontjes en pijlen leiden de blik door de pagina en ondersteunen de tekst zonder haar te overschaduwen.
            </p>
            <p>
              Het kleurenpallet — zacht groen als achtergrond, terracotta en blauw als accenten — creëert een rustige sfeer die past bij de huiselijke context van het onderwerp. De typografie combineert een speelse titel met leesbare instructietekst.
            </p>
            <p>
              De hiërarchie is opgebouwd via genummerde stappen, visuele grootte en witruimte. Zo is de infographic in één oogopslag te begrijpen, maar ook te raadplegen als stappenplan terwijl je bezig bent.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. PROJECTINFO ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="bg-gray-50 rounded-3xl p-10 space-y-8">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900">Projectinfo</p>
            <div className="space-y-4">
              {[
                { label: "Project", value: "Hoe doe je de was" },
                { label: "Type", value: "Datavisualisatie / Infographic" },
                { label: "Vak", value: "Information Essentials" },
                { label: "School", value: "AP Hogeschool Antwerpen" },
                { label: "Jaar", value: "2025" },
                { label: "Deliverable", value: "Infographic (print)" },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                  <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900">Reflectie</p>
            <blockquote className="text-2xl md:text-3xl font-black tracking-tighter leading-tight text-gray-900">
              "Complexe informatie vereenvoudigen zonder inhoud te verliezen — dat is de kern van goede datavisualisatie."
            </blockquote>
            <p className="text-gray-400 font-light leading-relaxed">
              Dit project leerde me om een proces te analyseren en te ontleden in begrijpelijke stappen. Het uitdagende zat niet in de complexiteit van de data, maar in het vinden van de juiste visuele taal om een doelgroep direct aan te spreken — zonder voorkennis, zonder uitleg erbij.
            </p>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            onClick={() => setLightboxSrc(null)}
          >
            <X size={28} />
          </button>
          <div
            className="relative w-full max-w-lg h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt="Infographic vergroot"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes expand {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-expand {
          animation: expand 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: left;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #991b1b; border-radius: 10px; }
      `}</style>
    </main>
  )
}