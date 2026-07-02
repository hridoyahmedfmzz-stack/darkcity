// utils/monetag.js

export const loadAds = () => {

  const script = document.createElement("script");

  // এখানে Monetag Dashboard থেকে পাওয়া script URL বসাবে
  script.src =
    "<script src='//libtl.com/sdk.js' data-zone='11005883' data-sdk='show_11005883'></script>";

  script.async = true;

  document.body.appendChild(script);

};

export const showRewardAd = async () => {

  try {

    if (
      typeof window.show_11005883 !==
      "function"
    ) {
      alert("Reward Ad Not Loaded");
      return false;
    }

    await window.show_11005883();

    return true;

  } catch (e) {

    console.error("Monetag Error:", e);

    return false;

  }

};