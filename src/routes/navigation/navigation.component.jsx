import { Outlet, Link } from "react-router-dom"
import { ReactComponent as CrownLogo } from '../../assets/crown.svg'
import { UserContext } from "../../contexts/user.context"
import { CartContext } from "../../contexts/cart.context"
import { Fragment, useState, useContext } from 'react'
import { signOutUser } from "../../utils/firebase/firebase.utils"
import CartIcon from "../../components/cart-icon/cart-icon.component"
import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component"
import {NavigationContainer, NavLinks, NavLink, LogoContainer} from './navigation.styles'
import { shallowEqual, useSelector } from "react-redux"
import { selectCurrentUser } from "../../store/user/user.selector"
import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';

const Navigation = () => {

    // NE RADI SA REDUXOM!!!
    //const currentUser = useSelector(selectCurrentUser, shallowEqual);

    // PREKO CONTEXTA RADI
    const { currentUser } = useContext(UserContext);
    
    debugger;
    const { isCartOpen } = useContext(CartContext);

    return (
      <Fragment>
        <NavigationContainer>
          <LogoContainer to='/'>
            <CrwnLogo className='logo' />
          </LogoContainer>
          <NavLinks>
            <NavLink to='/shop'>SHOP</NavLink>
  
            {currentUser ? (
              <NavLink as='span' onClick={signOutUser}>
                SIGN OUT
              </NavLink>
            ) : (
              <NavLink to='/auth'>SIGN IN</NavLink>
            )}
            <CartIcon />
          </NavLinks>
          {isCartOpen && <CartDropdown />}
        </NavigationContainer>
        <Outlet />
      </Fragment>
    );
  };
  
  export default Navigation;