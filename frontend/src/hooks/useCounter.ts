"use client";

import { useEffect, useState } from "react";

/**
 * Animated counter hook - counts from 0 to end value
 * @param end - Target number to count to
 * @param duration - Animation duration in milliseconds
 * @param start - Whether to start the animation
 */
export function useCounter(
  end: number,
  duration: number = 2000,
  start: boolean = false
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}
