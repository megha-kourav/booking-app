import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Home() {
    const [logoutalert, setlogoutalert] = useState(false)
    let navigate = useNavigate()
   async function logoutaccount() {
        await signOut(auth)
        navigate("/signup")
        alert("logout ho gya")
    }
    return(
<div className="home-container">

  <header className="home-header">
    <img src="logo.png" alt="logo" className="home-logo" />
  </header>

  <div className="home-main">

    <button className="home-btn mawa-btn" onClick={()=> navigate("/mawa")}>
      🧀 Mawa Booking
    </button>

    <button className="home-btn car-btn" onClick={()=> navigate("/car")}>
      🚗 Car Booking
    </button>

  </div>

  <div className="logout-section">
    <button onClick={()=>{
       
        setlogoutalert(true)
    }} className="logout-btn">
      Logout
    </button>
  </div>

   {logoutalert && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="popup-buttons">
              <button
                className="cancel-btn"
                onClick={() => setlogoutalert(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={logoutaccount}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

</div>
    )
}
export default Home