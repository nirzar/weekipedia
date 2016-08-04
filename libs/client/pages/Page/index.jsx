import React, { Component } from 'react'

import SectionContent from './../../components/SectionContent'
import IntermediateState from './../../components/IntermediateState';
import Section from './../../components/Section'
import LastModifiedBar from './../../components/LastModifiedBar'
import Button from './../../components/Button'
import ErrorBox from './../../components/ErrorBox'

import Article from './../../containers/Article'
import CardList from './../../containers/CardList'
import Content from './../../containers/Content'

import './styles.css'
import './tablet.css'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      api: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      related: null,
      isExpanded: false,
      lead: {},
      errorMsg: 'This page does not exist.',
      error: false,
      remaining: {}
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    this.load();
  },
  componentWillReceiveProps(nextProps){
    this.load( nextProps.title, nextProps.lang );
  },
  loadRelatedArticles() {
    var self = this;
    var endpoint = '/api/related/' + this.props.lang + '/' + this.props.title;
    this.props.api.fetchCards( endpoint, this.props ).then( function ( cards ) {
      self.setState( {
        related: cards
      } );
    } );
  },
  load( title, lang ) {
    var self = this;
    title = title || this.props.title;
    lang = lang || this.props.lang;

    if ( window.location.search.indexOf( 'expanded=1' ) > -1 ) {
      this.setState( { isExpanded: true } );
    }
    this.setState( { lead: {} } );
    this.props.api.getPage( title, lang ).then( function ( data ) {
      var ns = data.lead.ns;

      // If talk page or user page auto expand
      if ( ns % 2 === 1 || ns === 2 ) {
        self.setState( { isExpanded: true } );
      }
      self.setState(data);
      self.loadRelatedArticles();
    } ).catch( function ( e ) {
      self.setState({ error: true, errorMsg: e.toString() });
    } );
  },
  expand() {
     this.props.router.navigateTo( window.location.pathname + '?expanded=1', '', true );
     this.setState({
      isExpanded: true
    } );
  },
  render(){
    var url, leadHtml, related, talkUrl,
      contentBody,
      sections = [],
      btns = [],
      self = this,
      lang = this.props.lang,
      title = this.props.title,
      lead = this.state.lead,
      namespace = this.state.lead.ns;

    if ( !lead.displaytitle ) {
      contentBody = this.state.error ? <ErrorBox msg={this.state.errorMsg}></ErrorBox>
      : <IntermediateState></IntermediateState>;

      return (
        <Article>
          <Content>{contentBody}</Content>
        </Article>
      )
    } else {
      leadHtml = lead.sections.length ? lead.sections[0].text : '';
      if ( this.state.error ) {
        sections = [<ErrorBox msg="This page does not exist."></ErrorBox>];
      } else if ( this.state.isExpanded ) {
        sections = this.state.remaining.sections.map( function ( sectionProps ) {
          return <Section {...self.props} {...sectionProps} key={sectionProps.id}></Section>
        } );
      } else {
        sections.push(<Button key="article-expand" label="Expand" onClick={this.expand}></Button>);
      }
      if ( this.state.lead.languagecount > 0 ) {
        btns.push(<Button key="lang-view" href="#/languages"
          label="Read in another language"></Button>);
      }
      if ( namespace === 0 ) {
        btns.push(<Button key="article-talk" href={'/' + lang + '/wiki/Talk:' + title }
          label="Talk"></Button>);
      }

      if ( this.state.related ) {
        related = <Content key="page-row-related" className="post-content">
          <h2>Read more</h2>
          <CardList unordered="1" cards={this.state.related} />
        </Content>;
      }
      return (
        <Article {...this.props} title={this.state.lead.displaytitle} tagline={this.state.lead.description}>
          <Content key="page-row-1" className="content">
            <SectionContent {...this.props} text={leadHtml}></SectionContent>
            {sections}
          </Content>
          <Content key="page-row-2" className="post-content">{btns}</Content>
          <LastModifiedBar editor={lead.lastmodifier} lang={this.props.lang}
            title={this.props.title} timestamp={lead.lastmodified} />
          {related}
        </Article>
      )
    }
  }
} );
