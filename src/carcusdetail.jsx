import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { auth, db } from "./firebase"
import { useNavigate } from "react-router-dom"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"

function Carcusdetail() {
let navigate = useNavigate()
  const [pricepop, setpricepop] = useState(false)
  const [newprice, setnewprice] = useState("")
  const [customer, setcustomer] = useState([])
  const [dateedit, setdateedit] = useState("")
  const [datepop, setdatepop] = useState(false)
  const [careditpop, setcareditpop] = useState(false)
  const [carinput, setcarinput] = useState("")
  const [pricemsg, setpricemsg] = useState(false)
  const [datemsg, setdatemsg] = useState(false)
  const [carmsg, setcarmsg] = useState(false)

  let { id } = useParams()
  let user = auth.currentUser

  const today = new Date();
  const bookingDate = new Date(customer.Date);
  const diffTime = bookingDate - today; // milliseconds
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  useEffect(() => {
    if (!user || !id) return;
    const sub = onSnapshot(
      doc(db, "users", user.uid, "carbookings", id), (snapshot) => {
        if (snapshot.exists()) {
          setcustomer({ id: snapshot.id, ...snapshot.data() })
        }
      }
    )
    return () => sub()

  }, [user, id])

  if (!customer) {
    return <p>loading...</p>
  }

  async function editprice(cus) {
    if (!user || newprice === "") {
      return;
    }
     
 const nayaprice = Number(cus.price) + Number(newprice)
   if (nayaprice < 0) {
    alert("invalid amount")
    return;
   }

    setpricepop(false)
const ref = doc(db, "users", user.uid, "carbookings", cus.id)
await updateDoc(ref,{
  price: nayaprice
})
setpricemsg(true)
setTimeout(() => {
  setpricemsg(false)
}, 2000);

setnewprice("")

  }

  async function dateeditfun(cus) {
    if (!user || dateedit === "") {
      return;
    }
    if (dateedit === cus.Date) {
      setdatepop(false)
      return;
    }

  const today = new Date();
    today.setHours(0, 0, 0, 0);
let selecteddate = new Date(dateedit)
if (selecteddate < today ) {
  alert("invalid date")
  return;
}
    setdatepop(false)
    const ref = doc(db, "users", user.uid, "carbookings", cus.id)
    await updateDoc(ref,{
      Date: dateedit
    })
    setdatemsg(true)
    setTimeout(() => {
      setdatemsg(false)
    }, 2000);
  setdateedit("")
  }

  async function editcar(cus) {
    if (!user || carinput === "") {
      return;
    }
    if (carinput === cus.car) {
      setcareditpop(false)
      return;
    }
    setcareditpop(false)
    const ref = doc(db, "users", user.uid, "carbookings", cus.id)
    await updateDoc(ref,{
      car: carinput
    })
    setcarmsg(true)
    setInterval(() => {
      setcarmsg(false)
    }, 2000);
    setcarinput("")

  }

  return (
    <>
    <div className="cardetail-wrapper-xt92kq">
 <p className="days-remaining">{diffDays} day's remaining</p>
      <h2 className="cardetail-name-xt92kq">
        {customer.name}
      </h2>

      <div className="cardetail-row-xt92kq">
        <span className="cardetail-label-xt92kq">Price</span>
        <div className="cardetail-valuebox-xt92kq">
          <span className="cardetail-value-xt92kq">
            ₹ {customer.price}
          </span>
          <span onClick={() => setpricepop(true)} className="cardetail-plus-xt92kq">➕</span>
        </div>
      </div>

      <div className="cardetail-row-xt92kq">
        <span className="cardetail-label-xt92kq">Date</span>
        <div className="cardetail-valuebox-xt92kq">
          <span className="cardetail-value-xt92kq">
            {customer.Date}
          </span>
          <span onClick={()=> {
            setdatepop(true)
            setdateedit(customer.Date)
          }} className="cardetail-plus-xt92kq">➕</span>
        </div>
      </div>

      <div className="cardetail-row-xt92kq">
        <span className="cardetail-label-xt92kq">Car</span>
        <div className="cardetail-valuebox-xt92kq">
          <span className="cardetail-value-xt92kq">
            {customer.car}
          </span>
          <span onClick={()=> setcareditpop(true)} className="cardetail-plus-xt92kq">➕</span>
        </div>
      </div>
 <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="carpage-back-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </div>
    </div>

    {pricepop && (
  <div
    className="priceedit-overlay-z41kp"
   
  >
    <div
      className="priceedit-modal-z41kp"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="priceedit-title-z41kp">
        Edit booking price ₹ {customer.price}
      </h2>

      <input
        type="number"
        placeholder="Enter new price"
        className="priceedit-input-z41kp"
        
        value={newprice}
        onChange={(e)=> setnewprice(e.target.value)}
      />

      <div className="priceedit-btnwrap-z41kp">
        <button
          className="priceedit-btn-cancel-z41kp"
          onClick={() => setpricepop(false)}
        >
          Cancel
        </button>

        <button className="priceedit-btn-done-z41kp" onClick={()=> editprice(customer)}>
          Done
        </button>
      </div>
    </div>
  </div>
)}

{datepop && (
  <div
    className="dateedit-overlay-k82lm"
  
  >
    <div
      className="dateedit-modal-k82lm"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="dateedit-title-k82lm">
        Edit Booking Date
      </h2>

      <input
        type="date"
        className="dateedit-input-k82lm"
        value={dateedit}
        onChange={(e)=> setdateedit(e.target.value)}
      />

      <div className="dateedit-btnwrap-k82lm">
        <button
          className="dateedit-btn-cancel-k82lm"
          onClick={() => setdatepop(false)}
        >
          Cancel
        </button>

        <button className="dateedit-btn-done-k82lm" onClick={()=> dateeditfun(customer)}>
          Done
        </button>
      </div>
    </div>
  </div>
)}

 


{careditpop && (
  <div
    className="carbook-overlay-m91rt"
    
  >
    <div
      className="carbook-modal-m91rt"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="carbook-title-m91rt">
        Edit Car For Booking
      </h2>

      <select className="carbook-select-m91rt" value={carinput} onChange={(e)=> setcarinput(e.target.value)}>
        <option value="">Choose Car</option>
        <option value="ECCO">ECCO</option>
        <option value="BOLERO">BOLERO</option>
        <option value="BOTH">BOTH</option>
      </select>

      <div className="carbook-btnwrap-m91rt">
        <button
          className="carbook-btn-cancel-m91rt"
          onClick={() => {
            setcareditpop(false)
            setcarinput("")
          }}
        >
          Cancel
        </button>

        <button className="carbook-btn-done-m91rt" onClick={()=> editcar(customer)}>
          Done
        </button>
      </div>
    </div>
  </div>
)}

      {pricemsg && (
  <div className="addmsg-overlay">
    <div className="addmsg-box">
      <p>Price updated ✅</p>
    </div>
  </div>
)}

      {datemsg && (
  <div className="addmsg-overlay">
    <div className="addmsg-box">
      <p>Date updated ✅</p>
    </div>
  </div>
)}

      {carmsg && (
  <div className="addmsg-overlay">
    <div className="addmsg-box">
      <p>Car Selected ✅</p>
    </div>
  </div>
)}

    </>
  )
}
export default Carcusdetail