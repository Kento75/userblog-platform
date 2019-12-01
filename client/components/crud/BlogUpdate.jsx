import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {getCookie, isAuth} from '../../actions/auth';
import {getCategories} from '../../actions/category';
import {getTags} from '../../actions/tag';
import {singleBlog, updateBlog} from '../../actions/blog';
import {QuillFormats, QuillModules} from '../../helpers/quill';

// react-quill エディタを簡単に実装できる便利なやつ
// Repository -> https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});

const BlogUpdate = ({router}) => {
  const [body, setBody] = useState('');
  const [values, setValues] = useState({
    error: '',
    success: '',
    formData: '',
    title: '',
    body: '',
  });

  const {error, success, formData, title} = values;

  useEffect(() => {
    setValues({...values, formData: new FormData()});
    initBlog();
  }, [router]);

  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({...values, title: data.title});
          setBody(data.body);
        }
      });
    }
  };

  const handleChange = name => e => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({...values, [name]: value, formData, error: ''});
  };

  const handleBody = e => {
    setBody(e);
    formData.set('body', e);
  };

  const editBlog = () => {
    console.log('update blog');
  };

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange('title')}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing ..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8 text-break">
          {updateBlogForm()}
          <div className="pt-3">show success and error msg</div>
        </div>

        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured image</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);
