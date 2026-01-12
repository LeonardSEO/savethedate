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
const INTRO_FADE_START_MS = 1600
const INTRO_VIDEO_FADE_MS = 500
const INTRO_PAPER_PAUSE_MS = 150
const INTRO_LAYER_FADE_MS = 500
const INTRO_END_MS = INTRO_FADE_START_MS + INTRO_VIDEO_FADE_MS + INTRO_PAPER_PAUSE_MS + INTRO_LAYER_FADE_MS
const PAPER_COLOR = "#faf9f6"
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
    // One-time micro-pulse on load
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

  // Generate calendar grid
  const calendarDays: (number | null)[] = Array(firstDayOfMonth).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="calendar-card mx-auto max-w-sm bg-white rounded-2xl shadow-soft p-4 relative overflow-hidden">
      {/* Corner decorations */}
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

      {/* Month header */}
      <div className="text-center mb-4">
        <h3 className="font-serif text-lg font-medium text-ink tracking-wide">{monthLabel}</h3>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
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

export function SaveTheDatePage() {
  const [introStatus, setIntroStatus] = useState<
    "idle" | "playing" | "fading" | "paper" | "revealing" | "done"
  >("idle")
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const introFadeTimeoutRef = useRef<number | null>(null)
  const introPaperTimeoutRef = useRef<number | null>(null)
  const introRevealTimeoutRef = useRef<number | null>(null)
  const introDoneTimeoutRef = useRef<number | null>(null)
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
  const contentVisible = introStatus === "revealing" || introStatus === "done"

  useEffect(() => {
    return () => {
      if (introFadeTimeoutRef.current !== null) {
        window.clearTimeout(introFadeTimeoutRef.current)
        introFadeTimeoutRef.current = null
      }
      if (introPaperTimeoutRef.current !== null) {
        window.clearTimeout(introPaperTimeoutRef.current)
        introPaperTimeoutRef.current = null
      }
      if (introRevealTimeoutRef.current !== null) {
        window.clearTimeout(introRevealTimeoutRef.current)
        introRevealTimeoutRef.current = null
      }
      if (introDoneTimeoutRef.current !== null) {
        window.clearTimeout(introDoneTimeoutRef.current)
        introDoneTimeoutRef.current = null
      }
    }
  }, [])

  const handleIntroStart = () => {
    if (introStatus !== "idle") return
    setIntroStatus("playing")

    const video = introVideoRef.current
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {
        // Playback might fail on some devices; continue the reveal anyway.
      })
    }

    introFadeTimeoutRef.current = window.setTimeout(() => {
      setIntroStatus("fading")
    }, INTRO_FADE_START_MS)

    introPaperTimeoutRef.current = window.setTimeout(() => {
      setIntroStatus("paper")
    }, INTRO_FADE_START_MS + INTRO_VIDEO_FADE_MS)

    introRevealTimeoutRef.current = window.setTimeout(() => {
      setIntroStatus("revealing")
    }, INTRO_FADE_START_MS + INTRO_VIDEO_FADE_MS + INTRO_PAPER_PAUSE_MS)

    introDoneTimeoutRef.current = window.setTimeout(() => {
      setIntroStatus("done")
    }, INTRO_END_MS)
  }

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
    if (!contentVisible) return
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
  }, [contentVisible, reduceMotion])

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
    <div className="min-h-screen" style={{ backgroundColor: PAPER_COLOR }}>
      {introStatus !== "done" && (
        <div
          className={`intro-layer ${introStatus !== "idle" ? "is-passive" : ""} ${introStatus === "revealing" ? "is-exiting" : ""}`}
          style={{ backgroundColor: PAPER_COLOR }}
        >
          <video
            ref={introVideoRef}
            className={`intro-video ${introStatus === "fading" || introStatus === "paper" || introStatus === "revealing" ? "is-fading" : ""}`}
            playsInline
            preload="auto"
            muted
          >
            <source src="/kling_video.mp4" type="video/mp4" />
          </video>
          <div
            className={`intro-hit ${introStatus === "idle" ? "" : "is-hidden"}`}
            role="button"
            tabIndex={0}
            aria-label="Open de envelop"
            onClick={handleIntroStart}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                handleIntroStart()
              }
            }}
          />
        </div>
      )}

      <div
        className={`content-layer ${contentVisible ? "is-visible" : ""}`}
        aria-hidden={!contentVisible}
        style={{ opacity: contentVisible ? 1 : 0, visibility: contentVisible ? "visible" : "hidden" }}
      >
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
              <img
                src="/poloroid1.png"
                alt=""
                aria-hidden="true"
                className="polaroid-bg polaroid-bg-top"
              />
              <img
                src="/poloroid2.png"
                alt=""
                aria-hidden="true"
                className="polaroid-bg polaroid-bg-bottom"
              />
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
                  <p className="section-subtitle text-muted">
                    Achterland 1a, 2964 LA Groot-Ammers, Nederland.
                  </p>
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
      </div>

      <style jsx global>{`
        :root {
          --paper: ${PAPER_COLOR};
          --ink: #1c1a17;
          --muted: #7f766d;
          --accent: #c9b07a;
          --accent-dark: #9c7a37;
          --champagne: #e8d7b4;
          --line: rgba(201, 176, 122, 0.35);
          --gold: #d1a954;
          --gold-1: #996515;
          --gold-2: #b8860b;
          --gold-3: #d4af37;
          --gold-4: #ffe8a3;
          --gold-5: #8a6b1b;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: var(--paper);
          color: var(--ink);
        }

        .text-ink {
          color: var(--ink);
        }
        .text-gold {
          color: var(--gold);
        }
        .text-muted {
          color: var(--muted);
        }
        .text-accent {
          color: var(--accent);
        }

        .intro-layer {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          background: ${PAPER_COLOR};
          opacity: 1;
          transition: opacity ${INTRO_LAYER_FADE_MS}ms ease;
        }

        .intro-layer.is-passive {
          pointer-events: none;
        }

        .intro-layer.is-exiting {
          opacity: 0;
        }

        .intro-video {
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          object-position: center;
          opacity: 1;
          transition: opacity ${INTRO_VIDEO_FADE_MS}ms ease;
        }

        .intro-video.is-fading {
          opacity: 0;
        }

        .intro-hit {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: transparent;
          cursor: pointer;
          z-index: 2;
          touch-action: manipulation;
        }

        .intro-hit.is-hidden {
          display: none;
          pointer-events: none;
        }

        .content-layer {
          opacity: 0;
          visibility: hidden;
          transform: translateY(6px);
          transition: opacity 0.55s ease, transform 0.55s ease;
          pointer-events: none;
        }

        .content-layer.is-visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        .page-shell {
          min-height: 100vh;
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(circle at 15% 10%, rgba(201, 176, 122, 0.16), transparent 55%),
            radial-gradient(circle at 80% 15%, rgba(232, 215, 180, 0.3), transparent 45%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(250, 249, 246, 0.92) 40%, var(--paper) 100%);
        }

        .page-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(201, 176, 122, 0.06) 1px, transparent 1px);
          background-size: 120px 120px;
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }

        .page-shell > * {
          position: relative;
          z-index: 1;
        }

        .section {
          padding: clamp(3.5rem, 7vw, 6.5rem) 1.5rem;
        }

        .container {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .eyebrow {
          font-size: 0.65rem;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: clamp(4rem, 10vw, 7rem) 1.5rem;
          color: #fdfaf3;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 30%;
          z-index: 0;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 12, 9, 0.55) 0%, rgba(15, 12, 9, 0.2) 55%, rgba(15, 12, 9, 0.6) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: min(700px, 100%);
          display: grid;
          gap: 1rem;
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .hero-title {
          font-size: clamp(2.6rem, 6vw, 4.6rem);
          line-height: 1.05;
          letter-spacing: 0.02em;
        }

        .ampersand {
          color: var(--champagne);
          font-weight: 400;
        }

        .hero-date {
          font-size: clamp(1.05rem, 2.2vw, 1.45rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--champagne);
        }

        .hero-tagline {
          font-size: 0.9rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
        }

        .hero-sound {
          position: absolute;
          right: 24px;
          bottom: 24px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          background: rgba(196, 161, 90, 0.85);
          color: #2b1c09;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          backdrop-filter: blur(6px);
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .hero-video {
            object-position: 50% 75%;
          }
        }

        .save-date-section {
          position: relative;
        }

        .kiss-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(196, 161, 90, 0.3);
          box-shadow: 0 20px 40px rgba(15, 10, 5, 0.15);
          background: #fff;
        }

        .kiss-video {
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
          max-width: 360px;
        }

        .countdown-card {
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 18px;
          padding: 0.9rem 0.7rem;
          text-align: center;
          box-shadow: 0 12px 30px rgba(15, 10, 5, 0.2);
        }

        .countdown-value {
          display: block;
          font-size: 1.4rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: #fff;
        }

        .countdown-label {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
        }

        .section-title {
          font-size: clamp(1.8rem, 3.4vw, 2.7rem);
          line-height: 1.2;
        }

        .section-subtitle {
          max-width: 38rem;
          font-size: 1rem;
          line-height: 1.6;
        }

        .section-header {
          display: grid;
          gap: 0.6rem;
          margin-bottom: 2.5rem;
        }

        .timeline {
          position: relative;
          display: grid;
          gap: 1.2rem;
          --timeline-time: 84px;
          --timeline-icon: 40px;
          --timeline-gap: 0.9rem;
        }

        .timeline-section,
        .location-section {
          position: relative;
          overflow: hidden;
        }

        .timeline-section .container,
        .location-section .container {
          position: relative;
          z-index: 1;
        }

        .polaroid-bg {
          position: absolute;
          width: min(260px, 55vw);
          opacity: 0.4;
          filter: saturate(0.9);
          z-index: 0;
          pointer-events: none;
        }

        .polaroid-bg-top {
          top: 40px;
          right: -30px;
          transform: rotate(6deg);
        }

        .polaroid-bg-bottom {
          bottom: 20px;
          right: -30px;
          transform: rotate(-8deg);
        }

        .timeline-line {
          position: absolute;
          top: 8px;
          bottom: 8px;
          left: calc(var(--timeline-time) + var(--timeline-gap) + (var(--timeline-icon) / 2));
          width: 1px;
          background: var(--line);
          z-index: 0;
        }

        .timeline-item {
          display: grid;
          grid-template-columns: var(--timeline-time) var(--timeline-icon) 1fr;
          gap: var(--timeline-gap);
          align-items: start;
          position: relative;
          z-index: 1;
        }

        .timeline-time {
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          color: var(--muted);
          font-variant-numeric: tabular-nums;
        }

        .timeline-icon {
          width: var(--timeline-icon);
          height: var(--timeline-icon);
          border-radius: 999px;
          border: 1px solid rgba(196, 161, 90, 0.5);
          background: var(--champagne);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .timeline-icon::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: var(--champagne);
          z-index: -1;
        }

        .timeline-title {
          font-size: 1rem;
          font-weight: 600;
        }

        .location-meta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--muted);
        }

        .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          border: 1px solid rgba(196, 161, 90, 0.45);
          color: var(--accent);
          background: transparent;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.65rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .btn-ghost:hover {
          background: rgba(196, 161, 90, 0.14);
          color: var(--accent-dark);
        }

        .map-card {
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(196, 161, 90, 0.3);
          background: #fff;
          box-shadow: 0 20px 40px rgba(15, 10, 5, 0.12);
        }

        .map-frame {
          width: 100%;
          min-height: 320px;
          border: 0;
          aspect-ratio: 4 / 3;
          filter: grayscale(0.7) sepia(0.2) contrast(1.05);
        }

        .cta-card {
          display: grid;
          gap: 1rem;
          text-align: center;
          padding: clamp(2.5rem, 6vw, 3.5rem);
          border-radius: 28px;
          border: 1px solid rgba(196, 161, 90, 0.35);
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 22px 45px rgba(15, 10, 5, 0.18);
          justify-items: center;
        }

        .cta-meta {
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-dark);
        }

        .btn-seal {
          background: linear-gradient(135deg, #d8c08b 0%, #b6883d 100%);
          color: #2b1b0a;
          border-radius: 999px;
          padding: 0.9rem 1.6rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-size: 0.7rem;
          gap: 0.6rem;
          font-weight: 600;
          box-shadow: 0 14px 28px rgba(86, 67, 25, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .btn-seal:hover {
          filter: brightness(1.05);
        }

        .btn-seal:focus-visible {
          outline: 3px solid rgba(196, 161, 90, 0.5);
          outline-offset: 3px;
        }

        .back-to-top {
          margin-top: 1.6rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(196, 161, 90, 0.35);
          color: var(--accent);
          background: transparent;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          font-size: 0.6rem;
          font-weight: 600;
          cursor: pointer;
        }

        .footer {
          padding: 2.5rem 1.5rem 3rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--muted);
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }

        [data-reveal].is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        @media (min-width: 768px) {
          .timeline {
            --timeline-time: 140px;
            --timeline-icon: 52px;
            --timeline-gap: 1.4rem;
          }

          .timeline-item {
            gap: var(--timeline-gap);
          }
        }

        @media (min-width: 1024px) {
          .polaroid-bg {
            width: 360px;
            opacity: 0.5;
          }

          .polaroid-bg-top {
            right: -10px;
            top: 20px;
          }

          .polaroid-bg-bottom {
            right: -10px;
            bottom: 10px;
          }
        }

        @media (max-width: 640px) {
          .polaroid-bg {
            opacity: 0.22;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
        
        /* Added realistic gold text styling with gradient */
        .text-gold-realistic {
          background: linear-gradient(180deg,
            var(--gold-5) 0%,
            var(--gold-2) 18%,
            var(--gold-3) 32%,
            var(--gold-4) 55%,
            var(--gold-2) 72%,
            var(--gold-1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        /* Added realistic gold border styling */
        .border-gold-realistic {
          border: 1px solid var(--gold-2);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.1);
        }

        .calendar-card {
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
        }

        .shadow-soft {
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
        }

        .video-card {
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
          border: 1px solid #d1a954;
        }

        .calendar-cell {
          min-height: 36px;
        }

        @media (min-width: 768px) {
          .calendar-cell {
            min-height: 44px;
          }
        }

        @keyframes pulse-once {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }

        .animate-pulse-once {
          animation: pulse-once 400ms ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-once {
            animation: none;
          }
        }

        /* Fixed button text color for proper contrast against gold background */
        .btn-gold-realistic {
          background: 
            linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%),
            linear-gradient(180deg,
              var(--gold-5) 0%,
              var(--gold-2) 18%,
              var(--gold-3) 32%,
              var(--gold-4) 55%,
              var(--gold-2) 72%,
              var(--gold-1) 100%
            );
          color: #1a1a1a;
          border-radius: 0.75rem;
          border: 1px solid #b08d57;
          box-shadow: 
            inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -1px 0 rgba(0,0,0,0.25),
            0 6px 16px rgba(0,0,0,0.25);
          background-blend-mode: screen, normal;
          transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
          font-weight: 700;
        }

        /* Added noise texture overlay for metallic effect */
        .btn-gold-realistic::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.25;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          mix-blend-mode: overlay;
          border-radius: 0.75rem;
        }

        /* Added animated shine effect */
        .btn-gold-realistic .shine {
          position: absolute;
          inset: -30% -30% auto auto;
          width: 60%;
          height: 200%;
          transform: rotate(25deg);
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
          animation: sweep 2.8s linear infinite;
          opacity: 0.6;
          pointer-events: none;
        }

        @keyframes sweep {
          from { transform: translateX(-120%) rotate(25deg); }
          to { transform: translateX(120%) rotate(25deg); }
        }
        
        .btn-gold-realistic:hover {
          transform: translateY(-1px);
          box-shadow: 
            inset 0 1px 0 rgba(255,255,255,0.4),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 8px 20px rgba(0,0,0,0.3);
          filter: brightness(1.05);
        }
        
        .btn-gold-realistic:active {
          transform: translateY(0);
          filter: brightness(.96);
        }
        
        .btn-gold-realistic:focus-visible {
          outline: 3px solid var(--gold-4);
          outline-offset: 3px;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .btn-gold-realistic .shine {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
