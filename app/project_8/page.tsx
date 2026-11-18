"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, X, ZoomIn, Package, Users, Layers, Zap, Globe, FileText, Cpu, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import * as THREE from "three"
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

const gaEvent = ({ action, category, label }: { action: string; category: string; label: string }) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
    })
    console.log(`[GA] ${action} → ${label}`)
  }
}

export default function LumaProject() {
  const fullTitle = "LUMA"
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [activeHighlight, setActiveHighlight] = useState(0)

  const scrollMilestones = useRef<Set<number>>(new Set())
  const pageStartTime = useRef<number>(Date.now())
  const router = useRouter()

  // Three.js refs
  const canvasRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animFrameRef = useRef<number>(0)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState(false)

  useEffect(() => {
    gaEvent({ action: "page_view_luma", category: "luma", label: "LUMA pagina geladen" })
    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000)
      gaEvent({ action: "time_on_page", category: "luma", label: `${timeSpent} seconden` })
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setDisplayedTitle(fullTitle.slice(0, index + 1))
      index++
      if (index === fullTitle.length) clearInterval(interval)
    }, 200)
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
          gaEvent({ action: `scroll_depth_${milestone}`, category: "luma", label: `${milestone}% gescrolld` })
        }
      })
    }
    window.addEventListener("scroll", update)
    return () => window.removeEventListener("scroll", update)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // ── Three.js 3D viewer ──
  useEffect(() => {
    if (!canvasRef.current) return
    const container = canvasRef.current
    const w = container.clientWidth
    const h = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf9fafb)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
    camera.position.set(0, 0, 5)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 7)
    dirLight.castShadow = true
    scene.add(dirLight)
    const fillLight = new THREE.DirectionalLight(0xffe8d6, 0.4)
    fillLight.position.set(-5, -3, -5)
    scene.add(fillLight)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.5
    controls.minDistance = 1
    controls.maxDistance = 20
    controlsRef.current = controls

    // Load OBJ — vervang het pad hieronder door je eigen .obj bestand
    const loader = new OBJLoader()
    loader.load(
      "/IMG-2/LUMA_capsule_3D.obj", // ← JE PAD HIER
      (obj) => {
        // Centreer het model automatisch
        const box = new THREE.Box3().setFromObject(obj)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 3 / maxDim
        obj.scale.setScalar(scale)
        obj.position.sub(center.multiplyScalar(scale))
        obj.rotation.z = Math.PI // 180° draaien

        // Rood materiaal — kleur past bij de LUMA stijl
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            ;(child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              roughness: 0.4,
              metalness: 0.1,
            })
          }
        })

        scene.add(obj)
        setModelLoaded(true)
        gaEvent({ action: "3d_model_loaded", category: "luma", label: "capsule OBJ geladen" })
      },
      undefined,
      () => {
        setModelError(true)
      }
    )

    // Animate
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      if (!container) return
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", onResize)
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  const highlights = [
    {
      number: "01",
      label: "Het concept",
      desc: "LUMA is een gedecentraliseerd, offline communicatiesysteem voor Enschede in 2035. Via herbruikbare capsules en een netwerk van lokale communicatiepunten blijven mensen verbonden — ook wanneer internet of elektriciteit uitvalt.",
      icon: <Globe size={18} />,
    },
    {
      number: "02",
      label: "De capsules",
      desc: "Fysieke berichten worden verstuurd in 3D-geprinte capsules. Vijf kleurcodes — oranje, blauw, groen, geel en grijs — geven aan om welk soort bericht het gaat: van dringend noodbericht tot persoonlijke brief.",
      icon: <Package size={18} />,
    },
    {
      number: "03",
      label: "Het netwerk",
      desc: "Connection Centers fungeren als centrale ontmoetings- en verdeelpunten. Kleinere LUMA Nodes zijn verspreid over buurten. Lokaal transport verloopt via een ondergronds pneumatisch buizensysteem.",
      icon: <Layers size={18} />,
    },
    {
      number: "04",
      label: "De identiteit",
      desc: "De visuele identiteit combineert het lettertype Akira Expanded met kleurgecodeerde formulieren, adreslabels en posters. Slogan: PEOPLE PLACES MESSAGES AGAIN.",
      icon: <Zap size={18} />,
    },
  ]

  const sections = [
    {
      icon: <Globe size={20} />,
      tag: "Concept",
      title: "Offline verbonden in 2035",
      body: [
        "Tijdens het International Multidisciplinary Lab werkte ons team van vier studenten aan een toekomstgericht ontwerp voor Enschede in 2035. De centrale vraag: hoe kunnen mensen met elkaar verbonden blijven wanneer internet, mobiele netwerken of elektriciteit niet meer goed werken?",
        "LUMA is ons antwoord. Een gedecentraliseerd communicatiesysteem dat niet afhankelijk is van digitale infrastructuur. Mensen schrijven fysieke berichten, plaatsen ze in herbruikbare capsules en versturen ze via een netwerk van lokale communicatiepunten — de LUMA Nodes en Connection Centers.",
      ],
    },
    {
      icon: <Package size={20} />,
      tag: "Prototypes",
      title: "Van 3D-model tot capsule",
      body: [
        "Een belangrijk onderdeel van het project waren de fysieke capsuleprototypes. Samen met Kenji ontwierp ik het 3D-model van de capsule. De onderdelen werden geprint, geschuurd, geschilderd en getest op waterdichtheid.",
        "Het productieproces verliep niet altijd zonder problemen — een print mislukte door opgeraakt filament, en enkele capsules moesten opnieuw worden gemaakt. Maar die tegenslag dwong ons om het ontwerp stap voor stap te verbeteren. De uiteindelijke prototypes in vijf kleurcodes konden we trots tonen tijdens de eindpresentatie.",
      ],
    },
    {
      icon: <FileText size={20} />,
      tag: "Formulieren & Labels",
      title: "Systeem in detail",
      body: [
        "Voor elk type bericht — van noodbericht tot internationale brief — ontwierpen we aparte A4-formulieren. Elk formulier heeft een eigen nummer en kleurcode die overeenkomt met de bijbehorende capsule. Adreslabels zorgen ervoor dat de capsule altijd de juiste bestemming bereikt.",
        "Daarnaast maakten we een LUMA Message Guide: een overzichtelijk boekje dat uitlegt hoe het systeem werkt en hoe de formulieren correct ingevuld worden. Het was onze manier om het concept direct toepasbaar te maken, niet alleen als toekomstverhaal maar als tastbaar systeem.",
      ],
    },
    {
      icon: <Cpu size={20} />,
      tag: "Conceptvideo & Branding",
      title: "Visie tot leven gebracht",
      body: [
        "Om LUMA overtuigend te presenteren maakten Lloyd en Kenji een conceptvideo met AI-gegenereerde beelden en animaties. De video toont hoe het communicatiesysteem er in Enschede in 2035 zou kunnen uitzien — van het versturen van een capsule tot het ophalen ervan bij een Connection Center.",
        "De visuele identiteit van LUMA is gebouwd op het lettertype Akira Expanded Super Bold, diagonale grafische elementen en de vijf kleurcodes van het berichtensysteem. Posters, formulieren, capsules en presentatieonderdelen vormen samen één samenhangend geheel.",
      ],
    },
    {
      icon: <Users size={20} />,
      tag: "Samenwerking",
      title: "Multidisciplinair in twee weken",
      body: [
        "LUMA was een groepsproject van vier studenten: Thibaut Vanden Eynden, Lloyd Bouter, Kenji Gooris en Anujin Tumurkhuu. In amper twee weken werkten we van eerste brainstorm tot volledig uitgewerkt toekomstconcept.",
        "Mijn bijdrage omvatte planning, onderzoek, conceptteksten, technische tekeningen, 3D-modelleren, capsuleafwerking, berichtformulieren, adreslabels en eindpresentatie. Iedere ochtend bespraken we de dagplanning en hielpen we elkaar waar nodig — een aanpak die ons hielp om het project op tijd af te krijgen.",
      ],
    },
  ]

  const merkPilaren = [
    ["Fysiek", "Digitaal"],
    ["Lokaal", "Netwerk"],
    ["Offline", "Verbonden"],
    ["Systeem", "Gemeenschap"],
  ]

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-red-900 selection:text-white relative font-sans overflow-x-hidden">

      {/* SCROLL PROGRESS */}
      <div
        className="fixed top-0 left-0 h-1 bg-red-900 z-50 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

        {/* Terugknop */}
        <div className="absolute top-8 left-6 md:left-12 z-10">
          <button
            onClick={() => router.push("/portfolio")}
            className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-red-900 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Terug naar portfolio
          </button>
        </div>

      {/* ── 1. HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-16 lg:px-24 pt-16 pb-20">

        <div className="w-full">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-red-900 mb-8">
            IML · Groepsproject · 2026 · AP Hogeschool Antwerpen
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-black uppercase tracking-tighter text-gray-900 leading-[0.85] mb-4 text-center">
            {displayedTitle}<span className="opacity-30 animate-pulse">_</span>
          </h1>

          <div className="w-16 h-0.75 bg-red-900 mx-auto mb-8 animate-expand" />

          <p className="text-gray-500 text-xl md:text-2xl font-light italic leading-relaxed mb-12 max-w-2xl mx-auto">
            "People Places Messages Again." — Een offline communicatiesysteem voor Enschede in 2035, gebouwd rond fysieke capsules, lokale netwerken en menselijke verbinding.
          </p>

          <button
            onClick={() => {
              gaEvent({ action: "cta_ontdek_project", category: "luma", label: "scroll naar highlights" })
              document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-8 py-3 text-[11px] font-black tracking-[0.25em] uppercase text-gray-700 hover:border-red-900 hover:text-red-900 transition-all duration-300"
          >
            Ontdek het project <span className="text-base">↓</span>
          </button>

          {/* Hero image */}
          <div
            className="relative w-full max-w-5xl mx-auto mt-20 aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-100 cursor-zoom-in group"
            onClick={() => {
              setLightboxSrc("/IMG-2/LUMA_zwart.png")
              gaEvent({ action: "image_lightbox_open", category: "luma", label: "hero afbeelding" })
            }}
          >
            <Image
              src="/IMG-2/LUMA_zwart.png"
              alt="LUMA — People Places Messages Again"
              fill
              className="object-cover bg-gray-100 group-hover:scale-105 transition-all duration-700"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="text-white drop-shadow" size={32} />
            </div>
            <p className="absolute bottom-5 left-0 right-0 text-center text-white/70 text-[10px] uppercase tracking-[0.3em] font-bold">
              LUMA — Offline communicatiesysteem Enschede 2035
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. HIGHLIGHTS ── */}
      <section id="highlights" className="py-28 md:py-40 bg-white px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-3 text-center">Overzicht</p>
          <h2 className="text-center text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            Vier pijlers van het project.
          </h2>
          <p className="text-center text-gray-400 font-light mb-14 text-sm max-w-xl mx-auto">
            Van concept tot capsule — de kernonderdelen van LUMA op een rij.
          </p>

          <div className="flex gap-2 justify-center flex-wrap mb-10">
            {highlights.map((h, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveHighlight(i)
                  gaEvent({ action: `highlight_click_${i + 1}`, category: "luma", label: `highlight ${i + 1}: ${h.label}` })
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

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 min-h-80">
            <div className="p-10 md:p-16 flex flex-col justify-center gap-6 bg-gray-50">
              <div className="flex items-center gap-3 text-red-900">
                {highlights[activeHighlight].icon}
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-900/50">
                  {highlights[activeHighlight].number} / {String(highlights.length).padStart(2, "0")}
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
                {highlights[activeHighlight].label}
              </p>
              <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base italic">
                {highlights[activeHighlight].desc}
              </p>
            </div>
            <div
              className="relative aspect-video md:aspect-auto md:min-h-80 cursor-zoom-in bg-gray-100"
              onClick={() => {
                const imgs = ["/IMG/luma-concept.jpg", "/IMG/luma-capsule.jpg", "/IMG/luma-network.jpg", "/IMG/luma-branding.jpg"]
                setLightboxSrc(imgs[activeHighlight])
                gaEvent({ action: "image_lightbox_open", category: "luma", label: `highlight afbeelding ${activeHighlight + 1}` })
              }}
            >
              <Image
                src={["/IMG-2/Luma9.jpg", "/IMG-2/Luma2.jpg", "/IMG-2/Luma10.jpg", "/IMG-2/Luma5.jpg"][activeHighlight]}
                alt="LUMA highlight"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DELIVERABLES ── */}
      <section className="py-28 md:py-40 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-900 mb-3">Deliverables</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            Alles wat we maakten.
          </h2>
          <p className="text-gray-400 mb-20 font-light text-sm">
            Van 3D-geprinte capsules tot conceptvideo — elk onderdeel op een rij.
          </p>

          {/* helper: label boven elk blok */}
          {/* ── 1. Capsule — 3D model ── */}
          <div className="mb-16">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-900 mb-1">01 — Capsule</p>
            <p className="text-gray-400 font-light text-sm mb-5">Interactief 3D model — roteer en zoom vrij.</p>
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50" style={{ aspectRatio: "16/9" }}>
              <div ref={canvasRef} className="w-full h-full absolute inset-0" />
              {!modelLoaded && !modelError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50/90 pointer-events-none">
                  <div className="w-8 h-8 border-2 border-red-900/30 border-t-red-900 rounded-full animate-spin" />
                  <p className="text-xs text-gray-400 font-light tracking-widest uppercase">Model laden…</p>
                </div>
              )}
              {modelError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 pointer-events-none">
                  <Package size={32} className="text-gray-300" />
                  <p className="text-xs text-gray-400 font-light text-center px-8">Zet je .obj op <code className="font-mono text-red-900/70">/IMG/luma-capsule.obj</code></p>
                </div>
              )}
              {modelLoaded && (
                <>
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 pointer-events-none">
                    <RotateCcw size={12} className="text-white/70" />
                    <span className="text-white/70 text-[10px] uppercase tracking-widest font-bold">Roteerbaar</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── 2. Conceptvideo ── */}
          <div className="mb-16">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-900 mb-1">02 — Conceptvideo</p>
            <p className="text-gray-400 font-light text-sm mb-5">AI-gegenereerde beelden tonen LUMA in gebruik in Enschede 2035.</p>
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gray-900" style={{ aspectRatio: "16/9" }}>
              <video
                src="/IMG-2/LUMA_movie.mp4"
                className="absolute inset-0 w-full h-full object-cover"
                controls
                poster="/IMG-2/LUMA_zwart.png"
                onPlay={() => gaEvent({ action: "video_play", category: "luma", label: "conceptvideo gestart" })}
                onEnded={() => gaEvent({ action: "video_ended", category: "luma", label: "conceptvideo volledig bekeken" })}
              />
            </div>
          </div>

          {/* ── 3. Blauwdruk ── */}
          <div className="mb-16">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-900 mb-1">03 — Blauwdruk</p>
            <p className="text-gray-400 font-light text-sm mb-5">Schematisch overzicht van het LUMA-netwerk en de volledige infrastructuur.</p>
            <div
              className="relative rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-100"
              style={{ aspectRatio: "297/210" }}
              onClick={() => {
                setLightboxSrc("/IMG-2/Luma10.jpg")
                gaEvent({ action: "image_lightbox_open", category: "luma", label: "blauwdruk" })
              }}
            >
              <Image src="/IMG-2/Luma10.jpg" alt="LUMA blauwdruk" fill className="object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="text-white" size={18} />
              </div>
            </div>
          </div>

          {/* ── 4. Technische tekeningen ── */}
          <div className="mb-16">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-900 mb-1">04 — Technische tekeningen</p>
            <p className="text-gray-400 font-light text-sm mb-5">Maatvoering en opbouw van de capsule en het LUMA station.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "/IMG-2/Luma7.jpg", label: "Tekening 1 — capsule opbouw" },
                { src: "/IMG-2/Luma8.jpg", label: "Tekening 2 — LUMA station" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-100"
                  style={{ aspectRatio: "297/210" }}
                  onClick={() => {
                    setLightboxSrc(item.src)
                    gaEvent({ action: "image_lightbox_open", category: "luma", label: item.label })
                  }}
                >
                  <Image src={item.src} alt={item.label} fill className="object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  <p className="absolute bottom-3 left-4 text-white text-xs font-light italic">{item.label}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="text-white" size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 5. Posters ── */}
          <div className="mb-16">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-900 mb-1">05 — Posters</p>
            <p className="text-gray-400 font-light text-sm mb-5">Zes posters voor de visuele identiteit van LUMA — vijf staand, één liggend.</p>
            {/* Rij A: 3 staand */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { src: "/IMG-2/Luma1.jpg", label: "Poster 1" },
                { src: "/IMG-2/Luma2.jpg", label: "Poster 2" },
                { src: "/IMG-2/Luma3.jpg", label: "Poster 3" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-100"
                  style={{ aspectRatio: "210/297" }}
                  onClick={() => {
                    setLightboxSrc(item.src)
                    gaEvent({ action: "image_lightbox_open", category: "luma", label: item.label })
                  }}
                >
                  <Image src={item.src} alt={item.label} fill className="object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-linear-to-trom-black/40 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-white text-xs font-light italic">{item.label}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="text-white" size={15} />
                  </div>
                </div>
              ))}
            </div>
            {/* Rij B: poster 4 liggend (volle breedte) */}
            <div className="mb-4">
              <div
                className="relative rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-100"
                style={{ aspectRatio: "297/210" }}
                onClick={() => {
                  setLightboxSrc("/IMG-2/Luma9.jpg")
                  gaEvent({ action: "image_lightbox_open", category: "luma", label: "Poster 4" })
                }}
              >
                <Image src="/IMG-2/Luma9.jpg" alt="Poster 4" fill className="object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-linear-to-trom-black/40 to-transparent" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-light italic">Poster 4</p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="text-white" size={15} />
                </div>
              </div>
            </div>
            {/* Rij C: posters 5 + 6 staand, 2 kolommen */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "/IMG-2/Luma4.jpg", label: "Poster 5" },
                { src: "/IMG-2/Luma5.jpg", label: "Poster 6" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-100"
                  style={{ aspectRatio: "210/297" }}
                  onClick={() => {
                    setLightboxSrc(item.src)
                    gaEvent({ action: "image_lightbox_open", category: "luma", label: item.label })
                  }}
                >
                  <Image src={item.src} alt={item.label} fill className="object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-white text-xs font-light italic">{item.label}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="text-white" size={15} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 6. Invulbladen ── */}
          <div className="mb-16">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-900 mb-1">06 — Invulbladen</p>
            <p className="text-gray-400 font-light text-sm mb-5">Per berichttype een eigen A4-formulier met kleurcode — van noodbericht tot persoonlijke brief.</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { src: "/IMG-2/Luma_invulbladen_1.jpg", label: "Emergency message" },
                { src: "/IMG-2/Luma_invulbladen_2.jpg", label: "International letter" },
                { src: "/IMG-2/Luma_invulbladen_3.jpg", label: "Neighbourhood message" },
                { src: "/IMG-2/Luma_invulbladen_4.jpg", label: "Regional bulletin" },
                { src: "/IMG-2/Luma_invulbladen_5.jpg", label: "Personal letter" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-100"
                  style={{ aspectRatio: "297/210" }}
                  onClick={() => {
                    setLightboxSrc(item.src)
                    gaEvent({ action: "image_lightbox_open", category: "luma", label: item.label })
                  }}
                >
                  <Image src={item.src} alt={item.label} fill className="object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-white text-xs font-light italic">{item.label}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="text-white" size={15} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 7. Adreslabel ── */}
          <div className="mb-16">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-900 mb-1">07 — Adreslabel</p>
            <p className="text-gray-400 font-light text-sm mb-5">Bestemming en kleurcode per capsule — bevestigd aan de buitenkant.</p>
            <div
              className="relative rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-100"
              style={{ aspectRatio: "297/210" }}
              onClick={() => {
                setLightboxSrc("/IMG/luma-label.jpg")
                gaEvent({ action: "image_lightbox_open", category: "luma", label: "adreslabel" })
              }}
            >
              <Image src="/IMG-2/Luma_label_1.jpg" alt="LUMA label" fill className="object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="text-white" size={16} />
              </div>
            </div>
          </div>

          {/* ── 8. PDF boekje ── */}
          <div className="mb-4">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-900 mb-1">08 — PDF boekje</p>
            <p className="text-gray-400 font-light text-sm mb-3">Overzicht van de AI-prompts en het creatieve proces achter de conceptvideo.</p>
            <a
              href="/IMG-2/LUMA boekje (A4).pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gaEvent({ action: "pdf_open", category: "luma", label: "PDF boekje geopend" })}
              className="inline-flex items-center gap-2 mb-5 text-[11px] font-black tracking-[0.2em] uppercase text-red-900 hover:text-red-700 transition-colors border-b border-red-900/30 hover:border-red-700 pb-0.5"
            >
              <FileText size={13} />
              Openen in nieuw tabblad ↗
            </a>
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100" style={{ aspectRatio: "210/297" }}>
              <iframe
                src="/IMG-2/LUMA boekje (A4).pdf"
                className="w-full h-full"
                title="LUMA boekje — AI-prompts"
              />
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
                onClick={() => gaEvent({ action: `tekstsectie_click_${s.tag}`, category: "luma", label: s.title })}
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

      {/* ── 5. SPANNINGSVELDEN ── */}
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
                onClick={() => gaEvent({ action: `spanningsveld_click_${a}_vs_${b}`, category: "luma", label: `${a} vs ${b}` })}
                className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 space-y-4 hover:border-red-900/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xl uppercase tracking-tight text-gray-900">{a}</span>
                  <span className="text-[10px] font-black text-red-900/40 tracking-widest">VS</span>
                  <span className="font-black text-xl uppercase tracking-tight text-gray-400">{b}</span>
                </div>
                <div className="w-full h-px bg-linear-to-r from-red-900/20 via-gray-200 to-transparent" />
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
                { label: "Project", value: "LUMA*" },
                { label: "Programma", value: "International Multidisciplinary Lab (IML)" },
                { label: "Opleiding", value: "Grafische en Digitale Media — AP Hogeschool" },
                { label: "Team", value: "Team 4 — 4 studenten" },
                { label: "Periode", value: "Oktober – November 2026" },
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
                  { icon: <Package size={14} />, label: "3D-geprinte capsuleprototypes (5 kleuren)" },
                  { icon: <Cpu size={14} />, label: "Conceptvideo met AI-beelden en animaties" },
                  { icon: <FileText size={14} />, label: "Invulbladen — 7 berichtformulieren" },
                  { icon: <Zap size={14} />, label: "Adreslabel per capsule" },
                  { icon: <FileText size={14} />, label: "PDF boekje — AI-prompts en creatief proces" },
                  { icon: <Layers size={14} />, label: "Blauwdruk LUMA-netwerk" },
                  { icon: <Layers size={14} />, label: "2 technische tekeningen (capsule + station)" },
                  { icon: <Globe size={14} />, label: "6 posters — visuele identiteit" },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => gaEvent({ action: `deliverable_click_${item.label}`, category: "luma", label: item.label })}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span className="text-red-900">{item.icon}</span>
                    <span className="text-gray-500 font-light text-sm group-hover:text-gray-900 transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-red-900 mb-3">
                  <Users size={14} />
                  <p className="text-[10px] font-black tracking-widest uppercase">Reflectie</p>
                </div>
                <p className="text-gray-500 font-light text-sm italic leading-relaxed">
                  "LUMA leerde me hoe je een complex toekomstconcept in amper twee weken vertaalt naar een samenhangend systeem — van onderzoek en 3D-modellen tot visuele identiteit en fysieke presentatie."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => {
            setLightboxSrc(null)
            gaEvent({ action: "image_lightbox_close", category: "luma", label: "lightbox gesloten" })
          }}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white p-2 transition-colors">
            <X size={32} />
          </button>
          <div className="relative w-full h-[80vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={lightboxSrc} alt="Fullscreen" fill className="object-contain" />
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