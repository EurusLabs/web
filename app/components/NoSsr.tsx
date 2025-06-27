"use client"

import React, { useState, useEffect } from 'react';

interface NoSsrProps {
  children: React.ReactNode;
}

const NoSsr: React.FC<NoSsrProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};

export default NoSsr; 