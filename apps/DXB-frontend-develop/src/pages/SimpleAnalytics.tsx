import React from 'react';

const SimpleAnalytics: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
        📊 Analytics
      </h1>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
          Market Analytics Dashboard
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Real estate market analysis and data visualization tools.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Total Properties</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>15,420</p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Average Price</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>$1.85M</p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#fef3c7',
            borderRadius: '6px', 
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Total Deals</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>8,750</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAnalytics;
