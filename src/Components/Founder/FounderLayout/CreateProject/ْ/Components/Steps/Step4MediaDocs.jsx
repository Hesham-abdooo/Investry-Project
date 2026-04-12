import React from 'react';

const Step4MediaDocs = ({
  coverImages, setCoverImages,
  documents, setDocuments,
  videoUrl, setVideoUrl,
  errors,
}) => {

  const handleCoverImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setCoverImages(prev => [...prev, ...files]);
  };

  const handleCoverImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setCoverImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setCoverImages(coverImages.filter((_, i) => i !== index));
  };

  const handleDocumentsUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const handleDocumentsDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className='media_container'>
      {/* Left Column: Visual Presentation */}
      <div className='media_card'>
        <h2 className='media_card_title'>Visual Presentation</h2>

        <div className='media_field'>
          <label className='tier_label'>Project Cover Image <span className='tier_required'>*</span></label>
          <div
            className='upload_zone'
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleCoverImageDrop}
            onClick={() => document.getElementById('coverImageInput').click()}
          >
            <div className='upload_icon upload_icon_image'>🖼</div>
            <p className='upload_text'><span className='upload_link'>Click to upload</span> or drag and drop</p>
            <p className='upload_hint'>SVG, PNG, JPG or GIF (max. 5MB)</p>
            <input
              id='coverImageInput'
              type='file'
              accept='.svg,.png,.jpg,.jpeg,.gif'
              multiple
              style={{ display: 'none' }}
              onChange={handleCoverImageUpload}
            />
          </div>
          <p className='equity_helper_text'>This image will be used as the thumbnail on the campaign discovery page. Recommended ratio 16:9.</p>
          {errors.coverImages && <p className="error_msg">{errors.coverImages}</p>}

          {coverImages.map((img, index) => (
            <div className='uploaded_file' key={index}>
              <div className='uploaded_file_info'>
                <span className='file_icon file_icon_img'>🖼</span>
                <div className='file_details'>
                  <span className='file_name'>{img.name}</span>
                  <span className='file_size'>{formatFileSize(img.size)}</span>
                </div>
              </div>
              <button type='button' className='file_remove' onClick={() => removeImage(index)}>🗑</button>
            </div>
          ))}
        </div>

        <div className='media_field'>
          <label className='tier_label'>
            Promotional Video URL <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
          </label>
          <input
            type='text'
            className='tier_input'
            placeholder='e.g. https://youtube.com/watch?v=...'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <p className='equity_helper_text'>Adding a video can increase funding success by up to 30%. Provide a valid YouTube or Vimeo link.</p>
        </div>
      </div>

      {/* Right Column: Required Documents */}
      <div className='media_card'>
        <h2 className='media_card_title'>Required Documents</h2>

        <div className='media_field'>
          <label className='tier_label'>Pitch Deck & Financials <span className='tier_required'>*</span></label>
          <div
            className='upload_zone'
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDocumentsDrop}
            onClick={() => document.getElementById('documentsInput').click()}
          >
            <div className='upload_icon upload_icon_doc'>📄</div>
            <p className='upload_text'><span className='upload_link'>Click to upload</span> or drag and drop</p>
            <p className='upload_hint'>PDF documents only (max. 15MB per file)</p>
            <input
              id='documentsInput'
              type='file'
              accept='.pdf'
              multiple
              style={{ display: 'none' }}
              onChange={handleDocumentsUpload}
            />
          </div>
          <p className='equity_helper_text'>Include your business plan, cap table, and financial projections. You can upload multiple files.</p>
          {errors.documents && <p className="error_msg">{errors.documents}</p>}

          {documents.map((doc, index) => (
            <div className='uploaded_file' key={index}>
              <div className='uploaded_file_info'>
                <span className='file_icon file_icon_doc'>📄</span>
                <div className='file_details'>
                  <span className='file_name'>{doc.name}</span>
                  <span className='file_size'>{formatFileSize(doc.size)}</span>
                </div>
              </div>
              <button type='button' className='file_remove' onClick={() => removeDocument(index)}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4MediaDocs;