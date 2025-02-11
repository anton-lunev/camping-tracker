"use client";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  targetId: string;
  children: ReactNode;
};

export function Portal({ children, targetId }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const targetNode = document.getElementById(targetId) || document.body;
    targetRef.current = targetNode;
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, [targetId]);

  return mounted && targetRef.current
    ? createPortal(children, targetRef.current)
    : null;
}
