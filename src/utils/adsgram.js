export const showRewardAd = async () => {
  const isTelegram =
    window.Telegram &&
    window.Telegram.WebApp;

  // Telegram Mini App
  if (isTelegram) {
    const AdController =
      window.Adsgram?.init({
        blockId: "int-34641",
      });

    if (!AdController) {
      throw new Error("AdsGram not loaded");
    }

    return await AdController.show();
  }

  // Website Monetag
  if (window.show_10937558) {
    window.show_10937558();
    return true;
  }

  // Website Adsterra Direct Link Fallback
  window.open(
    "https://YOUR_ADSTERRA_DIRECT_LINK",
    "_blank"
  );

  return true;
};