import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  Home,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Send,
} from 'lucide-react';

const BookingModal = ({ property, onClose, onSuccess }) => {
  const { user, showToast } = useAuth();

  const [visitType, setVisitType] = useState('visit'); // 'visit' or 'rental'
  const [checkInDate, setCheckInDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in to schedule visits or apply for rentals', 'warning');
      return;
    }

    setLoading(true);
    try {
      await bookingService.createBooking({
        propertyId: property._id,
        visitType,
        checkInDate,
        preferredTime: visitType === 'visit' ? preferredTime : undefined,
        notes,
      });

      // Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore confetti errors if unsupported
      }

      setCompleted(true);
      showToast(
        visitType === 'visit'
          ? 'Tour visit scheduled successfully!'
          : 'Rental application submitted successfully!',
        'success'
      );

      if (onSuccess) onSuccess();
    } catch (error) {
      showToast(error.message || 'Failed to submit request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deposit = property.securityDeposit || property.rentPrice;
  const upfrontTotal = property.rentPrice + deposit;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                {visitType === 'visit' ? 'Schedule Tour Visit' : 'Apply for Rental Lease'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                {property.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {completed ? (
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <CheckCircle size={36} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.35rem', marginBottom: '0.5rem' }}>
              Request Received!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Your {visitType === 'visit' ? 'tour appointment' : 'rental application'} has been transmitted to the landlord ({property.owner?.name || 'Property Owner'}). You will receive confirmation and updates on your tenant dashboard.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
            {/* Request Type Toggle */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '0.35rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => setVisitType('visit')}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: visitType === 'visit' ? 'var(--primary)' : 'transparent',
                  color: visitType === 'visit' ? '#fff' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                In-Person Tour
              </button>
              <button
                type="button"
                onClick={() => setVisitType('rental')}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: visitType === 'rental' ? 'var(--primary)' : 'transparent',
                  color: visitType === 'rental' ? '#fff' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                Apply for Lease
              </button>
            </div>

            {/* Date Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                {visitType === 'visit' ? 'Preferred Tour Date' : 'Desired Move-in Date'}
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="glass-input"
              />
            </div>

            {/* Time Slot for Visits */}
            {visitType === 'visit' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Preferred Time Slot
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="glass-input"
                >
                  <option value="09:00 AM">09:00 AM (Morning)</option>
                  <option value="11:00 AM">11:00 AM (Late Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="04:30 PM">04:30 PM (Late Afternoon)</option>
                  <option value="06:00 PM">06:00 PM (Evening Sunset)</option>
                </select>
              </div>
            )}

            {/* Pricing Summary if Rental */}
            {visitType === 'rental' && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  <span>First Month Rent:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>${property.rentPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  <span>Refundable Security Deposit:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>${deposit.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#38bdf8', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
                  <span>Estimated Move-in Total:</span>
                  <span>${upfrontTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Notes / Message to Owner */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Note for Landlord (Optional)
              </label>
              <textarea
                rows={3}
                placeholder={
                  visitType === 'visit'
                    ? 'Let the owner know if you have specific questions or companions...'
                    : 'Share details regarding your employment, desired lease length, etc.'
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="glass-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-emerald"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Send size={16} />
              {loading
                ? 'Processing...'
                : visitType === 'visit'
                ? 'Confirm Tour Schedule'
                : 'Submit Rental Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
