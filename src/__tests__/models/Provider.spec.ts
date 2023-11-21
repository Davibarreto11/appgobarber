import api from '../../services/api'

import type User from '../../models/auth/User'
import type AvailabilityProvider from '../../models/provider/AvailabilityProvider'

const mockUser: User = {
  id: 'some_id',
  name: 'some_name',
  email: 'some_email',
  avatar: 'some_avatar',
  created_at: 'some_date',
  updated_at: 'some_date',
  avatar_url: 'some_avatar_url'
}

const mockAvailabilityProvider: AvailabilityProvider = {
  hour: 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15,
  available: false || true
}

test('should be able list to providers in dashboard', async () => {
  const { data } = await api.post('sessions', {
    email: 'davi@gmail.com',
    password: '123456'
  })

  const { token } = data

  const listProviders = await api.get('providers/list', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  expect(Object.keys(listProviders.data?.[0])).toEqual(Object.keys(mockUser))
})

test('should be able list to providers in createAppointment', async () => {
  const { data } = await api.post('sessions', {
    email: 'davi@gmail.com',
    password: '123456'
  })

  const { token } = data

  const listProviders = await api.get('providers/list', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const selectedProvider = listProviders.data?.[0].id

  const availabilityResponse = await api.post(`/providers/${selectedProvider}/day-availability`, {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate()
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  // const appointmentResponse = await api.post('appointments', {
  //   provider_id: selectedProvider,
  //   date: new Date()
  // },
  // {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // })
  // console.log(appointmentResponse.data)

  expect(Object.keys(listProviders.data?.[0])).toEqual(Object.keys(mockUser))
  expect(Object.keys(availabilityResponse.data?.[0])).toEqual(Object.keys(mockAvailabilityProvider))
})
