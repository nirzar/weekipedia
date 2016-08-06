import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

import MainMenu from './../../components/MainMenu'
import Header from './../../components/Header'
import Icon from './../../components/Icon'
import TransparentShield from './../../components/TransparentShield'
import SearchForm from './../../components/SearchForm'

import Toast from './../../overlays/Toast'

// Main component
export default React.createClass({
  getInitialState() {
    return {
      isMenuOpen: false,
      notification: '',
      isOverlayEnabled: false
    }
  },
  getDefaultProps() {
    return {
      lang: 'en',
      isOverlayFullScreen: true,
      isOverlayEnabled: false
    };
  },
  componentWillReceiveProps( nextProps ) {
    this.setState( { isOverlayEnabled: nextProps.overlay } );
  },
  componentWillMount() {
    this.setState( { isOverlayEnabled: this.props.overlay } );
  },
  hijackLinks(){
    var links = ReactDOM.findDOMNode( this ).querySelectorAll( 'a' );
    var props = this.props;

    function navigateTo( ev ) {
      var link = ev.currentTarget;
      var childNode = link.firstChild;
      var parentNode = link.parentNode;
      if ( parentNode.className === 'mw-ref' ) {
        ev.preventDefault();
        ev.stopPropagation();
        props.router.navigateTo( null,
          '#/ref/' + link.getAttribute( 'href' ).substr( 1 ), true );
      } else if ( childNode && childNode.nodeName === 'IMG' ) {
        var href = link.getAttribute( 'href' ) || '';
        var match = href.match( /\/wiki\/File\:(.*)/ );
        if ( match && match[1] ) {
          ev.preventDefault();
          props.router.navigateTo( '#/media/' + match[1] );
        }
      } else {
        var href = link.getAttribute( 'href' ) || '';
        // FIXME: Workaround for #5
        if ( href.substr( 0, 5 ) === '/wiki' ) {
          href = '/' + props.lang + href;
        }
        props.router.navigateTo( href );
        ev.preventDefault();
      }
    }

    Array.prototype.forEach.call( links, function ( link ) {
      link.addEventListener( 'click', navigateTo );
    } );
  },
  componentDidMount(){
    this.hijackLinks();
  },
  closeOverlay() {
    var node;
    // If an overlay is open
    if ( this.state.isOverlayEnabled ) {
      this.setState( { isOverlayEnabled: false } );
    }
    this.setState( { notification: null } );
  },
  closePrimaryNav( ev ){
    this.setState({ isMenuOpen: false });
    this.closeOverlay();
  },
  openPrimaryNav( ev ){
    this.setState({ isMenuOpen: true });
    ev.preventDefault();
    ev.stopPropagation();
  },
  showNotification( msg ) {
    var self = this;
    this.setState( {
      notification: msg
    } );
    clearTimeout( this.pendingToast );
    this.pendingToast = setTimeout( function () {
      self.setState( {
        notification: null
      } );
    }, 5000 );
  },
  onClickSearch(ev){
    this.props.router.navigateTo( '#/search' );
  },
  render(){
    var searchForm = (<SearchForm
      onClickSearch={this.onClickSearch}></SearchForm>);

    var navigationClasses = this.state.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';

    var icon = <Icon glyph="mainmenu" label="Home"
      onClick={this.openPrimaryNav}/>;
    var shield = this.state.isMenuOpen ? <TransparentShield /> : null;

    var overlay, toast;

    if ( this.state.isOverlayEnabled ) {
      if ( this.props.overlayProps ) {
        overlay = React.createElement( this.props.overlay,
          this.props.isOverlayFullScreen ? this.props.overlayProps :
          Object.assign( {}, this.props.overlayProps, {
            onExit: this.closeOverlay
          } )
        );
      } else {
        overlay = this.props.overlay;
      }
    }

    if ( overlay ) {
      navigationClasses += this.props.isOverlayFullScreen ? 'overlay-enabled' : '';
    }

    if ( this.state.notification ) {
     toast = <Toast>{this.state.notification}</Toast>;
    }

    // clone each child and pass them the notifier
    const children = React.Children.map( this.props.children, ( child ) => React.cloneElement( child, {
        showNotification: this.showNotification,
        hijackLinks: this.hijackLinks
      } )
    );

    return (
      <div id="mw-mf-viewport" className={navigationClasses}>
        <nav id="mw-mf-page-left">
          <MainMenu lang={this.props.lang}/>
        </nav>
        <div id="mw-mf-page-center" onClick={this.closePrimaryNav}>
          <Header key="header-bar" primaryIcon={icon}
            main={searchForm}></Header>
          {children}
          {shield}
        </div>
        { overlay }
        { toast }
      </div>
    )
  }
} );
