'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

interface StoreProviderProps {
  children: ReactNode;
}

/**
 * High-order application context wrapper supplying the global Redux state matrix to Client components.
 */
export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}