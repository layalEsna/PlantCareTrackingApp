import { useContext } from "react"
import { useLocation } from "react-router-dom"
import AppContext from "./AppContext"
import CareNoteForm from "./CareNoteForm"
import { useNavigate } from "react-router-dom"
//plant.category
const PlantDetailes = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { user, plants, userCategories, setPlants } = useContext(AppContext)

    if (!user || !user.username) {
        return <p>Loading user data...</p>
    }

    const plantId = state?.plantId

    const plant = plants.find(p => p.id === plantId)

    if (!plant) {
        return <p>Plant not found...</p>
    }

    const category = userCategories.find(cat => cat.id === plant.category_id)

    function handleDelete(plantId) {
        fetch(`/plant/${plantId}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (!res.ok) throw new Error('failed to delete plant.')
                return res.json()
            })
            .then(() => {
                const selectedPlant = plants.filter(plant => plant.id !== plantId)
                setPlants(prev => [...prev, selectedPlant])
                 navigate(`/plant/${plantId}`)
                // setPlants(plants => plants.filter(p => p.id !== plantId))
            })
            .catch(e => console.error(e))
    }

    return (
        <div>
            <h4>🌿 Plant: {plant.plant_name}</h4>
            <h5>Category: {category?.category_name || "Unknown"}</h5>
            <button onClick={() => handleDelete(plantId)}>Delete: {plant.plant_name}</button>

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
                <CareNoteForm plantId={plant.id} />
            </div>
        </div>
    )
}

export default PlantDetailes
