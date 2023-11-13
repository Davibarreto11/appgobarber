import React from 'react'

import { AuthProvider } from './Auth'

interface AppProviderState {
  children: any
}

const AppProvider: React.FC<AppProviderState> = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
)

export default AppProvider
