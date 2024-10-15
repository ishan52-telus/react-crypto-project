import React, { useState, useMemo } from "react";
import CryptoCard from "./CryptoCard";
import { useQueries } from "@tanstack/react-query";
import SavedCrypto from "../models/SavedCrypto";
import "./SavedCryptos.css";
import fetchCryptoData from "../apiclients/crypto.api";

const NUMBER_OF_CRYPTOS_DISPLAYED = 4;

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

  const visibleCryptos = useMemo(() => {
    return showAll
      ? props.favCryptos
      : props.favCryptos.slice(0, NUMBER_OF_CRYPTOS_DISPLAYED);
  }, [props.favCryptos, showAll]);

  return (
    <>
      <h2>Saved Cryptos</h2>
      <div className="saved-cryptos-container">
        <div className="saved-cryptos-list">
          {visibleCryptos.length > NUMBER_OF_CRYPTOS_DISPLAYED && (
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
              {visibleCryptos.map((crypto, index) => {
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
                      prices={[
                        { currency: "usd", value: query.data.usd },
                        { currency: "eur", value: query.data.eur },
                        { currency: "gbp", value: query.data.gbp },
                      ]}
                      isSaved={props.favCryptos.some((c) => c.id === crypto.id)}
                      onToggleSave={props.onSelectCrypto}
                    />
                  )
                );
              })}

              {visibleCryptos.length > NUMBER_OF_CRYPTOS_DISPLAYED && (
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
