import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    const container =
      document.getElementById("top-banner-ad");

    if (!container) return;

    container.innerHTML = "";

    const configScript =
      document.createElement("script");

    configScript.innerHTML = `
      atOptions = {
        'key' : 'fe7247a8fd56a44b200590ff9b16325b',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const invokeScript =
      document.createElement("script");

    invokeScript.src =
      "https://www.highperformanceformat.com/fe7247a8fd56a44b200590ff9b16325b/invoke.js";

    invokeScript.async = true;

    container.appendChild(configScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="flex justify-center my-4">
      <div id="top-banner-ad"></div>
    </div>
  );
}
{/* Mobile */}
<div className="block md:hidden">
  <MobileBanner />
</div>

{/* Desktop */}
<div className="hidden md:block">
  <DesktopBanner />
</div>