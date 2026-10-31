import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  tab: NavigationTab;
  image: string;
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'rent-machine',
    title: 'Rent a Machine',
    subtitle: 'Tractors & harvesters',
    tab: 'matching',
    image: '/images/machines/mahindra-arjun-605-tractor.jpg',
  },
  {
    id: 'buy-supplies',
    title: 'Buy Supplies',
    subtitle: 'Seeds, fertilizer & bags',
    tab: 'marketplace',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'crop-planner',
    title: 'Crop Planner',
    subtitle: 'Season task calendar',
    tab: 'crop-planner',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'group-booking',
    title: 'Group Booking',
    subtitle: 'Save up to 40%',
    tab: 'group-booking',
    image: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1400&q=80',
  },
];

export const HomeCarousel: React.FC = () => {
  const { setCurrentTab } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-slide every 5 seconds unless hovered/touched or prefersReducedMotion
  useEffect(() => {
    if (prefersReducedMotion || isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, prefersReducedMotion]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  return (
    <div
      className="relative w-full h-[200px] sm:h-[260px] md:h-[300px] rounded-xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-800 select-none shadow-xs isolate"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Home featured actions carousel"
    >
      {/* Horizontal Slides Track */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide, index) => {
          const hasError = imageErrors[slide.id];
          return (
            <div
              key={slide.id}
              role="button"
              tabIndex={0}
              aria-label={`${slide.title}: ${slide.subtitle}`}
              onClick={() => setCurrentTab(slide.tab)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setCurrentTab(slide.tab);
                }
              }}
              className="w-full min-w-full h-full shrink-0 basis-full relative overflow-hidden cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:ring-inset"
            >
              {/* Photo or Neutral Dark Fallback */}
              {!hasError ? (
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onError={() => handleImageError(slide.id)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-stone-900" />
              )}

              {/* Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

              {/* Slide Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-6 sm:pb-7 pt-4 flex items-end justify-between gap-3 pointer-events-none">
                <div className="min-w-0 pr-2">
                  <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-sm">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-200 font-normal drop-shadow-sm mt-0.5">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Small Green Explore Button */}
                <div className="shrink-0 pointer-events-auto mr-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Left / Right Arrow Buttons (Hidden on mobile swipe) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/75 text-white items-center justify-center transition-all cursor-pointer backdrop-blur-xs z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/75 text-white items-center justify-center transition-all cursor-pointer backdrop-blur-xs z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-auto">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            className={`transition-all duration-300 cursor-pointer rounded-full ${
              currentSlide === index
                ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-emerald-500'
                : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
