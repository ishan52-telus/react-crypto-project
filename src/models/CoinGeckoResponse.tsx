type CoinGeckoResponse = {
    [key: string]: {
      usd: number;
      eur: number;
      gbp: number;
    };
};

export default CoinGeckoResponse;