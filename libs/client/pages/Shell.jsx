import React from 'react'

import WikiPage from './WikiPage'

import { IntermediateState } from 'wikipedia-react-components'

export default React.createClass({
  render(){
    return (
      <WikiPage body={<IntermediateState />} />
    )
  }
})

