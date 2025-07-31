import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = '', size = 32 }: LogoIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Círculo principal */}
      <circle cx="50" cy="50" r="35" fill="#f5f5dc" stroke="none"/>
      
      {/* Símbolo Bitcoin */}
      <text x="50" y="58" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#ff6b35">₿</text>
      
      {/* Raio 1 - diagonal superior esquerda para inferior direita */}
      <path d="M 30 35 L 70 65" stroke="#ff6b35" stroke-width="3" fill="none" opacity="0.8"/>
      
      {/* Raio 2 - diagonal inferior esquerda para superior direita */}
      <path d="M 30 65 L 70 35" stroke="#ff6b35" stroke-width="3" fill="none" opacity="0.8"/>
    </svg>
  );
} 