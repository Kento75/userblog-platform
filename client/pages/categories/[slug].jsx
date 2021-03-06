import Head from 'next/head';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Layout from '../../components/Layout';
import Card from '../../components//blog/Card';
import {singleCategory} from '../../actions/category';
import {API, DOMAIN, APP_NAME, FB_APP_ID} from '../../config';

dayjs.extend(relativeTime);

const Category = ({category, blogs, query}) => {
  // SEO Header
  const head = () => (
    <Head>
      <title>
        {category.name} | {APP_NAME}
      </title>
      <meta
        name="description"
        content={`Programing blogs on node next react vue web development on ${category.name}`}
      />

      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />

      <meta property="og:title" content={`${category.name} | ${APP_NAME}`} />
      <meta
        property="og:description"
        content={`Programing blogs on node next react vue web development on ${category.name}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
      <meta property="og:site_name" content={`${DOMAIN}`} />

      <meta
        property="og:image"
        content={`${DOMAIN}/static/images/userblog.png`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/images/userblog.png`}
      />
      {/* TODO: ↓ よく考えたらpng以外の場合もあるのでここあとで修正したい */}
      {/* <meta property="og:image:type" content="image/png" /> */}
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt3">
                <h1 className="display-4 font-weight-bold">{category.name}</h1>
                {blogs.map((blog, index) => (
                  <div>
                    <Card key={index} blog={blog} />
                    <hr />
                  </div>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

Category.getInitialProps = ({query}) => {
  return singleCategory(query.slug).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {category: data.category, blogs: data.blogs, query};
    }
  });
};

export default Category;
