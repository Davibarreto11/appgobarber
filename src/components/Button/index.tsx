import React from 'react'
import { type RectButtonProperties } from 'react-native-gesture-handler'

import { Container, ButtonText } from './styles'

interface PropsButton extends RectButtonProperties {
  children: string
}

const Button: React.FC<PropsButton> = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <ButtonText>{children}</ButtonText>
    </Container>
  )
}
export default Button
