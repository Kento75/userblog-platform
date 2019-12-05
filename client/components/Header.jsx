import {useState} from 'react';
import {APP_NAME} from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import NProgress from 'nprogress';
import '../node_modules/nprogress/nprogress.css';
import 'react-quill/dist/quill.snow.css';
import {signout, isAuth} from '../actions/auth';
import Link from 'next/link';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Router from 'next/router';
import Search from './blog/Search';

NProgress.configure({showSpinner: false, easing: 'ease', speed: 500});
// https://nextjs.org/docs#router-events
Router.events.on('routeChangeStart', url => NProgress.start());
Router.events.on('routeChangeComplete', url => NProgress.done());
Router.events.on('routeChangeError', url => NProgress.done());

const Header = () => {
  console.log(APP_NAME);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <React.Fragment>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavbarBrand className="font-weight-bold">{APP_NAME}</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <React.Fragment>
              <NavItem>
                <Link href="/blogs">
                  <NavLink style={{cursor: 'pointer'}}>Blogs</NavLink>
                </Link>
              </NavItem>
            </React.Fragment>

            {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signin">
                    <NavLink style={{cursor: 'pointer'}}>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink style={{cursor: 'pointer'}}>Signup</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}

            {/* User Dashboard */}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user">
                  <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}

            {/* Admin Dashboard */}
            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href="/admin">
                  <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}

            {isAuth() && (
              <NavItem>
                <NavLink
                  style={{cursor: 'pointer'}}
                  onClick={() => signout(() => Router.replace(`/signin`))}
                >
                  Signout
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
      <Search />
    </React.Fragment>
  );
};

export default Header;
