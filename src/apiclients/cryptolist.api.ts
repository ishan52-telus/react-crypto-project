import axios from "axios";
import CryptoList from "../models/CryptoList";
  
const fetchCryptoList = async (): Promise<CryptoList[]> => {
    const response = await axios.get<CryptoList[]>(
      `https://api.coingecko.com/api/v3/coins/list`
    );
    return response.data;
};

export default fetchCryptoList