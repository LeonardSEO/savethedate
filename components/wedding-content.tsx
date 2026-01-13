"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import {
  ArrowUp,
  Calendar,
  Banknote,
  Church,
  DoorOpen,
  Mail,
  MapPin,
  Moon,
  PenTool,
  Star,
  Utensils,
  Users,
  Volume2,
  VolumeX,
  Wine,
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
const COUNTDOWN_TARGET = `${SAVE_THE_DATE}T12:00:00`

const TIMELINE_ITEMS: { time: string; title: string; icon: LucideIcon }[] = [
  { time: "12:00", title: "Ontvangst", icon: DoorOpen },
  { time: "12:30", title: "Burgerlijk Huwelijk", icon: PenTool },
  { time: "13:30", title: "Taart & Toost", icon: Wine },
  { time: "15:30", title: "Kerkelijke Inzegening", icon: Church },
  { time: "18:15", title: "Diner", icon: Utensils },
  { time: "20:15", title: "Ontvangst avondgasten", icon: Users },
  { time: "20:30", title: "Avondceremonie", icon: Star },
  { time: "23:30", title: "Einde", icon: Moon },
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

export type WeddingContentProps = {
  visible: boolean
}

export function WeddingContent({ visible }: WeddingContentProps) {
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const kissVideoRef = useRef<HTMLVideoElement>(null)
  const [heroMuted, setHeroMuted] = useState(true)
  const [isCeremonyModalOpen, setIsCeremonyModalOpen] = useState(false)
  const [isGiftPopoverOpen, setIsGiftPopoverOpen] = useState(false)
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [calendarType, setCalendarType] = useState<"google" | "ics" | "outlook">("google")
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
    setModalRoot(document.body)
  }, [])

  useEffect(() => {
    if (!isCeremonyModalOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isCeremonyModalOpen])

  useEffect(() => {
    if (!isCeremonyModalOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCeremonyModalOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isCeremonyModalOpen])

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const platform = navigator.platform?.toLowerCase() || ""

      if (/iphone|ipad|ipod/.test(userAgent) || (platform.includes("mac") && "ontouchend" in document)) {
        setCalendarType("ics")
        return
      }

      if (/android/.test(userAgent)) {
        setCalendarType("google")
        return
      }

      if (platform.includes("mac")) {
        setCalendarType("ics")
        return
      }

      if (platform.includes("win")) {
        setCalendarType("outlook")
        return
      }

      setCalendarType("google")
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

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    if (!visible) {
      video.pause()
      return
    }
    if (reduceMotion) return
    video.play().catch(() => {
      // Ignore autoplay failures; user can start via sound toggle.
    })
  }, [reduceMotion, visible])

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
              autoPlay={!reduceMotion && visible}
              muted={heroMuted}
              loop
              playsInline
              preload="metadata"
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
                >
                  <source src={KISS_VIDEO_SRC} type="video/mp4" />
                </video>
              </div>
              <div className="space-y-4" data-reveal>
                <h2 className="section-title font-serif">12 juni 2026</h2>
              </div>
            </div>
          </section>

          <section className="section timeline-section">
            <img src="/poloroid1.png" alt="" aria-hidden="true" className="polaroid-bg polaroid-bg-top" />
            <img src="/poloroid2.png" alt="" aria-hidden="true" className="polaroid-bg polaroid-bg-bottom" />
            <div className="container">
              <div className="section-header" data-reveal>
                <h2 className="section-title font-serif">Programma</h2>
              </div>
              <div className="timeline">
                <span className="timeline-line" aria-hidden="true" />
                <div className="timeline-items">
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

          <section className="section practical-section">
            <div className="container">
              <div className="practical-grid" data-reveal>
                <div className="practical-item">
                  <p className="practical-label">Dresscode</p>
                  <p className="practical-text">Mannen: Blauw en/of Beige</p>
                  <p className="practical-text">Vrouwen: Pastelkleuren</p>
                </div>
                <div
                  className="practical-item"
                  onMouseEnter={() => setIsGiftPopoverOpen(true)}
                  onMouseLeave={() => setIsGiftPopoverOpen(false)}
                >
                  <p className="practical-label">Cadotip</p>
                  <button
                    type="button"
                    className="practical-link"
                    onClick={() => setIsGiftPopoverOpen((prev) => !prev)}
                    aria-expanded={isGiftPopoverOpen}
                    aria-haspopup="dialog"
                  >
                    Wensen
                  </button>
                  <div
                    className={`gift-popover ${isGiftPopoverOpen ? "is-visible" : ""}`}
                    role="note"
                    aria-hidden={!isGiftPopoverOpen}
                  >
                    <Mail className="gift-icon" />
                    <Banknote className="gift-icon" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cta-section">
            <div className="container">
              <div className="cta-card" data-reveal>
                <h2 className="section-title font-serif">Save the Date</h2>
                <p className="section-subtitle text-muted">We hopen deze bijzondere dag met jullie te delen.</p>
                <p className="cta-meta">{calendarDayDisplay} • Groot-Ammers</p>
                <Button onClick={handleAddToCalendar} size="lg" className="btn-seal">
                  <Calendar className="h-5 w-5" />
                  <span>Zet in agenda</span>
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
          <button
            type="button"
            className="footer-link"
            onClick={() => setIsCeremonyModalOpen(true)}
            aria-haspopup="dialog"
          >
            Vragen? Contacteer de ceremoniemeesters
          </button>
          <p>© 2026 Leonard &amp; Thirza - Made with love</p>
        </footer>
      </div>

      {modalRoot && isCeremonyModalOpen
        ? createPortal(
            <div
              className="modal-overlay"
              role="dialog"
              aria-modal="true"
              aria-label="Ceremoniemeesters"
              onClick={() => setIsCeremonyModalOpen(false)}
            >
              <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title font-serif">Ceremoniemeesters</h2>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => setIsCeremonyModalOpen(false)}
                    aria-label="Sluiten"
                  >
                    ✕
                  </button>
                </div>
                <p className="modal-intro">Voor vragen over de dag, speeches of verrassingen.</p>
                <div className="modal-contacts">
                  <a className="modal-link" href="tel:0618396917">
                    Ilse Gouman – 06-18396917
                  </a>
                  <a className="modal-link" href="tel:0622265033">
                    Marc Schippers – 06-22265033
                  </a>
                </div>
                <p className="modal-note">
                  Heb je allergieën of dieetwensen? Geef dit tijdig door aan Ilse of Marc.
                </p>
              </div>
            </div>,
            modalRoot,
          )
        : null}

    </>
  )
}
