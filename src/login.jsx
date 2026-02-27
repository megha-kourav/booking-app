import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";
function Login() {
  let provider = new GoogleAuthProvider()
    const [email, setemail] = useState("")
    const [pass, setpass] = useState("")

    let navigate = useNavigate()

   async function loginaccount() {
        try {
            await signInWithEmailAndPassword(auth, email, pass)
  alert("account logedIn successfully ✅")
            navigate("/home")
        } catch (error) {
            alert("information match nahi kar rahi database se")
        }
    }

   async function googlelogin() {
      try {
        await signInWithPopup(auth, provider)
        alert("login ho gya google se")
      } catch (error) {
        console.log("err aa raha hai bhai", error)
      }
    }

    return(
        <div className="login-container">

  <div className="login-card">
    <h2 className="login-title">Welcome Back</h2>

    <input
      type="email"
      placeholder="Enter your email"
      className="login-input"
      onChange={(e)=> setemail(e.target.value)}
      value={email}
    />

    <input
      type="password"
      placeholder="Enter your password"
      className="login-input"
      value={pass}
      onChange={(e)=> setpass(e.target.value)}
    />

    <button className="login-btn" onClick={loginaccount}>
      Login
    </button>

    <button className="google-btn" onClick={googlelogin}>
      Continue with Google
    </button>

    <p className="signup-text">
      Don’t have an account?
      <span className="signup-link" onClick={()=> {
navigate("/signup")
      }}> Sign Up</span>
    </p>
  </div>


</div>

    )
}
export default Login