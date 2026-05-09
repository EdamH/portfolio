"use client";

import { useState, useEffect, useCallback } from "react";
import BootSequence from "./BootSequence";

interface BootWrapperProps {
  children: React.ReactNode;
}

export default function BootWrapper({ children }: BootWrapperProps) {
  const [showBoot, setShowBoot] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasBooted = sessionStorage.getItem("portfolio-booted");
    if (!hasBooted) {
      setShowBoot(true);
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem("portfolio-booted", "1");
    setShowBoot(false);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Portfolio is always rendered — boot just covers it */}
      {children}

      {/* Boot overlay slides up and away */}
      {showBoot && <BootSequence onComplete={handleBootComplete} />}
    </>
  );
}
