import { useContext } from "react";
import AppContext from "./AppContext";
import { useFormik } from "formik";
import * as Yup from 'yup'

const NewCategory = () => {
    const {setAllCategories} = useContext(AppContext)

    const formik = useFormik({
        initialValues: {
            category_name: ''
        },
        validationSchema: Yup.object({
            category_name: Yup.string()
                .required('Category name is requierd.')
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
                    console.log('🟢categories', data)

                    // setAllCategories(prev => {
                    //     const existedCategory = 
                    // })

                
            })
            .catch(e => console.error(e))
        }
    })


    return (
        <div>

        </div>
    )
}

export default NewCategory