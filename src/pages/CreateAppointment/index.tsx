import React, { useEffect, useCallback, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FlatList } from 'react-native'

import Icon from 'react-native-vector-icons/Feather'
// import { View } from 'react-native'

import { useAuth } from '../../hooks/Auth'
import api from '../../services/api'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName
} from './styles'

interface RouteParams {
  providerId: string
}

interface Provider {
  id: string
  name: string
  avatar_url: string
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()
  const route = useRoute()
  const { goBack } = useNavigation()
  const routesParams = route.params as RouteParams

  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(routesParams.providerId)

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  useEffect(() => {
    api.get('providers/list').then((respose) => {
      setProviders(respose.data)
    })
  }, [])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name='chevron-left' size={24} color='#999591' />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }}></UserAvatar>
      </Header>

      <ProvidersListContainer>
        <FlatList
          style={{ paddingTop: 32, paddingBottom: 32, paddingLeft: 24, paddingRight: 24 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              style={{ borderRadius: 10 }}
              onPress={() => { handleSelectProvider(provider.id) }}
              selected={provider.id === selectedProvider}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
    </Container>
  )
}

export default CreateAppointment
