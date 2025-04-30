import { useContext, useEffect } from "react";
import AppContext from "./AppContext";
import { useFormik } from "formik";
import * as Yup from 'yup'

import { useNavigate } from "react-router-dom";

const NewCategory = () => {
    const { setAllCategories, allCategories, user, loading} = useContext(AppContext)
    const navigate = useNavigate()

    
    const formik = useFormik({
        
        initialValues: {
            category_name: ''
        },
        validationSchema: Yup.object({
            category_name: Yup.string()
                .required('Category name is required.')
                .min(5, 'Category name must be between 5 and 100 characters.')

                .max(100, 'Category name must be between 5 and 100 characters.')

        }),
        onSubmit: (values) => {
            fetch('/categories/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(async res => {
                    const data = await res.json()
                    if (!res.ok) {
                        // throw new Error(data.error || 'Failed to fetch data.')
                        if (data.error === 'Category already exists.') {
                            alert(data.error)
                            return null
                        }
                        throw new Error(data.error || 'Failed to fetch data.')
 
                    }
                    return data
                    // return res.json()
            })
                .then(data => {
                    if (!data) return
                    // console.log("🟢 Response from /new_category:", data)
                    const existedCategory = allCategories.some(cat => cat.id === data.id)
                    if (existedCategory) {
                            // return
                            alert('The category already exists.') 
                        }
                        else {
                            setAllCategories(prev => [...prev, data])
                            alert('Category added 🎉')
                        }
                        

                    
                
                })
                formik.resetForm({ values: { category_name: '' }, touched: {}, errors: {} })

            .catch(e => console.error(e))
        }
    })

    useEffect(() => {
        if (!loading && !user) {
          navigate("/login");
        }
      }, [user, loading, navigate]);
    
    
    
    return (
        <div>
             <p>create a new category if it is not in the list:</p>

            <form onSubmit={formik.handleSubmit}>
            <div>
                <label htmlFor="category_name">Add New Category</label>
                <input
                    id="category_name"
                    name="category_name"
                    value={formik.values.category_name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                
                />

            </div>
            {formik.errors.category_name && formik.touched.category_name && (
                <div className="error">{formik.errors.category_name}</div>
            )}
            <button type="submit">
                Add A New Category
            </button>
        </form>

        </div>
    )
}

export default NewCategory