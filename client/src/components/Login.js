import React, { useState, useContext } from 'react'
import AppContext from './AppContext'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const Login = () => {
    const { setUser, setUserCategories } = useContext(AppContext)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$/

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Username is required.')
                .min(5, 'Username must be at least 5 characters.')
                .max(100, 'Username must be less than 100 characters.'),
            password: Yup.string()
                .required('Password is required.')
                .min(8, 'Password must be at least 8 characters.')
                .matches(passwordPattern, 'Password must include at least 1 lowercase letter, 1 uppercase letter, and 1 special character (!@#$%^&*).'),
        }),
        onSubmit: (values) => {
            setErrorMessage('')
            console.log("Submitting login request with values:", values)

            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
                .then(res => res.json().then(data => ({ ok: res.ok, data })))
                .then(({ ok, data }) => {
                    if (!ok || data.error) {
                        throw new Error(data.error || 'Login failed.')
                    }

                    return fetch('/check_session')
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch user session.')
                    }
                    return res.json()
                })
                .then(sessionData => {
                    setUser(sessionData)
                    setUserCategories(sessionData.categories || [])
                    navigate('/')
                })
                .catch(error => {
                    setErrorMessage(error.message)
                })
        }
    })

    return (
        <div>
            <h3>Login</h3>
            {errorMessage && <div className="error">{errorMessage}</div>}

            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div className="error">{formik.errors.username}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="error">{formik.errors.password}</div>
                    )}
                </div>

                <div>
                    <button className="btn" type="submit">Login</button>
                    <button className="btn" type="button" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default Login






