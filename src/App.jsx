import { useState, useEffect } from "react";
import { auth,db } from "./firebase";
import { onAuthStateChanged  } from "firebase/auth";
import Login from "./login";
import Signup from "./signup";
import Customerdetails from "./customerdetails";
import Home from "./home";
import Mawa from "./mawa";
import Car from "./car";
import Carcusdetail from "./carcusdetail";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [user, setuser] = useState(null)
  const [loading, setloading] = useState(true)
useEffect(()=>{
let sub = onAuthStateChanged(auth, (current)=>{
  setuser(current)
  setloading(false)

})
return ()=> sub()
},[])

if (loading) return <p>Loading...</p>;
  return(
    <div>

 <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/home" />}
        />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" />}
        />

        {/* Protected Route */}
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
        <Route 
        path="/mawa"
        element = {user ? <Mawa /> : <Navigate to="/login" />}
        />
        <Route
        path="/customerdetails"
        element = {user? <Customerdetails /> : <Navigate to="/login"/>}
        />
        <Route
        path="/car"
        element = {user? <Car /> : <Navigate to="/login"/>}
        />
         <Route
        path="/carcusdetail/:id"
        element = {user? <Carcusdetail /> : <Navigate to="/login"/>}
        />
           <Route
        path="/customerdetails/:id"
        element = {user? <Customerdetails /> : <Navigate to="/login"/>}
        />

        {/* Default Route */}
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/login"} />}
        />

      </Routes>
    </BrowserRouter>
    </div>
  )
}
export default App
