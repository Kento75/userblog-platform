import Document, {Html, Head, Main, NextScript} from 'next/document';

class MyDocument extends Document {
  render () {
    return (
      <Html lang="ja">
        <Head>
          <meta charSet="UTF-8" />
          {/* https://www.w3schools.com/html/html_head.asp */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
