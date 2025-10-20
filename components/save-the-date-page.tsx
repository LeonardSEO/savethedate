"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

const SAVE_THE_DATE = "2026-06-12"
const EVENT_START_UTC = "T130000Z"
const EVENT_END_UTC = "T220000Z"

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

export function SaveTheDatePage() {
  const [calendarType, setCalendarType] = useState<"google" | "ics" | "outlook">("google")
  const [calendarLabel, setCalendarLabel] = useState("Voeg toe aan agenda")
  const videoRef = useRef<HTMLVideoElement>(null)
  const eventDate = useMemo(() => new Date(`${SAVE_THE_DATE}T15:00:00`), [])
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
        setCalendarLabel("Voeg toe aan agenda")
        return
      }

      if (/android/.test(userAgent)) {
        setCalendarType("google")
        setCalendarLabel("Voeg toe aan agenda")
        return
      }

      if (platform.includes("mac")) {
        setCalendarType("ics")
        setCalendarLabel("Voeg toe aan agenda")
        return
      }

      if (platform.includes("win")) {
        setCalendarType("outlook")
        setCalendarLabel("Voeg toe aan agenda")
        return
      }

      setCalendarType("google")
      setCalendarLabel("Voeg toe aan agenda")
    }

    detectDevice()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          video.play().catch(() => {
            // Autoplay failed, which is fine
          })
        } else {
          video.pause()
        }
      },
      { threshold: [0.4, 0.6] },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const video = videoRef.current
    if (prefersReducedMotion && video) {
      video.style.display = "none"
    }
  }, [])

  const handleAddToCalendar = () => {
    const eventData = {
      title: "Leonard & Thirza trouwen", // Updated event title to match new name order
      start: dateStamp,
      end: dateStamp,
      description: "Officiële uitnodiging volgt later.",
      location: "Nieuw-Lekkerland, Nederland",
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

  return (
    <div className="min-h-screen bg-white">
      <section className="relative px-4 py-16 md:py-24 lg:py-32 min-h-screen flex items-center">
        <div className="mx-auto max-w-4xl text-center w-full relative">
          {/* Ornament 1: Small rings above title */}
          <div className="mb-6 flex justify-center">
            <RingsIcon className="h-8 w-8 text-gold-realistic" />
          </div>

          {/* Compact stacked title and names */}
          <h1 className="mb-2 font-serif text-4xl font-light tracking-wide text-ink md:text-5xl lg:text-6xl">
            Save the Date
          </h1>

          <div className="mb-2">
            <h2 className="font-serif text-3xl font-medium text-ink md:text-4xl lg:text-5xl">
              Leonard <span className="text-gold-realistic">&</span> Thirza
            </h2>
          </div>

          {/* Date directly under names */}
          <div className="mb-8">
            <p className="text-xl font-medium text-ink md:text-2xl">{calendarDayDisplay}</p>
          </div>

          {/* Ornament 2: Thin divider with mini-ring */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex-1 h-px bg-slate-200 max-w-24"></div>
            <RingsIcon className="h-4 w-4 text-gold-realistic mx-4" />
            <div className="flex-1 h-px bg-slate-200 max-w-24"></div>
          </div>

          <div className="mb-8">
            <CalendarCard />
          </div>

          {/* CTA button */}
          <div className="mb-8 relative z-20">
            <Button
              onClick={handleAddToCalendar}
              size="lg"
              className="btn-gold-realistic min-h-[44px] px-8 py-3 text-base font-medium"
            >
              <span className="shine"></span>
              <Calendar className="mr-2 h-5 w-5 relative z-10" />
              <span className="relative z-10">{calendarLabel}</span>
            </Button>
          </div>

          <div className="mb-8 mx-auto" style={{ width: "80%", maxWidth: "320px" }}>
            <div className="video-card bg-white rounded-2xl p-2 shadow-soft border-gold-realistic relative overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-xl"
                muted
                loop
                playsInline
                poster="/wedding-video-poster.jpg"
                style={{ aspectRatio: "4/5" }}
              >
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-09-09%20at%2021.40.24-BndD8sXBxXu8ekHUiHfWtyweg58V8M.mp4" type="video/mp4" />
              </video>
              {/* White overlay */}
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
          {/* Ornament 3: Small wedding cake icon as closer */}
          <CakeIcon className="h-5 w-5 text-gold-realistic mx-auto" />
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --ink: #0f172a;
          --gold: #d1a954;
          /* Added realistic gold color variables */
          --gold-1: #996515;
          --gold-2: #B8860B;
          --gold-3: #D4AF37;
          --gold-4: #FFE8A3;
          --gold-5: #8A6B1B;
        }
        
        .text-ink { color: var(--ink); }
        .text-gold { color: var(--gold); }
        
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
