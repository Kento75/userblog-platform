import {useState} from 'react';
import renderHTML from 'react-render-html';
import dayjs from 'dayjs';
// import 'dayjs/locale/ja';
import relativeTime from 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/Layout';
import {listBlogsWithCategoriesAndTags} from '../../actions/blog';
import {API} from '../../config';

// dayjs settings
// dayjs.locale('ja');
dayjs.extend(relativeTime);

const Blogs = ({blogs, categories, tags, size}) => {
  const showAllBlogs = () => {
    return blogs.map((blog, index) => {
      return (
        <article key={index}>
          <div className="lead pb-4 text-break">
            <header>
              <Link href={`/blogs.${blog.slug}`}>
                <a>
                  <h2 className="display-4 pt-3 pb-3 font-weight-bold">
                    {blog.title}
                  </h2>
                </a>
              </Link>
            </header>
            <section>
              <p className="mark ml-1 pt-2 pb-2">
                Written by {blog.postedBy.name} || Published{' '}
                {dayjs(blog.updatedAt).fromNow()}
              </p>
            </section>
            <section>
              <p>blog categories and tags</p>
            </section>
            <div className="row">
              <div className="col-md-4">image</div>
              <div className="col-md-8">
                <section>
                  <div className="pb-3 text-break">
                    {renderHTML(blog.excerpt)}
                  </div>
                  <Link href={`/blogs/${blog.slug}`}>
                    <a className="btn btn-primary pt-2">Read more</a>
                  </Link>
                </section>
              </div>
            </div>
          </div>
          <hr />
        </article>
      );
    });
  };

  return (
    <Layout>
      <main>
        <div className="container-fluid">
          <header>
            <div className="col-md-12 pt-3">
              <h1 className="display-4 font-weight-bold text-center">
                Programing blogs
              </h1>
            </div>
            <section>
              <p>show categories and tags</p>
            </section>
          </header>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">{showAllBlogs()}</div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

Blogs.getInitialProps = () => {
  return listBlogsWithCategoriesAndTags().then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        size: data.size,
      };
    }
  });
};

export default Blogs;
