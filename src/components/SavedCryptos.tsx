import React, { useState } from "react";
import CryptoCard from "./CryptoCard";
import axios from "axios";
import { useQueries } from "@tanstack/react-query";
import CoinGeckoResponse from "../models/CoinGeckoResponse";
import SavedCrypto from "../models/SavedCrypto";
import "./SavedCryptos.css";

const fetchCryptoData = async (coinId: string) => {
  const response = await axios.get<CoinGeckoResponse>(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,eur,gbp&precision=2`
  );
  return response.data[coinId];
};

const SavedCryptos: React.FC<{
  onSelectCrypto: (crypto: SavedCrypto) => void;
  favCryptos: SavedCrypto[];
}> = (props) => {
  const [showAll, setShowAll] = useState(false);

  const cryptoQueries = useQueries({
    queries: props.favCryptos.map((crypto) => ({
      queryKey: ["crypto", crypto.id],
      queryFn: () => fetchCryptoData(crypto.id),
    })),
  });

  const firstFourCryptos = props.favCryptos.slice(0, 4);
  const remainingCryptos = props.favCryptos.slice(4);

  return (
    <>
      <h2>Saved Cryptos</h2>
      <div className="saved-cryptos-container">
        <div className="saved-cryptos-list">
          {remainingCryptos.length > 0 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className={`show-more-btn-mobile ${
                showAll ? "btn-visible" : "btn-invisible"
              }`}
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
          {props.favCryptos.length === 0 ? (
            <p>No saved cryptocurrencies</p>
          ) : (
            <>
              {firstFourCryptos.map((crypto, index) => {
                const query = cryptoQueries[index];
                if (query.isLoading)
                  return <p key={crypto.id}>Loading {crypto.name}...</p>;
                if (query.isError)
                  return <p key={crypto.id}>Failed to load {crypto.name}</p>;
                return (
                  query.data && (
                    <CryptoCard
                      key={crypto.id}
                      coinId={crypto.id}
                      coinName={crypto.name}
                      usd={query.data.usd}
                      eur={query.data.eur}
                      gbp={query.data.gbp}
                      isSaved={props.favCryptos.some((c) => c.id === crypto.id)}
                      onToggleSave={props.onSelectCrypto}
                    />
                  )
                );
              })}

              {showAll &&
                remainingCryptos.map((crypto, index) => {
                  const query = cryptoQueries[index + 4];
                  if (!query) return null;
                  if (query.isLoading)
                    return <p key={crypto.id}>Loading {crypto.name}...</p>;
                  if (query.isError)
                    return <p key={crypto.id}>Failed to load {crypto.name}</p>;
                  return (
                    query.data && (
                      <CryptoCard
                        key={crypto.id}
                        coinId={crypto.id}
                        coinName={crypto.name}
                        usd={query.data.usd}
                        eur={query.data.eur}
                        gbp={query.data.gbp}
                        isSaved={props.favCryptos.some(
                          (c) => c.id === crypto.id
                        )}
                        onToggleSave={props.onSelectCrypto}
                      />
                    )
                  );
                })}

              {remainingCryptos.length > 0 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="show-more-btn"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedCryptos;
