import React from "react";
import "./CryptoCard.css";

type CryptoCardProps = {
  coinId: string;
  coinName: string;
  usd: number;
  eur: number;
  gbp: number;
  isSaved: boolean;
  onToggleSave: (coin: { id: string; name: string }) => void;
};

const CryptoCard: React.FC<CryptoCardProps> = ({
  coinId,
  coinName,
  usd,
  eur,
  gbp,
  isSaved,
  onToggleSave,
}) => {
  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h3>{coinName}</h3>
        <span
          className={`fa fa-star fa-lg ${isSaved ? "unstar" : "star"}`}
          onClick={() => onToggleSave({ id: coinId, name: coinName })}
        ></span>
      </div>
      <div className="crypto-card-data">
        <p> USD: {usd}</p>
        <p> EUR: {eur}</p>
        <p> GBP: {gbp}</p>
      </div>
    </div>
  );
};

export default CryptoCard;
