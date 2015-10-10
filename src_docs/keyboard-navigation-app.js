var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react');

var allKeys = require('./all-keys');

var KeyboardNavigationApp = React.createClass({

  _renderKeysLinks: function() {
    var propsLinks = _.map(allKeys, function(key, index) {
      var href = '#' + key.nameAttr;
      var reactKey = 'key_link_' + index;
      return (<li key={reactKey}><a href={href}> {key.nameAttr} </a></li>);
    });

    return propsLinks;
  },

  _renderKeys: function() {
    var articles = _.map(allKeys, function(key, index) {
      var reactKey = "keyboard_" + index;
      return( <article key={reactKey} className="api-item">
                <h5 className="api-link">
                  <a name={key.nameAttr}>{key.displayName}</a>
                </h5>
                <p dangerouslySetInnerHTML={{__html: key.renderString}} />
                <a className="top-return" href="#index_top">Back to Top</a>
                <a className="top-return" href="#keys_top">Back to Keys Links</a>
              </article>);
    });

    return articles;
  },

  render: function() {
    return( <section className="api-docs-section">
              <a name="keyboard"> </a>
              <h3 className="feature-heading">Keyboard Navigation:</h3>
              <a name="keys_top"> </a>
              <h5>Keyboard Navigation Links By Key:</h5>
              <nav className="api">
               <ul>
                 {this._renderKeysLinks()}
               </ul>
              </nav>
              {this._renderKeys()}
            </section>);
  }
});

module.exports = KeyboardNavigationApp;
React.render(<KeyboardNavigationApp />, document.getElementById('keyboard_docs'));
