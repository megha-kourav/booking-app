import { createUserWithEmailAndPassword  } from "firebase/auth"; 
import { auth } from "./firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  let navigate = useNavigate()
const [email, setemail] = useState("")
const [pass, setpass] = useState("")

async function createaccount() {
try {
  await createUserWithEmailAndPassword(auth, email, pass)
alert("account created ✅")
  navigate("/home")


} catch (error) {
  if (pass.length < 6) {
    alert("6 ya 6 se jyda ka pass dalo")
    return;
  }
  alert("invalid email")
}
}

    return(
       <div className="signup-container">
  <div className="signup-card">
    <h2 className="signup-title">Create Account</h2>

    <input
      type="email"
      placeholder="Enter your email"
      className="signup-input"
      value={email}
      onChange={(e)=> setemail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Enter your password"
      className="signup-input"
      value={pass}
      onChange={(e)=> setpass(e.target.value)}
    />

    <button className="signup-btn" onClick={createaccount}>
      Sign Up
    </button>

    <p className="login-text">
      Already have an account?
      <span className="login-link" onClick={()=>{
   navigate("/login");
   
      }}> Login</span>
    </p>
  </div>

</div>
    )
}
export default Signup