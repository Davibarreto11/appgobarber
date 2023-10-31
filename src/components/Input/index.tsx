import React from 'react'
import { type TextInputProps } from 'react-native'

import { Container, TextInput, Icon } from './styles'

interface PropsInput extends TextInputProps {
  name: string
  icon: string
}

const Input: React.FC<PropsInput> = ({ name, icon, ...rest }) => {
  return (
    <Container>
      <Icon name={icon} size={20} color='#FFF' />

      <TextInput
        keyboardAppearance='dark'
        placeholderTextColor='#666360'
        {...rest}
      />
    </Container>
  )
}
export default Input
