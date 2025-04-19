import { useLocation, useParams } from "react-router-dom"
import { useContext } from "react"
import AppContext from "./AppContext"
import CareNoteForm from "./CareNoteForm"


const PlantDetailes = () => {
    const { user, plants, userCategories, setPlants } = useContext(AppContext)
    const location = useLocation()
    const { id: paramId } = useParams()
    const plantId = location.state?.plantId || paramId
    if (!user || !user.username || !plantId || !plants.length || !userCategories.length) {
        return <p>Loading data.......plant detail page</p>
    }
    

    const plant = plants.find(p => p.id === Number(plantId))
    console.log("🧪 plants[0]:", plants[0])

    console.log("plantId from state:", plantId)
    console.log("typeof plantId:", typeof plantId)

    console.log("plants from context:", plants)
    console.log("plant:", plant)

    if (!plant || !plants.length) {
        return <p>Plant not found...</p>
    }
    console.log("userCategories from context:", userCategories)

    const category = userCategories.find(cat => cat.id === plant.category_id)
    console.log('category from context', category)
    function handleDelete(plantId) {
        fetch(`/plant/${plantId}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (!res.ok) throw new Error('failed to delete plant.')
                return res.json()
            })
            .then(() => {

                setPlants(prev => prev.filter(p => p.id !== plantId))

            })
            .catch(e => console.error(e))
    }

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
                <CareNoteForm plantId={plant.id} />
            </div>
        </div>
    )
}

export default PlantDetailes
