import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAccount from "./CreateAccount.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./Login.jsx";
import ForgetPassword from "./ForgetPassword.jsx"; 
import AdminLandingPage from "./AdminLandingPage.jsx";
import Visitors from "./Visitors.jsx";
import RatiosAndSizes from "./RatiosAndSizes.jsx";
import NewMeal from "./NewMeal.jsx";
import CookMode from "./CookMode.jsx";
import Message from "./AdminSms.jsx";
import ManageUsers from "./ManageUsers.jsx";
import './index.css';


function App() {
  return (
    <Router>
      <Header />
      <Routes basename="/CookingMs">
        <Route path="/" element={<Login />} /> 
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/admin" element={<AdminLandingPage />} />
        <Route path="/admin/visitors" element={<Visitors />} />
        <Route path="/admin/ratio-and-sizes" element={<RatiosAndSizes />} />
        <Route path="/admin/add-new-meal" element={<NewMeal />} />
        <Route path="/admin/cook-mode" element={<CookMode />} />
        <Route path="/admin/message" element={<Message />} />
        <Route path="/admin/mngUsers" element={<ManageUsers />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

