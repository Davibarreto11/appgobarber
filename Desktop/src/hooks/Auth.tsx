import React, { createContext, useCallback, useState, useContext } from 'react'
import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  avatar_url: string
  token: string
}

interface AuthState {
  token: string
  user: User
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextState {
  token: string
  user: User
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => void
  updateUser: (user: User) => void
}

interface AuthProviderState {
  children: any
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState)

export const AuthProvider: React.FC<AuthProviderState> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Gobarber:token')
    const user = localStorage.getItem('@Gobarber:user')

    if (token && user) {
      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('sessions', {
      email,
      password
    })

    const { token, user } = response.data

    localStorage.setItem('@Gobarber:token', token)
    localStorage.setItem('@Gobarber:user', JSON.stringify(user))

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, user })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@Gobarber:token')
    localStorage.removeItem('@Gobarber:user')

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('@Gobarber:user', JSON.stringify(user))

    setData({
      token: data.token,
      user
    })
  }, [setData, data.token])

  return (
    <AuthContext.Provider value={{ token: data.token, user: data.user, signIn, signOut, updateUser }}>
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
