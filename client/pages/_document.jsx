import Document, {Html, Head, Main, NextScript} from 'next/document';

import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

class MyDocument extends Document {
  setGoogleTags() {
    if (publicRuntimeConfig.PRODUCTION) {
      return {
        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${publicRuntimeConfig.GOOGLE_ANALYTICS_ID}');
            `,
      };
    }
  }

  render() {
    return (
      // static
      <Html lang="ja">
        <Head>
          <meta charSet="UTF-8" />
          {/* https://www.w3schools.com/html/html_head.asp */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="stylesheet" href="/static/css/styles.css" />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${publicRuntimeConfig.GOOGLE_ANALYTICS_ID}`}
          ></script>
          <script dangerouslySetInnerHTML={this.setGoogleTags()}></script>
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
