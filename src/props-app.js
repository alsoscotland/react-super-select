var _ = require('lodash'),
    React = require('react');

var allProps = require('./examples/all-props');

var Props = React.createClass({

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
              </article>);
    });

    return articles;
  },

  render: function() {
    return( <section className="api-docs-section">
              <a name="apiDocs"> </a>
              <h3 className="feature-heading">API documentation</h3>
              you can also view the
              <a href="example/annotated-source.html"> Annotated Source Code </a>
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

React.render(<Props />, document.getElementById('props_docs'));
