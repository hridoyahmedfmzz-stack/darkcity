export async function showRewardAd() {
  try {
    if (typeof window.show_11005883 !== "function") {
      console.log("Reward ad not loaded");
      return false;
    }

    await window.show_11005883();

    console.log("Reward completed");
    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}