import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CryptoCard from "./CryptoCard";
import "./CryptoFinder.css";
import fetchCryptoData from "../apiclients/crypto.api";
import fetchCryptoList from "../apiclients/cryptolist.api";
import CryptoList from "../models/CryptoList";
import SavedCryptoInfo from "../models/SavedCrypto";

const CryptoFinder: React.FC<{
  onSelectCrypto: (crypto: SavedCryptoInfo, isSaved: boolean) => void;
  favCryptos: SavedCryptoInfo[];
}> = (props) => {
  const [selectedCoin, setSelectedCoin] = useState<SavedCryptoInfo>({
    id: "",
    name: "",
  });

  const [queryCoin, setQueryCoin] = useState<SavedCryptoInfo>({
    id: "",
    name: "",
  });

  const [cryptoList, setCryptoList] = useState<CryptoList[]>([]);

  useEffect(() => {
    const getCryptos = async () => {
      const cryptos = await fetchCryptoList();
      setCryptoList(cryptos);
    };
    getCryptos();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCrypto = cryptoList.find(
      (crypto) => crypto.id === event.target.value
    );
    if (selectedCrypto) {
      setSelectedCoin({ id: selectedCrypto.id, name: selectedCrypto.name });
    } else {
      setSelectedCoin({ id: "", name: "" });
    }
  };

  const handleFetchData = () => {
    if (selectedCoin.id) {
      setQueryCoin({ id: selectedCoin.id, name: selectedCoin.name });
    }
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["crypto", queryCoin.id],
    queryFn: () => fetchCryptoData(queryCoin.id),
    enabled: !!queryCoin.id,
  });

  return (
    <>
      <h2>Crypto Finder</h2>
      <div className="crypto-tracker-container">
        <div className="crypto-finder">
          <label htmlFor="crypto-select">Select a cryptocurrency:</label>
          <div className="select-wrapper">
            <select
              id="crypto-select"
              onChange={handleSelectChange}
              value={selectedCoin.id}
            >
              <option value="">-- Choose a cryptocurrency --</option>
              {cryptoList.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleFetchData} disabled={selectedCoin.id === ""}>
            Find results
          </button>
        </div>

        <div className="results">
          {isLoading && <p>Loading...</p>}
          {isError && (
            <p>Failed to fetch data. Check the cryptocurrency symbol.</p>
          )}
          {data && (
            <CryptoCard
              key={queryCoin.id}
              coinId={queryCoin.id}
              coinName={queryCoin.name}
              prices={[
                { currency: "usd", value: data.usd },
                { currency: "eur", value: data.eur },
                { currency: "gbp", value: data.gbp },
              ]}
              isSaved={props.favCryptos.some((c) => c.id === queryCoin.id)}
              onToggleSave={props.onSelectCrypto}
            />
          )}
          {!data && <p>Your results will be shown here</p>}
        </div>
      </div>
    </>
  );
};

export default CryptoFinder;
