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

  return (
    <>
      <div className='current_model'>
        <div className='current_model_left'>
          <div className='model_icon'><CiCircleCheck /></div>
          <h3>Selected model: <span>{selectedFunding}</span></h3>
        </div>
        <button type="button" className='change_link' onClick={() => setCurrentStep(1)}>Change</button>
      </div>

      <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Left Column: Project Story */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Project Story</h2>
            <div className="space-y-6">

              <div className="space-y-2">
                <label className="block font-semibold">Project title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F2044] outline-none transition bg-white"
                />
                <p className="text-sm text-gray-400">Keep it clear and specific.</p>
                {errors.projectTitle && <p className="error_msg">{errors.projectTitle}</p>}
              </div>

              <div className="space-y-2">
                <label className="block font-semibold">Category <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#0F2044] outline-none cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="error_msg">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <label className="block font-semibold">Project description <span className="text-red-500">*</span></label>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="flex items-center gap-4 p-3 border-b border-gray-100 bg-gray-50/50">
                    <span className="text-gray-400">T</span>
                  </div>
                  <textarea
                    className="w-full p-4 h-48 outline-none resize-none text-sm leading-relaxed bg-white"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-400">Explain the problem, your solution, and how funds will be used.</p>
                {errors.projectDescription && <p className="error_msg">{errors.projectDescription}</p>}
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-gray-600">
                  Location <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cairo, Egypt"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F2044] outline-none bg-white"
                />
              </div>
            </div>
          </section>

          {/* Right Column: Funding & Campaign */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Funding & Campaign</h2>
            <div className="space-y-6">

              <div className="space-y-2">
                <label className="block font-semibold">Funding goal <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="bg-gray-100 border border-r-0 border-gray-200 px-4 py-3 rounded-l-lg text-gray-500 font-medium">EGP</span>
                  <input
                    type="text"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full p-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#0F2044] outline-none"
                  />
                </div>
                <p className="text-sm text-gray-400">Total amount you want to raise to complete your project.</p>
                {errors.fundingGoal && <p className="error_msg">{errors.fundingGoal}</p>}
              </div>

              <div className="space-y-2">
                <label className="block font-semibold">Minimum contribution <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="bg-gray-100 border border-r-0 border-gray-200 px-4 py-3 rounded-l-lg text-gray-500 font-medium">EGP</span>
                  <input
                    type="text"
                    value={minContribution}
                    onChange={(e) => setMinContribution(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full p-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#0F2044] outline-none"
                  />
                </div>
                <p className="text-sm text-gray-400">The smallest amount a person can invest in this campaign.</p>
                {errors.minContribution && <p className="error_msg">{errors.minContribution}</p>}
              </div>

              <div className="space-y-2">
                <label className="block font-semibold">Campaign duration <span className="text-red-500">*</span></label>
                <div className="duration-btns">
                  <button type="button" className={selectDuration === '30 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('30 days')}>30 days</button>
                  <button type="button" className={selectDuration === '60 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('60 days')}>60 days</button>
                  <button type="button" className={selectDuration === '90 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('90 days')}>90 days</button>
                </div>
                <p className="text-sm text-gray-400">You can adjust this before final submission.</p>
                {errors.selectDuration && <p className="error_msg">{errors.selectDuration}</p>}
              </div>

              <div className="start_date_group">
                <label className="start_date_label">Campaign start date</label>
                <label
                  className={`start_date_option ${startDateOption === 'immediately' ? 'start_date_selected' : ''}`}
                  onClick={() => setStartDateOption('immediately')}
                >
                  <div className={`start_date_radio ${startDateOption === 'immediately' ? 'start_date_radio_active' : ''}`}>
                    {startDateOption === 'immediately' && <div className="start_date_radio_dot"></div>}
                  </div>
                  <span className="start_date_text">Start immediately upon approval</span>
                </label>

                <label
                  className={`start_date_option ${startDateOption === 'schedule' ? 'start_date_selected' : ''}`}
                  onClick={() => setStartDateOption('schedule')}
                >
                  <div className={`start_date_radio ${startDateOption === 'schedule' ? 'start_date_radio_active' : ''}`}>
                    {startDateOption === 'schedule' && <div className="start_date_radio_dot"></div>}
                  </div>
                  <span className="start_date_text">Schedule a specific start date</span>
                </label>

                {startDateOption === 'schedule' && (
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="start_date_input"
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Step2ProjectDetails;