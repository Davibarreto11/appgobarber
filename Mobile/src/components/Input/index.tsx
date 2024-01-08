import React, { useEffect, useRef } from 'react'
import { type TextInputProps } from 'react-native'

import { useField } from '@unform/core'

import { Container, TextInput, Icon } from './styles'

interface PropsInput extends TextInputProps {
  name: string
  icon: string
  containerStyle?: object
}

interface InputValueReference {
  value: string
}

const Input: React.FC<PropsInput> = ({ name, icon, containerStyle = {}, ...rest }) => {
  const inputElementRef = useRef<any>(null)

  const { registerField, defaultValue = '', fieldName, error } = useField(name)
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue })

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue (ref: any, value) {
        inputValueRef.current.value = value
        inputElementRef.current.setNativeProps({ text: value })
      },
      clearValue () {
        inputValueRef.current.value = ''
        inputElementRef.current.clear()
      }
    })
  }, [registerField, fieldName])

  return (
    <Container style={containerStyle} isErrored={!!error}>
      <Icon name={icon} size={20} color='#FFF' />

      <TextInput
        // ref={inputElementRef}
        keyboardAppearance='dark'
        placeholderTextColor='#666360'
        defaultValue={defaultValue}
        onChangeText={(value) => { inputValueRef.current.value = value }}
        {...rest}
      />
    </Container>
  )
}
export default Input
