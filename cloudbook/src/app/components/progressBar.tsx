'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timers on re-render to prevent conflicts
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start the progress bar
    setVisible(true);
    setProgress(0);

    let currentProgress = 0;
    const intervalTime = 0; // How often to update the progress (milliseconds)
    const incrementAmount = 5; // How much to increment each time

    timerRef.current = setInterval(() => {
      currentProgress += incrementAmount;
      if (currentProgress < 90) {
        setProgress(currentProgress);
      } else {
        // Stop the rapid increment before 90% and wait for the "complete" signal
        setProgress(90); // Cap it at 90% during the "loading" phase
        clearInterval(timerRef.current!);
        timerRef.current = null;
      }
    }, intervalTime);

    // Clean up on component unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pathname, searchParams]); // Re-run effect when pathname or searchParams change

  useEffect(() => {
    // This effect runs after the page content has rendered for the *new* URL.
    // We use a short timeout to ensure the progress bar is fully visible before completing.
    if (visible && progress >= 90) { // Ensure it's active and at least near completion
      if (timerRef.current) { // Clear any lingering timers from the previous effect
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setProgress(100); // Instantly set to 100%
      const hideTimeout = setTimeout(() => {
        setVisible(false);
        setProgress(0); // Reset for next navigation
      }, 300); // Duration to show the 100% filled bar

      return () => clearTimeout(hideTimeout);
    }
  }, [visible, progress]); // Depend on visible and progress to trigger completion logic

  return (
    <>
      {visible && (
        <div
          className="fixed top-0 left-0 h-1 bg-[#009333] z-50 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
    </>
  );
}