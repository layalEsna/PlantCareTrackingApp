


import React, { createContext, useState, useEffect } from 'react'


const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [plants, setPlants] = useState([])
    const [userCategories, setUserCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [careNotes, setCareNotes] = useState([])

    // function fetchUserData() {
    //     fetch('/check_session', {

    //     })
    //         .then(res => {
    //             if (!res.ok) throw new Error('Failed to fetch')
    //             return res.json()
    //         })
    //         .then(data => {
    //             console.log('🟢', data)
    //             const uniqueCategories = [
    //                 ...new Map(data.categories.map(cat => [cat.category_name, cat])).values()
    //             ]
    //             // console.log('🌱 All plants from check_session:', data.plants)

    //             const enhancedCategories = uniqueCategories.map(cat => {
    //                 const categoryPlants = data.plants.filter(plant => {


    //                     return plant.category_id === cat.id
    //                 })
    //                 return { ...cat, plants: categoryPlants }
    //               })


    //             setUser(data)


    //             setUserCategories(enhancedCategories)
    //             setPlants(data.plants)
    //             // const allCareNotes = data.plants.flatMap(plant => plant.care_notes || [])

    //             // setCareNotes(allCareNotes)
    //         })
    //         .catch(e => console.error(e))
    // }

    function fetchUserData() {
        fetch('/check_session')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data.')
                }
                return res.json()
            })
            .then(data => {
                console.log('🟢', data)
                setUser(data)
                
                setUserCategories(data.categories || [])
                setPlants(data.plants || [])
                
                // setCareNotes(data.plants.map(plant=> plant.careNotes || []))
                setCareNotes(
                    data.plants.map(plant => plant.careNotes || []).flat()
                    
                  )
                  

            })
            .catch(e => console.log(e))

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
            setAllCategories,
            careNotes,
            setCareNotes

        }}>
            {children}
        </AppContext.Provider>
    )

}


export default AppContext