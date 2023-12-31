import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api'

import type User from '../models/auth/User'

interface AuthState {
  token: string
  user: User
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextState {
  user: User
  loading: boolean
  signIn: (credentials: SignInCredentials) => Promise<AuthState>
  signOut: () => void
  updateUser: (user: User) => Promise<void>
}

interface AuthProviderState {
  children: any
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState)

export const AuthProvider: React.FC<AuthProviderState> = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStorageData (): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user'
      ])

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`

        setData({ token: token[1], user: JSON.parse(user[1]) })
      }

      setLoading(false)
    }

    loadStorageData()
  }, [])

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('sessions', {
      email,
      password
    })

    const { token, user } = response.data

    await AsyncStorage.multiSet([
      ['@Gobarber:token', token],
      ['@Gobarber:user', JSON.stringify(user)]
    ])

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, user })

    return { user, token }
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@Gobarber:user',
      '@Gobarber:token'
    ])

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback(async (user: User) => {
    await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user))

    setData({
      token: data.token,
      user
    })

    // console.log(user)
  }, [setData, data.token])

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('UseAuth must be used within an AuthProvider')
  }

  return context
}
