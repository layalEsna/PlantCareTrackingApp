

import { useContext } from "react"
import AppContext from "./AppContext"
import { useLocation, Link, useParams } from "react-router-dom"



const UserCategory = () => {
  const { user, userCategories } = useContext(AppContext)
  const { state } = useLocation()
    const { categoryId } = useParams()
    // const { state } = useLocation()

  const id = Number(categoryId)
  if (!categoryId) {
    return <p>Category ID missing in URL state</p>
  }

  const category = userCategories.find(cat => cat.id === id)
  const updatedPlants = state?.updatedPlants
  const plants = updatedPlants || category?.plants

  if (!user || !user.username) {
    return <p>User name not found...</p>
  }

  if (!userCategories || userCategories.length === 0) {
    return <p>User categories not loaded yet...</p>
  }

  if (!category) {
    return <p>Category not found.</p>
  }

  if (!plants) {
    return <p>No plants in user category page</p>
  }

  return (
      <div>
          <div>
              <Link to={`/users/${user.id}`}>Home</Link>
          </div>
      <h3>Username: {user.username} </h3>
      <h3>🌿 Category: {category.category_name || 'Unknown'}</h3>
      {plants.length > 0 ? (
        plants.map(plant => (
            <div key={plant.id}>

<Link
  to={`/plants/${plant.id}/details/${category.id}`}
  state={{ plantId: plant.id, categoryId: category.id }}
>
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

