import { signInWithGooglePopup, createUserDocumentFromAuth, signInWithGoogleRedirect, auth} from '../../utils/firebase/firebase.utils';
import React, { useEffect } from 'react'
import { getRedirectResult } from 'firebase/auth';
import SignUpForm from '../../components/sign-ip-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import './authentication.styles.scss'

function Authentication() {

  return (
    <div className='authentication-container'>
      <SignInForm />
      <SignUpForm />
    </div>
  )
}

export default Authentication;