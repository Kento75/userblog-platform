import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {getCookie, isAuth} from '../../actions/auth';
import {getTags} from '../../actions/tag';
import {createBlog} from '../../actions/blog';

// react-quill エディタを簡単に実装できる便利なやつ
// Repository -> https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});
import 'react-quill/dist/quill.snow.css';

const CreateBlog = ({router}) => {
  // localStorageに下書きがある場合表示
  const blogFromLS = () =>
    typeof window !== 'undefined' && localStorage.getItem('blog')
      ? JSON.parse(localStorage.getItem('blog'))
      : false;

  const [body, setBody] = useState(blogFromLS());
  const [values, setValues] = useState({
    error: '',
    sizeError: '',
    success: '',
    formData: '',
    title: '',
    hidePublishButton: false,
  });

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
  } = values;

  useEffect(() => {
    setValues({...values, formData: new FormData()});
  }, [router]);

  const publishBlog = e => {
    e.preventDefault();
    console.log('ready to publishBlog');
  };

  const handleChange = name => e => {
    // console.log(e.target.value, name);
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({...values, [name]: value, formData, error: ''});
  };

  const handleBody = e => {
    // console.log(e);
    setBody(e);
    formData.set('body', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog', JSON.stringify(e));
    }
  };

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
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
            modules={CreateBlog.modules}
            formats={CreateBlog.formats}
            value={body}
            placeholder="Write something amazing ..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      {createBlogForm()}
      <hr />
      {JSON.stringify(title)}
      <hr />
      {JSON.stringify(body)}
    </div>
  );
};

CreateBlog.modules = {
  toolbar: [
    [{header: '1'}, {header: '2'}, {header: [3, 4, 5, 6]}, {font: []}],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{list: 'ordered'}, {list: 'bullet'}],
    ['link', 'image', 'video'], // イメージ挿入を可能にする
    ['clean'],
    ['code-block'],
  ],
};

CreateBlog.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'video',
  'code-block',
];

export default withRouter(CreateBlog);
