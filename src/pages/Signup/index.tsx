import React, { useRef, useCallback } from 'react'
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'

import * as Yup from 'yup'
import api from '../../services/api'

import { Form } from '@unform/mobile'
import { type FormHandles } from '@unform/core' // Corrected import

import getValidationErrors from '../../utils/getValidationErros'

import Button from '../../components/Button'
import Input from '../../components/Input'

import Logo from '../../assets/logo.png'

import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText
} from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const navigation = useNavigation() // Corrected variable name

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      await api.post('/users', data)

      Alert.alert(
        'Cadastro realizado com sucesso!',
        'Você já pode fazer login na aplicação'
      )

      navigation.goBack()
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)

        return
      }

      try {
        const response = await fetch('http://localhost:3333')
        const data = await response.json()
        console.log('Resposta da API:', data)
      } catch (error) {
        console.error('Erro na Solicitação da API:', error)
      }

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao tentar login, cheque seus dados.'
      )
    }
  }, [navigation])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={Logo} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize='words'
                name='name'
                icon='user'
                placeholder='Nome'
              />

              <Input
                autoCorrect={false}
                autoCapitalize='none'
                keyboardType='email-address'
                name='email'
                icon='mail'
                placeholder='E-mail'
              />

              <Input
                onSubmitEditing={() => { formRef.current?.submitForm() }}
                returnKeyType='send'
                secureTextEntry
                name='password'
                icon='lock'
                placeholder='Senha'
              />

              <Button style={{ borderRadius: 10, width: 320 }} onPress={() => { formRef.current?.submitForm() }}>Entrar</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => { navigation.goBack() }}>
        <Icon name='arrow-left' size={20} color='#fff' />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>

    </>
  )
}

export default SignUp
