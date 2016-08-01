import React, { Component } from 'react'

import IntermediateState from './../../components/IntermediateState'
import ErrorBox from './../../components/ErrorBox'
import Icon from './../../components/Icon'

import Overlay from './../../containers/Overlay'

import './styles.css'
import './icons.css'

export default React.createClass({
  getInitialState() {
    return {
      isLoading: true,
      isError: false,
      text: null
    }
  },
  loadReference( refId ) {
    var self = this;
    this.props.api.getReference( this.props.title, this.props.lang, refId )
      .then( function ( refHtml ) {
        self.setState( { text: refHtml, isLoading: false } );
      } ).catch( function () {
        self.setState( { isError: true } );
      } );
  },
  componentDidMount() {
    this.loadReference( this.props.refId );
  },
  componentWillReceiveProps( nextProps ) {
    this.loadReference( nextProps.refId );
  },
  render(){
    var children;

    if ( this.state.isError ) {
      children = [
        <ErrorBox key="ref-drawer-error" msg="Error loading reference." />
      ]
    } else if ( this.state.isLoading ) {
      children = [
        <IntermediateState key="ref-drawer-1"></IntermediateState>
      ]
    } else {
      children = [
        <span key="ref-drawer-2" className="reference-text"
          dangerouslySetInnerHTML={{ __html: this.state.text }}></span>
      ];
    }
    // FIXME: create Drawer container
    return (
      <Overlay {...this.props} className="references-drawer" isDrawer="1">
        <div className="cite">
          <Icon type="before" glyph="citation" label="Citation" className="text"/>
        </div>
        {children}
      </Overlay>
    )
  }
} )
