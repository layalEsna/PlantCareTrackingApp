/////////////////////////////////////

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppContext";
import Signup from "./Signup";

import LandingPage from "./LandingPage";
import Login from "./Login";
import UserCategory from "./UserCategory";
import PlantForm from "./PlantForm";
import PlantDetails from "./plantDetais";
import CareNoteForm from "./CareNoteForm";
import Logout from "./Logout";
import NewCategory from "./NewCategory";



function App() {
  return (
    <AppProvider>
      <Router>

        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />


          {/* <Route path="/" element={<LandingPage />} /> */}


          <Route path="/categories/:categoryId/plants" element={<UserCategory />} />


          <Route path="/plants/new" element={<PlantForm />} />

          <Route path="/plants/:plantId" element={<PlantDetails />} />

          <Route path="/care_notes/new" element={<CareNoteForm />} />
          <Route path="/categories/new" element={<NewCategory />} />

        </Routes>



      </Router>
    </AppProvider>
  )


}

export default App;


