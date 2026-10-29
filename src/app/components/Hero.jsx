"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    title: "Painters in Gurgaon for Homes, Offices & Societies",
    text: "Protect and elevate your property with durable exterior painting, weather-resistant coatings, and elegant curb appeal.",
    image: "/images/hero-image-two.webp",
    imageAlt: "Freshly painted exterior of a modern home in Gurgaon",
    badge: "Exterior Painting",
  },
  {
    title: "Premium Interior Painting in Gurgaon",
    text: "High-quality interior painting services with flawless finishes, premium colors, and expert craftsmanship for homes and apartments.",
    image: "/images/sons-bedroom.webp",
    imageAlt: "Bedroom interior with wooden furniture and green accents",
    badge: "Interior Painting",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goToNext, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [goToNext, isPaused]);

  return (
    <section
      className="relative overflow-hidden bg-[#f6f6f4]"
      aria-label="Featured painting services"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full">
        <div className="relative overflow-hidden shadow-[0_24px_80px_rgba(11,31,77,0.14)]">
          {/* Slides track */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={`${slide.badge}-${index}`}
                className="relative min-h-[76vh] w-full shrink-0 md:min-h-[82vh]"
                aria-hidden={index !== currentSlide}
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  sizes="100vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(6,15,34,0.15)] via-[rgba(6,15,34,0.45)] to-[rgba(6,15,34,0.72)]" />

                {/* Content */}
                <div className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center text-white sm:px-8">
                  <div className="max-w-[780px]">
                    {/* Badge */}
                    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm md:mb-6">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c2410c]" />
                      {slide.badge}
                    </span>

                    {index === 0 ? (
                      <h1 className="mb-4 text-[clamp(2.4rem,5.5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)] md:mb-5">
                        {slide.title}
                      </h1>
                    ) : (
                      <h2 className="mb-4 text-[clamp(2.4rem,5.5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)] md:mb-5">
                        {slide.title}
                      </h2>
                    )}

                    <p className="mx-auto max-w-[30rem] text-sm leading-6 text-white/85 sm:text-[0.95rem] md:max-w-[34rem] md:text-[1.05rem] md:leading-7">
                      {slide.text}
                    </p>

                    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-9">
                      <a
                        href="tel:+919717256514"
                        className="inline-flex items-center justify-center rounded-full bg-[#c2410c] px-7 py-3 text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(194,65,12,0.32)] transition-transform duration-200 hover:-translate-y-0.5 md:px-8 md:py-3.5 md:text-[0.85rem]"
                      >
                        Get Free Quote
                      </a>
                      <Link
                        href="/services"
                        className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 md:px-8 md:py-3.5 md:text-[0.85rem]"
                      >
                        Our Services
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot navigation */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 md:bottom-8">
            {slides.map((slide, index) => (
              <button
                key={slide.badge}
                type="button"
                aria-label={`Go to slide ${index + 1}: ${slide.badge}`}
                aria-current={index === currentSlide ? "true" : undefined}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 8000);
                }}
                className={`h-2 rounded-full transition-all duration-400 ${
                  index === currentSlide
                    ? "w-7 bg-white"
                    : "w-2 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/10">
            <div
              key={`progress-${currentSlide}-${isPaused}`}
              className={`h-full bg-[#c2410c] ${!isPaused ? "animate-[heroProgress_5s_linear_1]" : ""}`}
              style={{ width: isPaused ? "0%" : undefined }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
