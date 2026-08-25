import React, { useState } from 'react';
import { X, Maximize2, Compass, Eye, Sparkles, Navigation, Layers } from 'lucide-react';

const VirtualTourModal = ({ property, onClose }) => {
  if (!property) return null;

  const tourRooms = [
    {
      name: 'Grand Living & Lounge',
      image: property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      description: 'High-ceiling open-concept lounge with floor-to-ceiling glass exposure.',
    },
    {
      name: 'Master Bedroom Suite',
      image: property.images?.[1] || 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
      description: 'Serene primary suite with custom walk-in dressing room and private balcony.',
    },
    {
      name: 'Gourmet Chef Kitchen',
      image: property.images?.[2] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      description: 'Italian marble quartz island with integrated Sub-Zero appliances.',
    },
    {
      name: 'Skyline Terrace & Pool',
      image: property.images?.[3] || property.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      description: 'Expansive private outdoor terrace with heated infinity pool.',
    },
  ];

  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const currentRoom = tourRooms[activeRoomIndex];

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          maxWidth: '960px',
          background: '#0a0f1d',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.9)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>
                360° Interactive Virtual Tour
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                {property.title} • {property.city}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
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

        {/* 360 Viewport */}
        <div
          style={{
            position: 'relative',
            height: '460px',
            backgroundColor: '#000',
            overflow: 'hidden',
            cursor: 'grab',
          }}
        >
          <img
            src={currentRoom.image}
            alt={currentRoom.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.4s ease, filter 0.3s ease',
            }}
          />

          {/* 360 Hotspot / Gyro Overlay simulation */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px dashed rgba(56, 189, 248, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulseGlow 3s infinite ease-in-out',
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Navigation size={24} color="#38bdf8" />
            </div>
            <span
              style={{
                background: 'rgba(11, 15, 25, 0.85)',
                padding: '0.3rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontWeight: 600,
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              Interactive 360° Walkthrough
            </span>
          </div>

          {/* Current Room Caption Tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              background: 'rgba(11, 15, 25, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: '380px',
            }}
          >
            <div style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Viewing Hotspot:
            </div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
              {currentRoom.name}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
              {currentRoom.description}
            </div>
          </div>

          {/* Zoom controls */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              right: '1.25rem',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
              className="btn btn-secondary btn-sm"
              style={{ background: 'rgba(15, 23, 42, 0.8)' }}
            >
              Zoom +
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 1))}
              className="btn btn-secondary btn-sm"
              style={{ background: 'rgba(15, 23, 42, 0.8)' }}
            >
              Zoom -
            </button>
          </div>
        </div>

        {/* Room Navigation Strip */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: '#0d1424',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={14} color="#3b82f6" /> Select Room to Teleport
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {tourRooms.map((room, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveRoomIndex(idx);
                  setZoomLevel(1);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.5rem 0.75rem',
                  background: activeRoomIndex === idx ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: activeRoomIndex === idx ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  color: activeRoomIndex === idx ? '#60a5fa' : '#cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition)',
                }}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{room.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourModal;
