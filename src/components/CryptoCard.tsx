import React from "react";
import "./CryptoCard.css";
import SavedCryptoInfo from "../models/SavedCrypto";

type Price = {
  currency: string;
  value: number;
};

type CryptoCardProps = {
  coinId: string;
  coinName: string;
  prices: Price[];
  isSaved: boolean;
  onToggleSave: (coin: SavedCryptoInfo, isSaved: boolean) => void;
};

const CryptoCard: React.FC<CryptoCardProps> = ({
  coinId,
  coinName,
  prices,
  isSaved,
  onToggleSave,
}) => {
  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h3>{coinName}</h3>
        <span
          className={`fa fa-star fa-lg ${isSaved ? "unstar" : "star"}`}
          onClick={() => onToggleSave({ id: coinId, name: coinName }, isSaved)}
        ></span>
      </div>
      <div className="crypto-card-data">
        {prices.map((price) => (
          <p key={price.currency}>
            {price.currency.toUpperCase()}: {price.value}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CryptoCard;
