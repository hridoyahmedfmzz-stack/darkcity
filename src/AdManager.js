export const loadAds = () => {
  const scripts = [
    "https://5gvci.com/act/files/tag.min.js?z=11112615",
    "https://al5sm.com/tag.min.js",
    "https://pl29599523.effectivecpmnetwork.com/79/c0/7c/79c07c0f4b220f4534c1010316c6f060.js",
    "//libtl.com/sdk.js",
  ];

  scripts.forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  });
};