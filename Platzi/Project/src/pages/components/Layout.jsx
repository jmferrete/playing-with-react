import React, { PropTypes } from 'react';

function Layout(props) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <title>{ props.title }</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minium-scale=1.0" />
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
        <link type="text/css" rel="stylesheet" href="http://localhost:8081/styles.css" />
      </head>
      <body>
        <div
          id="render-target"
          dangerouslySetInnerHTML={{
            __html: props.content,
          }}
        />
        <script src="http://localhost:8081/app.js" />
      </body>
    </html>
  );
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Layout;
