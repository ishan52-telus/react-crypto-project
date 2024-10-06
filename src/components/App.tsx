import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CryptoFinder from "./CryptoFinder";
import SavedCryptos from "./SavedCryptos";
import "./App.css";
import SavedCrypto from "../models/SavedCrypto";
import Header from "./Header";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [favCryptos, setFavCryptos] = useState<SavedCrypto[]>(() => {
    const saved = localStorage.getItem("savedCoins");
    return saved ? JSON.parse(saved) : [];
  });

  function handleFavCrypto(selectedCrypto: SavedCrypto) {
    setFavCryptos((prevFavCryptos) => {
      const exists = prevFavCryptos.find(
        (crypto) => crypto.id === selectedCrypto.id
      );
      let updatedFavCryptos;
      if (exists) {
        updatedFavCryptos = prevFavCryptos.filter(
          (crypto) => crypto.id !== selectedCrypto.id
        );
      } else {
        updatedFavCryptos = [selectedCrypto, ...prevFavCryptos];
      }
      localStorage.setItem("savedCoins", JSON.stringify(updatedFavCryptos));
      return updatedFavCryptos;
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <div className="app-container">
        <SavedCryptos
          onSelectCrypto={handleFavCrypto}
          favCryptos={favCryptos}
        />
        <CryptoFinder
          onSelectCrypto={handleFavCrypto}
          favCryptos={favCryptos}
        />
      </div>
    </QueryClientProvider>
  );
};

export default App;
