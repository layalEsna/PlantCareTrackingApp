import { useFormik } from "formik";
import * as Yup from 'yup'
import { useContext } from "react";
import AppContext from "./AppContext";
import { useLocation } from "react-router-dom";

const CareNoteForm = ({ plantId, onAddNote }) => {
    const { setUserCategories } = useContext(AppContext)

    const formik = useFormik({
        initialValues: {
            care_type: '',
            frequency: '',
            starting_date: '',
            plant_id: plantId
        },
        validationSchema: Yup.object({
            care_type: Yup.string()
                .required('care_type is required.')
                .min(5, 'care type must be between 5 and 100 characters.')
                .max(100, 'care type must be between 5 and 100 characters.'),
            frequency: Yup.number()
                .typeError('Frequency must be a number.')
                .required('frequency is required')
                .positive('frequency must be a positive number.'),
            starting_date: Yup.date()
                .required('starting_date is required')
                .typeError('Starting date must be a valid date.'),


        }),
        onSubmit: (values) => {

            const payload = {
                ...values,
                frequency: parseInt(values.frequency, 10),

            }

            fetch('/new_care_note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)

            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('failed to fetch data')
                    }
                    return res.json()
                })


                .then(data => {

                    setUserCategories(prevCats =>
                        prevCats.map(cat =>
                            cat.id === data.id
                                ? {
                                    ...cat,
                                    plants: cat.plants.map(p =>
                                        p.id === data.plant_id
                                            ? { ...p, care_notes: [...p.care_notes, data] }
                                            : p
                                    ),

                                }
                                : cat
                        )
                    )


                    

                    if (onAddNote) {
                        onAddNote(data)
                    }



                    formik.resetForm()

                })




                .catch(e => console.error(e))
        }

    })
    
    return (
        <div>
            <h3>Care Note Form:</h3>

            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="care_type">Care Type<span class="required">*</span></label>
                    <input
                        id="care_type"
                        type="text"
                        name="care_type"
                        value={formik.values.care_type}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.care_type && formik.touched.care_type && (
                        <div>{formik.errors.care_type}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="frequency">Frequency<span class="required">*</span></label>
                    <input
                        id="frequency"
                        name="frequency"
                        type="number"
                        value={formik.values.frequency}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.frequency && formik.touched.frequency && (
                        <div>{formik.errors.frequency}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="starting_date">Starting date<span class="required">*</span></label>
                    <input
                        id="starting_date"
                        name="starting_date"
                        type="date"
                        value={formik.values.starting_date}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.starting_date && formik.touched.starting_date && (
                        <div>{formik.errors.starting_date}</div>
                    )}
                </div>
                <button type="submit">Add Care Note</button>
                
            </form>

        </div>
    )
}

export default CareNoteForm