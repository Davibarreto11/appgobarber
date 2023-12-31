import React, { useCallback, useRef } from 'react'
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'

import * as Yup from 'yup'

import { Form } from '@unform/mobile'
import { type FormHandles } from '@unform/core'

import { useAuth } from '../../hooks/Auth'

import getValidationErrors from '../../utils/getValidationErros'

import Button from '../../components/Button'
import Input from '../../components/Input'

import Logo from '../../assets/logo.png'

import {
  Container,
  Title,
  ForgotPassword, ForgotPasswordText,
  CreateAccountButton, CreateAccountButtonText
} from './styles'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const navigation = useNavigation()
  const formRef = useRef<FormHandles>(null)
  // const passwordInputRef = useRef(null)

  const { signIn } = useAuth()

  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      await signIn({
        email: data.email,
        password: data.password
      })
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)

        return
      }

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao tentar login, cheque seus dados.'
      )
    }
  }, [])
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
            <Title>Faça seu logon</Title>
          </View>

          <Form ref={formRef} onSubmit={handleSignIn}>
            <Input
              autoCorrect={false}
              autoCapitalize='none'
              keyboardType='email-address'
              name='email'
              icon='mail'
              placeholder='E-mail'
              returnKeyType='next'
              onSubmitEditing={() => {
              }}
             />

            <Input
              onSubmitEditing={() => { formRef.current?.submitForm() }}
              returnKeyType='send'
              secureTextEntry
              name='password'
              icon='lock'
              placeholder='Senha'
            />

            <Button
              style={{ borderRadius: 10, width: 325 }}
              onPress={() => {
                formRef.current?.submitForm()
              }}
            >Entrar</Button>

          </Form>

          <ForgotPassword onPress={() => { console.log('deu') }}>
            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
          </ForgotPassword>

        </Container>
      </ScrollView>
    </KeyboardAvoidingView>

    <CreateAccountButton onPress={() => { navigation.navigate('SignUp') } }>
      <Icon name='log-in' size={20} color='#ff9000'/>
      <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
    </CreateAccountButton>

    </>
  )
}

export default SignIn
