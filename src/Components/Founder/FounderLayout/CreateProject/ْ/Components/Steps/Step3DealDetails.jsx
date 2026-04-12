import React from 'react';
import { IoAlertCircleOutline } from "react-icons/io5";

const Step3DealDetails = ({
  selectedFunding,
  setCurrentStep,
  fundingGoal,
  minContribution,
  selectDuration,
  rewardTiers, setRewardTiers,
  equityOffered, setEquityOffered,
  founderProfitShare, setFounderProfitShare,
  contractDuration, setContractDuration,
  payoutFrequency, setPayoutFrequency,
  errors,
}) => {

  const formatNumber = (num) => {
    if (!num) return '0';
    return Number(num).toLocaleString();
  };

  const addTier = () => {
    setRewardTiers([...rewardTiers, { gift: '', amount: '', quantity: '' }]);
  };

  const removeTier = (index) => {
    setRewardTiers(rewardTiers.filter((_, i) => i !== index));
  };

  const updateTier = (index, field, value) => {
    const updated = [...rewardTiers];
    updated[index] = { ...updated[index], [field]: value };
    setRewardTiers(updated);
  };

  const step3Content = () => {
    if (selectedFunding === 'Reward-Based') return (
      <div className='tiers_container'>
        {rewardTiers.map((tier, index) => (
          <div className='tier_card' key={index}>
            <div className='tier_header'>
              <h3 className='tier_title'>Tier {index + 1}</h3>
              {index > 0 && (
                <button type="button" className='tier_remove' onClick={() => removeTier(index)}>🗑 Remove</button>
              )}
            </div>
            <div className='tier_fields'>
              <div className='tier_field tier_field_gift'>
                <label className='tier_label'>Gift <span className='tier_required'>*</span></label>
                <input
                  type="text"
                  className='tier_input'
                  placeholder={index === 0 ? 'Early Bird Supporter Kit' : 'e.g., Special thank-you gift'}
                  value={tier.gift}
                  onChange={(e) => updateTier(index, 'gift', e.target.value)}
                />
              </div>
              <div className='tier_field tier_field_amount'>
                <label className='tier_label'>Amount (EGP) <span className='tier_required'>*</span></label>
                <div className='tier_amount_input'>
                  <span className='tier_egp_badge'>EGP</span>
                  <input
                    type="text"
                    className='tier_input'
                    placeholder={index === 0 ? '500' : 'e.g., 500'}
                    value={tier.amount}
                    onChange={(e) => updateTier(index, 'amount', e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>
              </div>
              <div className='tier_field tier_field_qty'>
                <label className='tier_label'>Quantity <span className='tier_required'>*</span></label>
                <input
                  type="text"
                  className='tier_input'
                  placeholder={index === 0 ? '50' : 'e.g., 100'}
                  value={tier.quantity}
                  onChange={(e) => updateTier(index, 'quantity', e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
            </div>
          </div>
        ))}
        {errors.rewardTiers && <p className="error_msg">{errors.rewardTiers}</p>}
        <button type="button" className='add_tier_btn' onClick={addTier}>+ Add another tier</button>
      </div>
    );

    if (selectedFunding === 'Equity-Based') return (
      <div className='tiers_container'>
        <div className='tier_card'>
          <div className='tier_fields' style={{ gridTemplateColumns: '1fr' }}>
            <div className='tier_field'>
              <label className='tier_label'>
                Equity offered (%) <span className='tier_required'>*</span>
                <span className='equity_info_icon' title='The percentage of your company you are offering to investors.'>
                  <IoAlertCircleOutline />
                </span>
              </label>
              <div className='equity_input_wrapper'>
                <input
                  type="text"
                  className='tier_input'
                  placeholder='10'
                  value={equityOffered}
                  onChange={(e) => setEquityOffered(e.target.value.replace(/[^0-9.]/g, ''))}
                />
                <span className='equity_pct_badge'>%</span>
              </div>
              <p className='equity_helper_text'>Enter the percentage of the entire company you will offer for the funding goal shown above.</p>
              {errors.equityOffered && <p className="error_msg">{errors.equityOffered}</p>}
            </div>
          </div>
        </div>
      </div>
    );

    if (selectedFunding === 'Mudarabah') return (
      <div className='tiers_container'>
        <div className='tier_card'>
          <div className='mudarabah_fields'>
            <div className='tier_field'>
              <label className='tier_label'>Founder profit share (%) <span className='tier_required'>*</span></label>
              <div className='equity_input_wrapper'>
                <input
                  type="text"
                  className='tier_input'
                  placeholder='e.g., 60'
                  value={founderProfitShare}
                  onChange={(e) => setFounderProfitShare(e.target.value.replace(/[^0-9]/g, ''))}
                />
                <span className='equity_pct_badge'>%</span>
              </div>
              <p className='equity_helper_text'>Your percentage of the project's total profit.</p>
              {errors.founderProfitShare && <p className="error_msg">{errors.founderProfitShare}</p>}
            </div>

            <div className='tier_field'>
              <label className='tier_label'>Contract duration <span className='tier_required'>*</span></label>
              <select
                className='tier_select'
                value={contractDuration}
                onChange={(e) => setContractDuration(e.target.value)}
              >
                <option value=''>Select duration</option>
                <option value='6 months'>6 months</option>
                <option value='12 months'>12 months</option>
                <option value='18 months'>18 months</option>
                <option value='24 months'>24 months</option>
                <option value='36 months'>36 months</option>
              </select>
              {errors.contractDuration && <p className="error_msg">{errors.contractDuration}</p>}
            </div>

            <div className='tier_field'>
              <label className='tier_label'>Profit payout frequency <span className='tier_required'>*</span></label>
              <select
                className='tier_select'
                value={payoutFrequency}
                onChange={(e) => setPayoutFrequency(e.target.value)}
              >
                <option value=''>Select frequency</option>
                <option value='Monthly'>Monthly</option>
                <option value='Quarterly'>Quarterly (3 months)</option>
                <option value='Semi-annually'>Semi-annually (6 months)</option>
                <option value='Annually'>Annually (12 months)</option>
              </select>
              {errors.payoutFrequency && <p className="error_msg">{errors.payoutFrequency}</p>}
            </div>
          </div>
        </div>
      </div>
    );

    return null;
  };

  return (
    <>
      <div className='summary_bar'>
        <div className='summary_item summary_item_border'>
          <span className='summary_label'>SELECTED MODEL</span>
          <div className='summary_value'>
            {selectedFunding} <button type="button" className='change_link' onClick={() => setCurrentStep(1)}>Change</button>
          </div>
        </div>
        <div className='summary_item summary_item_border'>
          <span className='summary_label'>FUNDING GOAL</span>
          <span className='summary_value'>EGP {formatNumber(fundingGoal)}</span>
        </div>
        <div className='summary_item summary_item_border'>
          <span className='summary_label'>MINIMUM CONTRIBUTION</span>
          <span className='summary_value'>EGP {formatNumber(minContribution)}</span>
        </div>
        <div className='summary_item'>
          <span className='summary_label'>DURATION</span>
          <span className='summary_value'>{selectDuration}</span>
        </div>
      </div>
      {step3Content()}
    </>
  );
};

export default Step3DealDetails;