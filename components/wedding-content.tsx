"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import {
  ArrowUp,
  Calendar,
  Camera,
  Car,
  CakeSlice,
  Church,
  Clock,
  DoorOpen,
  Hand,
  MapPin,
  Moon,
  PartyPopper,
  Scroll,
  Sparkles,
  UtensilsCrossed,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react"

const SAVE_THE_DATE = "2026-06-12"
const EVENT_START_UTC = "T100000Z"
const EVENT_END_UTC = "T220000Z"
const KISS_VIDEO_SRC =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-09-09%20at%2021.40.24-BndD8sXBxXu8ekHUiHfWtyweg58V8M.mp4"
const STORY_VIDEO_SRC = "/Save%20The%20Date.mp4"
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir//Achterland+1,+2964+LA+Groot-Ammers/@51.9187589,4.8479083,13z"
const MAPS_PLACE_URL = "https://www.google.com/maps/place/Achterland+1a,+2964+LA+Groot-Ammers"
const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Achterland+1a,+2964+LA+Groot-Ammers,+Nederland&output=embed"
const SHOW_LEGACY_SAVE_THE_DATE = false
const COUNTDOWN_TARGET = `${SAVE_THE_DATE}T12:00:00`

const TIMELINE_ITEMS: { time: string; title: string; icon: LucideIcon }[] = [
  { time: "12:00 - 12:15", title: "Ontvangst gasten op locatie", icon: DoorOpen },
  { time: "12:15 - 12:30", title: "Inloop en plaatsnemen", icon: Users },
  { time: "12:30 - 13:30", title: "Burgerlijke ceremonie", icon: Scroll },
  { time: "13:30 - 14:05", title: "Taart & Borrel", icon: CakeSlice },
  { time: "14:05 - 14:35", title: "Groepsfoto’s", icon: Camera },
  { time: "14:35 - 14:45", title: "Rustmoment & vertrek", icon: Clock },
  { time: "14:45 - 15:30", title: "Rit naar de kerk", icon: Car },
  { time: "15:30 - 17:30", title: "Kerkdienst & felicitaties", icon: Church },
  { time: "17:30 - 18:00", title: "Rit terug naar locatie", icon: Car },
  { time: "18:00 - 18:15", title: "Opfrissen / pauze", icon: Sparkles },
  { time: "18:15 - 20:15", title: "Diner met speeches", icon: UtensilsCrossed },
  { time: "20:15 - 20:30", title: "Inloop avondgasten", icon: Moon },
  { time: "20:30 - 23:30", title: "Avondceremonie / feest", icon: PartyPopper },
  { time: "23:30 - 00:00", title: "Afsluiten & uitzwaaien", icon: Hand },
]

const formatCountdownValue = (value: number) => String(value).padStart(2, "0")

const getCountdown = (targetDate: Date) => {
  const diff = Math.max(targetDate.getTime() - Date.now(), 0)
  const totalMinutes = Math.floor(diff / 60000)
  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  return { days, hours, minutes }
}

const RingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="12" r="4" />
    <circle cx="16" cy="12" r="4" />
  </svg>
)

const CakeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M3 18h18" />
    <path d="M12 2v7" />
    <path d="M8 2v7" />
    <path d="M16 2v7" />
  </svg>
)

const CalendarCard = () => {
  const [shouldPulse, setShouldPulse] = useState(false)
  const resetTimeoutRef = useRef<number | null>(null)

  const highlightDate = useMemo(() => new Date(`${SAVE_THE_DATE}T00:00:00`), [])
  const highlightDay = highlightDate.getDate()
  const monthLabel = useMemo(
    () =>
      highlightDate
        .toLocaleDateString("nl-NL", {
          month: "long",
          year: "numeric",
        })
        .toLocaleUpperCase("nl-NL"),
    [highlightDate],
  )
  const weekdays = ["zo", "ma", "di", "wo", "do", "vr", "za"]
  const daysInMonth = new Date(highlightDate.getFullYear(), highlightDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(highlightDate.getFullYear(), highlightDate.getMonth(), 1).getDay()

  useEffect(() => {
    const pulseTimeout = window.setTimeout(() => {
      setShouldPulse(true)
      resetTimeoutRef.current = window.setTimeout(() => setShouldPulse(false), 400)
    }, 500)

    return () => {
      window.clearTimeout(pulseTimeout)
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = null
      }
    }
  }, [])

  const calendarDays: (number | null)[] = Array(firstDayOfMonth).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="calendar-card mx-auto max-w-sm bg-white rounded-2xl shadow-soft p-4 relative overflow-hidden">
      <div className="absolute top-2 left-2 opacity-15">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gold">
          <path d="M8 2l1.5 3h3.5l-2.5 2 1 3.5-3-2-3 2 1-3.5-2.5-2h3.5z" />
        </svg>
      </div>
      <div className="absolute bottom-2 right-2 opacity-15">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-gold">
          <path d="M6 1l1 2h2l-1.5 1.5.5 2.5-2-1-2 1 .5-2.5-1.5-1.5h2z" />
        </svg>
      </div>

      <div className="text-center mb-4">
        <h3 className="font-serif text-lg font-medium text-ink tracking-wide">{monthLabel}</h3>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <div key={index} className="calendar-cell h-9 md:h-11 flex items-center justify-center relative">
            {day && (
              <>
                <span
                  className={`
                    font-mono text-base md:text-lg font-medium text-ink
                    ${day === highlightDay ? "relative z-10" : ""}
                  `}
                >
                  {day}
                </span>
                {day === highlightDay && (
                  <div
                    className={`
                      absolute inset-0 flex items-center justify-center z-0
                      ${shouldPulse ? "animate-pulse-once" : ""}
                    `}
                  >
                    <img src="/clearer-golden-heart.png" alt="Golden heart" className="w-48 h-48 object-contain" />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const LegacySaveTheDate = ({
  calendarDayDisplay,
  calendarLabel,
  onAddToCalendar,
}: {
  calendarDayDisplay: string
  calendarLabel: string
  onAddToCalendar: () => void
}) => (
  <div className="min-h-screen">
    <section className="relative px-4 py-16 md:py-24 lg:py-32 min-h-screen flex items-center">
      <div className="mx-auto max-w-4xl text-center w-full relative">
        <div className="mb-6 flex justify-center">
          <RingsIcon className="h-8 w-8 text-gold-realistic" />
        </div>

        <h1 className="mb-2 font-serif text-4xl font-light tracking-wide text-ink md:text-5xl lg:text-6xl">
          Save the Date
        </h1>

        <div className="mb-2">
          <h2 className="font-serif text-3xl font-medium text-ink md:text-4xl lg:text-5xl">
            Leonard <span className="text-gold-realistic">&</span> Thirza
          </h2>
        </div>

        <div className="mb-8">
          <p className="text-xl font-medium text-ink md:text-2xl">{calendarDayDisplay}</p>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <div className="flex-1 h-px bg-slate-200 max-w-24"></div>
          <RingsIcon className="h-4 w-4 text-gold-realistic mx-4" />
          <div className="flex-1 h-px bg-slate-200 max-w-24"></div>
        </div>

        <div className="mb-8">
          <CalendarCard />
        </div>

        <div className="mb-8 relative z-20">
          <Button onClick={onAddToCalendar} size="lg" className="btn-gold-realistic min-h-[44px] px-8 py-3 text-base font-medium">
            <span className="shine"></span>
            <Calendar className="mr-2 h-5 w-5 relative z-10" />
            <span className="relative z-10">{calendarLabel}</span>
          </Button>
        </div>

        <div className="mb-8 mx-auto" style={{ width: "80%", maxWidth: "320px" }}>
          <div className="video-card bg-white rounded-2xl p-2 shadow-soft border-gold-realistic relative overflow-hidden">
            <video
              className="w-full h-full object-cover rounded-xl"
              muted
              loop
              playsInline
              poster="/wedding-video-poster.jpg"
              style={{ aspectRatio: "4/5" }}
            >
              <source src={KISS_VIDEO_SRC} type="video/mp4" />
            </video>
            <div className="absolute inset-2 rounded-xl bg-linear-to-t from-white/20 via-transparent to-white/30 pointer-events-none"></div>
          </div>
        </div>

        <p className="text-sm text-slate-600">Uitnodiging volgt later</p>
      </div>
    </section>

    <footer className="relative px-4 py-8 text-center">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-4">
          <span>Meer informatie volgt via deze pagina</span>
        </div>
        <CakeIcon className="h-5 w-5 text-gold-realistic mx-auto" />
      </div>
    </footer>
  </div>
)

export type WeddingContentProps = {
  visible: boolean
}

export function WeddingContent({ visible }: WeddingContentProps) {
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const kissVideoRef = useRef<HTMLVideoElement>(null)
  const [heroMuted, setHeroMuted] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [calendarType, setCalendarType] = useState<"google" | "ics" | "outlook">("google")
  const [calendarLabel, setCalendarLabel] = useState("Zet in mijn agenda")
  const eventDate = useMemo(() => new Date(`${SAVE_THE_DATE}T15:00:00`), [])
  const heroDateStamp = useMemo(() => {
    const [year, month, day] = SAVE_THE_DATE.split("-")
    return `${day} · ${month} · ${year}`
  }, [])
  const targetDate = useMemo(() => new Date(COUNTDOWN_TARGET), [])
  const [countdown, setCountdown] = useState(() => getCountdown(targetDate))
  const calendarDayDisplay = useMemo(
    () =>
      new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(eventDate),
    [eventDate],
  )
  const dateStamp = SAVE_THE_DATE.replace(/-/g, "")
  const startUtcStamp = `${dateStamp}${EVENT_START_UTC}`
  const endUtcStamp = `${dateStamp}${EVENT_END_UTC}`

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const platform = navigator.platform?.toLowerCase() || ""

      if (/iphone|ipad|ipod/.test(userAgent) || (platform.includes("mac") && "ontouchend" in document)) {
        setCalendarType("ics")
        setCalendarLabel("Zet in mijn agenda")
        return
      }

      if (/android/.test(userAgent)) {
        setCalendarType("google")
        setCalendarLabel("Zet in mijn agenda")
        return
      }

      if (platform.includes("mac")) {
        setCalendarType("ics")
        setCalendarLabel("Zet in mijn agenda")
        return
      }

      if (platform.includes("win")) {
        setCalendarType("outlook")
        setCalendarLabel("Zet in mijn agenda")
        return
      }

      setCalendarType("google")
      setCalendarLabel("Zet in mijn agenda")
    }

    detectDevice()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = () => {
      setReduceMotion(mediaQuery.matches)
      if (mediaQuery.matches) {
        heroVideoRef.current?.pause()
        kissVideoRef.current?.pause()
      }
    }

    handleChange()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(targetDate))
    tick()
    const interval = window.setInterval(tick, 60000)
    return () => window.clearInterval(interval)
  }, [targetDate])

  useEffect(() => {
    if (!visible) return
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    if (!elements.length) return

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-revealed"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [visible, reduceMotion])

  const handleAddToCalendar = () => {
    const eventData = {
      title: "Leonard & Thirza trouwen",
      start: dateStamp,
      end: dateStamp,
      description: "We kunnen niet wachten om dit met jullie te vieren.",
      location: "Achterland 1a, 2964 LA Groot-Ammers, Nederland",
    }

    if (calendarType === "google") {
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventData.start}/${eventData.end}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`
      window.open(googleUrl, "_blank")
    } else if (calendarType === "ics") {
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Save the Date//Wedding//EN",
        "BEGIN:VEVENT",
        "UID:wedding-leonard-thirza@domain.com",
        "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
        `DTSTART:${startUtcStamp}`,
        `DTEND:${endUtcStamp}`,
        "SUMMARY:" + eventData.title,
        "DESCRIPTION:" + eventData.description,
        "LOCATION:" + eventData.location,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n")

      const blob = new Blob([icsContent], { type: "text/calendar" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "leonard-thirza-wedding.ics"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else if (calendarType === "outlook") {
      const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventData.title)}&startdt=${startUtcStamp}&enddt=${endUtcStamp}&body=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`
      window.open(outlookUrl, "_blank")
    }
  }

  const handleHeroSoundToggle = () => {
    const video = heroVideoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    if (!video.paused) {
      setHeroMuted(nextMuted)
      return
    }

    video
      .play()
      .then(() => {
        setHeroMuted(nextMuted)
      })
      .catch(() => {
        video.muted = true
        setHeroMuted(true)
      })
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <div className="page-shell" id="top">
        <main className="relative">
          <section className="hero-section">
            <video
              ref={heroVideoRef}
              className="hero-video"
              autoPlay={!reduceMotion}
              muted={heroMuted}
              loop
              playsInline
              preload="metadata"
              poster="/og-save-the-date-new.png"
            >
              <source src={STORY_VIDEO_SRC} type="video/mp4" />
            </video>
            <div className="hero-overlay" aria-hidden="true" />
            <div className="container hero-content" data-reveal>
              <p className="eyebrow text-accent">Save the Date</p>
              <h1 className="hero-title font-serif">
                Leonard <span className="ampersand">&</span> Thirza
              </h1>
              <p className="hero-date">{heroDateStamp}</p>
              <p className="hero-tagline">Aftellen tot de grote dag</p>
              <div className="countdown-grid">
                {[
                  { label: "Dagen", value: countdown.days },
                  { label: "Uren", value: countdown.hours },
                  { label: "Minuten", value: countdown.minutes },
                ].map((item) => (
                  <div key={item.label} className="countdown-card">
                    <span className="countdown-value">
                      {item.label === "Dagen" ? item.value : formatCountdownValue(item.value)}
                    </span>
                    <span className="countdown-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="hero-sound"
              onClick={handleHeroSoundToggle}
              aria-pressed={!heroMuted}
              aria-label={heroMuted ? "Geluid aanzetten" : "Geluid uitzetten"}
            >
              {heroMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{heroMuted ? "Geluid aan" : "Geluid uit"}</span>
            </button>
          </section>

          <section className="section save-date-section">
            <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
              <div className="kiss-card" data-reveal>
                <video
                  ref={kissVideoRef}
                  className="kiss-video"
                  autoPlay={!reduceMotion}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/og-save-the-date-new.png"
                >
                  <source src={KISS_VIDEO_SRC} type="video/mp4" />
                </video>
              </div>
              <div className="space-y-4" data-reveal>
                <p className="eyebrow text-accent">Save the Date</p>
                <h2 className="section-title font-serif">Samen vieren</h2>
                <p className="section-subtitle text-muted">We kijken ernaar uit om deze dag met jullie te vieren.</p>
              </div>
            </div>
          </section>

          <section className="section timeline-section">
            <img src="/poloroid1.png" alt="" aria-hidden="true" className="polaroid-bg polaroid-bg-top" />
            <img src="/poloroid2.png" alt="" aria-hidden="true" className="polaroid-bg polaroid-bg-bottom" />
            <div className="container">
              <div className="section-header" data-reveal>
                <p className="eyebrow text-accent">The Big Day</p>
                <h2 className="section-title font-serif">Dagprogramma</h2>
                <p className="section-subtitle text-muted">Een zachte leidraad voor de dag. Tijden kunnen iets schuiven.</p>
              </div>
              <div className="timeline">
                <span className="timeline-line" aria-hidden="true" />
                {TIMELINE_ITEMS.map((item) => (
                  <div key={item.time} className="timeline-item" data-reveal>
                    <div className="timeline-time">{item.time}</div>
                    <div className="timeline-icon">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="timeline-content">
                      <h3 className="timeline-title">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section location-section">
            <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
              <div className="space-y-4" data-reveal>
                <p className="eyebrow text-accent">Locatie</p>
                <h2 className="section-title font-serif">Achterland 1a</h2>
                <p className="section-subtitle text-muted">Achterland 1a, 2964 LA Groot-Ammers, Nederland.</p>
                <div className="location-meta">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>Parkeren op locatie</span>
                </div>
                <div className="button-row">
                  <a className="btn-ghost" href={MAPS_DIRECTIONS_URL} target="_blank" rel="noreferrer">
                    Navigeer hierheen
                  </a>
                  <a className="btn-ghost" href={MAPS_PLACE_URL} target="_blank" rel="noreferrer">
                    Bekijk omgeving
                  </a>
                </div>
              </div>
              <div className="map-card" data-reveal>
                <iframe
                  className="map-frame"
                  title="Kaart naar Achterland 1a"
                  src={MAPS_EMBED_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>

          <section className="section cta-section">
            <div className="container">
              <div className="cta-card" data-reveal>
                <p className="eyebrow text-accent">Save the Date</p>
                <h2 className="section-title font-serif">We kunnen niet wachten</h2>
                <p className="section-subtitle text-muted">
                  We kunnen niet wachten om dit met jullie te vieren. Zet de datum alvast in je agenda.
                </p>
                <p className="cta-meta">{calendarDayDisplay} • Groot-Ammers</p>
                <Button onClick={handleAddToCalendar} size="lg" className="btn-seal">
                  <Calendar className="h-5 w-5" />
                  <span>{calendarLabel}</span>
                </Button>
                <button type="button" className="back-to-top" onClick={handleBackToTop}>
                  <ArrowUp className="h-4 w-4" />
                  <span>Terug naar boven</span>
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>© 2026 Leonard &amp; Thirza - Made with love</p>
        </footer>
      </div>

      {SHOW_LEGACY_SAVE_THE_DATE ? (
        <LegacySaveTheDate
          calendarDayDisplay={calendarDayDisplay}
          calendarLabel={calendarLabel}
          onAddToCalendar={handleAddToCalendar}
        />
      ) : null}
    </>
  )
}
