import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {getCookie, isAuth} from '../../actions/auth';
import {getCategories} from '../../actions/category';
import {getTags} from '../../actions/tag';
import {createBlog} from '../../actions/blog';
import {QuillFormats, QuillModules} from '../../helpers/quill';

// react-quill エディタを簡単に実装できる便利なやつ
// Repository -> https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});

const CreateBlog = ({router}) => {
  // localStorageに下書きがある場合表示
  const blogFromLS = () => {
    if (process.browser) {
      if (typeof window !== 'undefined' && localStorage.getItem('blog')) {
        return JSON.parse(localStorage.getItem('blog'));
      }
    }
    return false;
  };
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedCategory, setCheckedCategory] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); //tags

  const [body, setBody] = useState(blogFromLS());
  const [values, setValues] = useState({
    error: '',
    sizeError: '',
    success: '',
    formData: '',
    title: '',
    imagePath: '',
    hidePublishButton: false,
  });

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    imagePath,
    hidePublishButton,
  } = values;
  const token = getCookie('token');

  useEffect(() => {
    setValues({...values, formData: new FormData()});
    initCategories();
    initTags();
  }, [router]);

  // カテゴリ一覧取得
  const initCategories = () => {
    getCategories().then(data => {
      if (data === null || typeof data === 'undefined') {
        setCategories([]);
      } else if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setCategories(data);
      }
    });
  };

  // タグ一覧取得
  const initTags = () => {
    getTags().then(data => {
      if (data === null || typeof data === 'undefined') {
        setTags([]);
      } else if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setTags(data);
      }
    });
  };

  const publishBlog = e => {
    e.preventDefault();
    createBlog(formData, token).then(data => {
      if (data === null || typeof data === 'undefined') {
      } else if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setValues({
          ...values,
          title: '',
          error: '',
          imagePath: '',
          success: `A new blog titled "${data.title}" is created`,
        });
        // リセット
        setBody('');
        setCategories([]);
        setTags([]);
        // タグとカテゴリの再取得
        initCategories();
        initTags();
      }
    });
  };

  // URLオブジェクトを作成する
  const createObjectURL = () => {
    if (process.browser) {
      return (
        (window.URL || window.webkitURL).createObjectURL ||
        window.createObjectURL
      );
    }
    return null;
  };

  const handleChange = name => e => {
    console.log(e.target.value, name);
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    if (name === 'photo') {
      setValues({
        ...values,
        [name]: value,
        imagePath: createObjectURL(e.target.files[0]),
        formData,
        error: '',
      });
    } else {
      setValues({...values, [name]: value, formData, error: ''});
    }
  };

  const handleBody = e => {
    // console.log(e);
    setBody(e);
    formData.set('body', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog', JSON.stringify(e));
    }
  };

  // カテゴリ一覧表示コンポーネント
  const showCategories = () => {
    return (
      categories &&
      categories.map((category, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleCategoriesToggle(category._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{category.name}</label>
        </li>
      ))
    );
  };

  // タグ一覧表示コンポーネント
  const showTags = () => {
    return (
      tags &&
      tags.map((tag, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleTagsToggle(tag._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  // カテゴリトグル
  const handleCategoriesToggle = c => () => {
    setValues({...values, error: ''});
    // return thhe first index or -1
    const clickedCategory = checkedCategory.indexOf(c);
    const all = [...checkedCategory];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setCheckedCategory(all);
    formData.set('categories', all);
  };

  // タグトグル
  const handleTagsToggle = t => () => {
    setValues({...values, error: ''});
    // return thhe first index or -1
    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    setCheckedTag(all);
    formData.set('tags', all);
  };

  const showError = () => (
    <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{display: success ? '' : 'none'}}
    >
      {success}
    </div>
  );

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
            modules={QuillModules}
            formats={QuillFormats}
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group pb-2">
            <h5>Featured image</h5>
            <hr />
            <small className="text-muted">Max size: 1mb</small>
            <br />
            <label className="btn btn-outline-info">
              Upload featured image
              <input
                onChange={handleChange('photo')}
                type="file"
                accept="image/*"
                hidden
              />
            </label>
          </div>
          <h5>Categories</h5>
          <hr />
          <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
            {showCategories()}
          </ul>
          <h5>Tags</h5>
          <hr />
          <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
            {showTags()}
          </ul>
        </div>
      </div>
      {imagePath && <img src={imagePath} alt={title} className="w-100" />}
    </div>
  );
};

export default withRouter(CreateBlog);
