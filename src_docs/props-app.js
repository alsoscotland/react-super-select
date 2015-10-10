var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react');

var allProps = require('./all-props');

var PropsApp = React.createClass({

  _renderPropsLinks: function() {
    var sortedProps = allProps.sort(function(propA, propB) {
      return (propA.nameAttr >= propB.nameAttr) ? 1 : -1;
    });
    var propsLinks = _.map(sortedProps, function(prop, index) {
      var href = '#' + prop.nameAttr;
      var key = 'prop_link_' + index;
      return (<li key={key}><a href={href}> {prop.nameAttr} </a></li>);
    });

    return propsLinks;

  },

  _renderProps: function() {
    var articles = _.map(allProps, function(prop, index) {
      var key = "api_prop_" + index;
      return( <article key={key} className="api-item">
                <h4 className="api-link">
                  <a name={prop.nameAttr}>{prop.nameAttr}</a>
                </h4>
                <p dangerouslySetInnerHTML={{__html: prop.renderString}} />
                <a className="top-return" href="#index_top">Back to Top</a>
                <a className="top-return" href="#properties_top">Back to API Documentation Links</a>
              </article>);
    });

    return articles;
  },

  render: function() {
    return( <section className="api-docs-section">
              <a name="apiDocs"> </a>
              <h3 className="feature-heading">API documentation</h3>
              you can also view the
              <a href="annotated-source.html"> Annotated Source Code </a>
              <a name="properties_top"> </a>
              <h5>Component Property API Documentation Links:</h5>
              <nav className="api">
               <ul>
                 {this._renderPropsLinks()}
               </ul>
              </nav>

              {this._renderProps()}
            </section>);
  }
});

module.exports = PropsApp;
React.render(<PropsApp />, document.getElementById('props_docs'));
