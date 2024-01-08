import styled, { keyframes } from 'styled-components'
import { shade } from 'polished'

import signInBackgroundImg from '../../assets/sign-background.png'

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


  width: 100%;
  max-width: 800px;
`
const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  animation: ${appearFromLeft} 1s;

  img {
    width: 220px;
  }

  form {
  margin: 80px 0;
  width: 340px;
  text-align: center;

  h1 {
    margin-bottom: 24px;
  }

}

> a {
  color: #FF9000;
  display: block;
  margin-top: 10px;
  text-decoration:  none;
  transition: color 0.2s;

  display: flex;
  align-items: center;

  svg {
    margin-right: 16px;
  }

  &:hover{
    color: ${shade(0.2, '#FF9000')};
  }
}
`

export const Backgroud = styled.div`
  flex: 1;
  background: url(${signInBackgroundImg}) no-repeat center;
  background: cover;
`
