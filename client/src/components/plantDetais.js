// import { useLocation, useNavigate } from "react-router-dom";
// import { useContext, useState } from "react";
// import AppContext from "./AppContext";
// import CareNoteForm from "./CareNoteForm";

// const PlantDetails = () => {
//     const { user, userCategories, setUserCategories } = useContext(AppContext)
//     const location = useLocation()
//     const plantId = location.state?.plantId
//     const categoryId = location.state?.categoryId
//     const navigate = useNavigate()
    

//     const plant = category.plants.find(p => p.id === Number(plantId))
//     const [careNotes, setCareNotes] = useState(plant.care_notes || [])
//     if (!user || !user.username || !plantId) {
//         return <p>Loading data.......plant detail page</p>
//     }

//     const category = userCategories.find(cat => cat.id === categoryId)
//     if (!category || !category.plants) {
//         return <p>Category or plants not found...</p>
//     }

//     if (!plant) {
//         return <p>Plant not found...</p>
//     }
    
//     const handleDelete = (plantIdToDelete) => {
//         fetch(`/plant/${plantIdToDelete}`, {
//             method: "DELETE",
//         })
//             .then(res => {
//                 if (!res.ok) throw new Error("Failed to delete plant.")
//                 return res.json()
//             })
//             .then(() => {
//                 const updatedPlants = category.plants.filter(p => p.id !== plantIdToDelete)

//                 if (updatedPlants.length > 0) {

//                     const updatedCategories = userCategories.map(cat =>
//                         cat.id === category.id ? { ...cat, plants: updatedPlants } : cat
//                     )
//                     setUserCategories(updatedCategories)
//                     navigate(`/users/categories/${category.id}`, {
//                         state: { categoryId: category.id },
//                     })
//                 } else {

//                     const updatedCategories = userCategories.filter(cat => cat.id !== category.id)
//                     setUserCategories(updatedCategories)
//                     navigate(`/users/${user.id}`)
//                 }
//             })
//             .catch(error => {
//                 console.error("Delete error:", error)
//             })
//     }

//     const onAddNote = (newNote) => {
//         setUserCategories(prevCats =>
//             prevCats.map(cat =>
//                 cat.id === categoryId
//                     ? {
//                         ...cat,
//                         plants: cat.plants.map(p =>
//                             p.id === plant.id
//                                 ? { ...p, care_notes: [...(p.care_notes || []), newNote] }
//                                 : p
//                         ),
//                     }
//                     : cat
//             )
//         )
//     }

//     function handleDeleteCareNote(careNoteId) {
//         console.log(`Deleting care note ${careNoteId} for plant ${plantId}`)

//         // const filteredCareNote = plant.care_notes.filter(note => note.id !== careNoteId)

//         fetch(`/plants/${plantId}/care_notes/${careNoteId}`, {
//             method: 'DELETE'
//         })
//             .then(res => {
//                 if (!res.ok) {
//                     throw new Error('Failed to fetch data.')
//                 } return res.json()
//             })
//             .then(() => {
//                 setCareNotes(prev => prev.filter(note => note.id !== careNoteId))


//             })
//             .catch(e => console.error(e))

//     }

//     return (
//         <div>
//             <h4>🌿 Plant: {plant.plant_name}</h4>
//             <h5>Category: {category.category_name}</h5>
//             <button onClick={() => handleDelete(plant.id)}>Delete: {plant.plant_name}</button>

//             <p>Care Notes:</p>
//             {plant.care_notes && plant.care_notes.length ? (
//                 plant.care_notes.map(note => (
//                     <ul key={note.id}>
//                         <li>Care Type: {note.care_type}</li>
//                         <li>Frequency: {note.frequency}</li>
//                         <li>Started Date: {note.starting_date}</li>
//                         <li>Upcoming Date: {note.next_care_date}</li>

//                         <button onClick={() => handleDeleteCareNote(note.id)}>Delete</button>
//                         <button>Edit</button>

//                     </ul>
//                 ))
//             ) : (
//                 <p>🌿 No care notes yet.</p>
//             )}

//             <div>

//                 <CareNoteForm plantId={plant.id} onAddNote={onAddNote} />

//             </div>
//         </div>
//     )
// }

// export default PlantDetails


import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AppContext from "./AppContext";
import CareNoteForm from "./CareNoteForm";

const PlantDetails = () => {
  const { user, userCategories, setUserCategories } = useContext(AppContext)
  const location = useLocation()
  const navigate = useNavigate()

  const plantId = location.state?.plantId
  const categoryId = location.state?.categoryId

  const category = userCategories.find(cat => cat.id === categoryId)
  const plant = category?.plants?.find(p => p.id === Number(plantId))

  // Safe default fallback: avoid using plant.care_notes until we're sure plant exists
  const initialCareNotes = plant?.care_notes || []
  const [careNotes, setCareNotes] = useState(initialCareNotes)

  if (!user || !user.username || !plantId) {
    return <p>Loading data.......plant detail page</p>
  }

  if (!category || !category.plants) {
    return <p>Category or plants not found...</p>
  }

  if (!plant) {
    return <p>Plant not found...</p>
  }

  const handleDelete = (plantIdToDelete) => {
    fetch(`/plant/${plantIdToDelete}`, {
      method: "DELETE",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete plant.")
        return res.json()
      })
      .then(() => {
        const updatedPlants = category.plants.filter(p => p.id !== plantIdToDelete)
        if (updatedPlants.length > 0) {
          const updatedCategories = userCategories.map(cat =>
            cat.id === category.id ? { ...cat, plants: updatedPlants } : cat
          )
          setUserCategories(updatedCategories)
          navigate(`/users/categories/${category.id}`, {
            state: { categoryId: category.id },
          })
        } else {
          const updatedCategories = userCategories.filter(cat => cat.id !== category.id)
          setUserCategories(updatedCategories)
          navigate(`/users/${user.id}`)
        }
      })
      .catch(error => {
        console.error("Delete error:", error)
      })
  }

  const onAddNote = (newNote) => {
    setCareNotes(prev => [...prev, newNote])

    setUserCategories(prevCats =>
      prevCats.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              plants: cat.plants.map(p =>
                p.id === plant.id
                  ? { ...p, care_notes: [...(p.care_notes || []), newNote] }
                  : p
              ),
            }
          : cat
      )
    )
  }

  const handleDeleteCareNote = (careNoteId) => {
    fetch(`/plants/${plantId}/care_notes/${careNoteId}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete care note")
        return res.json()
      })
      .then(() => {
        setCareNotes(prev => prev.filter(note => note.id !== careNoteId))

        setUserCategories(prevCats =>
          prevCats.map(cat =>
            cat.id === categoryId
              ? {
                  ...cat,
                  plants: cat.plants.map(p =>
                    p.id === plant.id
                      ? {
                          ...p,
                          care_notes: p.care_notes.filter(note => note.id !== careNoteId)
                        }
                      : p
                  ),
                }
              : cat
          )
        )
      })
      .catch(e => console.error(e))
  }

  return (
    <div>
      <h4>🌿 Plant: {plant.plant_name}</h4>
      <h5>Category: {category.category_name}</h5>
      <button onClick={() => handleDelete(plant.id)}>
        Delete: {plant.plant_name}
      </button>

      <p>Care Notes:</p>
      {careNotes.length ? (
        careNotes.map(note => (
          <ul key={note.id}>
            <li>Care Type: {note.care_type}</li>
            <li>Frequency: {note.frequency}</li>
            <li>Started Date: {note.starting_date}</li>
            <li>Upcoming Date: {note.next_care_date}</li>
            <button onClick={() => handleDeleteCareNote(note.id)}>Delete</button>
            <button>Edit</button>
          </ul>
        ))
      ) : (
        <p>🌿 No care notes yet.</p>
      )}

      <div>
        <CareNoteForm plantId={plant.id} onAddNote={onAddNote} />
      </div>
    </div>
  )
}

export default PlantDetails
