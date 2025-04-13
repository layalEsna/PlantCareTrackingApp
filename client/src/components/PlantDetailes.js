
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import AppContext from "./AppContext";

const PlantDetailes = () => {
    const { state } = useLocation()
    const { user } = useContext(AppContext)
    if (!user || !user.plants) {
        return <p>Loading user data...</p>
    }
    const plantId = state?.plantId

    const plant = user.plants.find(plant => plant.id === plantId)
    
    return (
        <div>
            <p>Care Notes:</p>
            <h4>🌿Plant: {plant.plant_name}</h4>
                        {plant.care_notes && plant.care_notes.length ? (
                            plant.care_notes.map(note => (
                                <ol key={note.id}>
                                    <li>Care Type: {note.care_type}</li>
                                    <li>Frequency: {note.frequency}</li>
                                    <li>Started Date: {note.starting_date}</li>
                                    <li>Up Coming Date: {note.next_care_date}</li>
                            </ol>
                        ))
                        ): (
                            <p>🌿</p>
                        ) } 
        </div>
    )
}

export default PlantDetailes