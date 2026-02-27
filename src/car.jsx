import { useState, useEffect, useRef } from "react"
import { collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import { useNavigate } from "react-router-dom"


import "./car.css"

function Car() {
  let user = auth.currentUser
  const popupRef = useRef(null)
  const [carbooking, setcarbooking] = useState([])
  const [date, setdate] = useState("")
  const [filteddata, setfiltereddata] = useState([])
  const [carbookingpop, setcarbookingpop] = useState(false)
  const [carbookinginput, setcarbookinginput] = useState("")
  const [price, setprice] = useState("")
  const [carselected, setcarselected] = useState("")
  const [search, setsearch] = useState("")
  const [dotspop, setdotspop] = useState(null)
  const [editpop, seteditpop] = useState(false)
  const [editcustomer, seteditcustomer] = useState(null)
  const [nameinput, setnameinput] = useState("")
  const [delcustomer, setdelcustomer] = useState(null)
  const [delpop, setdelpop] = useState(false)
  const deletetimer = useRef(null)
  const [delmsgpop, setdelmsgpop] = useState(false)
  const [editedmsg, seteditedmsg] = useState(false)
  const [addmsg, setaddmsg] = useState(false)
  const [remider, setreminder] = useState([])
  const [reminderpop, setreminderpop] = useState(false)
  const [menupop, setmenupop] = useState(false)
  const [tom, settom] = useState([])
  const [aajkibookings, setaajkibookings] = useState([])
  const [completed, setcompleted] = useState([])
  const [profit, setprofit] = useState(0)

useEffect(() => {
  if (!user || completed.length === 0) return;
  completed.forEach((booking) => {
    
    const now = new Date();
    const completedTime = new Date(booking.Date);

    const diff = now - completedTime;

    if (diff > 24 * 60 * 60 * 1000) {
      deleteDoc(doc(db, "users", user.uid, "carbookings", booking.id));
    }
  });
}, [completed, user]);

  let navigate = useNavigate()

  useEffect(()=>{
let num = completed.reduce((sum, item)=>{
  return sum + Number(item.price)
}, 0)
setprofit(num)
  },[completed])


  useEffect(() => {
    let completed = carbooking.filter(all => all.completed === true)
    setcompleted(completed)

  }, [carbooking])


  useEffect(() => {
    if (!carbooking || carbooking.length === 0) return;

    const aaj = new Date();
    aaj.setHours(0, 0, 0, 0);

    const kal = new Date(aaj);
    kal.setDate(aaj.getDate() + 1);

    const tombookings = carbooking.filter((all) => {
      const bookingDate = new Date(all.Date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === kal.getTime();
    });

    const kalkibooking = carbooking.filter((all) => {
      const bookingDate = new Date(all.Date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === aaj.getTime();
    });
    if (kalkibooking.length > 0) {
      setaajkibookings(kalkibooking)

    }

    if (tombookings.length > 0) {
      settom(tombookings)
    }

    const todayStr = new Date().toDateString();

    const alreadyShown = localStorage.getItem("bookingreminder");

    if (alreadyShown === todayStr) return; // aaj already show ho chuka

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowBookings = carbooking.filter((all) => {
      const bookingDate = new Date(all.Date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === tomorrow.getTime();
    });

    if (tomorrowBookings.length > 0) {
      setreminder(tomorrowBookings);   // 👈 list store karo

      setreminderpop(true);                     // 👈 modal open
      localStorage.setItem("bookingreminder", todayStr);
    }


  }, [carbooking]);



  async function addbooking() {
    if (!user || carbookinginput === "" || price === "" || carselected === "" || date === "") {
      return;
    }

    try {
      let data = {
        name: carbookinginput,
        Date: date,
        price: price,
        car: carselected,
        completed: false
      }
      setcarbookingpop(false)
      await addDoc(collection(db, "users", user.uid, "carbookings"), data)
      setaddmsg(true)
      setTimeout(() => {
        setaddmsg(false)
      }, 2000);
      setcarbookinginput("")
      setcarselected("")
      setdate("")
      setprice("")

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!user) {
      return;
    }
    let data = onSnapshot(collection(db, "users", user.uid, "carbookings"), (snapshot) => {
      const cusdata = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()

      }))
      setcarbooking(cusdata)
    })
    return () => data()

  }, [])

  useEffect(() => {
    let filter = carbooking.filter(all => all.name.toLowerCase().includes(search.trim().toLowerCase()))
    setfiltereddata(filter)
  }, [search, carbooking])


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

  async function editcusname(currentcus) {
    if (!user || currentcus.name === nameinput) {
      return;
    }
    const ref = doc(db, "users", user.uid, "carbookings", currentcus.id)
    await updateDoc(ref, {
      name: nameinput
    })
    setnameinput("")
    seteditedmsg(true)
    setTimeout(() => {
      seteditedmsg(false)
    }, 2000);
  }

  async function revcustomer(revcus) {
    if (!user) {
      return;
    }

    await deleteDoc(doc(db, "users", user.uid, "carbookings", revcus.id))
    if (deletetimer.current) {
      clearTimeout(deletetimer.current)
    }
    setdelmsgpop(true)
    deletetimer.current = setTimeout(() => {
      setdelmsgpop(false)
    }, 2000);

  }

  async function completedfunc(cus) {
    if (!user) {
      return;
    }
    setdotspop(false)
    const ref = doc(db, "users", user.uid, "carbookings", cus.id)
    await updateDoc(ref, {
      completed: !cus.completed
    })
  }


  return (
    <div className="carpage-main-wrapper">


      <div className="carpage-header-fixed" style={{ display: "flex", justifyContent: "space-between", padding: "15px", textAlign: "center", alignItems: "center" }}>
        <h2>Car Bookings</h2>
               {
menupop ? <img src="cut.png" alt="cutpng" style={{ width: "35px", height: "35px", filter: "invert(0.8)" }} onClick={() => setmenupop(!menupop)}/> :
 <img src="menu.png" alt="menu" style={{ width: "35px", height: "35px", filter: "invert(0.8)" }} onClick={() => setmenupop(!menupop)} />
        }
      </div>
      {menupop && (
        <div className="carpage-menu-popup">

          {/* Today Bookings */}
          <details className="carpage-details">
            <summary className="carpage-summary">Today's Bookings</summary>
            <ul className="carpage-sub-list">
              {aajkibookings ? aajkibookings.map(all => <li onClick={() => navigate(`/carcusdetail/${all.id}`)} key={all.id}>{all.name}</li>) : <p>nothing..</p>}
            </ul>
          </details>

          {/* Tomorrow Bookings */}
          <details className="carpage-details">
            <summary className="carpage-summary">Tomorrow's Bookings</summary>
            <ul className="carpage-sub-list">
              {tom ? tom.map(all => <li onClick={() => navigate(`/carcusdetail/${all.id}`)} key={all.id}>{all.name}</li>) : <p>nothing..</p>}
            </ul>
          </details>

          {/* Completed */}
          <details className="carpage-details">
            <summary className="carpage-summary">Completed Bookings</summary>
            <ul className="carpage-sub-list">
              {completed ? completed.map(all => <li onClick={() => navigate(`/carcusdetail/${all.id}`)} key={all.id}>{all.name}</li>) : <p style={{ color: "white" }}>nothing..</p>}
            </ul>
          </details>

 <details className="carpage-details">
            <summary className="carpage-summary">Total profit</summary>
            <ul className="carpage-sub-list">
              <li>{profit} ₹</li>
            </ul>
          </details>

        </div>
      )}

      <div className="carpage-content-area">

        <button className="carpage-add-btn" onClick={() => {
          setcarbookingpop(true)
        }}>
          ➕ Add Car Booking
        </button>

        <input
          type="text"
          placeholder="Search Car Booking..."
          className="carpage-search-input"
          spellCheck="false"

          value={search}

          onChange={(e) => setsearch(e.target.value)}
        />

      </div>

      {filteddata.length > 0 ? (
        filteddata.map((all) => {

          const today = new Date();
          const bookingDate = new Date(all.Date);

          const diffTime = bookingDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return (

            <div style={{
              backgroundColor: all.completed
                ? "#16b60a" :
                diffDays === 1
                  ? "#f96d6de8"
                  : diffDays === 0
                    ? "#f9dd6de8"
                    : "#d4d3d3",
            }} className="custlist-card-x91ab" key={all.id} onClick={() => navigate(`/carcusdetail/${all.id}`)}>
              <h2 className="custlist-name-x91ab">{all.name}</h2>

              <img
                src="three.png"
                alt="customer"
                className="custlist-img-x91ab"
                onClick={(e) => {
                  setdotspop(prev => prev === all.id ? null : all.id)
                  e.stopPropagation()
                }}
              />
              {dotspop === all.id && (
                <div className="custdots-popup-x92pql" ref={popupRef} onClick={(e) => e.stopPropagation()}>

                  <button className="custdots-btn-x92pql edit-x92pql" onClick={() => {
                    seteditcustomer(all)
                    setnameinput(all.name)
                    seteditpop(true)
                    setdotspop(null)
                  }}>
                    ✏&nbsp;&nbsp;Edit
                  </button>

                  <button className="custdots-btn-x92pql remove-x92pql" onClick={() => {
                    setdelpop(true)
                    setdelcustomer(all)
                    setdotspop(null)

                  }}>
                    🗑 &nbsp;Remove
                  </button>

                  <button className="custdots-btn-x92pql complete-x92pql" onClick={() => completedfunc(all)}>
                    ✔ &nbsp;{all.completed ? "UnCompleted 👎" : "Completed 👍"}
                  </button>

                </div>
              )}
            </div>

          );
        })
      ) : (
        <p className="custlist-empty-x91ab">Customer list is empty</p>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="carpage-back-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </div>

      {delmsgpop && (
        <div className="addmsg-overlay">
          <div className="addmsg-box">
            <p>Customer Deleted ✅</p>
          </div>
        </div>
      )}

      {editedmsg && (
        <div className="addmsg-overlay">
          <div className="addmsg-box">
            <p>Name Edited ✅</p>
          </div>
        </div>
      )}

      {addmsg && (
        <div className="addmsg-overlay">
          <div className="addmsg-box">
            <p>Customer Added ✅</p>
          </div>
        </div>
      )}


      {carbookingpop && (
        <div className="carbooking-simple-overlay-91x">
          <div
            className="carbooking-simple-modal-91x"
            onClick={(e) => e.stopPropagation()}
          >

            <span
              className="carbooking-simple-close-91x"
              onClick={() => setcarbookingpop(false)}
            >
              ❌
            </span>

            <h2 className="carbooking-simple-title-91x">
              Add Car Bookings
            </h2>

            <input
              type="text"
              placeholder="Enter Customer Name"
              className="carbooking-simple-input-91x"

              value={carbookinginput}
              onChange={(e) => setcarbookinginput(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter Booking Price"
              className="carbooking-simple-input-91x"

              value={price}
              onChange={(e) => setprice(e.target.value)}
            />

            <input
              type="date"
              className="carbooking-simple-input-91x"

              value={date}
              onChange={(e) => setdate(e.target.value)}
            />

            <select className="carbooking-simple-input-91x" value={carselected} onChange={(e) => setcarselected(e.target.value)}>
              <option value="">Select Car Type</option>
              <option value="ECCO">ECCO</option>
              <option value="BOLERO">BOLERO</option>
              <option value="BOTH">BOTH</option>
            </select>

            <button className="carbooking-simple-btn-91x" onClick={addbooking}>
              Done
            </button>
          </div>
        </div>
      )}


      {editpop && editcustomer && (
        <div
          className="editcust-overlay-x7a91"
        >
          <div
            className="editcust-modal-x7a91"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="editcust-title-x7a91">
              Name Edit
            </h2>

            <input
              type="text"
              spellCheck="false"
              placeholder="Edit customer name"
              value={nameinput}
              className="editcust-input-x7a91"
              onChange={(e) => setnameinput(e.target.value)}
            />

            {/* Button Wrapper */}
            <div className="editcust-btnwrap-x7a91">
              <button
                className="editcust-btn-cancel-x7a91"
                onClick={() => seteditpop(false)}
              >
                Cancel
              </button>

              <button className="editcust-btn-done-x7a91" onClick={() => {
                editcusname(editcustomer)
                seteditpop(false)
              }}>
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {delpop && delcustomer && (
        <div
          className="delcust-overlay-q81xz"

        >
          <div
            className="delcust-modal-q81xz"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="delcust-title-q81xz">
              Are you sure to remove {delcustomer.name}?
            </h2>

            <div className="delcust-btnwrap-q81xz">
              <button
                className="delcust-btn-no-q81xz"
                onClick={() => setdelpop(false)}
              >
                No
              </button>

              <button className="delcust-btn-yes-q81xz" onClick={() => {
                revcustomer(delcustomer)
                setdelpop(false)
              }}>
                Yes
              </button>
            </div>

          </div>
        </div>
      )}


      {reminderpop && (
        <div className="reminder-overlay" onClick={(e) => e.stopPropagation()} >
          <div className="reminder-modal" onClick={(e) => e.stopPropagation()} >
            <h2>📢 Latest Bookings</h2>

            {remider.map((item, index) => (
              <div key={index} className="reminder-item">
                <p><strong>{index + 1}. {item.name}</strong></p>
                <p>Price: {item.price} ₹</p>
                <p>Car: {item.car} </p>
                <p>Date: {item.Date}</p>
              </div>
            ))}

            <button
              className="reminder-ok-btn"
              onClick={() => setreminderpop(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}


    </div>
  )
}
export default Car