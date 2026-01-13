"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentType } from "react"
const INTRO_FADE_START_MS = 3000
const INTRO_VIDEO_FADE_MS = 500
const INTRO_PAPER_PAUSE_MS = 150
const INTRO_LAYER_FADE_MS = 500
const INTRO_END_MS = INTRO_FADE_START_MS + INTRO_VIDEO_FADE_MS + INTRO_PAPER_PAUSE_MS + INTRO_LAYER_FADE_MS
const PAPER_COLOR = "#faf9f6"
const CONTENT_LOAD_DELAY_MS = 500


export function SaveTheDatePage() {
  const [introStatus, setIntroStatus] = useState<
    "idle" | "playing" | "fading" | "paper" | "revealing" | "done"
  >("idle")
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const [introVideoSrc, setIntroVideoSrc] = useState<string | null>(null)
  const introBlobUrlRef = useRef<string | null>(null)
  const introFadeTimeoutRef = useRef<number | null>(null)
  const introPaperTimeoutRef = useRef<number | null>(null)
  const introRevealTimeoutRef = useRef<number | null>(null)
  const introDoneTimeoutRef = useRef<number | null>(null)
  const [WeddingContentComponent, setWeddingContentComponent] = useState<
    ComponentType<{ visible: boolean }> | null
  >(null)
  const contentRequestedRef = useRef(false)
  const contentVisible = introStatus === "revealing" || introStatus === "done"

  const requestContentLoad = () => {
    if (contentRequestedRef.current) return
    contentRequestedRef.current = true
    import("./wedding-content")
      .then((mod) => {
        setWeddingContentComponent(() => mod.WeddingContent)
      })
      .catch(() => {
        contentRequestedRef.current = false
      })
  }

  useEffect(() => {
    let cancelled = false

    const preloadIntroVideo = async () => {
      try {
        const response = await fetch("/kling_video2.mp4")
        if (!response.ok) {
          throw new Error("Failed to preload intro video")
        }
        const blob = await response.blob()
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        introBlobUrlRef.current = url
        setIntroVideoSrc(url)
      } catch {
        if (!cancelled) {
          setIntroVideoSrc("/kling_video2.mp4")
        }
      }
    }

    preloadIntroVideo()

    return () => {
      cancelled = true
      if (introBlobUrlRef.current) {
        URL.revokeObjectURL(introBlobUrlRef.current)
        introBlobUrlRef.current = null
      }
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
    requestContentLoad()

    const video = introVideoRef.current
    if (video) {
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
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
          })
          .catch(() => {
            setIntroStatus("done")
          })
      } else {
        setIntroStatus("done")
      }
    } else {
      setIntroStatus("done")
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      requestContentLoad()
    }, CONTENT_LOAD_DELAY_MS)

    return () => window.clearTimeout(timeout)
  }, [])

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
            webkit-playsinline="true"
            preload="metadata"
            muted
            poster="/envelop-start-frame2.png"
          >
            <source src={introVideoSrc ?? "/kling_video2.mp4"} type="video/mp4" />
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
        {WeddingContentComponent ? <WeddingContentComponent visible={contentVisible} /> : null}
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

        @media (max-width: 640px) {
          .countdown-grid {
            margin-top: clamp(14rem, 38vh, 30rem);
          }
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
          --timeline-time: 84px;
          --timeline-icon: 40px;
          --timeline-gap: 0.9rem;
        }

        .timeline-items {
          display: grid;
          gap: 1.2rem;
        }

        .timeline-section,
        .location-section {
          position: relative;
          overflow: hidden;
        }

        .timeline-section .container,
        .location-section .container {
          position: relative;
          z-index: 10;
        }

        .polaroid-bg {
          position: absolute;
          width: min(260px, 55vw);
          opacity: 0.35;
          filter: saturate(0.9);
          z-index: 0;
          pointer-events: none;
        }

        .polaroid-bg-top {
          top: 10px;
          right: -50px;
          transform: rotate(5deg);
        }

        .polaroid-bg-bottom {
          bottom: -140px;
          right: 10px;
          transform: rotate(-10deg);
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

        .footer-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          color: var(--accent-dark);
          margin-bottom: 0.75rem;
          text-decoration: underline;
          text-underline-offset: 4px;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .practical-section {
          padding-top: 2rem;
        }

        .practical-grid {
          display: grid;
          gap: 2rem;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(201, 176, 122, 0.2);
          border-bottom: 1px solid rgba(201, 176, 122, 0.2);
          align-items: start;
        }

        .practical-item {
          display: grid;
          gap: 0.5rem;
        }

        .practical-label {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent-dark);
          font-weight: 600;
        }

        .practical-text {
          color: var(--muted);
          font-size: 0.95rem;
        }

        .practical-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.98rem;
          color: var(--ink);
          text-decoration: underline;
          text-underline-offset: 4px;
          align-self: start;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
        }

        .gift-popover {
          margin-top: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.55rem 0.7rem;
          min-width: 72px;
          min-height: 44px;
          border-radius: 999px;
          border: 1px solid rgba(201, 176, 122, 0.25);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 24px rgba(15, 10, 5, 0.12);
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }

        .practical-item:hover .gift-popover {
          opacity: 1;
          transform: translateY(0);
        }

        .gift-popover.is-visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .gift-icon {
          width: 18px;
          height: 18px;
          color: var(--accent-dark);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 10, 0.45);
          display: grid;
          place-items: center;
          z-index: 9999;
          padding: 1.5rem;
        }

        .modal-card {
          background: #fff;
          color: var(--ink);
          border-radius: 24px;
          padding: 2rem;
          max-width: 480px;
          width: 100%;
          max-height: 80vh;
          overflow: auto;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
          display: grid;
          gap: 1rem;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .modal-title {
          font-size: 1.6rem;
        }

        .modal-close {
          border: 1px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }

        .modal-intro {
          color: var(--muted);
        }

        .modal-contacts {
          display: grid;
          gap: 0.4rem;
        }

        .modal-link {
          color: var(--ink);
          font-weight: 600;
          text-decoration: none;
        }

        .modal-note {
          color: var(--muted);
          font-size: 0.9rem;
          font-style: italic;
        }

        @media (min-width: 768px) {
          .practical-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 3rem;
          }
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
        }

        @media (min-width: 1024px) {
          .polaroid-bg {
            width: 360px;
            opacity: 0.5;
          }

          .polaroid-bg-top {
            right: -50px;
            top: 10px;
          }

          .polaroid-bg-bottom {
            right: 10px;
            bottom: -200px;
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
