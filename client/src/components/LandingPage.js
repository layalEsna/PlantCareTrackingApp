
import { useContext, useEffect } from "react";
import AppContext from "./AppContext";
import { Link, useNavigate } from "react-router-dom";
import PlantForm from "./PlantForm";
import Logout from "./Logout";

const LandingPage = () => {
    const { user, userCategories, loading } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login")
        }
    }, [user, loading, navigate])

    if (loading) return <p>Loading...</p>


    

    return (
        <div>
            {user?.username && <span>Username: {user.username}</span>}
            <Logout />
            <h4>My Categories</h4>

            <div>
                {userCategories?.length > 0 && (
                    userCategories.map((cat) => (
                        <div key={cat.id}>
                            <Link
                                to={`/categories/${cat.id}/plants`}
                                state={{ categoryId: cat.id }}
                            >
                                {cat.category_name}
                            </Link>
                        </div>
                    ))
                )}
            </div>

            <PlantForm />
        </div>
    );
};

export default LandingPage;




