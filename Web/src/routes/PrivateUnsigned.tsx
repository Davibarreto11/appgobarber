import React from 'react'
import {
  Navigate, Outlet
} from 'react-router-dom'

import { useAuth } from '../hooks/Auth'

export const Route: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/' />
  }

  return <Outlet />
}
