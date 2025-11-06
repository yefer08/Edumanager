import React from 'react';
import './AvatarWithInitials.css';

const AvatarWithInitials = ({ name, email, size = 80 }) => {
  // Obtener iniciales del nombre o email
  const getInitials = (name, email) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    // Si no hay nombre, usar las primeras 2 letras del email
    return email?.substring(0, 2).toUpperCase() || 'U';
  };

  // Generar color basado en el email (para que sea consistente)
  const generateColor = (email) => {
    if (!email) return '#8b4513'; // Color marrón por defecto
    
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Paleta de colores suaves y profesionales
    const colors = [
      '#8b4513', // Marrón
      '#a0522d', // Sienna
      '#cd853f', // Perú
      '#d2691e', // Chocolate
      '#6b8e23', // Olive verde
      '#4682b4', // Azul acero
      '#708090', // Gris pizarra
      '#bc8f8f', // Rosa marrón
      '#9370db', // Púrpura medio
      '#20b2aa', // Verde mar
      '#cd5c5c', // Rojo indio
      '#4169e1', // Azul royal
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(name, email);
  const backgroundColor = generateColor(email);
  const fontSize = size / 2.5;

  return (
    <div 
      className="avatar-with-initials" 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        backgroundColor,
        fontSize: `${fontSize}px`
      }}
    >
      {initials}
    </div>
  );
};

export default AvatarWithInitials;
