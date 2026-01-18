'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function GoogleAnalytics() {
  const [gaId, setGaId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGaId = async () => {
      try {
        const response = await fetch('/api/settings/public');
        const data = await response.json();
        if (data.googleAnalyticsId) {
          setGaId(data.googleAnalyticsId);
        }
      } catch (error) {
        console.error('Failed to fetch GA ID:', error);
      }
    };

    fetchGaId();
  }, []);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
