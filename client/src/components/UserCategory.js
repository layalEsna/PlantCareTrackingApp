


import { useContext } from "react"
import AppContext from "./AppContext"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
const UserCategory = () => {

    const {user, userCategories} = useContext(AppContext)
    const {state} = useLocation()
    if (!user || !user.username) {
        return <p>User name not found...</p>
            }
            const categoryId = state?.categoryId
            const category = userCategories.find(cat => cat.id === categoryId)
            

    if (!category) {
        return <p>Category info not available...</p>
    }
    
    // console.log("Selected Category:", category)
// console.log("Category Plants:", category?.plants)

    return (
        <div>
            <h3>Username: {user.username} </h3>
            <h4>Category: {category.category_name}</h4>

            {category.plants
                .filter(plant => plant.user_id === user.id)
                .map(plant => (
                    <div key={plant.id}>
                        <Link to={`/plant/${plant.id}`}
                        state={{plantId: plant.id}}>🌱Plant Name: {plant.plant_name}</Link>


                        {/* <p>Care Notes:</p>
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
                        ) } */}



                    </div>
                ))
            
            }
            
        </div>
    )
}

export default UserCategory



















