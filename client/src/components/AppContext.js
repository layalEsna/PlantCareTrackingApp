


import React, { createContext, useState, useEffect } from 'react'


const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [userLoaded, setUserLoaded] = useState(false)


    const [user, setUser] = useState(null)
   
    const [userCategories, setUserCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])
    

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
            })
            .catch(e => console.error(e))
            .finally(() => setUserLoaded(true))
        
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
          
            userCategories,
            fetchUserData,
           
            setUserCategories,
            allCategories,
            setAllCategories,
            userLoaded 
            

        }}>
            {children}
        </AppContext.Provider>
    )

}


export default AppContext