export const shouldShowAd = (geo, watchTime) => {
  if (geo?.isHighCPM) {
    return watchTime % 45 === 0;
  }

  return watchTime % 90 === 0;
};