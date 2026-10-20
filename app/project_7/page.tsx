"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, X, ZoomIn, Megaphone, Layers, Route, Users } from "lucide-react"
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

export default function Project7Page() {
  const router = useRouter()
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [displayedTitle, setDisplayedTitle] = useState("")
  const title = "PAWTNER"
  const pageStartTime = useRef<number>(Date.now())
  const scrollMilestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    gaEvent({ action: "page_view_project7", category: "project_7", label: "project 7 pagina geladen" })
    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
      gaEvent({ action: "time_on_page", category: "project_7", label: `${timeSpent} seconden` })
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
    }, 120)
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
          gaEvent({ action: `scroll_depth_${milestone}`, category: "project_7", label: `${milestone}% gescrolld` })
        }
      })
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openLightbox = (src: string, label: string) => {
    gaEvent({ action: "lightbox_open", category: "project_7", label })
    setLightboxSrc(src)
  }

  const closeLightbox = () => {
    gaEvent({ action: "lightbox_close", category: "project_7", label: "lightbox gesloten" })
    setLightboxSrc(null)
  }

  const highlights = [
    {
      icon: <Megaphone size={18} />,
      num: "01",
      title: "Merkstrategie",
      desc: "Submerk Pawtner volledig uitgewerkt binnen de Jack Wolfskin merkarchitectuur — eigen identiteit, zelfde DNA.",
    },
    {
      icon: <Layers size={18} />,
      num: "02",
      title: "Visuele uitingen",
      desc: "Twee campagne-affiches, een podcast cover en een AI-tool mockup — elk stuk gericht op een andere fase in de funnel.",
    },
    {
      icon: <Route size={18} />,
      num: "03",
      title: "Campagneplanning",
      desc: "Een volledige tijdslijn van awareness tot retentie, uitgewerkt over vier fases met owned, paid en earned media.",
    },
    {
      icon: <Users size={18} />,
      num: "04",
      title: "Teamwerk",
      desc: "Samengewerkt als viertal — elk onderdeel afgestemd, elke keuze strategisch onderbouwd.",
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

        {/* Terugknop — absoluut linksboven, zoals FOMU */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-10">
          <button
            onClick={() => {
              gaEvent({ action: "back_to_portfolio", category: "project_7", label: "terug naar portfolio" })
              router.push("/portfolio")
            }}
            className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-red-900 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Terug naar portfolio
          </button>
        </div>
        <div className="w-full">

          {/* Tags — volledig rood, gecentreerd */}
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-red-900 mb-8">
            Brand Essentials · 2025–2026 · AP Hogeschool Antwerpen
          </p>

          {/* Titel — gecentreerd, volle breedte */}
          <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-black uppercase tracking-tighter text-gray-900 uppercase leading-[0.85] mb-4 text-center">
            {displayedTitle}<span className="opacity-30 animate-pulse">_</span>
          </h1>



          {/* Rode streep — gecentreerd */}
          <div className="w-16 h-[3px] bg-red-900 mx-auto mb-8 animate-expand" />

          {/* Ondertitel */}
          <p className="text-gray-500 text-xl md:text-2xl font-light italic leading-relaxed mb-12 max-w-2xl mx-auto">
            "Een submerk voor Jack Wolfskin dat baas en hond samen naar buiten brengt."
          </p>

          {/* CTA knop */}
          <button
            onClick={() => {
              document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" })
              gaEvent({ action: "cta_scroll", category: "project_7", label: "ontdek het project" })
            }}
            className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-8 py-3 text-[11px] font-black tracking-[0.25em] uppercase text-gray-700 hover:border-red-900 hover:text-red-900 transition-all duration-300"
          >
            Ontdek het project <span className="text-base">↓</span>
          </button>
        </div>
      </section>

      {/* ── 2. HIGHLIGHT CARDS ── */}
      <section id="highlights" className="px-6 md:px-16 lg:px-24 py-20 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h) => (
            <div key={h.num} className="group relative border border-gray-100 rounded-2xl p-7 hover:border-red-900/20 hover:shadow-lg hover:shadow-red-900/5 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-900/5 flex items-center justify-center text-red-900 group-hover:bg-red-900 group-hover:text-white transition-all duration-300">
                  {h.icon}
                </div>
                <span className="text-[10px] font-black text-gray-200 group-hover:text-red-900/30 transition-colors">
                  {h.num}
                </span>
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-3 text-gray-900">{h.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. AFFICHES NAAST ELKAAR ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 border-t border-gray-100">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-4">Campagne-affiches</p>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-16 leading-none">
          Twee campagne-<br />momenten
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Expeditie Pawtner */}
          <div
            className="group cursor-pointer"
            onClick={() => openLightbox("/IMG/expeditie.jpg", "Expeditie Pawtner affiche")}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 shadow-md mb-6 transition-all duration-700 group-hover:shadow-xl group-hover:shadow-red-900/10 group-hover:-translate-y-1">
              <Image
                src="/IMG/expeditie.jpg"
                alt="Expeditie Pawtner affiche"
                fill
                className="object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <ZoomIn size={18} className="text-gray-900" />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-[9px] font-black tracking-widest uppercase text-red-900">Affiche</span>
              </div>
            </div>
            <div className="border-l-2 border-gray-100 pl-5 group-hover:border-red-900 transition-colors duration-500">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-red-900 transition-colors">Expeditie Pawtner</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed italic">
                Hero-affiche voor de wedstrijd waarbij deelnemers een exclusieve hike met Freek Vonk kunnen winnen. Man en hond samen in matching Pawtner-jassen.
              </p>
            </div>
          </div>

          {/* Walk & Match */}
          <div
            className="group cursor-pointer"
            onClick={() => openLightbox("/IMG/walk en match.jpg", "Walk & Match affiche")}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 shadow-md mb-6 transition-all duration-700 group-hover:shadow-xl group-hover:shadow-red-900/10 group-hover:-translate-y-1">
              <Image
                src="/IMG/walk en match.jpg"
                alt="Walk en Match affiche"
                fill
                className="object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <ZoomIn size={18} className="text-gray-900" />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-[9px] font-black tracking-widest uppercase text-red-900">Event</span>
              </div>
            </div>
            <div className="border-l-2 border-gray-100 pl-5 group-hover:border-red-900 transition-colors duration-500">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-red-900 transition-colors">Walk & Match</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed italic">
                Event-poster voor de community-wandeling in de Hoge Venen — het grote startsignaal van de campagne waarbij iedereen welkom is met of zonder hond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. DIGITALE UITINGEN ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 border-t border-gray-100 bg-gray-50/50">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-4">Digitale uitingen</p>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-16 leading-none">
          AI-tool &amp;<br />podcast
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* AI-tool mockup */}
          <div
            className="group cursor-pointer"
            onClick={() => openLightbox("/IMG/AI tool.jpg", "AI-tool mockup")}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FABB02] shadow-md mb-6 transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-1">
              <Image
                src="/IMG/AI tool.jpg"
                alt="AI-tool mockup"
                fill
                className="object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <ZoomIn size={18} className="text-gray-900" />
                </div>
              </div>
            </div>
            <div className="border-l-2 border-gray-100 pl-5 group-hover:border-red-900 transition-colors duration-500">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-red-900 transition-colors">AI-tool: maatscanner</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed italic">
                Upload een foto van je hond en de AI berekent automatisch de juiste maat voor de Pawtner-jas — drempelverlagend en innovatief.
              </p>
            </div>
          </div>

          {/* Podcast mockup */}
          <div
            className="group cursor-pointer"
            onClick={() => openLightbox("/IMG/podcast.jpg", "WandelCast podcast mockup")}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-md mb-6 transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-1">
              <Image
                src="/IMG/podcast.jpg"
                alt="De WandelCast podcast mockup"
                fill
                className="object-contain p-6 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <ZoomIn size={18} className="text-gray-900" />
                </div>
              </div>
            </div>
            <div className="border-l-2 border-gray-100 pl-5 group-hover:border-red-900 transition-colors duration-500">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-red-900 transition-colors">De WandelCast</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed italic">
                Een podcast die letterlijk buiten opgenomen wordt — met Freek Vonk als gezicht. Elke aflevering 20–30 minuten, perfect voor een wandeling met de hond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CAMPAGNE TIJDSLIJN ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 border-t border-gray-100">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-4">Campagneplanning</p>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-16 leading-none">
          Tijdslijn
        </h2>

        <div className="flex flex-col gap-6">
          {[
            { src: "/IMG/tijdlijn pawtner-01.jpg", alt: "Campagne tijdslijn deel 1" },
            { src: "/IMG/tijdlijn pawtner-02.jpg", alt: "Campagne tijdslijn deel 2" },
            { src: "/IMG/tijdlijn pawtner-03.jpg", alt: "Campagne tijdslijn deel 3" },
          ].map((img, i) => (
            <div
              key={i}
              className="group cursor-pointer relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl hover:shadow-red-900/5 transition-all duration-700"
              onClick={() => openLightbox(img.src, img.alt)}
            >
              <div className="relative w-full aspect-[16/7]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain p-4 md:p-8 group-hover:scale-[1.02] transition-all duration-700"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <ZoomIn size={18} className="text-gray-900" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 mt-8">
          {[
            { color: "bg-[#FABB02]", label: "Owned media" },
            { color: "bg-blue-500", label: "Paid media" },
            { color: "bg-green-500", label: "Earned media" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. CONCEPT + AANPAK ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 border-t border-gray-100 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-6">Concept</p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 leading-tight">
              Samen naar buiten,<br />samen beschermd
            </h2>
            <p className="text-gray-500 leading-relaxed font-light text-base">
              Pawtner is een submerk van Jack Wolfskin dat inspeelt op de groeiende trend van pet humanisation — honden als volwaardige gezinsleden die mee op avontuur gaan. Het centrale idee is eenvoudig maar krachtig: matching outdoorjassen voor baas en hond, gemaakt van dezelfde Texapore-materialen als de jassen van Jack Wolfskin.
            </p>
            <p className="text-gray-500 leading-relaxed font-light text-base mt-4">
              De campagne is opgebouwd rond vier fases: awareness via guerrillastunts en influencers, consideration via de AI-maattool en podcast, conversie via het Walk & Match-event en Expeditie Pawtner, en retentie via community awards en UGC.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-6">Visuele aanpak</p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 leading-tight">
              Zwart, geel en<br />de natuur als decor
            </h2>
            <p className="text-gray-500 leading-relaxed font-light text-base">
              De visuele identiteit van Pawtner leunt op het kleurenpalet van Jack Wolfskin — zwart en geel — aangevuld met warme, authentieke natuurfoto's. Geen gepolijste studiobeelden, maar echte momenten in de buitenlucht: modderpotige hondenpoten, herfstblad en regenjassen in gebruik.
            </p>
            <p className="text-gray-500 leading-relaxed font-light text-base mt-4">
              De typografie is krachtig en robuust, de tone of voice warm en direct. Het pootlogo van Jack Wolfskin blijft herkenbaar aanwezig, maar Pawtner krijgt een eigen stem binnen die merkwereld.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. PROJECTINFO ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 border-t border-gray-100">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-10">Projectinfo</p>

          <div className="space-y-6">
            {[
              { label: "Vak", value: "Brand Essentials (BDL)" },
              { label: "School", value: "AP Hogeschool Antwerpen" },
              { label: "Jaar", value: "2025–2026" },
              { label: "Team", value: "Gerbe, Sarah, Thibaut, Jarne" },
              { label: "Begeleiding", value: "Erwin Listhaeghe" },
              { label: "Merk", value: "Jack Wolfskin — Submerk: Pawtner" },
              {
                label: "Deliverables",
                value: "Merkanalyse, submerk concept, persona, campagnestrategie, affiches, podcast cover, AI-tool mockup, campagne tijdslijn",
              },
            ].map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8 border-b border-gray-50 pb-6">
                <span className="text-[10px] font-black tracking-widest uppercase text-gray-300 sm:w-32 shrink-0 pt-0.5">
                  {item.label}
                </span>
                <span className="text-gray-600 font-light text-sm leading-relaxed">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 border-l-4 border-red-900/20 pl-8">
            <p className="text-gray-400 italic font-light text-base leading-relaxed">
              "Dit project leerde me hoe je een volledig merksysteem opbouwt — van strategie tot visuele uitvoering. Het samenwerken in een team zorgde ervoor dat elke keuze goed onderbouwd moest worden."
            </p>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            onClick={closeLightbox}
          >
            <X size={18} />
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt="Lightbox"
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