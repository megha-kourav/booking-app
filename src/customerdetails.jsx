import { useState, useEffect } from "react";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate, useParams } from "react-router-dom";

function Customerdetails() {

  let navigate = useNavigate()
  let user = auth.currentUser
  let { id } = useParams()

  const [customer, setCustomer] = useState(null)

  const [priceinput, setPriceinput] = useState("")
  const [quantityinput, setQuantityinput] = useState("")
  const [dateedit, setDateedit] = useState("")

  const [pricepop, setpricepop] = useState(false)
  const [editquantitypop, seteditquantitypop] = useState(false)
  const [datepop, setdatepop] = useState(false)

  const [pricemsg, setpricemsg] = useState(false)
  const [quantitymsg, setquantitymsg] = useState(false)
  const [datemsg, setdatemsg] = useState(false)

  // 🔥 ID se real-time fetch
  useEffect(() => {
    if (!user || !id) return;

    const unsub = onSnapshot(
      doc(db, "users", user.uid, "customer", id),
      (snapshot) => {
        if (snapshot.exists()) {
          setCustomer({ id: snapshot.id, ...snapshot.data() })
        }
      }
    )

    return () => unsub()

  }, [user, id])


  if (!customer) return <p>Loading...</p>


  // 🔹 Quantity Update
  async function editquantity() {
    if (!quantityinput) return;

    const newQty = Number(customer.quantity) + Number(quantityinput)
    if (newQty < 0) return alert("Invalid Quantity")

    await updateDoc(
      doc(db, "users", user.uid, "customer", customer.id),
      { quantity: newQty }
    )

    seteditquantitypop(false)
    setQuantityinput("")
    setquantitymsg(true)
    setTimeout(() => setquantitymsg(false), 2000)
  }


  // 🔹 Price Update
  async function updateprice() {
    if (!priceinput) return;

    const newPrice = Number(customer.price) + Number(priceinput)
    if (newPrice < 0) return alert("Invalid Price")

    await updateDoc(
      doc(db, "users", user.uid, "customer", customer.id),
      { price: newPrice }
    )

    setpricepop(false)
    setPriceinput("")
    setpricemsg(true)
    setTimeout(() => setpricemsg(false), 2000)
  }


  // 🔹 Date Update
  async function updatedate() {
    if (!dateedit) return;

    const today = new Date()
    today.setHours(0,0,0,0)

    if (new Date(dateedit) < today)
      return alert("Invalid Date")

    await updateDoc(
      doc(db, "users", user.uid, "customer", customer.id),
      { date: dateedit }
    )

    setdatepop(false)
    setdatemsg(true)
    setTimeout(() => setdatemsg(false), 2000)
  }


  const today = new Date()
  const bookingDate = new Date(customer.date)
  const diffDays = Math.ceil((bookingDate - today) / (1000*60*60*24))


  return (

    <div className="customer-page">

      <header className="mawa-header">
        <h2>Mawa Booking</h2>
      </header>

      <p className="days-remaining">{diffDays} day's remaining</p>

      <div className="customer-card2">

        <h1 className="customer-name">{customer.name}</h1>

        <div className="customer-item">
          <p>🧀 Mawa Quantity: {customer.quantity} kg</p>
          <span onClick={() => seteditquantitypop(true)} className="edit-emoji">➕</span>
        </div>

        <div className="customer-item">
          <p>💸 Price : {customer.price} ₹</p>
          <span onClick={() => setpricepop(true)} className="edit-emoji">➕</span>
        </div>

        <div className="customer-item">
          <p>📅 Date: {customer.date}</p>
          <span onClick={() => {
            setdatepop(true)
            setDateedit(customer.date)
          }} className="edit-emoji">➕</span>
        </div>

      </div>

      {/* Quantity Popup */}
      {editquantitypop && (
        <div className="eqp-overlay">
          <div className="eqp-modal">
            <h3 style={{textAlign:"center"}}>Edit mawa quantity {customer.quantity} kg</h3>
            <input
              type="number"
              value={quantityinput}
              onChange={(e)=>setQuantityinput(e.target.value)}
            />
            <button onClick={editquantity}>Done</button>
            <button onClick={()=>seteditquantitypop(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Price Popup */}
      {pricepop && (
        <div className="dp-overlay">
          <div className="dp-modal">
            <h3 style={{textAlign:"center"}}>Edit mawa price {customer.price}₹</h3>
            <input
              type="number"
              value={priceinput}
              onChange={(e)=>setPriceinput(e.target.value)}
            />
            <button onClick={updateprice}>Done</button>
            <button onClick={()=>setpricepop(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Date Popup */}
      {datepop && (
        <div className="dp-overlay">
          <div className="dp-modal">
            <h3 style={{textAlign:"center"}}>Edit mawa date {customer.date}</h3>
            
            <input
              type="date"
              value={dateedit}
              onChange={(e)=>setDateedit(e.target.value)}
            />
            <button onClick={updatedate}>Done</button>
            <button onClick={()=>setdatepop(false)}>Cancel</button>
          </div>
        </div>
      )}

      {quantitymsg && <p>Quantity Updated ✅</p>}
      {pricemsg && <p>Price Updated ✅</p>}
      {datemsg && <p>Date Updated ✅</p>}

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

    </div>
  )
}

export default Customerdetails