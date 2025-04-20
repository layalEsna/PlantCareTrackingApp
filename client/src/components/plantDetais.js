

import { useLocation, useNavigate } from "react-router-dom"
import { useContext } from "react"
import AppContext from "./AppContext"
import CareNoteForm from "./CareNoteForm"


const PlantDetails = () => {

    const { user, userCategories, setUserCategories, setPlants } = useContext(AppContext)
    const location = useLocation()
    const plantId = location.state?.plantId
    const categoryId = location.state?.categoryId
    const navigate = useNavigate()

    if (!user || !user.username || !plantId) {
        return <p>Loading data.......plant detail page</p>
    }

    const category = userCategories.find(cat => cat.id === categoryId)
    const catPlants = category.plants



    const filteredPlants = catPlants.filter(p => p.id !== Number(plantId))
    const plant = category.plants.find(p => p.id === Number(plantId))

    if (!plant || !category.plants.length) {
        return <p>Plant not found...</p>
    }


    function handleDelete(plantId) {
        fetch(`/plant/${plantId}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (!res.ok) throw new Error('failed to delete plant.')
                return res.json()
            })
            .then(() => {
                setPlants(filteredPlants)

                if (filteredPlants.length > 0) {
                    navigate(`/users/categories/${category.id}`, {
                        state: { categoryId: category.id, updatedPlants: filteredPlants },
                    })
                } else {
                    
                    const updatedCategories = userCategories.filter(cat => cat.id !== categoryId)
                    setUserCategories(updatedCategories)
                    navigate(`/users/${user.id}`)

                    
                    navigate(`/users/${user.id}`) 
                }
            })
            .catch(e => console.error(e))
    }



    const onAddNote = (newNote) => {
        setUserCategories(prevCats =>
            prevCats.map(cat =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        plants: cat.plants.map(p =>
                            p.id === plant.id
                                ? { ...p, care_notes: [...(p.care_notes || []), newNote] }
                                : p
                        )
                    }
                    : cat
            )
        );
    };


    return (
        <div>
            <h4>🌿 Plant: {plant.plant_name}</h4>
            <h5>Category: {category?.category_name || "Unknown"}</h5>
            <button onClick={() => handleDelete(plant.id)}>Delete: {plant.plant_name}</button>

            <p>Care Notes:</p>
            {plant.care_notes && plant.care_notes.length ? (
                plant.care_notes.map(note => (
                    <ul key={note.id}>
                        <li>Care Type: {note.care_type}</li>
                        <li>Frequency: {note.frequency}</li>
                        <li>Started Date: {note.starting_date}</li>
                        <li>Upcoming Date: {note.next_care_date}</li>
                    </ul>
                ))
            ) : (
                <p>🌿 No care notes yet.</p>
            )}

            <div>
               
                <CareNoteForm plantId={plant.id} onAddNote={onAddNote} />

            </div>
        </div>
    )
}

export default PlantDetails