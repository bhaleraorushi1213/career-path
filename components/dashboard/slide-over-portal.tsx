"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const SlideOverPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};