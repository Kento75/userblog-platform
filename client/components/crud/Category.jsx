import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import {isAuth, getCookie} from '../../actions/auth';
import {create, getCategories, removeCategory} from '../../actions/category';

const Category = () => {
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false,
  });

  const {name, error, success, categories, removed, reload} = values;
  const token = getCookie('token');

  useEffect(() => {
    loadCategories();
  }, [reload]);

  const loadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({...values, categories: data});
      }
    });
  };

  const showCategories = () => {
    return categories.map((category, index) => {
      return (
        <button key={index} className="btn btn-outline-primary mr-1 ml-1 mt-3">
          {category.name}
        </button>
      );
    });
  };

  const clickSubmit = e => {
    e.preventDefault();
    create({name}, token).then(data => {
      if (data.error) {
        setValues({...values, error: data.error, success: false});
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: '',
          reload: !reload,
        });
      }
    });
  };

  const handleChange = e => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: false,
    });
  };

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          required
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      {newCategoryForm()}
      <div>{showCategories()}</div>
    </React.Fragment>
  );
};

export default Category;
