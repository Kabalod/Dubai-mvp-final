import React from 'react';

const SimpleReports: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
        📋 Reports
      </h1>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
          Generate Reports
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Create and download comprehensive real estate market reports.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Market Overview Report
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Comprehensive analysis of Dubai real estate market trends and statistics.
            </p>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Generate PDF
            </button>
          </div>
          
          <div style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Property Analysis
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Detailed property-level analysis with pricing and transaction data.
            </p>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Generate Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleReports;
