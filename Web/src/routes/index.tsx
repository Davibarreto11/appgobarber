import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Route as PrivateSigned } from './PrivateSigned'
import { Route as PrivateUnsigned } from './PrivateUnsigned'

import { Signin } from '../pages/Signin'
import { SignUp } from '../pages/Signup'
import { ForgortPassword } from '../pages/ForgotPassword'
import { ResetPassword } from '../pages/ResetPassword'

import { Dashboard } from '../pages/Dashboard'
import { Profile } from '../pages/Profile'

const Router: React.FC = () => (
  <Routes>
    <Route element={<PrivateSigned />}>
      <Route path='' element={<Signin />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/forgot-password' element={<ForgortPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
    </Route>

    <Route element={<PrivateUnsigned />}>
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/profile' element={<Profile />} />
    </Route>
  </Routes>
)

export default Router
