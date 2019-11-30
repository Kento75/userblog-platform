import {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Card from '../../components/blog/Card';

import Layout from '../../components/Layout';
import {listBlogsWithCategoriesAndTags} from '../../actions/blog';

const Blogs = ({blogs, categories, tags, size}) => {
  const showAllCategories = () =>
    categories.map((category, index) => (
      <Link key={index} href={`/categories/${category.slug}`}>
        <a className="btn btn-primary ml-1 mr-1 mt-3">{category.name}</a>
      </Link>
    ));

  const showAllTags = () =>
    tags.map((tag, index) => (
      <Link key={index} href={`/tags/${tag.slug}`}>
        <a className="btn btn-outline-primary ml-1 mr-1 mt-3">{tag.name}</a>
      </Link>
    ));

  const showAllBlogs = () => {
    return blogs.map((blog, index) => {
      return (
        <article key={index}>
          <Card blog={blog} />
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
              <div className="pt-5 text-center">
                {showAllCategories()}
                <br />
                {showAllTags()}
              </div>
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
