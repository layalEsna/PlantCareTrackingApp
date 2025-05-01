import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();
 

export const AppProvider = ({ children }) => {
     const [user, setUser] = useState(null)
    // const [user, setUser] = useState({
    //     usrname: ''
    // })
    const [userCategories, setUserCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
    fetch('/check_session')
            .then(res => {
                if (res.status === 401) {
                    setUser(null)
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (!data) return
                setUser(data)
                setUserCategories(data.categories || [])
            })
            .catch(err => {
                console.error('Error fetching session:', err)
                setUser(null)
            })
            .finally(() => setLoading(false))

    }, [])

    

    useEffect(() => {
        fetch('/categories')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch categories')
                return res.json()
            })
            .then(data => setAllCategories(data))
            .catch(err => console.error(err))
    }, [])

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            userCategories,
            setUserCategories,
            allCategories,
            setAllCategories,
            loading,
           
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext






// import React, { createContext, useState, useEffect } from 'react'

// //class
// const AppContext = createContext()

// export const AppProvider = ({ children }) => {

  


//     const [user, setUser] = useState({
//         username: ''
//     })
   

//     const [userCategories, setUserCategories] = useState([])
//     const [allCategories, setAllCategories] = useState([])
//     // const [loading, setLoading] = useState(true)

//     function fetchUserData() {
        
//         fetch('/check_session')
//             .then(res => {
//                 if (!res.ok) {
//                     throw new Error('failed to fetch data.')
//                 }return res.json()
//             })
//             .then(data => {
//                 console.log('➡️user cats', data)
//                 setUser(data)
              
//                 setUserCategories(data.categories)
//             })
//             .catch(e => console.error(e))
           
            
//     }


    
    

    
//     useEffect(() => {
//         fetchUserData()
//     }, [])

//     useEffect(() => {
//         fetch('/categories')
//             .then(res => {
//                 if (!res.ok) {
//                     throw new Error('Failed to fetch data.')
//                 } return res.json()
//             })
//             .then(data => {
//                 setAllCategories(data)
//                 //
//                 //  console.log('➡️all cats', data)
//             })
            
//             .catch()
//     }, [])

//     return (
//         <AppContext.Provider value={{
//             user,
//             setUser,
          
//             userCategories,
//             fetchUserData,
           
//             setUserCategories,
//             allCategories,
//             setAllCategories,
            
           

//         }}>
//             {children}
//         </AppContext.Provider>
//     )

// }


// export default AppContext