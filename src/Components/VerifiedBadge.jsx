import React from 'react';
import { MdVerified } from 'react-icons/md';

const VerifiedBadge = ({ size = 16, className = "" }) => {
  return (
    <MdVerified 
      size={size} 
      className={`text-blue-500 inline-block align-middle ml-1 ${className}`} 
      title="Verified Account"
    />
  );
};

export default VerifiedBadge;
