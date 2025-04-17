

import { useContext } from "react"
import AppContext from "./AppContext"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
const UserCategory = () => {

    const { user, userCategories, plants } = useContext(AppContext)
    const { state } = useLocation()
    if (!user || !user.username) {
        return <p>User name not found...</p>
    }
    const categoryId = state?.categoryId
    if (!categoryId) {
        return <p>Category ID missing in URL state</p>
    }
    const category = userCategories.find(cat => cat.id === categoryId)


    if (!category) {
        return <p>Category info not available...</p>
    }

    console.log("Plants in UserCategory:", plants);
    console.log("CategoryId in UserCategory:", categoryId);
    console.log("Category in UserCategory:", category);

    const filteredPlants = plants.filter(plant => plant.category_id === category.id && plant.user_id === user.id);
    console.log("Filtered Plants in UserCategory:", filteredPlants);

    return (
        <div>
            <h3>Username: {user.username} </h3>
            <h4>Category: {category?.category_name || 'Unknown'}</h4>
            {filteredPlants && filteredPlants.length > 0 ? (
                filteredPlants.map(plant => (
                    <div key={plant.id}>
                        <Link to={`/plant/${plant.id}`} state={{ plantId: plant.id }}>
                            🌱Plant Name: {plant.plant_name}
                        </Link>
                    </div>
                ))
            ) : (
                <p>No plants in this category yet.</p>
            )}

        </div>
    )
}

export default UserCategory















