import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FlatList, Platform, Alert } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'

import { format } from 'date-fns'

import Icon from 'react-native-vector-icons/Feather'
// import { View } from 'react-native'

import { useAuth } from '../../hooks/Auth'
import api from '../../services/api'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  ProfileButon,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText
} from './styles'

interface RouteParams {
  providerId: string
}

interface Provider {
  id: string
  name: string
  avatar_url: string
}

interface AvailabilityItem {
  hour: number
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()
  const route = useRoute()
  const { goBack, navigate } = useNavigation()
  const routesParams = route.params as RouteParams

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [availability, setAvailability] = useState<AvailabilityItem[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(routesParams.providerId)

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const navigateToProfile = useCallback(() => {
    navigate('Profile')
  }, [navigate])

  useEffect(() => {
    api.get('providers/list').then((respose) => {
      setProviders(respose.data)
    })
  }, [])

  useEffect(() => {
    api.get(`/providers/${selectedProvider}/day-availability`, {
      params: {
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        day: selectedDate.getDate()
      }
    }).then(response => {
      setAvailability(response.data)
    })
  }, [selectedDate, selectedProvider])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state)
  }, [])

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }

    if (date) {
      setSelectedDate(date)
    }
  }, [])

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)

      date.setHours(selectedHour)
      date.setMinutes(0)

      await api.post('appointments', {
        provider_id: selectedProvider,
        date
      })

      navigate('AppointmentCreated', { date: date.getTime() })
    } catch (err) {
      Alert.alert(
        'Error ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente mais tarde'
      )
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider])

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00')
        }
      })
  }, [availability])

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00')
        }
      })
  }, [availability])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name='chevron-left' size={24} color='#999591' />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <ProfileButon onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }}></UserAvatar>
        </ProfileButon>
      </Header>

      <Content>
        <ProvidersListContainer>
          <FlatList
            style={{ paddingTop: 32, paddingBottom: 32, paddingLeft: 16, paddingRight: 16 }}
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
        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton
            onPress={handleToggleDatePicker}
            style={{ borderRadius: 10 }}
          >
            <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
          <DateTimePicker
            mode='date'
            display='calendar'
            onChange={handleDateChange}
            value={selectedDate}
          />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hourFormatted, available, hour }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  onPress={() => { handleSelectHour(hour) }}
                  style={{ borderRadius: 10 }}
                  available={available}
                  key={hourFormatted}
                >
                  <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(({ hourFormatted, available, hour }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  onPress={() => { handleSelectHour(hour) }}
                  style={{ borderRadius: 10 }}
                  available={available}
                  key={hourFormatted}
                >
                  <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton
          style={{ borderRadius: 10 }}
          onPress={handleCreateAppointment}
        >
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
}

export default CreateAppointment
