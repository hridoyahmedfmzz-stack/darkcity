import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    const script1 = document.createElement("script");

    script1.innerHTML = `
      atOptions = {
        'key' : 'c0e6f5c4b4c8764bf12f66ee9679772e',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const script2 = document.createElement("script");
    script2.src =
      "https://www.highperformanceformat.com/c0e6f5c4b4c8764bf12f66ee9679772e/invoke.js";
    script2.async = true;

    document.getElementById("adsterra-banner")
      ?.appendChild(script1);

    document.getElementById("adsterra-banner")
      ?.appendChild(script2);
  }, []);

  return (
    <div
      id="adsterra-banner"
      className="flex justify-center py-6"
    />
  );
}
export const loadAds = () => {
  if (
    window.location.pathname.startsWith("/admin")
  ) {
    return;
  }

  const s = document.createElement("script");
  s.src =
    "https://5gvci.com/act/files/tag.min.js?z=11112615";
  s.async = true;

  document.body.appendChild(s);
};