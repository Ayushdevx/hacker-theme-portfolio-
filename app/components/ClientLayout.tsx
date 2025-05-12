'use client';

import { PropsWithChildren, useEffect } from "react";
import { initMobileScrollFix } from "../scrollFix";
import { MobileProvider } from "../providers/MobileProvider";

export function ClientLayout({ children }: PropsWithChildren) {
  // Initialize the mobile scroll fixes
  useEffect(() => {
    const cleanup = initMobileScrollFix();
    return cleanup;
  }, []);

  return (
    <MobileProvider>
      {children}
    </MobileProvider>
  );
}
