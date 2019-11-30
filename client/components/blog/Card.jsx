import Link from 'next/link';
import renderHTML from 'react-render-html';
import dayjs from 'dayjs';
// import 'dayjs/locale/ja';
import relativeTime from 'dayjs/plugin/relativeTime';

import {API} from '../../config';

// dayjs settings
// dayjs.locale('ja');
dayjs.extend(relativeTime);

const Card = ({blog}) => {
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
      <section className="pb-4">
        {showBlogCategories(blog)}
        {showBlogTags(blog)}
        <br />
      </section>

      <div className="row">
        <div className="col-md-4">
          <section>
            <img
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
              style={{maxHeight: '150px'}}
              className="mw-100 mh-100 img img-fluid"
            />
          </section>
        </div>
        <div className="col-md-8">
          <section>
            <div className="pb-3 text-break">{renderHTML(blog.excerpt)}</div>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="btn btn-primary pt-2">Read more</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;
