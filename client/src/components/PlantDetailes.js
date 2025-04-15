
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import AppContext from "./AppContext";
import CareNoteForm from "./CareNoteForm";

const PlantDetailes = () => {
    const { state } = useLocation()
    const { user } = useContext(AppContext)
    if (!user || !user.categories) {
        return <p>Loading user data...</p>
    }
    const plantId = state?.plantId

    // const plant = user.categories.find(cat => plant.id === plantId)
    const category = user.categories.find(cat =>
        cat.plants.some(plant => plant.id === plantId)
    )
    if (!category) {
        return <p>Category or Plant not found...</p>
    }


    const plant = category.plants.find(plant => plant.id === plantId);

    return (
        <div>
            <p>Care Notes:</p>
            <h4>🌿Plant: {plant.plant_name}</h4>
            <button>Delete: {plant.plant_name}</button>
                        {plant.care_notes && plant.care_notes.length ? (
                            plant.care_notes.map(note => (
                                <ul key={note.id}>
                                    <li>Care Type: {note.care_type}</li>
                                    <li>Frequency: {note.frequency}</li>
                                    <li>Started Date: {note.starting_date}</li>
                                    <li>Up Coming Date: {note.next_care_date}</li>
                                    
                                </ul>
                                
                        ))
                        ): (
                            <p>🌿</p>
            )} 
            
            <div>
                <CareNoteForm plantId={plant.id}/>
            </div>
        </div>
    )
}

export default PlantDetailes