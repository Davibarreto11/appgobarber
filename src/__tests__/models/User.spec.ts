import api from '../../services/api'

import type User from '../../models/auth/User'

const mockUser: User = {
  id: 'some_id',
  name: 'some_name',
  email: 'some_email',
  avatar: 'some_avatar',
  created_at: 'some_date',
  updated_at: 'some_date',
  avatar_url: 'some_avatar_url'
}

// objectkeys
// lenght de object keys === lengh do usuario retornado da api

describe('User', () => {
  test('should be able to sign in', async () => {
    const { data } = await api.post('sessions', {
      email: 'davi@gmail.com',
      password: '123456'
    })

    expect(data).toHaveProperty('token')
    expect(data).toHaveProperty('user')
    expect(Object.keys(data.user)).toEqual(Object.keys(mockUser))
  })
})
