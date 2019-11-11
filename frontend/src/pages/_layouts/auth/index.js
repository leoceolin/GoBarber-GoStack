import React from 'react'
import PropTypes from 'prop-types'

import { Wrapper, Content } from './styles'

export default function AuthLayout(props) {
  const { children } = props

  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
}
