import {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {withRouter} from 'next/router';

import Layout from '../../components/Layout';
import {singleBlog} from '../../actions/blog';
import {API, DOMAIN, APP_NAME, FB_APP_ID} from '../../config';

const SingleBlog = ({router, blog}) => {
  return (
    <React.Fragment>
      <Layout>
        <main>
          <article>
            <div className="container-fluid text-break">
              <section>{JSON.stringify(blog)}</section>
            </div>
          </article>
        </main>
      </Layout>
    </React.Fragment>
  );
};

SingleBlog.getInitialProps = ({query}) => {
  return singleBlog(query.slug).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {blog: data};
    }
  });
};

export default withRouter(SingleBlog);
