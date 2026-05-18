"use client";

import React, { useEffect } from 'react';
import { initTheme } from '@/lib/theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initTheme();
  }, []);

  return <>{children}</>;
};
