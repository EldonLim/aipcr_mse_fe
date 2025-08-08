// src/components/ClientThemeProvider.tsx
'use client';

import { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { theme } from '../theme/mui-theme';

// Create emotion cache
const cache = createCache({ key: 'css', prepend: true });

export default function ClientThemeProvider({ children }: { children: ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}