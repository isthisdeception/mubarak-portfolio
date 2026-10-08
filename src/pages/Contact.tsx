import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactData } from '../data/contact';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  location: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

const initialFormState: FormState = {
  name: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  location: '',
  message: '',
};

export const Contact: React.FC = () => {
  useDocumentTitle('Contact & Project Dialogue');
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<FormState | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name or organization.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'An email address is required for correspondence.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a primary discipline or service.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a brief description of your project or dates.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please share at least a short sentence regarding your vision.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate async network submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedData({ ...formData });
      setFormData(initialFormState);
    }, 850);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    setErrors({});
  };

  return (
    <div className="contact-page reveal-fade">
      <div className="container">
        {/* Header */}
        <header className="contact-header reveal-slide-up">
          <span className="contact-meta">{contactData.meta}</span>
          <h1 className="contact-title">{contactData.headline}</h1>
          <p className="contact-desc">{contactData.intro}</p>
        </header>

        {/* Layout Grid: Form on Left, Studio on Right */}
        <div className="contact-layout-grid">
          {/* Left Column: Form or Success Receipt */}
          <div className="contact-form-container">
            {isSubmitted && submittedData ? (
              <div
                className="contact-success-state"
                role="status"
                aria-live="polite"
              >
                <div className="success-badge">
                  <span className="success-badge-dot" aria-hidden="true" />
                  <span>Transmission Acknowledged · Studio Confirmation</span>
                </div>

                <h2 className="success-title">Inquiry Received</h2>

                <p className="success-message">
                  Thank you, <strong>{submittedData.name}</strong>. Your project parameters
                  have been logged directly with Mubarak’s production desk. We will review
                  scheduling and creative scope, and reply within 24 to 48 hours.
                </p>

                <div className="success-recap-box">
                  <div className="recap-row">
                    <span className="recap-label">Discipline / Service</span>
                    <span className="recap-val">{submittedData.service}</span>
                  </div>
                  {submittedData.date && (
                    <div className="recap-row">
                      <span className="recap-label">Projected Date</span>
                      <span className="recap-val">{submittedData.date}</span>
                    </div>
                  )}
                  {submittedData.location && (
                    <div className="recap-row">
                      <span className="recap-label">Location / Terrain</span>
                      <span className="recap-val">{submittedData.location}</span>
                    </div>
                  )}
                  <div className="recap-row">
                    <span className="recap-label">Direct Correspondence</span>
                    <span className="recap-val">{submittedData.email}</span>
                  </div>
                </div>

                <div className="success-actions">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-secondary btn-md"
                  >
                    Submit Another Inquiry
                  </button>
                  <Link to="/work" className="btn btn-primary btn-md">
                    Explore Archive Works →
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="contact-form"
                noValidate
                aria-label="Commission and booking inquiry form"
              >
                {/* Row 1: Name & Email */}
                <div className="form-group-row">
                  <div className="form-field">
                    <label htmlFor="name" className="form-label">
                      <span>Full Name or Maison</span>
                      <span className="form-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Elena Rostova"
                      className={`form-input ${errors.name ? 'has-error' : ''}`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      required
                    />
                    {errors.name && (
                      <span id="name-error" className="form-error-msg">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="email" className="form-label">
                      <span>Email Address</span>
                      <span className="form-label-required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. elena@rostova.com"
                      className={`form-input ${errors.email ? 'has-error' : ''}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      required
                    />
                    {errors.email && (
                      <span id="email-error" className="form-error-msg">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone & Service Discipline */}
                <div className="form-group-row">
                  <div className="form-field">
                    <label htmlFor="phone" className="form-label">
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="service" className="form-label">
                      <span>Service / Discipline</span>
                      <span className="form-label-required">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`form-select ${errors.service ? 'has-error' : ''}`}
                      aria-invalid={!!errors.service}
                      aria-describedby={errors.service ? 'service-error' : undefined}
                      required
                    >
                      <option value="">Select a discipline...</option>
                      {contactData.serviceOptionGroups.map((group) => (
                        <optgroup key={group.discipline} label={`— ${group.discipline} —`}>
                          {group.services.map((svc) => (
                            <option key={svc} value={`${group.discipline}: ${svc}`}>
                              {svc}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="Multi-Disciplinary Production">
                        Multi-Disciplinary (Photo + Cinema + Drone)
                      </option>
                    </select>
                    {errors.service && (
                      <span id="service-error" className="form-error-msg">
                        {errors.service}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 3: Date & Location */}
                <div className="form-group-row">
                  <div className="form-field">
                    <label htmlFor="date" className="form-label">
                      <span>Target Date or Season</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="location" className="form-label">
                      <span>Location / Region</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Lake Como, Italy or Svalbard"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Row 4: Narrative Message */}
                <div className="form-field">
                  <label htmlFor="message" className="form-label">
                    <span>Project Narrative & Scope</span>
                    <span className="form-label-required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the emotional mood, deliverables, production scale, and creative direction..."
                    className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    required
                  />
                  {errors.message && (
                    <span id="message-error" className="form-error-msg">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Row */}
                <div className="form-submit-row">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary form-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span aria-hidden="true">◌</span>
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Transmit Project Inquiry</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                  <p className="form-privacy-note">
                    {contactData.responseNote}
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Studio Information & Side Frame */}
          <aside className="contact-sidebar" aria-label="Studio Details">
            <div className="sidebar-image-frame">
              <img
                src={contactData.sideImage.src}
                alt={contactData.sideImage.alt}
                className="sidebar-image"
                loading="lazy"
              />
            </div>
            <p className="sidebar-caption">{contactData.sideImage.caption}</p>

            <div className="sidebar-info-block">
              <div className="sidebar-info-item">
                <span className="sidebar-info-label">Direct Correspondence</span>
                <a
                  href={`mailto:${contactData.email}`}
                  className="sidebar-info-value"
                >
                  {contactData.email}
                </a>
              </div>

              <div className="sidebar-info-item">
                <span className="sidebar-info-label">Studio Line</span>
                <a
                  href={`tel:${contactData.phone.replace(/[^0-9+]/g, '')}`}
                  className="sidebar-info-value"
                >
                  {contactData.phone}
                </a>
              </div>

              <div className="sidebar-info-item">
                <span className="sidebar-info-label">Representation</span>
                <span className="sidebar-info-muted">
                  {contactData.representation}
                </span>
              </div>

              <div className="sidebar-info-item">
                <span className="sidebar-info-label">Studio Hours</span>
                <span className="sidebar-info-muted">
                  {contactData.operatingHours}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
