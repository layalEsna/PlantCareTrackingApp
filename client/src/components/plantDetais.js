



import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import AppContext from "./AppContext";
import CareNoteForm from "./CareNoteForm";
import { useFormik } from "formik"
import * as Yup from 'yup'



const PlantDetails = () => {
    const { user, userCategories, setUserCategories } = useContext(AppContext);
    
    const { plantId } = useParams()
    const { state } = useLocation()
    const [editingNoteId, setEditingNoteId] = useState(null)
    const categoryId = state?.categoryId
    const navigate = useNavigate()

    const plantIdNum = Number(plantId)
    const categoryIdNum = Number(categoryId)

    const category = userCategories.find(cat => cat.id === categoryIdNum)
    const plant = category?.plants?.find(p => p.id === plantIdNum)
    
    const noteToEdit = plant?.care_notes.find(note => note.id === editingNoteId) || null

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            care_type: noteToEdit?.care_type || '',
            frequency: noteToEdit?.frequency || '',
            starting_date: noteToEdit?.starting_date || ''
        },
        validationSchema: Yup.object({
            care_type: Yup.string()
                .required('care_type is required.')
                .min(5, 'care_type must be between 5 and 100 characters inclusive.')
                .max(100, 'care_type must be between 5 and 100 characters inclusive.'),
            frequency: Yup.number()
                .required('frequency is required and must be a number.')
                .positive('Frequency must be a positive number.'),
            starting_date: Yup.date()
                .required('starting_date must be a valid date in YYYY-MM-DD format.')

        }),
        onSubmit: (values) => {

            const payload = {
                ...values,
                frequency: parseInt(values.frequency, 10)
            }
            
                fetch(`/care_notes/${editingNoteId}`, {

                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch data.')
                    } return res.json()
                })
                .then(updatedNote => {
                    setUserCategories(prevCats =>
                        prevCats.map(cat =>
                            cat.id === categoryIdNum
                                ? {
                                    ...cat,
                                    plants: cat.plants.map(p =>
                                        p.id === plant.id
                                            ? {
                                                ...p,
                                                care_notes: p.care_notes.map(note =>
                                                    note.id === updatedNote.id ? updatedNote : note
                                                )
                                            } : p
                                    )
                                } : cat
                        )

                    )
                    setEditingNoteId(null)
                }
                )
                .catch(e => console.error(e))
        }




    })

    

    if (!user) return null

    if (!user || !user.username) return <Link to='/login'>Login</Link>

   

    if (!userCategories || userCategories.length === 0) return <p>You need to login...</p>
   
    if (!plant) return <p>Plant not found...</p>

    const handleDelete = (plantIdToDelete) => {
        fetch(`/plants/${plantIdToDelete}`, {
            method: "DELETE",
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to delete plant.")
                return res.json()
            })
            .then(() => {
                const updatedPlants = category.plants.filter(p => p.id !== plantIdToDelete)
                if (updatedPlants.length > 0) {
                    const updatedCategories = userCategories.map(cat =>
                        cat.id === category.id ? { ...cat, plants: updatedPlants } : cat
                    )
                    setUserCategories(updatedCategories)
                   
                    navigate(`/categories/${category.id}/plants`)
                } else {
                    const updatedCategories = userCategories.filter(cat => cat.id !== category.id)
                    setUserCategories(updatedCategories)
                  
                    navigate('/')
                }
            })
            .catch(error => {
                console.error("Delete error:", error)
            })
    }

    
    function onAddNote(newNote) {
        setUserCategories(prevCats =>
            prevCats.map(cat => cat.id === categoryIdNum ?
                {
                    ...cat, plants: cat.plants.map(p => p.id === plant.id ?
                        { ...p, care_notes: [...(p.care_notes || []), newNote] }
                        : p
                )} : cat
            )
        )
    }
   


    const handleDeleteCareNote = (careNoteId) => {
        fetch(`/care_notes/${careNoteId}`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to delete care note")
                return res.json()
            })



            .then(() => {
                setUserCategories(prevCats =>
                    prevCats.map(cat => cat.id === categoryIdNum
                        ? {
                            ...cat, plants: cat.plants.map(p => p.id === plant.id
                                ? {...p, care_notes: p.care_notes.filter(note => note.id !== careNoteId)
                                
                            }: p
                        )
                            
                        }: cat
                    )
                )
            })


                .catch(e => console.error(e))
    }

    return (
        <div>
            <span>Username: {user.username} </span>
            <div>
                <Link to={`/`}>Home</Link>
                
            </div>
            {category?.id && (
                <div>
                   
                    <Link to={`/categories/${category.id}/plants`}>Category</Link>
                </div>
            )}


            <h3>🌿 Plant: {plant.plant_name}</h3>
            <h5>Category: {category.category_name}</h5>
            <button className="plant_delete_btn" onClick={() => handleDelete(plant.id)}>
                Delete: {plant.plant_name}
            </button>

            <p>Care Notes:</p>
            {plant.care_notes && plant.care_notes.length ? (
                plant.care_notes.map(note => (
                    <ul key={note.id}>
                        <li>Care Type: {note.care_type}</li>
                        <li>Frequency: {note.frequency}</li>
                        <li>Started Date: {note.starting_date}</li>
                        <li>Upcoming Date: {note.next_care_date}</li>
                        <button className="btn care_note_delete_btn" onClick={() => handleDeleteCareNote(note.id)}>Delete</button>
                        <button className="btn" onClick={() => setEditingNoteId(note.id)}>Edit</button>


                        {editingNoteId === note.id && (
                            <form className="edit_form" onSubmit={formik.handleSubmit}>
                                <div>
                                    <label htmlFor="care_type">Care Type:</label>
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
                                    <label htmlFor="frequency">Frequency:</label>
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
                                    <label htmlFor="starting_date">Starting date</label>
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
                                <button className="edit_btn green" type="submit">Edit Care Note</button>

                            </form>
                        )}

                    </ul>
                ))
            ) : (
                <p>🌿 Add Care Note</p>
            )}

            <div>
                <CareNoteForm plantId={plant.id} onAddNote={onAddNote} />
            </div>
        </div>
    )
}

export default PlantDetails

