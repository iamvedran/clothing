import { useState } from 'react'
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import FormInput from '../form-input/form-input.component';
import './sign-up-form.styles.scss'

const defaultFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

function SignUpForm() {

    const [formFields, setFormfields] = useState(defaultFields);
    const { displayName, email, password, confirmPassword } = formFields;

    //console.log(formFields);

    const ResetFormFields = () => {
        setFormfields(defaultFields);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password != confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password);

            await createUserDocumentFromAuth(user, { displayName });
            ResetFormFields();

        } catch (error) {
            if (error.code == 'auth/email-already-in-use') {
                alert("Email already in use")
            }
            console.log('user creation error ', error);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormfields({ ...formFields, [name]: value });
    }

    return (
        <div className='sign-up-container'>
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>

                <FormInput 
                    required type="text"
                    label="Display Name"
                    onChange={handleChange}
                    name="displayName"
                    value={displayName}
                />

                <FormInput 
                    required type="email" 
                    label="Email" 
                    onChange={handleChange} 
                    name="email" 
                    value={email} />

                <FormInput 
                    required type="password" 
                    label="Password" 
                    onChange={handleChange} 
                    name="password" 
                    value={password} />

                <FormInput 
                    required 
                    type="password" 
                    label="Confirm Password" 
                    onChange={handleChange} 
                    name="confirmPassword" 
                    value={confirmPassword} />

                <Button type='submit'>Sign Up</Button>
            </form>
        </div>
    )
}

export default SignUpForm;