import {useState, useEffect} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {withRouter} from 'next/router';

import renderHTML from 'react-render-html';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Layout from '../../components/Layout';
import {singleBlog, listRelated} from '../../actions/blog';
import {API, DOMAIN, APP_NAME, FB_APP_ID} from '../../config';

dayjs.extend(relativeTime);

const SingleBlog = ({query, blog}) => {
  const [related, setRelated] = useState([]);

  const loadRelated = () => {
    listRelated({blog}).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  useEffect(() => {
    loadRelated();
  }, []);

  // SEO Header
  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc} />

      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />

      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={`${blog.mdesc}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={`${DOMAIN}`} />

      <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}`} />
      {/* TODO: ↓ よく考えたらpng以外の場合もあるのでここあとで修正したい */}
      {/* <meta property="og:image:type" content="image/png" /> */}
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

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
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid text-break">
              <section>
                <div
                  className="row"
                  style={{
                    marginTop: '-30px',
                  }}
                >
                  <img
                    src={`${API}/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img image-fluid featured-image w-100"
                  />
                </div>
              </section>

              <section>
                <div className="container">
                  <h1 className="display-2 pt-3 pb-3 text-center font-weight-bold">
                    {blog.title}
                  </h1>
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
              {JSON.stringify(related)}
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
      return {blog: data, query};
    }
  });
};

export default withRouter(SingleBlog);
