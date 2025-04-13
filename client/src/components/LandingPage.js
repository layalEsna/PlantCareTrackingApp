

import { useContext } from "react";
import AppContext from "./AppContext";
import { Link } from "react-router-dom";
import PlantForm from "./PlantForm";


const LandingPage = () => {

    const { user, userCategories } = useContext(AppContext)
//    console.log('🟢user categories', userCategories)

    if (!user || !user.username) {
        return <p>User not found...</p>
    }
        
    return (
        <div>
            {user.username && <h3>Welcome: {user.username}</h3>}

            <div>
                {userCategories && userCategories.length > 0 && (
                    
                    userCategories.map((cat) => (
                        
                        <div key={cat.id}>
                            <Link to={`/users/categories/${cat.id}`}
                            state={{categoryId: cat.id}}
                            >{cat.category_name}</Link>
                        </div>
                    ))
                )}
            </div>

            <PlantForm />
            <p>create a new category if it is not in the list:</p>

        </div>
    )
}

export default LandingPage