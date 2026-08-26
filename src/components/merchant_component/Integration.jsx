import React from 'react';
import SellerPortal from '../daakit-widget/SellerPortal';

const Integration = () => {
  const token = localStorage.getItem('token');

  return (
    <SellerPortal token={token} />
  );
};

export default Integration;
