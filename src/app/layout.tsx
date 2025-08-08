// src/app/layout.tsx
import { ReactNode } from 'react';
import ClientThemeProvider from './components/ClientThemeProvider';

export const metadata = {
  title: 'Course Finder',
  description: 'Browse all available courses',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}