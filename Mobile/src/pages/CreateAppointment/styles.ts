import styled from 'styled-components/native'
import { RectButton } from 'react-native-gesture-handler'

interface ProviderContainerProps {
  selected: boolean
}

interface ProviderNameProps {
  selected: boolean
}

interface HoursProps {
  available: boolean
  selected: boolean
}

interface HourTextProps {
  selected: boolean
}

export const Container = styled.View`
  flex: 1;
`
export const Header = styled.View`
  padding: 20px;
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const BackButton = styled.TouchableOpacity`
  padding-right: 8px;
`

export const HeaderTitle = styled.Text`
  color: #f5ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  margin-right: auto;
`

export const ProfileButon = styled.TouchableOpacity``

export const UserAvatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`

export const Content = styled.ScrollView``

export const ProvidersListContainer = styled.View`
  height: 112px;
`
export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  background: ${(props) => (props.selected ? '#ff9000' : '#3e3b47')};
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  margin-right: 16px;
`

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`

export const ProviderName = styled.Text<ProviderNameProps>`
  margin-left: 8px;
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: ${(props) => (props.selected ? '#232129' : '#f4ede8')} ;
`

export const Calendar = styled.View`

`

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 24px;
`

export const OpenDatePickerButton = styled(RectButton)`
  height: 46px;
  background: #ff9000;
  margin: 0 24px;

  align-items: center;
  justify-content: center;
`

export const OpenDatePickerButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: #232129;
`

export const Schedule = styled.View`
  padding: 24px 0 16px;
`

export const Section = styled.View`
  margin-bottom: 24px;
`

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin: 0 24px 12px;
`

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: { paddingHorizontal: 24 },
  horizontal: true,
  showsHorizontalScrollIndicator: false
})``

export const Hour = styled(RectButton)<HoursProps>`
  padding: 12px;
  background: ${props => (props.selected ? '#ff9000' : '#3e3b47')};
  margin-right: 8px;

  opacity: ${(props) => (props.available ? 1 : 0.3)};
`

export const HourText = styled.Text<HourTextProps>`
  color: ${(props) => (props.selected ? '#232129' : '#f4ede8')};
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`

export const CreateAppointmentButton = styled(RectButton)`
  height: 50px;
  background: #ff9000;
  align-items: center;
  justify-content: center;
  margin: 0 24px 24px;
`
export const CreateAppointmentButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #232129;
`
