
import { useContext, useEffect } from "react";
import AppContext from "./AppContext";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";

const UserCategory = () => {
  const { user, userCategories, loading } = useContext(AppContext);
  const { state } = useLocation();
  const { categoryId } = useParams();
  const navigate = useNavigate();

  if (loading || !user) return <p>Loading...</p>

  
  if (!categoryId) return <p>Category ID missing</p>

  const id = Number(categoryId)
  const category = userCategories.find(cat => cat.id === id)
  const updatedPlants = state?.updatedPlants
  const plants = updatedPlants || category?.plants

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
      <span>Username: {user.username} </span>
      <div>
        <Link to={`/`}>Home</Link>
      </div>
      <h3>🌿 Category: {category.category_name || 'Unknown'}</h3>
      {plants.length > 0 ? (
        plants.map(plant => (
          <div key={plant.id}>
            <Link
              to={`/plants/${plant.id}`}
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




