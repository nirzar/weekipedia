import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'
import SectionContent from './../../components/SectionContent'
import Infobox from './../../components/Infobox'
import PageActions from './../../components/PageActions'

import Content from './../../containers/Content'

// Main component
class ArticleHeader extends Component {
  render(){
    var
      header = [],
      additionalClasses = [],
      lead = this.props.lead || {}

    additionalClasses.push( this.props.isSpecialPage ? ' special-page-heading' : ' standard-page-heading' );

    if ( typeof lead === 'string' ) {
      lead = { text: lead };
    }
    if ( this.props.tagline ) {
      lead.description = this.props.tagline;
    }
    if ( !lead.displaytitle && this.props.title ) {
      lead.displaytitle = this.props.title;
    }

    if ( this.props.isWikiPage ) {
      header.push( <PageActions {...this.props}
        id="page-actions"
        disableLanguages={lead.languagecount === 0} /> );
    }

    if ( lead.displaytitle ) {
      header.push(
        <h1 key="article-title"
        id="section_0" dangerouslySetInnerHTML={{ __html: lead.displaytitle }}></h1>
      );
    }
    if ( !lead.mainpage ) {
      header.push(<div className="tagline" key="article-tagline">{lead.description}</div>)
    }
    if ( lead.issues ) {
      header.push(<a href="#/issues" className="mw-mf-cleanup" key="article-issues">Page issues</a>)
    }
    if ( lead.hatnote ) {
      header.push( <p key="article-header-hatnote"
        className="hatnote" dangerouslySetInnerHTML={{ __html: lead.hatnote}} /> );
    }

    if ( this.props.tabs.length ) {
      header.push( <HorizontalList isSeparated="1" className="tabs"
        key="article-header-tabs">{this.props.tabs}</HorizontalList> );
    }

    if ( lead.infobox ) {
      additionalClasses.push( 'article-feature-infobox' );
    }
    return (
      <Content key="article-row-0" className={"pre-content " + additionalClasses.join( ' ' )}>
        <div className="heading-holder">{header}</div>
        <SectionContent {...this.props} className="lead-paragraph" text={lead.paragraph} />
        <Infobox {...this.props} text={lead.infobox} />
        <SectionContent {...this.props} className="lead-section" text={lead.text} />
      </Content>
    )
  }
}

ArticleHeader.defaultProps = {
  tabs: []
};

export default ArticleHeader
