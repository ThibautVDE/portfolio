"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ArrowLeft, X, ZoomIn, Palette, FileText, Ticket, Video, Globe, CalendarCheck, Sparkles } from "lucide-react"
import Link from "next/link"

const gaEvent = ({ action, category, label }: { action: string; category: string; label: string }) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
    })
    console.log(`[GA] ${action} → ${label}`)
  }
}

export default function CineCityProject() {
  const fullTitle = "CINECITY"
  const [title, setTitle] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [activeHighlight, setActiveHighlight] = useState(0)

  const scrollMilestones = useRef<Set<number>>(new Set())
  const pageStartTime = useRef<number>(Date.now())

  useEffect(() => {
    gaEvent({ action: "page_view_project_5", category: "project_5", label: "CineCity pagina geladen" })

    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
      gaEvent({ action: "time_on_page", category: "project_5", label: `${timeSpent} seconden` })
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setTitle(fullTitle.slice(0, index + 1))
      index++
      if (index === fullTitle.length) clearInterval(interval)
    }, 150)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const update = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.round((window.scrollY / scrollHeight) * 100)
      setScrollProgress(progress)

      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (progress >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone)
          gaEvent({ action: `scroll_depth_${milestone}`, category: "project_5", label: `${milestone}% gescrolld` })
        }
      })
    }
    window.addEventListener("scroll", update)
    return () => window.removeEventListener("scroll", update)
  }, [])

  const highlights = [
    {
      label: "Een stad als podium.",
      sub: "CineCity is een fictief filmfestival dat Antwerpen omvormt tot een open bioscoop. De visuele identiteit moest de stad zelf weerspiegelen — elke locatie krijgt zijn eigen kleuraccent binnen één samenhangend systeem.",
      img: "/IMG/affiche-31.png",
    },
    {
      label: "Affiches als eerste taal.",
      sub: "De affichereeks vormt het hart van de campagne. Negen varianten, één per festivallocatie, gebouwd op een golfvormige beeldtaal die cinema en stadsleven met elkaar verbindt.",
      img: "/IMG/affiche-32.png",
    },
    {
      label: "Een booklet als programmagids.",
      sub: "Het festival booklet bundelt het programma in een editorial format dat de visuele taal van de affiches doortrekt — van typografie tot kleurverloop. Informatief én beleefbaar.",
      img: "/IMG/booklet.jpg",
    },
    {
      label: "Kaartjes als aandenken.",
      sub: "Als extra deliverable ontwierp ik locatiekaartjes die bezoekers op elke festivallocatie kunnen ophalen. Elk kaartje draagt de kleur van die plek en wordt zo een tastbare herinnering aan het festival.",
      img: "/IMG/extra1.jpg",
    },
  ]

  const bentoItems = [
    { text: "Affiche variant 1 — de basisopbouw van het systeem.", img: "/IMG/affiche-33.png" },
    { text: "Filmaffiche — visuele taal toegepast op een concrete film.", img: "/IMG/affichefilm-43.png" },
    { text: "Affiche variant 2 — kleuraccent per locatie.", img: "/IMG/affiche-34.png" },
    { text: "Locatiekaartjes — aandenken per festivallocatie.", img: "/IMG/extra2.jpg" },
  ]

  const sections = [
    {
      icon: <Palette size={20} />,
      tag: "Concept",
      title: "De Visuele Identiteit",
      body: [
        "De opdracht was helder: ontwerp een volledige visuele identiteit voor het fictieve CineCity Filmfestival Antwerpen. Maar een identiteit is pas sterk als ze vertrekpunt, systeem én beleving tegelijk is. Ik koos voor een golfvormige beeldtaal die verwijst naar de beweging van film — de manier waarop een beeld overloopt in het volgende, hoe een verhaal stroomt.",
        "Het kleurensysteem is opgebouwd rondom de festivallocaties in Antwerpen. Elke locatie — Cinema Lumière, FOMU, De Studio, Permeke, Campus Spoor Noord en anderen — krijgt zijn eigen kleuraccent. Die accenten zijn verankerd in dezelfde donkere achtergrond en hetzelfde typografische raster, waardoor elke affiche herkenbaar CineCity is, maar toch uniek aanvoelt per locatie.",
      ],
    },
    {
      icon: <FileText size={20} />,
      tag: "Affichereeks & Booklet",
      title: "Van Affiche tot Programmagids",
      body: [
        "De negen affiches vormen de ruggengraat van de campagne. Ze zijn ontworpen in A3-formaat en volgen een strak grid dat ruimte laat voor expressiviteit: brede verlopen, krachtige typografie en golfvormen die de sfeer van een bioscoopzaal oproepen. Naast de locatieaffiches ontwierp ik ook filmaffiches die dezelfde visuele taal hanteren, maar zich richten op specifieke vertoningen.",
        "Het booklet vertaalt diezelfde taal naar een editorial formaat. Het bundelt het festivalprogramma op een manier die informeren en beleven combineert. De lay-out werkt met hetzelfde kleurensysteem als de affiches — zo vormt het geheel één coherente campagne die consistent is over alle dragers.",
      ],
    },
    {
      icon: <Ticket size={20} />,
      tag: "Extra Deliverable",
      title: "Locatiekaartjes als Souvenir",
      body: [
        "Voor de extra deliverable koos ik bewust voor iets tastbaars: locatiekaartjes. Op elke festivallocatie kunnen bezoekers een kaartje ophalen in de kleurvariant van die locatie. Zo verzamelen ze tijdens het festival een kleine collectie die hun persoonlijke festivalroute in beeld brengt.",
        "De kaartjes zijn compact en draagbaar, maar visueel even sterk als de affiches. Ze zijn niet alleen een aandenken — ze versterken ook de band tussen bezoeker en locatie, en maken het festival tot een ervaring die je letterlijk mee naar huis neemt.",
      ],
    },
    {
      icon: <Globe size={20} />,
      tag: "Digitale Deliverables",
      title: "Video, Landingspagina & Reserveringstool",
      body: [
        "Naast de gedrukte materialen omvatte de opdracht ook drie digitale deliverables. De promotievideo brengt de sfeer van CineCity tot leven in bewegend beeld — de golfvormtaal en het kleurensysteem vertalen zich naar animaties en overgangen die de identiteit versterken.",
        "De landingspagina fungeert als digitale toegangspoort tot het festival. Ze is opgebouwd met hetzelfde kleurensysteem en de vertrouwde golfvormen, maar vertaald naar een interactief webformaat. De reserveringstool laat bezoekers tickets reserveren per locatie en per filmvertoning — functioneel, maar ontworpen in de stijl van het festival zodat ook de boeking deel uitmaakt van de beleving.",
      ],
    },
  ]

  const merkPilaren = [
    ["Stad", "Scherm"],
    ["Systeem", "Expressie"],
    ["Print", "Digitaal"],
    ["Beleving", "Informatie"],
  ]

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-red-900 selection:text-white relative font-sans overflow-x-hidden">

      <div className="fixed top-0 left-0 h-1 bg-red-900 z-50 transition-all duration-300 ease-out" style={{ width: `${scrollProgress}%` }} />

      {/* ── 1. HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 relative">
        <Link
          href="/portfolio"
          onClick={() => gaEvent({ action: "cta_terug_portfolio", category: "project_5", label: "/portfolio" })}
          className="absolute top-8 left-6 md:left-12 inline-flex items-center gap-2 text-gray-400 hover:text-red-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Terug naar portfolio</span>
        </Link>

        <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-red-900 mb-6">
          Affiche ontwerp · Editorial · Visuele Identiteit · VDL3
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-gray-900 mb-8">
          {title}<span className="opacity-30 animate-pulse">_</span>
        </h1>

        <div className="w-16 h-[3px] bg-red-900 mx-auto mb-8 animate-expand" />

        <p className="text-lg md:text-2xl text-gray-400 font-light italic max-w-2xl leading-relaxed mb-12">
          "Een stad als podium." — Een volledige visuele identiteit voor het fictieve CineCity Filmfestival Antwerpen, van affichereeks tot digitale tools.
        </p>

        <a
          href="#highlights"
          onClick={() => gaEvent({ action: "cta_ontdek_project", category: "project_5", label: "scroll naar highlights" })}
          className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-8 py-3 text-[11px] font-black tracking-[0.25em] uppercase text-gray-700 hover:border-red-900 hover:text-red-900 transition-all duration-300"
        >
          Ontdek het project <span className="text-base">↓</span>
        </a>

        {/* Hero image */}
        <div
          className="relative w-full max-w-5xl mx-auto mt-20 aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-100 cursor-zoom-in group"
          onClick={() => {
            setLightboxImage("/IMG/affiche-31.png")
            gaEvent({ action: "image_lightbox_open", category: "project_5", label: "hero afbeelding" })
          }}
        >
          <Image src="/IMG/affiche-31.png" alt="CineCity Filmfestival Antwerpen" fill className="object-contain bg-black group-hover:scale-105 transition-all duration-700" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="text-white drop-shadow" size={32} />
          </div>
          <p className="absolute bottom-5 left-0 right-0 text-center text-white/70 text-[10px] uppercase tracking-[0.3em] font-bold">
            CineCity Filmfestival Antwerpen — Affichereeks
          </p>
        </div>
      </section>

      {/* ── 2. HIGHLIGHTS CAROUSEL ── */}
      <section id="highlights" className="py-28 md:py-40 bg-white px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-3 text-center">Overzicht</p>
          <h2 className="text-center text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            De highlights op een rij.
          </h2>
          <p className="text-center text-gray-400 font-light mb-14 text-sm max-w-xl mx-auto">
            Vier kernmomenten uit het project — van visuele identiteit tot aandenken per festivallocatie.
          </p>

          <div className="flex gap-2 justify-center flex-wrap mb-10">
            {highlights.map((h, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveHighlight(i)
                  gaEvent({ action: `highlight_click_${i + 1}`, category: "project_5", label: `highlight ${i + 1}: ${h.label}` })
                }}
                className={`w-9 h-9 rounded-full text-xs font-black border-2 transition-all duration-200 ${
                  activeHighlight === i
                    ? "bg-red-900 border-red-900 text-white scale-110"
                    : "border-gray-200 text-gray-400 hover:border-red-900 hover:text-red-900"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 min-h-100">
            <div
              className="relative aspect-video md:aspect-auto md:min-h-80 cursor-zoom-in bg-black"
              onClick={() => {
                setLightboxImage(highlights[activeHighlight].img)
                gaEvent({ action: "image_lightbox_open", category: "project_5", label: `highlight afbeelding ${activeHighlight + 1}` })
              }}
            >
              <Image src={highlights[activeHighlight].img} alt="Highlight" fill className="object-contain" />
            </div>
            <div className="p-10 md:p-16 flex flex-col justify-center gap-6">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-900/50">
                {String(activeHighlight + 1).padStart(2, "0")} / {String(highlights.length).padStart(2, "0")}
              </span>
              <p className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
                {highlights[activeHighlight].label}
              </p>
              <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base italic">
                {highlights[activeHighlight].sub}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. BENTO GRID ── */}
      <section className="py-28 md:py-40 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-3">Beeldmateriaal</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            Affiches & Kaartjes.
          </h2>
          <p className="text-gray-400 mb-16 font-light text-sm">
            Een selectie uit de volledige affichereeks en de locatiekaartjes — één samenhangend visueel systeem.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div
              className="col-span-2 relative aspect-video rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-black"
              onClick={() => {
                setLightboxImage(bentoItems[0].img)
                gaEvent({ action: "image_lightbox_open", category: "project_5", label: bentoItems[0].text })
              }}
            >
              <Image src={bentoItems[0].img} alt="Bento 1" fill className="object-contain group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-light italic">{bentoItems[0].text}</p>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="text-white" size={18} />
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4">
              {[bentoItems[1], bentoItems[2]].map((item, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-black"
                  onClick={() => {
                    setLightboxImage(item.img)
                    gaEvent({ action: "image_lightbox_open", category: "project_5", label: item.text })
                  }}
                >
                  <Image src={item.img} alt="Bento" fill className="object-contain group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-light italic">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative aspect-video rounded-2xl overflow-hidden shadow-md group cursor-zoom-in"
            onClick={() => {
              setLightboxImage(bentoItems[3].img)
              gaEvent({ action: "image_lightbox_open", category: "project_5", label: bentoItems[3].text })
            }}
          >
            <Image src={bentoItems[3].img} alt="Bento 4" fill className="object-cover group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-light italic">{bentoItems[3].text}</p>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="text-white" size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3B. BOOKLET + EXTRA KAARTJES ── */}
      <section className="py-10 pb-28 md:pb-40 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Booklet */}
            <div
              className="relative aspect-video rounded-2xl overflow-hidden shadow-md group cursor-zoom-in"
              onClick={() => {
                setLightboxImage("/IMG/booklet.jpg")
                gaEvent({ action: "image_lightbox_open", category: "project_5", label: "booklet spread" })
              }}
            >
              <Image src="/IMG/booklet.jpg" alt="CineCity booklet" fill className="object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-light italic">Booklet — het festivalprogramma als editorial object.</p>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="text-white" size={18} />
              </div>
            </div>
            {/* Extra kaartje 3 */}
            <div
              className="relative aspect-video rounded-2xl overflow-hidden shadow-md group cursor-zoom-in"
              onClick={() => {
                setLightboxImage("/IMG/extra3.jpg")
                gaEvent({ action: "image_lightbox_open", category: "project_5", label: "locatiekaartje 3" })
              }}
            >
              <Image src="/IMG/extra3.jpg" alt="CineCity locatiekaartje" fill className="object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-light italic">Locatiekaartje — een tastbaar aandenken per festivallocatie.</p>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="text-white" size={18} />
              </div>
            </div>
          </div>

          {/* Film affiches */}
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-black"
            onClick={() => {
              setLightboxImage("/IMG/affichefilm-44.png")
              gaEvent({ action: "image_lightbox_open", category: "project_5", label: "filmaffiche variant 2" })
            }}
          >
            <Image src="/IMG/affichefilm-44.png" alt="CineCity filmaffiche" fill className="object-contain group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-light italic">Filmaffiche variant 2 — de identiteit toegepast op een individuele vertoning.</p>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="text-white" size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. TEKST-SECTIES ── */}
      <section className="py-28 md:py-40 bg-white px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-3">Achtergrond</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-20 tracking-tight uppercase">
            Het verhaal achter het project.
          </h2>

          <div className="space-y-0">
            {sections.map((s, i) => (
              <div
                key={i}
                onClick={() => gaEvent({ action: `tekstsectie_click_${s.tag}`, category: "project_5", label: s.title })}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start border-t border-gray-200 py-14 cursor-pointer group"
              >
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3 text-red-900 mb-2">
                    {s.icon}
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">{s.tag}</p>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900 group-hover:text-red-900 transition-colors">{s.title}</h3>
                </div>
                <div className="md:col-span-8 space-y-5 text-gray-600 font-light leading-relaxed text-base md:text-lg">
                  {s.body.map((p, j) => <p key={j}>{p}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN STRATEGIE ── */}
      <section className="py-28 md:py-40 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-3 text-center">Spanningsvelden</p>
          <h2 className="text-center text-3xl md:text-4xl font-black text-gray-900 mb-16 tracking-tight uppercase">
            Design Strategie.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {merkPilaren.map(([a, b], i) => (
              <div
                key={i}
                onClick={() => gaEvent({ action: `spanningsveld_click_${a}_vs_${b}`, category: "project_5", label: `${a} vs ${b}` })}
                className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 space-y-4 hover:border-red-900/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xl uppercase tracking-tight text-gray-900">{a}</span>
                  <span className="text-[10px] font-black text-red-900/40 tracking-widest">VS</span>
                  <span className="font-black text-xl uppercase tracking-tight text-gray-400">{b}</span>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-red-900/20 via-gray-200 to-transparent" />
                <p className="text-gray-400 font-light text-xs italic">
                  Een bewuste keuze tussen {a.toLowerCase()} en {b.toLowerCase()} als ontwerpparameter.
                </p>
              </div>
            ))}
          </div>

          {/* Projectinfo card */}
          <div className="bg-white rounded-3xl p-10 md:p-14 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="space-y-8">
              {[
                { label: "Opleiding", value: "Grafisch Design — AP Hogeschool" },
                { label: "Vak", value: "VDL3 — Visuele Communicatie" },
                { label: "Deliverables", value: "9 affiches · booklet · kaartjes · video · landingspagina · reserveringstool" },
              ].map((item, i) => (
                <div key={i} className={i > 0 ? "border-t border-gray-200 pt-8" : ""}>
                  <p className="text-[10px] font-black tracking-widest uppercase text-red-900 mb-1">{item.label}</p>
                  <p className="font-black text-lg uppercase tracking-tight text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="md:border-l border-gray-200 md:pl-10 space-y-6">
              <p className="text-[10px] font-black tracking-widest uppercase text-red-900 mb-4">Deliverables</p>
              <div className="space-y-3">
                {[
                  { icon: <Palette size={14} />, label: "Affichereeks (9 varianten)" },
                  { icon: <FileText size={14} />, label: "Festival Booklet" },
                  { icon: <Ticket size={14} />, label: "Locatiekaartjes (extra)" },
                  { icon: <Video size={14} />, label: "Promotievideo" },
                  { icon: <Globe size={14} />, label: "Landingspagina" },
                  { icon: <CalendarCheck size={14} />, label: "Reserveringstool" },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => gaEvent({ action: `deliverable_click_${item.label}`, category: "project_5", label: item.label })}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span className="text-red-900">{item.icon}</span>
                    <span className="text-gray-500 font-light text-sm group-hover:text-gray-900 transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-red-900 mb-3">
                  <Sparkles size={14} />
                  <p className="text-[10px] font-black tracking-widest uppercase">Reflectie</p>
                </div>
                <p className="text-gray-500 font-light text-sm italic leading-relaxed">
                  "CineCity leerde me hoe je een visueel systeem opbouwt dat flexibel genoeg is om over tientallen dragers te werken — van A3-affiche tot digitale interface — zonder zijn identiteit te verliezen."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => {
            setLightboxImage(null)
            gaEvent({ action: "image_lightbox_close", category: "project_5", label: "lightbox gesloten" })
          }}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white p-2 transition-colors">
            <X size={32} />
          </button>
          <div className="relative w-full h-[80vh] max-w-5xl">
            <Image src={lightboxImage} alt="Fullscreen" fill className="object-contain" />
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