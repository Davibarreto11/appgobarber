import React, { useRef, useCallback } from 'react'
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAuth } from '../../hooks/Auth'
import { useNavigation } from '@react-navigation/native'

import * as Yup from 'yup'
import api from '../../services/api'

import { Form } from '@unform/mobile'
import { type FormHandles } from '@unform/core' // Corrected import

import getValidationErrors from '../../utils/getValidationErros'

import Button from '../../components/Button'
import Input from '../../components/Input'

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar
} from './styles'

interface ProfileFormData {
  name: string
  email: string
  old_password?: string
  password?: string
  password_confimation?: string
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()

  const formRef = useRef<FormHandles>(null)
  const navigation = useNavigation() // Corrected variable name

  const handleProfile = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({})

      // const schema = Yup.object().shape({
      //   name: Yup.string().required('Nome obrigatório'),
      //   email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
      //   old_password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      //   password: Yup.string().when('old_password', {
      //     is: val => !!val.length,
      //     then: () => Yup.string().required('Campo obrigatório')
      //   }),
      //   password_confirmation: Yup.string()
      //     .when('password', {
      //       is: val => !!val.length,
      //       then: () => Yup.string().required('Campo obrigatório').oneOf([Yup.ref('password')], 'Confirmação incorreta')
      //     })
      // })

      // await schema.validate(data, {
      //   abortEarly: false
      // })

      const {
        name,
        email,
        password,
        old_password,
        password_confimation
      } = data

      const formData = {
        name,
        email,
        ...(old_password
          ? {
              old_password,
              password,
              password_confimation
            }
          : {})
      }

      const response = await api.put('/profile/update', formData)

      updateUser(response.data)

      Alert.alert('Perfil atualizado com sucesso!')

      navigation.goBack()
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)

        return
      }

      Alert.alert(
        'Erro na atualização do perfil',
        'Ocorreu um erro ao atualizar seu perfil, cheque seus dados.'
      )
    }
  }, [navigation])

  const handleGoBack = useCallback(() => {
    navigation.goBack()
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
            <BackButton onPress={handleGoBack}>
              <Icon name='chevron-left' size={24} color='#999591' />
            </BackButton>

            <UserAvatarButton onPress={() => {}}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form initialData={user} ref={formRef} onSubmit={handleProfile}>
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
                returnKeyType='send'
                secureTextEntry
                name='old_password'
                icon='lock'
                placeholder='Senha atual'
                containerStyle={ { marginTop: 18 }}
              />

              <Input
                returnKeyType='send'
                secureTextEntry
                name='password'
                icon='lock'
                placeholder='Nova senha'
              />

              <Input
                onSubmitEditing={() => { formRef.current?.submitForm() }}
                returnKeyType='send'
                secureTextEntry
                name='password_confirmation'
                icon='lock'
                placeholder='Confirmar senha'
              />

              <Button style={{ borderRadius: 10, width: 330 }} onPress={() => { formRef.current?.submitForm() }}>Confirmar mundanças</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default Profile
