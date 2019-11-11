import React from 'react'
import PropTypes from 'prop-types'

import Header from '~/components/Header'

import { Wrapper } from './styles'

export default function DefaultLayout(props) {
  const { children } = props

  return (
    <Wrapper>
      <Header />
      {children}
    </Wrapper>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
}
