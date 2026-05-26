import type { Metadata } from 'next';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Variable serif with optical-size axis — feels editorial at display sizes,
// quiets down at UI sizes.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'molave.ai',
  description: 'AI interviews that listen, evaluate, and remember.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
          <Toaster
            position="bottom-right"
            theme="light"
            toastOptions={{
              style: {
                background: 'var(--color-paper)',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-rule-strong)',
                borderRadius: '0',
                fontFamily: 'var(--font-sans)',
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
