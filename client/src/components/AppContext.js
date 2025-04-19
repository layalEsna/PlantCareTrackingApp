


import React, { createContext, useState, useEffect } from 'react'


const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [plants, setPlants] = useState([])
    const [userCategories, setUserCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [careNotes, setCareNotes] = useState([])

    function fetchUserData() {
        
        fetch('/check_session')
            .then(res => {
                if (!res.ok) {
                    throw new Error('failed to fetch data.')
                }return res.json()
            })
            .then(data => {
             
                setUser(data)
                setUserCategories(data.categories)
                
                const userPlants = data.categories.flatMap(cat => cat.plants)
                // setPlants(prev=> [...prev,userPlants])
                setPlants(userPlants)
                
                
                const userCareNotes = userPlants.flatMap(p => p.care_notes);
                  
                setCareNotes(userCareNotes)
                   

                  
                

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
                } return res.json()
            })
            .then(data => {
                setAllCategories(data)
                //
                //  console.log('➡️all cats', data)
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
            setAllCategories,
            careNotes,
            setCareNotes

        }}>
            {children}
        </AppContext.Provider>
    )

}


export default AppContext