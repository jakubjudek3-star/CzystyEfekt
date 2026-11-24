import { useState, useRef, useEffect, useCallback } from 'react'

const NAV_LINKS = ['Usługi', 'Efekty', 'Cennik', 'Kontakt']

const SERVICES = [
  {
    title: 'Pranie Tapicerki Meblowej',
    desc: 'Pranie i odświeżanie kanap, foteli, krzeseł i narożników. Skuteczne usuwanie plam i nieprzyjemnych zapachów przy użyciu bezpiecznych środków.',
    tags: ['Kanapy', 'Fotele', 'Krzesła', 'Narożniki', 'Usuwanie plam'],
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=360&fit=crop&auto=format',
  },
  {
    title: 'Czyszczenie i Ozonowanie Aut',
    desc: 'Profesjonalne czyszczenie wnętrza pojazdu: fotele, podsufitki, bagażniki oraz neutralizacja nieprzyjemnych zapachów metodą ozonowania.',
    tags: ['Fotele', 'Podsufitki', 'Bagażniki', 'Ozonowanie'],
    img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=360&fit=crop&auto=format',
  },
  {
    title: 'Sprzątanie Domów i Mieszkań',
    desc: 'Kompleksowe sprzątanie wnętrz: mycie, odkurzanie, odświeżanie pomieszczeń. Zadbamy o każdy kąt Twojego domu lub mieszkania.',
    tags: ['Kompleksowe', 'Odświeżanie', 'Mycie', 'Odkurzanie'],
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=360&fit=crop&auto=format',
  },
]

const REVIEWS = [
  {
    name: 'Monika Wiśniewska',
    location: 'Gorzów Wlkp.',
    text: 'Jestem zachwycona efektem! Narożnik wyglądał jak nowy po praniu. Pełen profesjonalizm, punktualność i świetna cena. Polecam z całego serca!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
  },
  {
    name: 'Krzysztof Dąbrowski',
    location: 'Skwierzyna',
    text: 'Auto pachnie jak nowe po ozonowaniu. Fotele wyglądają rewelacyjnie. Łukasz to prawdziwy fachowiec – szybko, sprawnie i bez niespodzianek.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
  },
  {
    name: 'Agnieszka Kowalska',
    location: 'Kostrzyn n. Odrą',
    text: 'Kompleksowe sprzątanie mieszkania na najwyższym poziomie. Świetny kontakt, dojazd do klienta i bardzo uczciwa wycena. Wracam regularnie!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
  },
  {
    name: 'Tomasz Lewandowski',
    location: 'Strzelce Kraj.',
    text: 'Kanapę zakupioną na targu myślałem, że trzeba wyrzucić. Po praniu wygląda jak ze sklepu! Polecam każdemu – profesjonalna robota!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format',
  },
]

const GALLERY = [
  { src: '/images/tapicerka-samochodowa.jpg', caption: 'Tapicerka samochodowa' },
  { src: '/images/pranie-dywanu.jpg', caption: 'Czyszczenie dywanów i wykładzin' },
  { src: '/images/lozko-materac.jpg', caption: 'Pranie łóżek tapicerowanych i materacy' },
]

function Photo({ src, alt, className, style, draggable }: {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  draggable?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (failed) return (
    <div role="img" aria-label={alt} className={`${className} flex items-center justify-center bg-slate-200 text-slate-700`} style={style}>
      <svg aria-hidden="true" className="w-12 h-12 shrink-0" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="7" width="38" height="34" rx="4" />
        <circle cx="16" cy="18" r="4" />
        <path d="m6 36 12-12 9 9 7-7 9 10" />
      </svg>
      <span className="sr-only">Nie udało się wczytać zdjęcia.</span>
    </div>
  )
  return <img src={src} alt={alt} className={className} style={style} draggable={draggable} onError={() => setFailed(true)} />
}

/* ─────────────────────────────────────────────────────────
   REUSABLE BEFORE / AFTER SLIDER
───────────────────────────────────────────────────────── */
interface SliderProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  /** CSS aspect-ratio string, e.g. "16/7" */
  aspectRatio?: string
  /** Apply sepia/dark filter to the before image (same URL trick) */
  dirtyFilter?: boolean
  rounded?: string
}

function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Przed czyszczeniem',
  afterAlt = 'Po czyszczeniu',
  aspectRatio = '4/3',
  dirtyFilter = false,
  rounded = 'rounded-2xl',
}: SliderProps) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const calcPos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setPos(pct)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging.current) calcPos(e.clientX) }
    const onUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [calcPos])

  return (
    <div
      ref={containerRef}
      style={{ aspectRatio, cursor: 'col-resize', background: '#e2e8f0' }}
      role="slider"
      tabIndex={0}
      aria-label="Porównanie kanapy przed i po czyszczeniu"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      className={`relative overflow-hidden select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${rounded}`}
      onKeyDown={e => {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
          e.preventDefault()
          setPos(current => e.key === 'Home' ? 0 : e.key === 'End' ? 100 : Math.min(100, Math.max(0, current + (e.key === 'ArrowLeft' ? -5 : 5))))
        }
      }}
      onMouseDown={e => { isDragging.current = true; calcPos(e.clientX) }}
      onTouchMove={e => calcPos(e.touches[0].clientX)}
      onTouchStart={e => calcPos(e.touches[0].clientX)}
    >
      {/* AFTER — clean (right, base layer) */}
      <Photo
        src={afterSrc}
        alt={afterAlt}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* BEFORE — dirty (left, clipped) */}
      <Photo
        src={beforeSrc}
        alt={beforeAlt}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          filter: dirtyFilter
            ? 'sepia(0.9) brightness(0.48) saturate(0.28) contrast(1.18)'
            : undefined,
        }}
      />
      {/* Extra tint for dirty side */}
      {dirtyFilter && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            background: 'rgba(70,35,5,0.32)',
          }}
        />
      )}

      {/* ── Divider line ── */}
      <div
        className="absolute inset-y-0 w-px bg-white pointer-events-none"
        style={{ left: `${pos}%`, boxShadow: '0 0 8px 2px rgba(255,255,255,0.6)' }}
      />

      {/* ── Circular drag handle ── */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="w-11 h-11 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.28)] flex flex-col items-center justify-center gap-0.5">
          {/* up chevron */}
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          {/* down chevron */}
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ── PRZED label (top-left) ── */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="bg-black text-white text-xs font-black px-2.5 py-1 rounded-full tracking-widest uppercase">
          Przed
        </span>
      </div>

      {/* ── PO label (top-right) ── */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-full tracking-widest uppercase">
          Po
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   SHARED UI HELPERS
───────────────────────────────────────────────────────── */
function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────── */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ imie: '', telefon: '', miasto: '', usluga: '' })
  const [fileName, setFileName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState('')
  const sendingRef = useRef(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sendingRef.current) return
    setFormError('')
    const file = fileRef.current?.files?.[0]
    if (file && (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024)) {
      setFormError('Wybierz zdjęcie o rozmiarze do 5 MB.')
      return
    }
    const payload = new FormData()
    payload.append('access_key', 'c5059edc-0d81-4a0f-9e77-9bae751f51f8')
    payload.append('subject', 'CzystyEfekt — zapytanie o wycenę')
    payload.append('from_name', 'Formularz CzystyEfekt')
    payload.append('Imię', formData.imie.trim())
    payload.append('Telefon', formData.telefon.trim())
    payload.append('Miasto', formData.miasto.trim())
    const serviceNames: Record<string, string> = {
      tapicerka: 'Pranie tapicerki meblowej',
      auto: 'Czyszczenie i ozonowanie aut',
      sprzatanie: 'Sprzątanie domów i mieszkań',
      inne: 'Inne',
    }
    payload.append('Usługa', serviceNames[formData.usluga] || formData.usluga)
    if (file) payload.append('attachment', file)
    sendingRef.current = true
    setSending(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 30000)
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
      const result = await response.json()
      if (!response.ok || result.success !== true) {
        throw new Error('submission')
      }
      setFormData({ imie: '', telefon: '', miasto: '', usluga: '' })
      setFileName('')
      if (fileRef.current) fileRef.current.value = ''
      setSubmitted(true)
    } catch {
      setFormError(file
        ? 'Nie udało się wysłać zgłoszenia. Załączniki wymagają obsługi w planie Web3Forms. Spróbuj bez zdjęcia lub zadzwoń: 660 690 184. Dane formularza zostały zachowane.'
        : 'Nie udało się potwierdzić wysłania. Sprawdź połączenie i spróbuj ponownie lub zadzwoń: 660 690 184. Dane formularza zostały zachowane.')
    } finally {
      window.clearTimeout(timeout)
      sendingRef.current = false
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white [&_a]:focus-visible:ring-2 [&_button]:focus-visible:ring-2 [&_a]:focus-visible:ring-blue-600 [&_button]:focus-visible:ring-blue-600">

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/96 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2.5 group">
            <LogoMark />
            <span className="font-bold text-xl" style={{ fontFamily: 'Outfit, sans-serif', color: '#0d1f3c' }}>
              CzystyEfekt
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                {link}
              </a>
            ))}
          </nav>

          <a href="tel:+48660690184" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95">
            <PhoneIcon className="w-4 h-4" />
            Zadzwoń: 660 690 184
          </a>

          <button aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'} aria-expanded={menuOpen} className="md:hidden min-h-11 min-w-11 p-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-slate-600 py-2" onClick={() => setMenuOpen(false)}>{link}</a>
            ))}
            <a href="tel:+48660690184" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-semibold mt-1">
              Zadzwoń: 660 690 184
            </a>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #0e2a58 55%, #163d78 100%)' }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.18]" style={{ background: '#1a6fff', filter: 'blur(90px)' }} />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-[0.12]" style={{ background: '#38bdf8', filter: 'blur(70px)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.1] mb-5 tracking-tight">
              Profesjonalne Pranie Tapicerki i{' '}
              <span style={{ color: '#5aaeff' }}>Czyszczenie Aut</span>
            </h1>
            <p className="text-lg text-blue-100/90 mb-8 leading-relaxed max-w-lg">
              Czystość, którą widać! Przywracamy świeżość Twoim meblom i samochodom — profesjonalnie, bezpiecznie i punktualnie.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#formularz-kontaktowy" className="bg-blue-500 hover:bg-blue-400 text-white px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:shadow-xl hover:shadow-blue-900/50 active:scale-95">
                Bezpłatna wycena
              </a>
              <a href="tel:+48660690184" className="flex items-center gap-2.5 bg-white/10 hover:bg-white/18 border border-white/25 text-white px-7 py-3.5 rounded-xl font-bold text-base transition-all backdrop-blur-sm">
                <PhoneIcon className="w-4 h-4" />
                Zadzwoń teraz
              </a>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]" style={{ aspectRatio: '4/3' }}>
              <Photo src="/images/jasna-kanapa.jpg" alt="Czysta, jasna kanapa w słonecznym salonie" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top right, rgba(10,26,48,0.45), transparent 65%)' }} />
            </div>
          </div>
        </div>

        <div className="relative h-14 overflow-hidden">
          <svg viewBox="0 0 1440 56" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path fill="white" d="M0,56 C480,0 960,0 1440,56 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          OPINIE KLIENTÓW
      ════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full mb-3">Opinie klientów</div>
            <h2 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Co mówią nasi klienci?</h2>
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Stars />
              <span className="text-sm font-semibold ml-1">5.0 — 47 opinii w Google</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-lg hover:shadow-blue-50 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0 ring-2 ring-blue-100" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 text-sm leading-tight truncate">{r.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{r.location}</div>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4285F4"/>
                      <path d="M17.64 12.2c0-.35-.03-.68-.08-1H12v1.9h3.14c-.14.76-.54 1.4-1.15 1.83v1.52h1.86c1.09-1 1.79-2.47 1.79-4.25z" fill="#4285F4"/>
                      <path d="M12 18c1.57 0 2.89-.52 3.86-1.41l-1.86-1.52c-.52.35-1.18.56-2 .56-1.54 0-2.84-1.04-3.3-2.44H6.77v1.57C7.74 16.52 9.73 18 12 18z" fill="#34A853"/>
                      <path d="M8.7 13.19c-.12-.35-.19-.72-.19-1.1s.07-.75.19-1.1V9.42H6.77C6.28 10.38 6 11.47 6 12.09s.28 1.71.77 2.67l1.93-1.57z" fill="#FBBC05"/>
                      <path d="M12 8.55c.87 0 1.65.3 2.26.88l1.7-1.7C14.89 6.8 13.57 6.18 12 6.18c-2.27 0-4.26 1.48-5.23 3.65l1.93 1.57c.46-1.4 1.76-2.44 3.3-2.44v-.41z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <Stars />
                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          USŁUGI
      ════════════════════════════════════════ */}
      <section id="usługi" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full mb-3">Nasze usługi</div>
            <h2 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Co dla Ciebie zrobimy?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Oferujemy kompleksowe usługi czyszczenia tapicerki, aut i wnętrz na terenie całego regionu.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                <div className="h-48 overflow-hidden relative bg-slate-200">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,31,60,0.55), transparent 55%)' }} />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {s.tags.map(tag => (
                      <span key={tag} className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                  <a href="#formularz-kontaktowy" onClick={() => setFormData(current => ({ ...current, usluga: s === SERVICES[0] ? 'tapicerka' : s === SERVICES[1] ? 'auto' : 'sprzatanie' }))} className="mt-auto flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-sm py-2.5 rounded-xl transition-all">
                    Zapytaj o cenę
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          EFEKTY NASZEJ PRACY
      ════════════════════════════════════════ */}
      <section id="efekty" style={{ background: '#f1f5f9' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4"
              style={{ background: '#e2e8f0' }}
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Efekty pracy</span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Efekty naszej pracy
            </h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              Przeciągnij suwak, aby zobaczyć różnicę — przed i po czyszczeniu
            </p>
          </div>

          {/* ── LARGE MAIN SLIDER ── */}
          <div className="rounded-3xl overflow-hidden shadow-xl mb-8" style={{ background: '#f8fafc' }}>
            {/* Slider area */}
            <BeforeAfterSlider
              beforeSrc="/images/kanapa-przed.jpg"
              afterSrc="/images/kanapa-po.jpg"
              beforeAlt="Zielona kanapa z zabrudzeniami przed praniem"
              afterAlt="Czysta zielona kanapa po praniu"
              aspectRatio="2048/1143"
              dirtyFilter={false}
              rounded=""
            />

            {/* Blue bottom bar */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: '#2563eb' }}
            >
              <p className="text-white text-sm font-semibold">
                Tapicerka meblowa — przeciągnij suwak
              </p>
              <a
                href="#formularz-kontaktowy"
                className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm px-5 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
              >
                Umów wizytę
              </a>
            </div>
          </div>

          {/* Statyczna galeria realizacji */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GALLERY.map(photo => (
              <figure key={photo.src} className="min-w-0 flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Photo src={photo.src} alt={photo.caption} className="w-full aspect-[3/4] object-cover" />
                </div>
                <figcaption className="mt-3 text-lg font-semibold text-[#001F3C] px-1">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          KONTAKT
      ════════════════════════════════════════ */}
      <section id="cennik" className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-navy mb-4">Cennik</h2>
          <p className="text-base text-slate-600 leading-relaxed mb-6">
            Każde zlecenie wyceniamy indywidualnie. Cena zależy od rodzaju usługi,
            wielkości powierzchni i stopnia zabrudzenia. Wypełnij formularz lub zadzwoń,
            aby otrzymać bezpłatną wycenę.
          </p>
          <a href="#formularz-kontaktowy" className="inline-flex min-h-11 items-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700">
            Poproś o bezpłatną wycenę
          </a>
        </div>
      </section>
      <section id="kontakt" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full mb-3">Kontakt</div>
            <h2 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Umów wizytę lub zapytaj o cenę</h2>
            <p className="text-slate-500">Odpiszemy najszybciej jak to możliwe — zazwyczaj w ciągu godziny.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <div id="formularz-kontaktowy" className="min-w-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Uzyskaj szybką wycenę</h3>

              {submitted && (
                <div role="status" className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Zgłoszenie zostało wysłane!</h4>
                  <p className="text-slate-600">Dziękujemy za kontakt. Skontaktujemy się z Tobą pod podanym numerem telefonu. Pola formularza zostały wyczyszczone.</p>
                </div>
              )}
                <form onSubmit={handleSubmit} aria-label="Formularz bezpłatnej wyceny" aria-busy={sending} onChange={() => setSubmitted(false)} className="flex flex-col gap-4">
                  <fieldset disabled={sending} className="contents">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Imię</label>
                    <input aria-label="Imię" autoComplete="name" type="text" required pattern=".*\S.*" placeholder="np. Anna Kowalska" value={formData.imie} onChange={e => setFormData({ ...formData, imie: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Numer telefonu</label>
                    <input aria-label="Numer telefonu" autoComplete="tel" type="tel" required minLength={9} maxLength={20} placeholder="np. 660 123 456" value={formData.telefon} onChange={e => setFormData({ ...formData, telefon: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Miasto / Lokalizacja</label>
                    <input aria-label="Miasto lub lokalizacja" autoComplete="address-level2" type="text" required pattern=".*\S.*" placeholder="np. Gorzów Wielkopolski" value={formData.miasto} onChange={e => setFormData({ ...formData, miasto: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Wybierz usługę</label>
                    <div className="relative">
                      <select aria-label="Wybierz usługę" required value={formData.usluga} onChange={e => setFormData({ ...formData, usluga: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none pr-10">
                        <option value="" disabled>Wybierz usługę...</option>
                        <option value="tapicerka">Pranie Tapicerki Meblowej</option>
                        <option value="auto">Czyszczenie i Ozonowanie Aut</option>
                        <option value="sprzatanie">Sprzątanie Domów i Mieszkań</option>
                        <option value="inne">Inne</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dodaj zdjęcie</label>
                    <button type="button" onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600 text-sm transition-all group">
                      <svg className="w-5 h-5 flex-shrink-0 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                      </svg>
                      <span className="flex-1 text-left truncate">{fileName || 'Kliknij, aby dodać zdjęcie (opcjonalnie)'}</span>
                      {fileName && <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name ?? '')} />
                    <p className="text-sm text-slate-600 mt-1.5 pl-1">Zdjęcie do 5 MB. Wysyłanie załączników wymaga odpowiedniego planu Web3Forms.</p>
                    {fileName && <button type="button" className="min-h-11 text-sm font-semibold text-blue-700" onClick={() => { if (fileRef.current) fileRef.current.value = ''; setFileName(''); setFormError('') }}>Usuń zdjęcie</button>}
                  </div>
                  {formError && <p role="alert" className="text-sm text-red-800 bg-red-50 rounded-xl p-4">{formError}</p>}
                  <button type="submit" disabled={sending} className="mt-1 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-wait text-white font-bold py-3.5 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95">
                    {sending ? 'Wysyłanie zgłoszenia…' : 'Wyślij zgłoszenie →'}
                  </button>
                  </fieldset>
                </form>
            </div>

            {/* Contact panel */}
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'linear-gradient(145deg, #0d1f3c 0%, #0f2d5e 60%, #163d78 100%)' }}>
              <div className="p-8 flex flex-col gap-6">
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Obszar działania &amp; Kontakt</h3>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <div className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Wolny termin? Zadzwoń!</div>
                    <a href="tel:+48660690184" className="text-white text-2xl font-black hover:text-blue-300 transition-colors tracking-tight">660 690 184</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Właściciel</div>
                    <div className="text-white text-lg font-bold">Łukasz Gozdowski</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Obszar działania</div>
                    <div className="text-white font-bold text-base">Gorzów Wielkopolski i okolice</div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                <a href="tel:+48660690184" className="flex items-center justify-center gap-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-900/50 active:scale-95 text-base">
                  <PhoneIcon className="w-4 h-4" />
                  Zadzwoń teraz: 660 690 184
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer style={{ background: '#06101e' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-bold text-lg text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>CzystyEfekt</span>
            </div>
            <div className="flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">{link}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span role="img" aria-label="Facebook — profil nie został jeszcze podany" title="Adres profilu Facebook nie został jeszcze podany" className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              <span role="img" aria-label="Instagram — profil nie został jeszcze podany" title="Adres profilu Instagram nie został jeszcze podany" className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">© CzystyEfekt — Łukasz Gozdowski. Wszelkie prawa zastrzeżone.</p>
            <p className="text-xs text-slate-600">Profesjonalne pranie tapicerki i czyszczenie aut — Gorzów Wielkopolski i okolice</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
