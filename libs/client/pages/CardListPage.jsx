import React, { Component } from 'react'

import IntermediateState from './../components/IntermediateState';
import Card from './../components/Card';
import ErrorBox from './../components/ErrorBox';

import Content from './../containers/Content'
import Article from './../containers/Article'
import CardList from './../containers/CardList'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      emptyMessage: 'The list is disappointedly empty.',
      api: null,
      apiEndpoint: null,
      title: null,
      tagline: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      error: false,
      cards: null
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    this.load();
  },
  load() {
    var self = this;
    var props = { lang: this.props.lang, router: this.props.router };
    this.props.api.fetchCards( this.props.apiEndpoint, props ).then( function ( cards ) {
      self.setState({ cards : cards });
    } ).catch( function () {
      self.setState({ error: true });
    } );
  },
  render(){
    var children;

    if ( this.state.error ) {
      children = (<ErrorBox msg="Something went wrong when trying to render the list. Please refresh and try again."></ErrorBox>)
    } else if ( this.state.cards ) {
      children = this.state.cards.length ?
        (<CardList {...this.props} cards={this.state.cards} />) : this.props.emptyMessage;
    } else {
      children = (<IntermediateState></IntermediateState>);
    }

    return (
      <Article {...this.props}>
        <Content>{children}</Content>
        {this.props.children}
      </Article>
    )
  }
})

