import React, { useState, useRef } from 'react';

interface ReportModalProps {
  onClose: () => void;
  showNotification: (title: string, message: string, type: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, showNotification }) => {
  const [formData, setFormData] = useState({
    hazardType: '',
    severity: '',
    location: '',
    description: '',
    contact: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          }));
          showNotification('Location Found', 'Using your current location.', 'success');
        },
        () => {
          showNotification('Location Error', 'Could not get your location. Please enter manually.', 'error');
        }
      );
    } else {
      showNotification('Not Supported', 'Geolocation is not supported by this browser.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hazardType || !formData.severity || !formData.location || !formData.description) {
      showNotification('Form Error', 'Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      showNotification('Report Submitted!', 'Your hazard report has been submitted successfully.', 'success');
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content enhanced-modal">
        <div className="modal-header">
          <h2><i className="fas fa-shield-alt"></i> Report Ocean Hazard</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="hazardType">Hazard Type</label>
              <select 
                id="hazardType" 
                name="hazardType"
                className="form-control" 
                value={formData.hazardType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select hazard type</option>
                <option value="oil-spill">🛢️ Oil Spill</option>
                <option value="plastic-waste">♻️ Plastic Waste</option>
                <option value="chemical-pollution">⚗️ Chemical Pollution</option>
                <option value="marine-life">🐟 Unusual Marine Life</option>
                <option value="algae-bloom">🌊 Algae Bloom</option>
                <option value="debris">🗑️ Marine Debris</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="severity">Severity Level</label>
              <select 
                id="severity" 
                name="severity"
                className="form-control" 
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select severity</option>
                <option value="low">🟢 Low Impact</option>
                <option value="medium">🟡 Medium Impact</option>
                <option value="high">🟠 High Impact</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <div className="location-input">
              <input 
                type="text" 
                id="location" 
                name="location"
                className="form-control" 
                placeholder="e.g., Bay of Bengal, near Chennai"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <button type="button" className="location-btn" onClick={handleGetCurrentLocation}>
                <i className="fas fa-location-arrow"></i>
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea 
              id="description" 
              name="description"
              className="form-control" 
              rows={4} 
              placeholder="Provide detailed information about the hazard..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className="char-counter">
              <span>{formData.description.length}</span>/500 characters
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="photo">Upload Evidence</label>
            <div 
              className="file-upload-area" 
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Drop files here or <span className="upload-link">browse</span></p>
              <input 
                ref={fileInputRef}
                type="file" 
                id="photo" 
                className="form-control" 
                accept="image/*" 
                multiple
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
            {files.length > 0 && (
              <div className="upload-preview">
                {files.map((file, index) => (
                  <div key={index} className="file-preview-item">
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Information (Optional)</label>
            <input 
              type="email" 
              id="contact" 
              name="contact"
              className="form-control" 
              placeholder="your@email.com for follow-up"
              value={formData.contact}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;