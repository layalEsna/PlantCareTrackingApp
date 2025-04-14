import { useContext } from "react";
import AppContext from "./AppContext";
import { useFormik } from "formik";
import * as Yup from 'yup'

const NewCategory = () => {
    const {setAllCategories, allCategories} = useContext(AppContext)
    
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
            fetch('/new_category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (!res.ok) {
                    throw new Error('Failed to fetch data.')
                }return res.json()
            })
                .then(data => {
                    console.log("🟢 Response from /new_category:", data)
                    const existedCategory = allCategories.some(cat => cat.id === data.id)
                        if (existedCategory) {
                            return 
                        }
                        else {
                            setAllCategories (prev => [...prev, data])
                        }
                        formik.resetForm({ values: { category_name: '' }, touched: {}, errors: {} });

                    
                
            })
            .catch(e => console.error(e))
        }
    })


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