import { useEffect, useState, useRef } from "react"
import { collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"
function Mawa() {
  let navigate = useNavigate()
  const popupRef = useRef(null);
  const [addpopup, setaddpopup] = useState(false)
  const [customername, setcustomername] = useState("")
  const [quantity, setquantity] = useState("")
  const [date, setdate] = useState("")
  const [customerdata, setcustomerdata] = useState([])
  const [dotspop, setdotspop] = useState(null)
  const [removepop, setremovepop] = useState(false)
  const [search, setsearch] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [price, setprice] = useState("")
  const [outline, setoutline] = useState(false)
  const [quantityoutline, setquantityoutline] = useState(false)
  const [priceoutline, setpriceoutline] = useState(false)
  const [dateoutline, setdateoutline] = useState(false)
  const [msgpop, setmsgpop] = useState(false)
  const [reminderList, setReminderList] = useState([]);
  const [nameedit, setnameedit] = useState("")
  const [nameeditpop, setnameeditpop] = useState(false)
  const [editingcustomer, seteditingcustomer] = useState(null)
  const [revcus, setrevcus] = useState(null)
  const [addmsgpop, setaddmsgpop] = useState(false)
  const [delmsgpop, setdelmsgpop] = useState(false)
  const [editmsgpop, seteditmsgpop] = useState(false)
    const [menupop, setmenupop] = useState(false)
  const [tom, settom] = useState([])
  const [aajkibookings, setaajkibookings] = useState([])
  const [complete, setcompleted] = useState([])
  const [profit, setprofit] = useState(0)
  const deletetimer = useRef(null)

     let user = auth.currentUser

useEffect(() => {
  if (!user || complete.length === 0) return;
  complete.forEach((booking) => {
    
    const now = new Date();
    const completedTime = new Date(booking.date);

    const diff = now - completedTime;

    if (diff > 24 * 60 * 60 * 1000) {
      deleteDoc(doc(db, "users", user.uid, "customer", booking.id));
    }
  });
}, [complete, user]);



    useEffect(() => {
    let completed = customerdata.filter(all => all.completed === true)
    setcompleted(completed)

  }, [customerdata])

    useEffect(()=>{
let num = complete.reduce((sum, item)=>{
  return sum + Number(item.price)
}, 0)
setprofit(num)
  },[complete])

  useEffect(() => {
  complete.forEach((booking) => {
    const now = new Date();
    const completedTime = new Date(booking.date);

    const diff = now - completedTime;

    if (diff > 24 * 60 * 60 * 1000) {
      deleteDoc(doc(db, "users", user.uid, "customer", booking.id));
    }
  });
}, []);


useEffect(() => {
  if (!customerdata || customerdata.length === 0) return;

    const aaj = new Date();
    aaj.setHours(0, 0, 0, 0);

    const kal = new Date(aaj);
    kal.setDate(aaj.getDate() + 1);

    const tombookings = customerdata.filter((all) => {
      const bookingDate = new Date(all.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === kal.getTime();
    });

      const aajkibooking = customerdata.filter((all) => {
      const bookingDate = new Date(all.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === aaj.getTime();
    });

    if (tombookings.length > 0) {
      settom(tombookings)
    }
    if (aajkibooking.length > 0) {
      setaajkibookings(aajkibooking)
    }

    
  const todayStr = new Date().toDateString();

  const alreadyShown = localStorage.getItem("reminderShown");

  if (alreadyShown === todayStr) return; // aaj already show ho chuka


  const tomorrowBookings = customerdata.filter((all) => {
    const bookingDate = new Date(all.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() === kal.getTime();
  });


    // if (tomorrowBookings.length > 0) {
    //   settom(tomorrowBookings)
    // }

  if (tomorrowBookings.length > 0) {
    setReminderList(tomorrowBookings);   // 👈 list store karo
    setmsgpop(true);                     // 👈 modal open
    localStorage.setItem("reminderShown", todayStr);
  
  }

}, [customerdata]);


  useEffect(() => {
    let filtered = customerdata.filter((all) => all.name.toLowerCase().includes(search.trim().toLowerCase()))
    setFilteredData(filtered)
  }, [search, customerdata])

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setdotspop(null);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

 
  async function customeradded() {
    if (!user || customername === "" || quantity === "" || date === "" || price === "") {
      
    setoutline(true)
    setTimeout(() => {
      setoutline(false)
    }, 2000);
      return;
    }
if (quantity <= 0) {
  setquantityoutline(true)
  setTimeout(() => {
    setquantityoutline(false)
  }, 2000);
  return;
}

if (price <= 0) {
  setpriceoutline(true)
  setTimeout(() => {
    setpriceoutline(false)
  }, 2000);
  return;
}

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let selecteddate = new Date(date)

if (selecteddate < today) {
  setdateoutline(true)
  setTimeout(() => {
    setdateoutline(false)
  }, 2000);
  return;
}

    setaddpopup(false)
    try {
      let data = {
        name: customername,
        quantity: quantity,
        price:price,
        date: date,
        completed: false
      }
      await addDoc(collection(db, "users", user.uid, "customer"), data)
   
      setaddpopup(false)
      setcustomername("")
      setprice("")
      setquantity("")
      setdate("")
         setaddmsgpop(true)
      setTimeout(() => {
        setaddmsgpop(false)
      }, 2000);

    } catch (error) {
      alert(error)
    }
  }

  async function completed(all) {
    if (!user) {
      return;
    }
    setdotspop(null)
    const ref = doc(db, "users", user.uid, "customer",all.id)
    await updateDoc(ref,{
      completed: !all.completed
    })
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const sub = onSnapshot(collection(db, "users", user.uid, "customer"), (snapshot) => {
      const cusdata = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setcustomerdata(cusdata)

    })

    return () => sub()
  }, [])

  async function deletefunc(cus) {
    if (!user) {
      return;
    }
  
    await deleteDoc(doc(db, "users", user.uid, "customer", cus.id))
    if (deletetimer.current) {
      clearTimeout(deletetimer.current)
    }
   
    setdelmsgpop(true)
   deletetimer.current =  setTimeout(() => {
      setdelmsgpop(false)
    }, 2000);
  }

  async function updatename(info) {
    if (!user || nameedit === info.name) {
      return;
    }
    setnameeditpop(false)
    const ref = doc(db, "users", user.uid, "customer",info.id)
    await updateDoc(ref,{
      name: nameedit
    })
  
    setnameedit("")

    seteditmsgpop(true)
     setTimeout(() => {
      seteditmsgpop(false)
    }, 2000);
  }
 

  return (
    <div className="mawa-page">

      {/* Fixed Header */}
      <header className="mawa-header" style={{ display: "flex", justifyContent: "space-between", padding: "15px", textAlign: "center", alignItems: "center" }}>
        <h2>Mawa Booking</h2>
        {
menupop ? <img src="cut.png" alt="cutpng" style={{ width: "35px", height: "35px", filter: "invert(0.8)" }} onClick={() => setmenupop(!menupop)}/> :
 <img src="menu.png" alt="menu" style={{ width: "35px", height: "35px", filter: "invert(0.8)" }} onClick={() => setmenupop(!menupop)} />
        }
        
      </header>
{menupop && (
  <div className="mawa-menu-dropdown">

    <details className="mawa-menu-item">
      <summary>📅 Today's Mawa Booking</summary>
        <ul className="carpage-sub-list">
              {aajkibookings ? aajkibookings.map(all => <li onClick={() => navigate(`/customerdetails/${all.id}`)} key={all.id}>{all.name}</li>) : <p>nothing..</p>}
            </ul>
    </details>

    <details className="mawa-menu-item">
      <summary>📆 Tomorrow's Mawa Booking</summary>
      <ul className="carpage-sub-list">
              {tom ? tom.map(all => <li onClick={() => navigate(`/customerdetails/${all.id}`)} key={all.id}>{all.name}</li>) : <p>nothing..</p>}
            </ul>

    </details>

    <details className="mawa-menu-item">
      <summary>✅ Completed Mawa Bookings</summary>
       <ul className="carpage-sub-list">
              {complete ? complete.map(all => <li onClick={() => navigate(`/customerdetails/${all.id}`)} key={all.id}>{all.name}</li>) : <p>nothing..</p>}
            </ul>
    </details>

    <details className="mawa-menu-item profit-item">
      <summary>💰 Total Profit</summary>
          <ul className="carpage-sub-list">
            {profit ? <li>{profit} ₹</li> : <p>nothing..</p> }
            </ul>
    </details>

  </div>
)}
      {/* Page Content */}
      <div className="mawa-content">


        <button className="add-mawa-btn" onClick={() => setaddpopup(true)}>
          ➕ Add Mawa Booking
        </button>

        <div className="search-box">
          <input onChange={(e) => setsearch(e.target.value)} type="text" placeholder="🔍 Search booking..." spellCheck={false} />
        </div>


        <div className="customer-list" >
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((all, ind) => {
              const today = new Date();
              const bookingDate = new Date(all.date);

              const diffTime = bookingDate - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return (
                <div className="customer-card" key={all.id} style={{
                  backgroundColor: all.completed
    ? "#16b60a" :
                  diffDays === 1
                    ? "#f96d6de8"
                    : diffDays === 0
                      ? "#f9dd6de8"
                      : "#d4d3d3",

                }} onClick={() => {
                  navigate(`/customerdetails/${all.id}`)

                }}>
                  <h3 style={{ color: diffDays === 1 ? "#f8f5f5e8" : diffDays === 0 ? "black" : "black" }}><span>{ind + 1}</span>. {all.name}</h3>
                  <img onClick={(e) => {
                    setdotspop(prev => prev === all.id ? null : all.id)
                    
                    e.stopPropagation()
                  }} src="three.png" style={{ width: "30px", display: "flex", justifyContent: "center", cursor: "pointer" }} alt="threeicon" />
                  
                  {dotspop == all.id && (
                    <div className="modal2" ref={popupRef} onClick={(e) => e.stopPropagation()} >
                      <button className="popup-btn" onClick={(e) => {
                        
                        setnameeditpop(true)
                        setnameedit(all.name)
                        seteditingcustomer(all)
                        e.stopPropagation()
                        setdotspop(null)
                      }}
                      >Edit <img src="edit.png" style={{ width: "18px" }} alt="" /></button>
                      <button onClick={(e) => {
                        setrevcus(all)
                        setremovepop(true)
                        e.stopPropagation()
                        setdotspop(null)
                      }} className="popup-btn"
                      >Remove <img src="remove.png" style={{ width: "20px" }} alt="" /></button>

                       <button onClick={(e) => {
                      e.stopPropagation()
                      completed(all)
                      }} className="popup-btn"
                      >{all.completed ? "UnCompleted 👎" : "Completed 👍"}</button>

                    </div>
                  )}
              


                </div>
              )

            })
          ) : (
            <p className="empty-text">Customer list is empty</p>
          )}
        </div>
        <button style={{ width: "100%" }} className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

      </div>

      {nameeditpop && editingcustomer && (
  <div className="mawa-nameedit-overlay">
    <div
      className="mawa-nameedit-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="mawa-nameedit-title">Edit Name</h2>

      <input
        type="text"
        className="mawa-nameedit-input"
        value={nameedit}
        onChange={(e) => setnameedit(e.target.value)}
      />

      <div className="mawa-nameedit-btn-wrapper">
        <button
          className="mawa-nameedit-done-btn"
          onClick={() => {
            updatename(editingcustomer)  
            seteditingcustomer(null)
          }}
        >
          Done
        </button>

        <button
          className="mawa-nameedit-cancel-btn"
          onClick={() => {
            setnameeditpop(false)
            seteditingcustomer(null)
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{addmsgpop && (
  <div className="addmsg-overlay">
    <div className="addmsg-box">
      <p>Customer Added ✅</p>
    </div>
  </div>
)}

{delmsgpop && (
  <div className="addmsg-overlay">
    <div className="addmsg-box">
      <p>Customer Deleted ✅</p>
    </div>
  </div>
)}

{editmsgpop && (
  <div className="addmsg-overlay">
    <div className="addmsg-box">
      <p>Name Edited ✅</p>
    </div>
  </div>
)}

    {removepop && revcus && (
                    <div className="rp-overlay" onClick={(e) => e.stopPropagation()} >
                      <div className="rp-modal" onClick={(e) => e.stopPropagation()} >
                        <h3 className="rp-title">Remove Customer</h3>
                        <p className="rp-text">
                          Are you sure to remove {revcus.name}?
                        </p>

                        <div className="rp-btn-group">
                          <button
                            className="rp-no-btn"
                            onClick={(e) => {
                              setremovepop(false)
                              setrevcus(null)
                              e.stopPropagation()
                            }}
                          >
                            No
                          </button>

                          <button
                            className="rp-yes-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              deletefunc(revcus)
                              
                              setrevcus(null)
                              setremovepop(false)
                            }}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

{msgpop && (
  <div className="reminder-overlay" onClick={(e) => e.stopPropagation()} >
    <div className="reminder-modal" onClick={(e) => e.stopPropagation()} >
      <h2>📢 Latest Bookings</h2>

      {reminderList.map((item, index) => (
        <div key={index} className="reminder-item">
          <p><strong>{index + 1}. {item.name}</strong></p>
          <p>Quantity: {item.quantity}kg</p>
          <p>Price: {item.price} ₹</p>
          <p>Date: {item.date}</p>
        </div>
      ))}

      <button
        className="reminder-ok-btn"
        onClick={() => setmsgpop(false)}
      >
        OK
      </button>
    </div>
  </div>
)}

      {addpopup && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()} >
          <div className="modal-box" onClick={(e) => e.stopPropagation()} >
            <span
              className="close-btn"
              onClick={() => setaddpopup(false)}
            >
              ❌
            </span>

            <h3 className="modal-title">Add Mawa Booking</h3>

            <div className="form-group">
              <label>Add Customer Name</label>
              <input style={{border: outline? "1px solid red": ""}} type="text" placeholder="Enter customer name" value={customername} onChange={(e) => setcustomername(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Add Mawa Quantity (kg)</label>
              <input style={{border: outline? "1px solid red": quantityoutline? "1px solid red" :"" }} type="number" placeholder="Enter quantity" value={quantity} onChange={(e) => setquantity(e.target.value)} />
            </div>

               <div className="form-group">
              <label>Add Mawa Price</label>
              <input style={{border: outline? "1px solid red": priceoutline ? "1px solid red": ""}} type="number" placeholder="Enter Mawa Price" value={price} onChange={(e) => setprice(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Add Date</label>
              <input style={{border: outline? "1px solid red": dateoutline ? "1px solid red" : ""}} type="date" value={date} onChange={(e) => setdate(e.target.value)} />
            </div>

            <button className="done-btn" onClick={() => {
              
              customeradded()
            }}>
              Done
            </button>

          </div>
        </div>
      )}

    </div>
  )
}
export default Mawa