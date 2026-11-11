import React from 'react';

export type SweetType = 
  | 'motichoor'   // 1. Classic Golden Motichoor Laddu (round boondi)
  | 'star_peda'   // 2. Saffron Star Peda
  | 'kaju_katli'  // 3. Diamond Silver Vark Katli
  | 'jalebi'      // 4. Golden Crisp Jalebi Swirl
  | 'gulab_jamun' // 5. Royal Besan/Jamun Delicacy
  | 'bomb_special'// 6. Diwali Sparkler Bomb Laddu (match 4 or 5)
  | 'maha_laddu'; // 7. Crown Maha Rainbow Laddu

interface SweetIconProps {
  type: SweetType;
  className?: string;
  isSpecial?: boolean;
}

export const SweetIcon: React.FC<SweetIconProps> = ({ type, className = "w-full h-full", isSpecial = false }) => {
  switch (type) {
    case 'motichoor':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Radial gradient for golden sphere */}
            <radialGradient id="ladduGrad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="35%" stopColor="#FFB300" />
              <stop offset="75%" stopColor="#E67300" />
              <stop offset="100%" stopColor="#8A3800" />
            </radialGradient>
            <filter id="ladduGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4a1a00" floodOpacity="0.6"/>
            </filter>
          </defs>
          {/* Main sphere */}
          <circle cx="50" cy="50" r="41" fill="url(#ladduGrad)" filter="url(#ladduGlow)" />
          
          {/* Boondi pearls texture */}
          <g opacity="0.85">
            <circle cx="36" cy="30" r="5.5" fill="#FFE875" />
            <circle cx="48" cy="24" r="5" fill="#FFF2A3" />
            <circle cx="62" cy="32" r="5.5" fill="#FFA500" />
            <circle cx="28" cy="45" r="5" fill="#FFC837" />
            <circle cx="42" cy="42" r="6.5" fill="#FFE27A" />
            <circle cx="57" cy="44" r="6" fill="#FF9A00" />
            <circle cx="70" cy="48" r="4.5" fill="#E67300" />
            <circle cx="34" cy="60" r="5.5" fill="#E67300" />
            <circle cx="49" cy="58" r="6" fill="#FF8C00" />
            <circle cx="64" cy="62" r="5" fill="#D65B00" />
            <circle cx="44" cy="74" r="4.5" fill="#A84300" />
            <circle cx="58" cy="74" r="4" fill="#8F3000" />
          </g>

          {/* Pistachio and Almond slivers */}
          <path d="M42 32 C40 28, 48 26, 46 30 C45 32, 43 34, 42 32 Z" fill="#70A83B" />
          <path d="M58 52 C56 48, 63 46, 62 50 Z" fill="#84C441" />
          <path d="M33 50 C31 48, 36 45, 35 49 Z" fill="#C9A063" />

          {/* Silver Vark fleck (edible silver foil) */}
          <polygon points="46,38 52,36 49,42 44,41" fill="#FFFFFF" opacity="0.9" />
          <polygon points="56,28 60,26 58,30" fill="#E8F4F8" opacity="0.85" />
          
          {/* Top light highlight */}
          <ellipse cx="38" cy="24" rx="14" ry="7" fill="#FFFFFF" opacity="0.45" />
        </svg>
      );

    case 'star_peda':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="starGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="40%" stopColor="#FFC83B" />
              <stop offset="85%" stopColor="#E08600" />
              <stop offset="100%" stopColor="#9E5300" />
            </linearGradient>
            <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#3B1500" floodOpacity="0.55"/>
            </filter>
          </defs>
          {/* 5-pointed sweet star with rounded chamfer */}
          <path 
            d="M 50 10 
               L 61 34 
               L 88 37 
               L 68 56 
               L 73 83 
               L 50 70 
               L 27 83 
               L 32 56 
               L 12 37 
               L 39 34 Z" 
            fill="url(#starGrad)" 
            stroke="#FFECA1" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
            filter="url(#starShadow)" 
          />
          {/* Inner embossed bevel */}
          <path 
            d="M 50 24 
               L 57 40 
               L 75 42 
               L 61 55 
               L 65 73 
               L 50 63 
               L 35 73 
               L 39 55 
               L 25 42 
               L 43 40 Z" 
            fill="#FFAA00" 
            opacity="0.5" 
          />
          {/* Saffron and cardamom stamp in center */}
          <circle cx="50" cy="50" r="9" fill="#B32400" />
          <circle cx="50" cy="50" r="6" fill="#D9381E" />
          <circle cx="48" cy="48" r="2.5" fill="#FFEAA7" opacity="0.9" />
          {/* Star highlights */}
          <circle cx="50" cy="18" r="2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="80" cy="40" r="2" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );

    case 'kaju_katli':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Silver Vark Diamond Gradient */}
            <linearGradient id="kajuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E2E8F0" />
              <stop offset="60%" stopColor="#CBD5E1" />
              <stop offset="85%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <filter id="gemShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.6"/>
            </filter>
          </defs>
          {/* Diamond base */}
          <polygon 
            points="50,10 88,50 50,90 12,50" 
            fill="url(#kajuGrad)" 
            stroke="#FFFFFF" 
            strokeWidth="2.5" 
            filter="url(#gemShadow)" 
          />
          {/* Facets / Silver cut lines */}
          <polygon points="50,10 88,50 50,50" fill="#FFFFFF" opacity="0.45" />
          <polygon points="12,50 50,50 50,90" fill="#64748B" opacity="0.35" />
          <polygon points="50,50 88,50 50,90" fill="#475569" opacity="0.25" />
          <polygon points="50,10 12,50 50,50" fill="#F8FAFC" opacity="0.6" />

          {/* Internal diamond facet */}
          <polygon points="50,26 72,50 50,74 28,50" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
          
          {/* Diamond glint / sparkle */}
          <polygon points="50,22 53,30 61,33 53,36 50,44 47,36 39,33 47,30" fill="#FFFFFF" opacity="0.95" />
          <circle cx="50" cy="33" r="1.5" fill="#FFEAA7" />
        </svg>
      );

    case 'jalebi':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="jalebiGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF4B8" />
              <stop offset="30%" stopColor="#FF9F1C" />
              <stop offset="70%" stopColor="#E85D04" />
              <stop offset="100%" stopColor="#9D0208" />
            </radialGradient>
            <filter id="jalebiGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#370617" floodOpacity="0.55"/>
            </filter>
          </defs>
          {/* Background disc for presence */}
          <circle cx="50" cy="50" r="39" fill="#FF8500" opacity="0.15" />

          {/* Concentric spiral rings representing authentic fried crisp jalebi curls */}
          <g filter="url(#jalebiGlow)">
            <ellipse cx="50" cy="50" rx="36" ry="34" stroke="url(#jalebiGrad)" strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="51" cy="49" rx="25" ry="24" stroke="url(#jalebiGrad)" strokeWidth="8.5" strokeLinecap="round" />
            <ellipse cx="49" cy="51" rx="14" ry="13" stroke="url(#jalebiGrad)" strokeWidth="8" strokeLinecap="round" />
            <circle cx="50" cy="50" r="5" fill="#FFBA08" />
          </g>

          {/* Glossy Sugar Syrup (Chashni) Highlights */}
          <path d="M26 34 C34 22, 66 22, 74 34" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
          <path d="M36 43 C42 36, 58 36, 64 43" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
          <circle cx="68" cy="46" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="32" cy="54" r="1.5" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );

    case 'gulab_jamun':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="jamunGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#D4A373" />
              <stop offset="35%" stopColor="#8C421B" />
              <stop offset="70%" stopColor="#4A1806" />
              <stop offset="100%" stopColor="#230800" />
            </radialGradient>
            <filter id="jamunShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#0D0200" floodOpacity="0.7"/>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="41" fill="url(#jamunGrad)" filter="url(#jamunShadow)" />
          {/* Rose water glaze sheen */}
          <ellipse cx="38" cy="30" rx="18" ry="10" fill="#FFFFFF" opacity="0.38" transform="rotate(-15 38 30)" />
          {/* Pistachio & saffron garnish on top */}
          <path d="M48 24 C45 20, 55 18, 52 23 Z" fill="#90BE6D" />
          <path d="M43 27 C40 25, 47 24, 46 28 Z" fill="#4D908E" />
          <circle cx="50" cy="28" r="1.5" fill="#C9184A" />
          {/* Golden syrup droplet */}
          <circle cx="34" cy="36" r="2.5" fill="#FFE6A7" opacity="0.85" />
        </svg>
      );

    case 'bomb_special':
      return (
        <div className={`relative ${className} flex items-center justify-center`}>
          {/* Pulsing sparkler aura */}
          <div className="absolute inset-0 bg-amber-400/30 rounded-full animate-ping opacity-60 pointer-events-none" />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="bombGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF9D2" />
                <stop offset="30%" stopColor="#FFB703" />
                <stop offset="70%" stopColor="#FB8500" />
                <stop offset="100%" stopColor="#9E2A2B" />
              </radialGradient>
              <filter id="bombGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFB703" floodOpacity="0.9"/>
              </filter>
            </defs>
            {/* Golden sweet bomb body */}
            <circle cx="50" cy="54" r="36" fill="url(#bombGrad)" filter="url(#bombGlow)" />
            {/* Top crown fuse holder */}
            <rect x="42" y="16" width="16" height="8" rx="2" fill="#FFD700" stroke="#FFF" strokeWidth="1.5" />
            {/* Curved fuse line */}
            <path d="M50 16 Q54 8 62 7" stroke="#FFDE59" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Burst of Diwali sparkler stars */}
            <g className="animate-pulse">
              {/* Spark 1 */}
              <polygon points="62,7 64,2 66,7 71,8 66,10 65,15 62,11 57,11" fill="#FFFFFF" />
              {/* Spark 2 */}
              <circle cx="74" cy="4" r="2.5" fill="#FFE600" />
              <circle cx="68" cy="18" r="2" fill="#FF4D00" />
              {/* Radiating rays */}
              <line x1="62" y1="7" x2="76" y2="1" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="62" y1="7" x2="70" y2="16" stroke="#FFE600" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="62" y1="7" x2="52" y2="0" stroke="#FF8500" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Bomb emblem: diya or bomb icon */}
            <circle cx="50" cy="54" r="14" fill="#3D0000" opacity="0.6" />
            <path d="M50 44 L53 52 L61 54 L55 59 L57 67 L50 62 L43 67 L45 59 L39 54 L47 52 Z" fill="#FFE27A" />
          </svg>
        </div>
      );

    case 'maha_laddu':
      return (
        <div className={`relative ${className} flex items-center justify-center`}>
          <div className="absolute inset-0 bg-yellow-300/40 rounded-full animate-pulse blur-sm" />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="25%" stopColor="#FF70A6" />
                <stop offset="50%" stopColor="#70D6FF" />
                <stop offset="75%" stopColor="#FF9770" />
                <stop offset="100%" stopColor="#E9FF70" />
              </linearGradient>
              <filter id="mahaGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFE066" floodOpacity="1"/>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="41" fill="url(#rainbowGrad)" filter="url(#mahaGlow)" stroke="#FFF" strokeWidth="3" />
            
            {/* Royal Gold Crown on Top */}
            <path d="M30 46 L35 34 L50 42 L65 34 L70 46 Z" fill="#FFD700" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="35" cy="33" r="3" fill="#FFF" />
            <circle cx="50" cy="40" r="3.5" fill="#FF0055" />
            <circle cx="65" cy="33" r="3" fill="#FFF" />
            
            {/* Diamond emblem in center */}
            <polygon points="50,50 62,60 50,70 38,60" fill="#FFFFFF" stroke="#FFD700" strokeWidth="2" />
            <circle cx="50" cy="60" r="2.5" fill="#FFE27A" />
          </svg>
        </div>
      );
  }
};
