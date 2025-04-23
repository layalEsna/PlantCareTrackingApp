import { useContext } from "react"
import AppContext from "./AppContext"
import { useNavigate } from "react-router-dom"

const Logout = () => {

    const { setUser, setUserCategories } = useContext(AppContext)
    const navigate = useNavigate()

    function handleLogout() {
        fetch('/logout', {
            method: 'DELETE'
        })
            .then(res => {
                if (!res.ok) {
                throw new Error('Failed to fetch data.')
                } return res.json()
                    .then(() => {
                        setUser(null)
                        setUserCategories(null)

                        navigate('/login')
                })
                .catch(e=> console.error(e))
                
        })
    }

    
    
    return (
        <div>
            <button className="logout_btn" onClick={handleLogout}>Logout</button>

        </div>
    )
}

export default Logout