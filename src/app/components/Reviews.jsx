"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const reviews = [
  {
    name: "Neha Trehan",
    age: "3 months ago",
    text: "Amazing work Home Glazer! The team did a wonderful job at my home. The quality of the paint and finish is very nice, and they completed the work on time. Staff is also very polite and professional. Highly recommended!",
  },
  {
    name: "Shubham Sultania",
    label: "Local Guide",
    age: "4 months ago",
    text: "Home Glazer did a wonderful job at my home. Top-notch paint quality, perfect finish, and they stuck to the timeline. Super polite and professional staff too. 10/10, would recommend!",
  },
  {
    name: "Sakshi Trehan",
    age: "4 months ago",
    text: "Highly recommend Home Glazer! I recently used their services for my home and was incredibly impressed by the quality of work and attention to detail. The team is professional, listens to your requirements, and delivers exactly what's promised.",
  },
  {
    name: "Yogesh Gaikwad",
    age: "5 months ago",
    text: "I had a fantastic experience with this company. The service was top-notch, the staff was incredibly professional, and the entire process was smooth and efficient. I would highly recommend them to anyone looking for quality and care.",
  },
  {
    name: "Ashwani Kumar",
    age: "1 year ago",
    text: "We are very pleased with the wonderful paint job your team completed. The color selection was perfect, and the application was smooth and even. The painters were very professional, punctual, and cleaned up thoroughly after the job. We highly recommend your company to anyone looking for high quality painting services.",
  },
  {
    name: "Rajni Pal",
    age: "3 years ago",
    text: "Home Glazer was a great choice for my home painting needs and I would gladly recommend them to anyone. The customer service was excellent, the quality of their work was impeccable, and the price was reasonable. They made the entire process seamless.",
  },
  {
    name: "Edward Masih",
    age: "3 years ago",
    text: "Not only was I impressed with the quality of their work, but I was also very pleased with the end result. My home looks better than ever and I am so happy with the transformation. I would highly recommend Home Glazer for any painting needs that you might have. They provided me with the best customer service and a top-notch job.",
  },
  {
    name: "Ada Khan",
    age: "3 years ago",
    text: "After a careful search for a reliable painting service, I recently chose Home Glazer for the task. I am extremely pleased with their service and the quality of their work. They completed the job to my exact specifications and with great care…",
  },
  {
    name: "Kunal Kapoor",
    label: "Local Guide",
    age: "1 year ago",
    text: "Very professional service. Mr. Vipin Gupta is well versed in knowledge of his field and painter also did a wonderful job. Happy with the services.",
  },
  {
    name: "Lohit Shandilya",
    age: "4 years ago",
    text: "The support team is just amazing, and the painters were on time every time. The work they did was very outstanding. With the fresh paint job, my living room looks fantastic. They did an outstanding job. Home Glazer, thank you very much!",
  },
  {
    name: "Nitish Kumar",
    age: "4 years ago",
    text: "Due to the harsh weather, a lot of my furniture needed recoating. Home Glazer are among the few experts I've met who are able to understand every type of wood in my house. They explained which colour suits and its durability…",
  },
  {
    name: "Vijay Kumar",
    age: "5 years ago",
    text: "My experience with Home Glazer has been fantastic. Staff was professional and work is done swiftly. Polycoat coating service availed from them was up to the mark and entire supervision process was truly hassle-free. Keep it up guys!",
  },
  {
    name: "Bhagat Singh",
    age: "5 years ago",
    text: "I had been looking for someone who could polish my antiques very carefully as I cannot afford to break it. Vipin from Home Glazer had been very calm and gave me his word that the service would be excellent. I trusted him with some fear…",
  },
  {
    name: "Anjali Gehra",
    age: "3 years ago",
    text: "My experience with Home Glazer has been fantastic. Staff is professional and work is done swiftly. The wood polish service availed from them was up to the mark. I'm happy and so is my wife!",
  },
  {
    name: "Rajesh Kumar",
    label: "Local Guide",
    age: "6 years ago",
    text: "These people from Home Glazer are amazing. Got painting work done in my South Delhi house. They did an amazing job. The best thing is they work with 100% cleanliness without disturbing your daily work…",
  },
  {
    name: "Amit Kumar",
    age: "5 years ago",
    text: "The team of Home Glazer, the best painters in Delhi, was proficient. They clarified the procedure before beginning their work. They concealed the closets and cupboards and covered different areas to ensure there were no spills…",
  },
  {
    name: "Monica Thakkar",
    age: "5 years ago",
    text: "I had been looking for someone with good knowledge on WoodTech PU Exterior for my wood coatings. I met with the owner and he helped me understand the possibilities for getting the work done and gave me advice on heat…",
  },
];

function subscribeToHydration() {
  return () => {};
}

function subscribeToMotionPreference(onChange) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function getMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function ReviewCard({ review }) {
  return (
    <article className="flex w-[320px] max-w-[84vw] shrink-0 snap-start flex-col rounded-md bg-[#f9f9f7] p-5 sm:w-[340px] sm:p-6">
      <span aria-hidden="true" className="text-4xl font-semibold leading-none text-[#c2410c]">
        &ldquo;
      </span>
      <blockquote className="mt-2 line-clamp-5 flex-1 text-sm leading-6 text-[#514b41]">
        {review.text}
      </blockquote>
      <a
        href="https://share.google/e5zg9apyc1FExKnVK"
        target="_blank"
        rel="noreferrer"
        className="mt-2 self-start text-xs font-semibold text-[#c2410c] hover:text-[#9a3412]"
      >
        Read full review
      </a>
      <footer className="mt-4 flex items-center gap-3 border-t border-[#e7e2d9] pt-4">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c2410c] text-xs font-bold text-white"
        >
          {getInitials(review.name)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-[#29251f]">{review.name}</span>
          <span className="mt-0.5 block text-xs text-[#777166]">
            Google review{review.label ? ` · ${review.label}` : ""} · {review.age}
          </span>
        </span>
      </footer>
    </article>
  );
}

export default function Reviews() {
  const railRef = useRef(null);
  const secondSetRef = useRef(null);
  const pauseAutoScrollRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const isCloned = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerSnapshot,
  );
  const [userPaused, setUserPaused] = useState(false);
  const isPaused = userPaused || prefersReducedMotion;

  useEffect(() => {
    pauseAutoScrollRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frameId;
    let previousTime;
    const pixelsPerSecond = 18;

    function animate(time) {
      if (previousTime !== undefined && !pauseAutoScrollRef.current && !document.hidden) {
        const secondSet = secondSetRef.current;
        const cycleLength = secondSet
          ? secondSet.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft
          : 0;
        if (cycleLength) {
          rail.scrollLeft += ((time - previousTime) / 1000) * pixelsPerSecond;
          if (rail.scrollLeft >= cycleLength) rail.scrollLeft -= cycleLength;
        }
      }
      previousTime = time;
      frameId = window.requestAnimationFrame(animate);
    }

    frameId = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  function pauseThenResume() {
    setUserPaused(true);
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      setUserPaused(false);
    }, 3500);
  }

  function toggleAutoScroll() {
    if (prefersReducedMotion) return;
    window.clearTimeout(resumeTimerRef.current);
    setUserPaused((paused) => !paused);
  }

  function scrollReviews(direction) {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: direction * rail.clientWidth * 0.8,
      behavior: "smooth",
    });
    pauseThenResume();
  }

  return (
    <section
      id="reviews"
      className="bg-white px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-6 flex max-w-3xl flex-col items-center text-center sm:mb-8">
          <p className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#29251f]">
            <span className="h-px w-8 bg-[#c2410c]" />
            Customer reviews
            <span className="h-px w-8 bg-[#c2410c]" />
          </p>
          <h2
            id="reviews-heading"
            className="text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl lg:text-6xl"
          >
            What our customers say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#69645b] sm:text-base sm:leading-7">
            Feedback from Home Glazer customers. Individual reviews may describe projects outside Gurgaon.
          </p>
        </header>

          <div className="mb-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={toggleAutoScroll}
            aria-pressed={isPaused}
            disabled={prefersReducedMotion}
            className="mr-auto rounded-full border border-[#29251f]/15 px-4 text-sm font-semibold text-[#29251f] transition-colors hover:border-[#c2410c] hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]"
          >
            {prefersReducedMotion
              ? "Paused for reduced motion"
              : isPaused
                ? "Play reviews"
                : "Pause reviews"}
          </button>
          <button
            type="button"
            onClick={() => scrollReviews(-1)}
            aria-label="Scroll to previous reviews"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#29251f]/15 text-[#29251f] transition-colors hover:border-[#c2410c] hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollReviews(1)}
            aria-label="Scroll to next reviews"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#29251f]/15 text-[#29251f] transition-colors hover:border-[#c2410c] hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        <div
          ref={railRef}
          className="reviews-scrollbar relative flex gap-4 overflow-x-auto overflow-y-hidden pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onFocus={() => setUserPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setUserPaused(false);
          }}
          role="region"
          aria-label="Customer review carousel"
          tabIndex={0}
        >
          {[false, ...(isCloned ? [true] : [])].map((isClone) => (
            <div
              key={isClone ? "review-loop" : "reviews"}
              ref={isClone ? secondSetRef : null}
              aria-hidden={isClone || undefined}
              inert={isClone ? true : undefined}
              className="flex shrink-0 snap-none items-stretch gap-4 pr-4"
            >
              {reviews.map((review, index) => (
                <ReviewCard key={`${isClone ? "clone-" : ""}${review.name}-${index}`} review={review} />
              ))}
            </div>
          ))}
        </div>

        <p className="mt-2 text-center text-xs text-[#777166]">
          Reviews scroll automatically. Use the pause button or swipe to browse.
        </p>
      </div>
    </section>
  );
}
