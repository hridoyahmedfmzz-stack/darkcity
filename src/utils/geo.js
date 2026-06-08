export const getUserGeo = async () => {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();

    return {
      country: data.country_code,
      isHighCPM: ["US", "GB", "CA", "AU", "DE"].includes(
        data.country_code
      ),
    };
  } catch (e) {
    return {
      country: "BD",
      isHighCPM: false,
    };
  }
};