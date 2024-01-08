import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { isToday, format, parseISO, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DayPicker, type DayModifiers } from 'react-day-picker'
import 'react-day-picker/src/style.css'

import { FiClock, FiPower } from 'react-icons/fi'
import { useAuth } from '../../hooks/Auth'

import api from '../../services/api'

import logoImg from '../../assets/logo.svg'

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar
} from './styles'

interface MonthAvailabilityItem {
  day: number
  available: boolean
}

interface AppointmentItem {
  id: string
  date: string
  hourFormatted: string
  user: {
    name: string
    avatar_url: string
  }
}

export const Dashboard: React.FC = () => {
  const { signOut, user, token } = useAuth()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([])
  const [appointments, setAppointments] = useState<AppointmentItem[]>([])

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day)
    }
  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      setMonthAvailability(response.data)
    })
  }, [currentMonth, user.id, token])

  useEffect(() => {
    api.get<AppointmentItem[]>('/appointments/me', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(response => {
      const appointmentFormatted = response.data.map(appointment => {
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm')
        }
      })

      setAppointments(appointmentFormatted)
    })
  }, [selectedDate, token])

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        return new Date(year, month, monthDay.day)
      })
    return dates
  }, [currentMonth, monthAvailability])

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR })
  }, [selectedDate])

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR })
  }, [selectedDate])

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12
    })
  }, [appointments])

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12
    })
  }, [appointments])

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date())
    )
  }, [appointments])

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt='GoBarber' />

          <Profile>
            <img
              src={user.avatar_url}
              alt={user.name}
            />
            <div>
              <span>Bem-vindo,</span>
              <Link to='/profile'><strong>{user.name}</strong></Link>
            </div>
          </Profile>

          <button onClick={signOut} type='button'>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
          {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste período</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
              <span>
                <FiClock />
                {appointment.hourFormatted}
              </span>

              <div>
                <img
                  src={appointment.user.avatar_url}
                  alt={appointment.user.name}
                />

                <strong>{appointment.user.name}</strong>
              </div>
            </Appointment>
            ))}

          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste período</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
              <span>
                <FiClock />
                {appointment.hourFormatted}
              </span>

              <div>
                <img
                  src={appointment.user.avatar_url}
                  alt={appointment.user.name}
                />

                <strong>{appointment.user.name}</strong>
              </div>
            </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            className='DayPicker'
            modifiersClassNames={{
              selected: 'selected',
              disabled: 'disabled',
              outside: 'outside',
              available: 'available'
            }}
            mode='single'
            fromMonth={new Date()}
            selected={selectedDate}
            onMonthChange={handleMonthChange}
            modifiers={{
              available: { dayOfWeek: [1, 2, 3, 4, 5] }
            }}
            onDayClick={handleDateChange}
            disabled={[
              { dayOfWeek: [0, 6] },
              ...disabledDays
            ]}
            locale={ptBR}
          />
        </Calendar>
      </Content>
    </Container>
  )
}
