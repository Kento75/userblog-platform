import {useState} from 'react';
import {APP_NAME} from '../config';
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

const Header = () => {
  console.log(APP_NAME);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavbarBrand className="font-weight-bold">{APP_NAME}</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
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
    </div>
  );
};

export default Header;
