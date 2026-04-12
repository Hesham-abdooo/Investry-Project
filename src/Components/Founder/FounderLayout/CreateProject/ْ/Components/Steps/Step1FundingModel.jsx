import React from 'react';
import { FaGift } from "react-icons/fa6";
import { FiPieChart } from "react-icons/fi";
import { FaBuildingColumns } from "react-icons/fa6";

const Step1FundingModel = ({ selectedFunding, setSelectedFunding }) => {
  return (
    <div className='funding_container'>
      <div
        className={`funding_card ${selectedFunding === 'Reward-Based' ? 'selected' : ''}`}
        onClick={() => setSelectedFunding('Reward-Based')}
      >
        <div className="card_icon"><FaGift /></div>
        <h3>Reward-Based</h3>
        <p className="card_description">Offer perks or exclusive products to backers.</p>
        <div className="ideal_for">
          <h4>IDEAL FOR</h4>
          <p>Creative projects, new products, community campaigns.</p>
        </div>
      </div>

      <div
        className={`funding_card ${selectedFunding === 'Equity-Based' ? 'selected' : ''}`}
        onClick={() => setSelectedFunding('Equity-Based')}
      >
        <div className="card_icon"><FiPieChart /></div>
        <h3>Equity-Based</h3>
        <p className="card_description">Offer investors ownership shares in exchange for funding.</p>
        <div className="ideal_for">
          <h4>IDEAL FOR</h4>
          <p>Tech startups and high-growth ventures.</p>
        </div>
      </div>

      <div
        className={`funding_card ${selectedFunding === 'Mudarabah' ? 'selected' : ''}`}
        onClick={() => setSelectedFunding('Mudarabah')}
      >
        <div className="card_icon"><FaBuildingColumns /></div>
        <h3>Mudarabah</h3>
        <p className="card_description">Share profits with investors under Sharia-compliant terms.</p>
        <div className="ideal_for">
          <h4>IDEAL FOR</h4>
          <p>Sharia-compliant investments and business projects of all sizes.</p>
        </div>
      </div>
    </div>
  );
};

export default Step1FundingModel;