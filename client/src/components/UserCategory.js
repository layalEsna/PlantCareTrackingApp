import { useContext } from "react"
import AppContext from "./AppContext"
import { useLocation } from "react-router-dom"
const UserCategory = () => {

    const {user, userCategories} = useContext(AppContext)
    const {state} = useLocation()
    if (!user || !user.username) {
        return <p>User name not found...</p>
            }
            const categoryId = state?.categoryId
            const category = userCategories.find(cat => cat.id === categoryId)
            

    // const selectedCategory = userCategories.find(cat => cat.id === )
    if (!category) {
        return <p>Category info not available...</p>
    }
    
    console.log("Selected Category:", category)
console.log("Category Plants:", category?.plants)

    return (
        <div>
            <h4>Username: {user.username} </h4>
            <h5>Category: {category.category_name}</h5>
            {category.plants && category.plants.length ? (
                category.plants.map(plant=> (
                    <div key={plant.id}>
                        <p>{plant.plant_name}</p>
                        
                </div>
            ))
            ): (
                
                <p>No Plants</p>
            )}
        </div>
    )
}

export default UserCategory
