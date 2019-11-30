import {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {withRouter} from 'next/router';

import renderHTML from 'react-render-html';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Layout from '../../components/Layout';
import {singleBlog} from '../../actions/blog';
import {API, DOMAIN, APP_NAME, FB_APP_ID} from '../../config';

dayjs.extend(relativeTime);

const SingleBlog = ({router, blog}) => {
  const showBlogCategories = blog =>
    blog.categories.map((category, index) => (
      <Link key={index} href={`/categories/${category.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
      </Link>
    ));

  const showBlogTags = blog =>
    blog.tags.map((tag, index) => (
      <Link key={index} href={`/tags/${tag.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
      </Link>
    ));

  return (
    <React.Fragment>
      <Layout>
        <main>
          <article>
            <div className="container-fluid text-break">
              <section>
                <div className="row" style={{marginTop: '-30px'}}>
                  <img
                    src={`${API}/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img image-fluid featured-image w-100"
                  />
                </div>
              </section>

              <section>
                <p className="lead mt-3 mark">
                  Written by {blog.postedBy.name} || Published{' '}
                  {dayjs(blog.updatedAt).fromNow()}
                </p>
                <div className="pb-3">
                  {showBlogCategories(blog)}
                  {showBlogTags(blog)}
                  <br />
                  <br />
                </div>
              </section>
            </div>

            <div className="container">
              <section>
                <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
              </section>
            </div>

            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
              <hr />
              <p>show related blogs</p>
            </div>

            <div className="container pb-5">
              <p>show comments</p>
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
