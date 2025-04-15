
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import AppContext from "./AppContext";
import CareNoteForm from "./CareNoteForm";

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
            {/* <button>Delete: {plant.plant_name}</button> */}
            <div>
                <CareNoteForm plantId={plant.id}/>
            </div>
        </div>
    )
}

export default PlantDetailes