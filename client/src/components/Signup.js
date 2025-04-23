import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import AppContext from './AppContext'

const Signup = () => {
    
    const navigate = useNavigate()
    const { user, setUser } = useContext(AppContext)
    const [errorMessage, setErrorMessage] = useState('')

    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$/

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirm_password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Username is required.')
                .min(5, 'Username must be at least 5 characters.')
                .max(100, 'Username must be less than 100 characters.'),
            password: Yup.string()
                .required('Password is required.')
                .min(8, 'Password must be at least 8 characters.')
                .matches(passwordPattern, 'Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, and 1 special character (!@#$%^&*).'),
            confirm_password: Yup.string()
                .required('Confirm_password is required.')
                .oneOf([Yup.ref('password'), null], 'Password must match.')

        }),
        
        onSubmit: (values => {

            fetch('/signup', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(values)

            })
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(errData => {
                            throw new Error(errData.message || 'Failed to signup.')
                        })
                    }
                    return res.json()
                })
                .then(data => {
                    
                    if (!data || !data.id) {
                        throw new Error('Signup failed.')
                    }
                    setUser (data)
                    navigate(`/users/${data.id}`)

                })
                .catch(e => {

                    if (e.message.includes('unique constraint')) {
                        setErrorMessage('Username already exists. Please choose a different one.')
                    } else if (e.message === 'Failed to fetch') {
                        setErrorMessage('Network error or server not running. Please check the server.')
                    } else {
                        setErrorMessage(e.message)
                    }
                })

        })
    })

    return (
        <div>
            <h3>Create an Account</h3>

            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor='username'>username:</label>
                    <input
                        id='username'
                        type='text'
                        name='username'
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.username && formik.touched.username && (
                        <div className='error'>{formik.errors.username}</div>
                    )}
                </div>
                <div>
                    <label htmlFor='password'>password:</label>
                    <input
                        id='password'
                        type='password'
                        name='password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password && (
                        <div className='error'>{formik.errors.password}</div>
                    )}
                </div>
                <div>
                    <label htmlFor='confirm_password'>confirm password:</label>
                    <input
                        id='confirm_password'
                        type='password'
                        name='confirm_password'
                        value={formik.values.confirm_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.confirm_password && formik.touched.confirm_password && (
                        <div className='error'>{formik.errors.confirm_password}</div>
                    )}
                </div>

                <div>
                    <button className='btn' type='submit'>Signup</button>
                    <div className='signup_btn'> <span>Already have an account? </span> 
                    <button onClick={()=>navigate('/login')} className='btn' type='submit'>Login</button></div>
                </div>

            </form>
            {errorMessage && <div>{errorMessage}</div>}

        </div>
    )
}

export default Signup