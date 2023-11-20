import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'

import Signin from '../../pages/Signin'

const mocketNavigationNavigate = jest.fn()

jest.mock('react-native-vector-icons/Feather', () => {
  return {
    Icon: jest.fn()
  }
})

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mocketNavigationNavigate
    })
  }
})

describe('SigIn page', () => {
  test('should be able to sign in', () => {
    const { getByPlaceholder, getByText } = render(<Signin />)

    const emailField = getByPlaceholder('E-mail')
    const passwordFiled = getByPlaceholder('Senha')
    const buttonElement = getByText('Entrar')

    fireEvent.changeText(emailField, { target: { value: 'davi@gmail.com' } })
    fireEvent.changeText(passwordFiled, { target: { value: '123456' } })

    fireEvent.press(buttonElement)

    expect(mocketNavigationNavigate).toHaveBeenCalledWith('Dashboard')
  })
})
