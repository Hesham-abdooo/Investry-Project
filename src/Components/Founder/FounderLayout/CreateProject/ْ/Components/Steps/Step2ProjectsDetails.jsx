import React from 'react';
import axios from 'axios';
import { CiCircleCheck } from "react-icons/ci";
import axiosInstance from '../../../../../../../Api/axiosInstance';

const Step2ProjectDetails = ({
  selectedFunding,
  setCurrentStep,
  projectTitle, setProjectTitle,
  category, setCategory,
  projectDescription, setProjectDescription,
  fundingGoal, setFundingGoal,
  minContribution, setMinContribution,
  selectDuration, setSelectDuration,
  startDateOption, setStartDateOption,
  scheduledDate, setScheduledDate, errors
}) => {

  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    axiosInstance.get('/Categories')
      .then(res => {
        if (res.data.success) setCategories(res.data.data);
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  /* ── Shared Styles ── */
  const inputClass = "w-full px-4 py-3 border border-gray-100 rounded-xl text-sm text-[#0F2044] bg-white outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#FEF9EC] placeholder:text-gray-300";
  const labelClass = "block text-[13px] font-semibold text-[#0F2044] mb-1.5";
  const hintClass = "text-[12px] text-gray-400 mt-1.5 leading-relaxed";

  return (
    <>
      <div className='current_model'>
        <div className='current_model_left'>
          <div className='model_icon'><CiCircleCheck /></div>
          <h3>Selected model: <span>{selectedFunding}</span></h3>
        </div>
        <button type="button" className='change_link' onClick={() => setCurrentStep(1)}>Change</button>
      </div>

      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ══ Left Column: Project Story ══ */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-lg font-bold mb-6" style={{ color: '#0F2044' }}>Project Story</h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className={labelClass}>Project title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Enter your project title"
                  className={inputClass}
                />
                <p className={hintClass}>Keep it clear and specific.</p>
                {errors.projectTitle && <p className="error_msg">{errors.projectTitle}</p>}
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>Category <span className="text-red-400">*</span></label>
                <select
                  className={`${inputClass} appearance-none cursor-pointer`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <p className="error_msg">{errors.category}</p>}
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Project description <span className="text-red-400">*</span></label>
                <textarea
                  className={`${inputClass} h-44 resize-none leading-relaxed`}
                  placeholder="Explain the problem, your solution, and how funds will be used..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
                <p className={hintClass}>Explain the problem, your solution, and how funds will be used.</p>
                {errors.projectDescription && <p className="error_msg">{errors.projectDescription}</p>}
              </div>

              {/* Location */}
              <div>
                <label className={labelClass}>
                  Location <span className="text-gray-300 font-normal text-[12px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cairo, Egypt"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ══ Right Column: Funding & Campaign ══ */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-lg font-bold mb-6" style={{ color: '#0F2044' }}>Funding & Campaign</h2>

            <div className="space-y-5">
              {/* Funding Goal */}
              <div>
                <label className={labelClass}>Funding goal <span className="text-red-400">*</span></label>
                <div className="flex">
                  <span className="flex items-center px-4 text-[13px] font-semibold rounded-l-xl border border-r-0 border-gray-100" style={{ backgroundColor: '#FEF9EC', color: '#D4A017' }}>EGP</span>
                  <input
                    type="text"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    className={`${inputClass} rounded-l-none`}
                  />
                </div>
                <p className={hintClass}>Total amount you want to raise to complete your project.</p>
                {errors.fundingGoal && <p className="error_msg">{errors.fundingGoal}</p>}
              </div>

              {/* Min Contribution */}
              <div>
                <label className={labelClass}>Minimum contribution <span className="text-red-400">*</span></label>
                <div className="flex">
                  <span className="flex items-center px-4 text-[13px] font-semibold rounded-l-xl border border-r-0 border-gray-100" style={{ backgroundColor: '#FEF9EC', color: '#D4A017' }}>EGP</span>
                  <input
                    type="text"
                    value={minContribution}
                    onChange={(e) => setMinContribution(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    className={`${inputClass} rounded-l-none`}
                  />
                </div>
                <p className={hintClass}>The smallest amount a person can invest in this campaign.</p>
                {errors.minContribution && <p className="error_msg">{errors.minContribution}</p>}
              </div>

              {/* Duration */}
              <div>
                <label className={labelClass}>Campaign duration <span className="text-red-400">*</span></label>
                <div className="duration-btns">
                  <button type="button" className={selectDuration === '30 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('30 days')}>30 days</button>
                  <button type="button" className={selectDuration === '60 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('60 days')}>60 days</button>
                  <button type="button" className={selectDuration === '90 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('90 days')}>90 days</button>
                </div>
                <p className={hintClass}>You can adjust this before final submission.</p>
                {errors.selectDuration && <p className="error_msg">{errors.selectDuration}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step2ProjectDetails;