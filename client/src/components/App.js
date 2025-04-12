/////////////////////////////////////

import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { AppProvider } from "./AppContext";
// import Signup from "./Signup";

// import LandingPage from "./LandingPage";
import Login from "./Login";
// import UserCategory from "./UserCategory";
// import PlantForm from "./PlantForm";


function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/users/:user_id" element={<LandingPage />} />
          <Route path="/users/categories/:categoryId" element={<UserCategory/> } /> */}
          {/* <Route path="/plants" element={<PlantForm/> } /> */}
           
        </Routes>
      </Router>
    </AppProvider>
  )


}

export default App;
