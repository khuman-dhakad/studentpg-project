import React from 'react';
import {
  MdWifi,
  MdLocalAtm,
  MdAcUnit,
  MdRestaurant,
  MdShield,
  MdFlashOn
} from 'react-icons/md';

const iconMap = {
  wifi: <MdWifi />,
  ac: <MdAcUnit />,
  food: <MdRestaurant />,
  security: <MdShield />,
  power: <MdFlashOn />,
  laundry: <MdLocalAtm />
};

export default function AmenityBadge({ name }) {
  const key = name?.toLowerCase()?.trim();
  const icon = iconMap[key] || <MdWifi />;

  return (
    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200">
      {icon}
      <span className="capitalize">{name || 'Amenity'}</span>
    </span>
  );
}