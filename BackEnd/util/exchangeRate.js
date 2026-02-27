import axios from "axios";

let cachedRate = null;
let lastFetchTime = 0;

export const getUSDtoINR = async () => {
  const ONE_HOUR = 60 * 60 * 1000;

  // Cache for 1 hour
  if (cachedRate && Date.now() - lastFetchTime < ONE_HOUR) {
    return cachedRate;
  }

  const response = await axios.get(
    "https://v6.exchangerate-api.com/v6/3be1a347b06a9b94aba21779/latest/USD",
  );

  const rate = response.data.conversion_rates.INR;

  cachedRate = rate;
  lastFetchTime = Date.now();

  return rate;
};
