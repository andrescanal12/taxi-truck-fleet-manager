import React from 'react';

/**
 * Ejemplo de un botón que sigue la guía de estilo de Taxi Truck.
 * Utiliza los principios de: Negrita extrema, color amarillo vibrante y texto en mayúsculas.
 */
const BrandButton = ({ children, onClick, icon: Icon }) => {
    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: '#FFD000',
                color: '#000000',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                textTransform: 'uppercase',
                padding: '12px 28px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                letterSpacing: '-0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 0 #FDB913',
                transition: 'all 0.1s ease'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 5px 0 #FDB913';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #FDB913';
            }}
        >
            {Icon && <Icon size={20} />}
            {children}
        </button>
    );
};

export default BrandButton;
