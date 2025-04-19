

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

    if (!userCategories || userCategories.length === 0) {
        return <p>User categories not loaded yet...</p>
    }

    const categoryId = Number(state?.categoryId)
    if (!categoryId) {
        return <p>Category ID missing in URL state</p>
    }

    const category = userCategories.find(cat => cat.id === categoryId)

    if (!category) {
        return <p>Category not found.</p>
    }

    if (!category.plants) {
        return <p>No plants in user category page</p>
    }

    return (
        <div>
            <h3>Username: {user.username} </h3>
            <h4>Category: {category.category_name || 'Unknown'}</h4>
            {category.plants.length > 0 ? (
                category.plants.map(plant => (
                    <div key={plant.id}>
                        <Link to={`/plant/${plant.id}`} state={{ plantId: plant.id }}>
                            {plant.plant_name}
                        </Link>
                    </div>
                ))
            ) : (
                <p>No plants in this category</p>
            )}
        </div>
    )
}

export default UserCategory
