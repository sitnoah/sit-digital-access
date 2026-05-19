const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="sit-orange" x1="8" x2="56" y1="8" y2="56" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ff9f0a"/>
      <stop offset="1" stop-color="#ff4d00"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#0b0b0b"/>
  <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#sit-orange)"/>
  <text x="32" y="40" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" text-anchor="middle">SIT</text>
</svg>`;

export const dynamic = "force-static";

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
