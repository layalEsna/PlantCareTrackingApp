import React, { createContext, useState, useEffect} from 'react'


const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [plants, setPlants] = useState([])
    const [categories, setCategories] = useState([])



    function fetchUserData() {
        fetch('/check_session', {
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(data => {
                const seen = new Set()
                const uniqueCategories = data.categories.filter(cat => {
                    if (seen.has(cat.id)) return false
                    seen.add(cat.id)
                    return true
                })
                setUser(data)
                setCategories(uniqueCategories)
                setPlants(data.plants)
            })
            .catch(e => console.error(e))
    }
    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            plants,
            categories,
            fetchUserData

        }}>
            {children}
        </AppContext.Provider>
    )

}


export default AppContext