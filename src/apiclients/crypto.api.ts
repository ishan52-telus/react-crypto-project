import axios from "axios";
import CoinGeckoResponse from "../models/CoinGeckoResponse";

const fetchCryptoData = async (coinId: string) => {
    const response = await axios.get<CoinGeckoResponse>(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,eur,gbp&precision=2`
    );
    return response.data[coinId];
};

export default fetchCryptoData;