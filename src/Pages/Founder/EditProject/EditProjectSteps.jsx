import React, { useState, useEffect } from "react";
import { FiImage, FiUploadCloud, FiFile, FiTrash2, FiLink, FiEdit2 } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FiPieChart } from "react-icons/fi";
import axiosInstance from "../../../Api/axiosInstance";

/* ── Shared Styles ── */
const inputClass = "w-full px-4 py-3 border border-gray-100 rounded-xl text-sm text-[#0F2044] bg-white outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#FEF9EC] placeholder:text-gray-300";
const labelClass = "block text-[13px] font-semibold text-[#0F2044] mb-1.5";
const hintClass = "text-[12px] text-gray-400 mt-1.5 leading-relaxed";

/* ═══════════════════════════════════════════ */
/* ══  STEP 1: PROJECT DETAILS              ══ */
/* ═══════════════════════════════════════════ */
export function EditStep1({ fundingModel, projectTitle, setProjectTitle, category, setCategory, projectDescription, setProjectDescription, fundingGoal, setFundingGoal, minContribution, setMinContribution, selectDuration, setSelectDuration, errors }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axiosInstance.get("/Categories").then(res => { if (res.data.success) setCategories(res.data.data); }).catch(() => {});
  }, []);

  const modelLabel = fundingModel === "Reward" ? "Reward-Based" : fundingModel === "Equity" ? "Equity-Based" : "Mudarabah";

  return (
    <>
      <div className="current_model">
        <div className="current_model_left">
          <div className="model_icon"><CiCircleCheck /></div>
          <h3>Funding model: <span>{modelLabel}</span></h3>
        </div>
        <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>Cannot be changed</span>
      </div>
      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-lg font-bold mb-6" style={{ color: "#0F2044" }}>Project Story</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Project title <span className="text-red-400">*</span></label>
                <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="Enter your project title" className={inputClass} />
                <p className={hintClass}>Keep it clear and specific.</p>
                {errors.projectTitle && <p className="error_msg">{errors.projectTitle}</p>}
              </div>
              <div>
                <label className={labelClass}>Category <span className="text-red-400">*</span></label>
                <select className={`${inputClass} appearance-none cursor-pointer`} value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select a category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                {errors.category && <p className="error_msg">{errors.category}</p>}
              </div>
              <div>
                <label className={labelClass}>Project description <span className="text-red-400">*</span></label>
                <textarea className={`${inputClass} h-44 resize-none leading-relaxed`} placeholder="Explain the problem, your solution, and how funds will be used..." value={projectDescription} onChange={e => setProjectDescription(e.target.value)} />
                {errors.projectDescription && <p className="error_msg">{errors.projectDescription}</p>}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-lg font-bold mb-6" style={{ color: "#0F2044" }}>Funding & Campaign</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Funding goal <span className="text-red-400">*</span></label>
                <div className="flex">
                  <span className="flex items-center px-4 text-[13px] font-semibold rounded-l-xl border border-r-0 border-gray-100" style={{ backgroundColor: "#FEF9EC", color: "#D4A017" }}>EGP</span>
                  <input type="text" value={fundingGoal} onChange={e => setFundingGoal(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" className={`${inputClass} rounded-l-none`} />
                </div>
                {errors.fundingGoal && <p className="error_msg">{errors.fundingGoal}</p>}
              </div>
              <div>
                <label className={labelClass}>Minimum contribution <span className="text-red-400">*</span></label>
                <div className="flex">
                  <span className="flex items-center px-4 text-[13px] font-semibold rounded-l-xl border border-r-0 border-gray-100" style={{ backgroundColor: "#FEF9EC", color: "#D4A017" }}>EGP</span>
                  <input type="text" value={minContribution} onChange={e => setMinContribution(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" className={`${inputClass} rounded-l-none`} />
                </div>
                {errors.minContribution && <p className="error_msg">{errors.minContribution}</p>}
              </div>
              <div>
                <label className={labelClass}>Campaign duration <span className="text-red-400">*</span></label>
                <div className="duration-btns">
                  {["30 days", "60 days", "90 days"].map(d => (
                    <button key={d} type="button" className={selectDuration === d ? "duration-selected" : ""} onClick={() => setSelectDuration(d)}>{d}</button>
                  ))}
                </div>
                {errors.selectDuration && <p className="error_msg">{errors.selectDuration}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════ */
/* ══  STEP 2: DEAL DETAILS                 ══ */
/* ═══════════════════════════════════════════ */
export function EditStep2({ fundingModel, fundingGoal, minContribution, selectDuration, rewardTiers, setRewardTiers, equityOffered, setEquityOffered, founderProfitShare, setFounderProfitShare, contractDuration, setContractDuration, payoutFrequency, setPayoutFrequency, errors }) {
  const fmt = n => n ? Number(n).toLocaleString() : "0";
  const addTier = () => setRewardTiers([...rewardTiers, { gift: "", amount: "", quantity: "" }]);
  const removeTier = i => setRewardTiers(rewardTiers.filter((_, idx) => idx !== i));
  const updateTier = (i, field, val) => { const u = [...rewardTiers]; u[i] = { ...u[i], [field]: val }; setRewardTiers(u); };

  const modelLabel = fundingModel === "Reward" ? "Reward-Based" : fundingModel === "Equity" ? "Equity-Based" : "Mudarabah";

  return (
    <>
      <div className="summary_bar">
        <div className="summary_item summary_item_border">
          <span className="summary_label">MODEL</span>
          <span className="summary_value">{modelLabel}</span>
        </div>
        <div className="summary_item summary_item_border">
          <span className="summary_label">FUNDING GOAL</span>
          <span className="summary_value">EGP {fmt(fundingGoal)}</span>
        </div>
        <div className="summary_item summary_item_border">
          <span className="summary_label">MIN. CONTRIBUTION</span>
          <span className="summary_value">EGP {fmt(minContribution)}</span>
        </div>
        <div className="summary_item">
          <span className="summary_label">DURATION</span>
          <span className="summary_value">{selectDuration || "—"}</span>
        </div>
      </div>

      {fundingModel === "Reward" && (
        <div className="tiers_container">
          {rewardTiers.map((tier, i) => (
            <div className="tier_card" key={i}>
              <div className="tier_header">
                <h3 className="tier_title">Tier {i + 1}</h3>
                {i > 0 && <button type="button" className="tier_remove" onClick={() => removeTier(i)}>🗑 Remove</button>}
              </div>
              <div className="tier_fields">
                <div className="tier_field tier_field_gift">
                  <label className="tier_label">Gift <span className="tier_required">*</span></label>
                  <input type="text" className="tier_input" placeholder="e.g., Early Bird Kit" value={tier.gift} onChange={e => updateTier(i, "gift", e.target.value)} />
                </div>
                <div className="tier_field tier_field_amount">
                  <label className="tier_label">Amount (EGP) <span className="tier_required">*</span></label>
                  <div className="tier_amount_input">
                    <span className="tier_egp_badge">EGP</span>
                    <input type="text" className="tier_input" placeholder="500" value={tier.amount} onChange={e => updateTier(i, "amount", e.target.value.replace(/[^0-9]/g, ""))} />
                  </div>
                </div>
                <div className="tier_field tier_field_qty">
                  <label className="tier_label">Quantity <span className="tier_required">*</span></label>
                  <input type="text" className="tier_input" placeholder="50" value={tier.quantity} onChange={e => updateTier(i, "quantity", e.target.value.replace(/[^0-9]/g, ""))} />
                </div>
              </div>
            </div>
          ))}
          {errors.rewardTiers && <p className="error_msg">{errors.rewardTiers}</p>}
          <button type="button" className="add_tier_btn" onClick={addTier}>+ Add another tier</button>
        </div>
      )}

      {fundingModel === "Equity" && (
        <div className="tiers_container">
          <div className="tier_card">
            <div className="tier_fields" style={{ gridTemplateColumns: "1fr" }}>
              <div className="tier_field">
                <label className="tier_label">Equity offered (%) <span className="tier_required">*</span></label>
                <div className="equity_input_wrapper">
                  <input type="text" className="tier_input" placeholder="10" value={equityOffered} onChange={e => setEquityOffered(e.target.value.replace(/[^0-9.]/g, ""))} />
                  <span className="equity_pct_badge">%</span>
                </div>
                <p className="equity_helper_text">The percentage of your company you are offering to investors.</p>
                {errors.equityOffered && <p className="error_msg">{errors.equityOffered}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {fundingModel === "Mudarabah" && (
        <div className="tiers_container">
          <div className="tier_card">
            <div className="mudarabah_fields">
              <div className="tier_field">
                <label className="tier_label">Founder profit share (%) <span className="tier_required">*</span></label>
                <div className="equity_input_wrapper">
                  <input type="text" className="tier_input" placeholder="60" value={founderProfitShare} onChange={e => setFounderProfitShare(e.target.value.replace(/[^0-9]/g, ""))} />
                  <span className="equity_pct_badge">%</span>
                </div>
                {errors.founderProfitShare && <p className="error_msg">{errors.founderProfitShare}</p>}
              </div>
              <div className="tier_field">
                <label className="tier_label">Contract duration <span className="tier_required">*</span></label>
                <select className="tier_select" value={contractDuration} onChange={e => setContractDuration(e.target.value)}>
                  <option value="">Select duration</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
                {errors.contractDuration && <p className="error_msg">{errors.contractDuration}</p>}
              </div>
              <div className="tier_field">
                <label className="tier_label">Profit payout frequency <span className="tier_required">*</span></label>
                <select className="tier_select" value={payoutFrequency} onChange={e => setPayoutFrequency(e.target.value)}>
                  <option value="">Select frequency</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly (3 months)</option>
                  <option value="Semi-annually">Semi-annually (6 months)</option>
                  <option value="Annually">Annually (12 months)</option>
                </select>
                {errors.payoutFrequency && <p className="error_msg">{errors.payoutFrequency}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════ */
/* ══  STEP 3: MEDIA & DOCS                ══ */
/* ═══════════════════════════════════════════ */
export function EditStep3({ existingImages, existingDocs, existingCoverUrl, onDeleteExisting, newMediaFiles, setNewMediaFiles, videoUrl, setVideoUrl, newDocuments, setNewDocuments, errors }) {
  const resolveUrl = u => u ? (u.startsWith("http") ? u : `https://investry.runasp.net${u}`) : null;
  const handleNewImages = e => { const f = Array.from(e.target.files); setNewMediaFiles(prev => [...prev, ...f]); };
  const handleNewDocs = e => { const f = Array.from(e.target.files); setNewDocuments(prev => [...prev, ...f]); };
  const removeNewImage = i => setNewMediaFiles(newMediaFiles.filter((_, idx) => idx !== i));
  const removeNewDoc = i => setNewDocuments(newDocuments.filter((_, idx) => idx !== i));
  const formatSize = b => { if (b < 1024) return b + " B"; if (b < 1048576) return (b / 1024).toFixed(1) + " KB"; return (b / 1048576).toFixed(1) + " MB"; };

  return (
    <div className="media_container">
      <div className="media_card">
        <h2 className="media_card_title">Visual Presentation</h2>
        <div className="media_field">
          <label className="tier_label">Current Images</label>
          {existingImages.length === 0 && !existingCoverUrl && <p className="equity_helper_text">No images uploaded yet.</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            {existingCoverUrl && (
              <div style={{ position: "relative", width: 90, height: 64, borderRadius: 10, overflow: "hidden", border: "2px solid #D4A017" }}>
                <img src={resolveUrl(existingCoverUrl)} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", bottom: 2, left: 4, fontSize: 8, color: "#D4A017", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.9)", padding: "1px 4px", borderRadius: 4 }}>COVER</span>
              </div>
            )}
            {existingImages.map((img, i) => (
              <div key={i} style={{ position: "relative", width: 90, height: 64, borderRadius: 10, overflow: "hidden", border: "1.5px solid #f0f0f0" }}>
                <img src={resolveUrl(img.url)} alt={`Gallery ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button type="button" onClick={() => onDeleteExisting(img.publicId || img.url, "image")} style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.9)", border: "none", color: "white", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            ))}
          </div>
          <label className="tier_label">Add New Images</label>
          <div className="upload_zone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setNewMediaFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }} onClick={() => document.getElementById("editCoverInput").click()}>
            <div className="upload_icon upload_icon_image"><FiUploadCloud /></div>
            <p className="upload_text"><span className="upload_link">Click to upload</span> or drag and drop</p>
            <p className="upload_hint">SVG, PNG, JPG or GIF (max. 5MB)</p>
            <input id="editCoverInput" type="file" accept=".svg,.png,.jpg,.jpeg,.gif" multiple style={{ display: "none" }} onChange={handleNewImages} />
          </div>
          {newMediaFiles.map((img, i) => (
            <div className="uploaded_file" key={i}>
              <div className="uploaded_file_info">
                <span className="file_icon file_icon_img"><FiImage /></span>
                <div className="file_details"><span className="file_name">{img.name}</span><span className="file_size">{formatSize(img.size)}</span></div>
              </div>
              <button type="button" className="file_remove" onClick={() => removeNewImage(i)}><FiTrash2 /></button>
            </div>
          ))}
          {errors.media && <p className="error_msg">{errors.media}</p>}
        </div>
        <div className="media_field">
          <label className="tier_label">Promotional Video URL <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Optional)</span></label>
          <div className="video_input_wrapper">
            <span className="video_link_icon"><FiLink /></span>
            <input type="text" className="tier_input video_input" placeholder="e.g. https://youtube.com/watch?v=..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="media_card">
        <h2 className="media_card_title">Documents</h2>
        <div className="media_field">
          <label className="tier_label">Current Documents</label>
          {existingDocs.length === 0 && <p className="equity_helper_text">No documents uploaded yet.</p>}
          {existingDocs.map((doc, i) => {
            const name = doc.url?.split("/").pop() || `Document ${i + 1}`;
            return (
              <div className="uploaded_file" key={i}>
                <div className="uploaded_file_info">
                  <span className="file_icon file_icon_doc"><FiFile /></span>
                  <div className="file_details"><span className="file_name">{name}</span></div>
                </div>
                <button type="button" className="file_remove" onClick={() => onDeleteExisting(doc.publicId || doc.url, "doc")}><FiTrash2 /></button>
              </div>
            );
          })}
          <label className="tier_label" style={{ marginTop: 16 }}>Add New Documents</label>
          <div className="upload_zone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setNewDocuments(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }} onClick={() => document.getElementById("editDocsInput").click()}>
            <div className="upload_icon upload_icon_doc"><FiUploadCloud /></div>
            <p className="upload_text"><span className="upload_link">Click to upload</span> or drag and drop</p>
            <p className="upload_hint">PDF documents only (max. 15MB per file)</p>
            <input id="editDocsInput" type="file" accept=".pdf" multiple style={{ display: "none" }} onChange={handleNewDocs} />
          </div>
          {newDocuments.map((doc, i) => (
            <div className="uploaded_file" key={i}>
              <div className="uploaded_file_info">
                <span className="file_icon file_icon_doc"><FiFile /></span>
                <div className="file_details"><span className="file_name">{doc.name}</span><span className="file_size">{formatSize(doc.size)}</span></div>
              </div>
              <button type="button" className="file_remove" onClick={() => removeNewDoc(i)}><FiTrash2 /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ══  STEP 4: REVIEW & SAVE               ══ */
/* ═══════════════════════════════════════════ */
export function EditStep4({ fundingModel, projectTitle, category, fundingGoal, minContribution, selectDuration, equityOffered, rewardTiers, founderProfitShare, contractDuration, existingImages, newMediaFiles, existingDocs, newDocuments, videoUrl, existingCoverUrl, setCurrentStep }) {
  const fmt = n => n ? Number(n).toLocaleString() : "0";
  const modelLabel = fundingModel === "Reward" ? "Reward-Based" : fundingModel === "Equity" ? "Equity-Based" : "Mudarabah";
  const totalImages = (existingCoverUrl ? 1 : 0) + existingImages.length + newMediaFiles.length;
  const totalDocs = existingDocs.length + newDocuments.length;

  const previewUrl = newMediaFiles.length > 0 ? URL.createObjectURL(newMediaFiles[0]) : existingCoverUrl ? (existingCoverUrl.startsWith("http") ? existingCoverUrl : `https://investry.runasp.net${existingCoverUrl}`) : null;

  return (
    <div className="review_container">
      <div className="review_left">
        <div className="review_section">
          <div className="review_section_header">
            <h3 className="review_section_title">Project Details</h3>
            <button type="button" className="review_edit_btn" onClick={() => setCurrentStep(1)}><FiEdit2 size={13} /> Edit</button>
          </div>
          <div className="review_row" style={{ gridTemplateColumns: "1fr" }}>
            <div className="review_field"><span className="review_field_label">PROJECT TITLE</span><span className="review_field_value">{projectTitle}</span></div>
          </div>
          <div className="review_row">
            <div className="review_field"><span className="review_field_label">FUNDING MODEL</span><span className="review_field_value">{modelLabel}</span></div>
            <div className="review_field"><span className="review_field_label">FUNDING GOAL</span><span className="review_field_value review_highlight">EGP {fmt(fundingGoal)}</span></div>
          </div>
          <div className="review_row" style={{ marginBottom: 0 }}>
            <div className="review_field"><span className="review_field_label">MIN. CONTRIBUTION</span><span className="review_field_value">EGP {fmt(minContribution)}</span></div>
            <div className="review_field"><span className="review_field_label">DURATION</span><span className="review_field_value">{selectDuration}</span></div>
          </div>
        </div>

        <div className="review_section">
          <div className="review_section_header">
            <h3 className="review_section_title">Deal Details</h3>
            <button type="button" className="review_edit_btn" onClick={() => setCurrentStep(2)}><FiEdit2 size={13} /> Edit</button>
          </div>
          {fundingModel === "Reward" && <div className="review_row" style={{ marginBottom: 0 }}><div className="review_field"><span className="review_field_label">REWARD TIERS</span><span className="review_field_value review_highlight">{rewardTiers.length} tier{rewardTiers.length !== 1 ? "s" : ""}</span></div></div>}
          {fundingModel === "Equity" && <div className="review_row" style={{ marginBottom: 0 }}><div className="review_field"><span className="review_field_label">EQUITY OFFERED</span><span className="review_field_value review_highlight">{equityOffered}%</span></div></div>}
          {fundingModel === "Mudarabah" && <><div className="review_row"><div className="review_field"><span className="review_field_label">FOUNDER PROFIT SHARE</span><span className="review_field_value review_highlight">{founderProfitShare}%</span></div></div><div className="review_row" style={{ marginBottom: 0 }}><div className="review_field"><span className="review_field_label">CONTRACT DURATION</span><span className="review_field_value">{contractDuration} months</span></div></div></>}
        </div>

        <div className="review_section">
          <div className="review_section_header">
            <h3 className="review_section_title">Media & Documents</h3>
            <button type="button" className="review_edit_btn" onClick={() => setCurrentStep(3)}><FiEdit2 size={13} /> Edit</button>
          </div>
          <div className="review_row">
            <div className="review_field"><span className="review_field_label">IMAGES</span><span className="review_field_value">{totalImages} total</span></div>
            <div className="review_field"><span className="review_field_label">VIDEO</span><span className="review_field_value">{videoUrl ? "Link provided" : "Not provided"}</span></div>
          </div>
          <div className="review_row" style={{ marginBottom: 0 }}>
            <div className="review_field"><span className="review_field_label">DOCUMENTS</span><span className="review_field_value">{totalDocs} total</span></div>
          </div>
        </div>
      </div>

      <div className="review_right">
        <span className="preview_header">PROJECT PREVIEW</span>
        <div className="preview_card">
          {previewUrl ? (
            <div className="preview_image_wrapper">
              <img src={previewUrl} alt="Cover" className="preview_image" />
              <span className="preview_badge"><FiPieChart size={12} /> {modelLabel}</span>
            </div>
          ) : (
            <div className="preview_image_placeholder"><span>No image</span></div>
          )}
          <div className="preview_body">
            <span className="preview_category">{category || "CATEGORY"}</span>
            <h3 className="preview_title">{projectTitle || "Project Title"}</h3>
            <div className="preview_goal">
              <span className="preview_goal_label">Funding Goal</span>
              <span className="preview_goal_value">EGP {fmt(fundingGoal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
