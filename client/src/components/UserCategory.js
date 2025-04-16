


import { useContext } from "react"
import AppContext from "./AppContext"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
const UserCategory = () => {

    const {user, userCategories, plants} = useContext(AppContext)
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



            {
                plants
                .filter(plant => plant.category_id === category.id && plant.user_id === user.id)
                .map(plant => (
                  <div key={plant.id}>
                    <Link to={`/plant/${plant.id}`} state={{ plantId: plant.id }}>
                      🌱Plant Name: {plant.plant_name}
                    </Link>
                  </div>
                ))
              

            }

            {/* {user.plants
                .filter(plant => plant.category_id === category.id && plant.user_id === user.id)
                .map(plant => (
                    <div key={plant.id}>
                        <Link to={`/plant/${plant.id}`}
                        state={{plantId: plant.id}}>🌱Plant Name: {plant.plant_name}</Link>


                        


                    </div>
                ))
            
            } */}
            
        </div>
    )
}

export default UserCategory



















