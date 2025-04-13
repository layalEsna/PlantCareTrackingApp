


import React, { createContext, useState, useEffect} from 'react'


const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [plants, setPlants] = useState([])
    const [userCategories, setUserCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])


    function fetchUserData() {
        fetch('/check_session', {
            
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(data => {
                const uniqueCategories = [
                    ...new Map(data.categories.map(cat => [cat.category_name, cat])).values()
                ]
                // console.log('🌱 All plants from check_session:', data.plants)

                const enhancedCategories = uniqueCategories.map(cat => {
                    const categoryPlants = data.plants.filter(plant => {
                    

                        return plant.category_id === cat.id
                    })
                    return { ...cat, plants: categoryPlants }
                  })
                  
                               
                setUser(data)
                
                  
                setUserCategories(enhancedCategories)
                setPlants(data.plants)
            })
            .catch(e => console.error(e))
    }
    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {
        fetch('/categories')
            .then(res => {
                if (!res.ok) {
                throw new Error('Failed to fetch data.')
            }return res.json()
        })
            .then(data => {
                setAllCategories(data)
                // console.log('➡️all cats', data)
        })
        .catch()
    }, [])

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            plants,
            userCategories,
            fetchUserData,
            setPlants,
            setUserCategories,
            allCategories,
            setAllCategories

        }}>
            {children}
        </AppContext.Provider>
    )

}


export default AppContext