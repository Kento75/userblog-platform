import Link from 'next/link';
import renderHTML from 'react-render-html';
import dayjs from 'dayjs';
// import 'dayjs/locale/ja';
import relativeTime from 'dayjs/plugin/relativeTime';

import {API} from '../../config';

dayjs.extend(relativeTime);

const SmallCard = ({blog}) => {
  return (
    <div className="card">
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <img
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
              style={{maxHeight: '150px'}}
              className="mw-100 mh-100 img img-fluid"
            />
          </a>
        </Link>
      </section>

      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <a>
              <h5 className="card-title">{blog.title}</h5>
            </a>
          </Link>
          <p className="card-text">{renderHTML(blog.excerpt)}</p>
        </section>
      </div>

      <div className="card-body lead mark">
        <p className="float-left mt-0 mb-0">
          Posted {dayjs(blog.updatedAt).fromNow()}
        </p>
        <br />
        <p className="float-right mt-0 mb-0">
          by{' '}
          <Link href={`/profile/${blog.postedBy.username}`}>
            <a>{blog.postedBy.name}</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SmallCard;
