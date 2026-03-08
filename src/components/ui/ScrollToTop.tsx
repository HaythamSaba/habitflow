import { RefObject, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  containerRef: RefObject<HTMLDivElement | null>;  // ⭐ ADD | null
}

export function ScrollToTop({ containerRef }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    container.addEventListener("scroll", updateScroll);
    return () => container.removeEventListener("scroll", updateScroll);
  }, [containerRef]);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - scrollProgress / 100);

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Scroll to top"
    >
      {/* Progress ring */}
      <svg 
        className="absolute w-13.5 h-13.5 -rotate-90"
        viewBox="0 0 48 48"
      >
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          // stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>
      
      {/* Arrow icon */}
      <ArrowUp className="w-5 h-5 relative z-10" />
    </button>
  );
}