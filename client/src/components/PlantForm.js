

import { useContext } from "react";
import AppContext from "./AppContext";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import NewCategory from "./NewCategory";

// console.log(first)
const PlantForm = () => {
    const navigate = useNavigate()
    // const location = useLocation();
    // const plant = location.state?.plant;
    const {user, allCategories, setUserCategories, setUser} = useContext(AppContext)

    const formik = useFormik({
        initialValues: {
            plant_name: '',
            image: '',
            created_at: '',
            user_id: '',
            category_id: '',
            // new_cat: ''
        },
        validationSchema: Yup.object({
            plant_name: Yup.string()
                .min(2, 'Plant name must be between 2 and 100 characters.')
                .max(100, 'Plant name must be between 2 and 100 characters.')
                .required('Plant name field is required.'),
            image: Yup.string(),
            created_at: Yup.date()
                .required('created_at field is required')
                .typeError('Invalid date format'),
                category_id: Yup.number()
                .test(
                    "category-or-new",
                    "You must select a category or add a new one.",
                    function (value) {
                        return value || this.parent.new_cat;
                    }
                )
                .required('Category ID is required.')
                .positive('Category must be a valid number.')
                .integer('Category must be an integer.')
        }),
        onSubmit: (values) => {
            console.log("Submitting plant data:", values);

            let plantDataToSend = {
                plant_name: values.plant_name,
                image: values.image,
                created_at: values.created_at,
                category_id: values.category_id ? parseInt(values.category_id) : null,

                user_id: user.id
                
            }
            console.log("Sending plantDataToSend:", plantDataToSend)

            
                        fetch('/new_plant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                            },
                            
                body: JSON.stringify(plantDataToSend)
                        })
                            
                            
                            
                .then(res => {
                    if (!res.ok) {
                    throw new Error(res.error  || 'failed to fetch data.')
                    }
                    return res.json()
                })
                            
                .then(data => {
                    const newPlant = data.plant
                    const newCategory = newPlant.category
                alert('New plant added 🎉')
                    
                    // setPlants(prevPlants => [...prevPlants, newPlant])

                    
                    
                    setUserCategories(prev => {
                        const exists = prev.some(cat => cat.id === newCategory.id)
                
                        if (exists) {
                           
                            return prev.map(cat => {
                                if (cat.id === newCategory.id) {
                                    return {
                                        ...cat,
                                        plants: [...(cat.plants || []), newPlant]  
                                    }
                                }
                                return cat;
                            });
                        } else {
                            
                            return [...prev, {
                                ...newCategory,
                                plants: [newPlant]  
                            }]
                        }
                    })
                
                
                  
                    setUser(prevUser => {
                        const updatedGroupedPlants = { ...prevUser.plants }
                        const categoryName = newCategory.category_name
                
                        if (!updatedGroupedPlants[categoryName]) {
                            updatedGroupedPlants[categoryName] = []
                        }
                
                        updatedGroupedPlants[categoryName].push(newPlant)
                
                        return { ...prevUser, plants: updatedGroupedPlants }

                    })

                    
                    formik.resetForm()
                    })
                                
                            
                                                          
            .catch(err => console.error(console.error('Backend error:', err)))
        }
    })
    
    return (
        <div>
            <h4>Add a Plant</h4>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="plant_name">Plant Name<span class="required">*</span></label>
                    <input
                        name="plant_name"
                        id="plant_name"
                        type="text"
                        value={formik.values.plant_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.plant_name && formik.touched.plant_name && (
                        <div className="error">{formik.errors.plant_name}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="image">Image:</label>
                    <input
                        name="image"
                        id="image"
                        type="text"
                        value={formik.values.image}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.image && formik.touched.image && (
                        <div className="error">{formik.errors.image}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="created_at">Created at:</label>
                    <input
                        name="created_at"
                        id="created_at"
                        type="date"
                        value={formik.values.created_at}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.created_at && formik.touched.created_at && (
                        <div className="error">{formik.errors.created_at}</div>
                    )}
                </div>

                 <div>
                    <label htmlFor="category_id">Categories<span class="required">*</span> </label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formik.values.category_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        
                    >
                        <option value=''>Select one</option>
                        {allCategories && allCategories.length && (
                            allCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))
                        )}
                    </select>
                </div> 

                <div>
                    <button type="submit">Add Plant</button>
                </div>
            </form>

            <div>
                <NewCategory />
            </div>
        </div>
    )
}

export default PlantForm