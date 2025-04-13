/////////////////////////////////////

import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { AppProvider } from "./AppContext";
// import Signup from "./Signup";

import LandingPage from "./LandingPage";
import Login from "./Login";
import UserCategory from "./UserCategory";
import PlantForm from "./PlantForm";
import PlantDetailes from "./PlantDetailes";


function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/users/:user_id" element={<LandingPage />}/>
          <Route path="/users/categories/:categoryId" element={<UserCategory/> } /> 
          <Route path="/new_plant" element={<PlantForm/> } />
          <Route path="/plant/:plantId" element={<PlantDetailes/> } />
           
        </Routes>
      </Router>
    </AppProvider>
  )


}

export default App;
