import { RectButton } from 'react-native-gesture-handler'
import styled from 'styled-components/native'
// import { Flat } from 'react-native'

export const Container = styled.View`
  flex: 1;
`

export const Header = styled.View`
  padding: 24px;
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const HeaderTitle = styled.Text`
  color: #F4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab-Regular';
  line-height: 28px;
`

export const UserName = styled.Text`
  color: #ff9000;
  font-family: 'RobotoSlab-Medium';
`

export const ProfileButton = styled.TouchableOpacity``

export const UserAvatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`
export const ProvidersListTitle = styled.Text`
  font-size: 24px;
  margin-bottom: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
`

export const ProviderContainer = styled(RectButton)`
  background: #3e3b47;
  padding: 20px;
  margin-bottom: 16px;

  flex-direction: row;
  align-items: center;
`
export const ProviderAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`
export const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`

export const ProviderName = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #f4ede8;
`
export const ProviderMeta = styled.View`
  flex-direction: row;
  align-items: center;

  margin-top: 8px;
`
export const ProviderMetaText = styled.Text`
  margin-left: 8px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
`
