const { auth, db } = require("../firebase");
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth");

const {
  getDocs,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  increment,
} = require("firebase/firestore");

// /api/users/login
//COMPLETED////////////////////////////////
// ////////////////////////////////////////
//////////////////////////////////////////
const user_login = async (req, res) => {
  try {
    const userData = req.body;
    const loginEmail = userData.loginEmail.split(" ")[0];
    console.log(loginEmail, userData.loginPass);
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      userData.loginPass
    );
    const uid = userCredentials.user.uid;
    console.log(uid);
    res.send(uid);
  } catch (err) {
    console.error(err.code?.split("/")[1]);
    res.status(500).send(err.code?.split("/")[1]);
  }
};
//       /////////////////////////////////

// /api/users/signup
//COMPLETED////////////////////////////////
// ////////////////////////////////////////
//////////////////////////////////////////
const user_register = async (req, res) => {
  try {
    const hospitalData = req.body;
    console.log(hospitalData);
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      hospitalData.loginEmail,
      hospitalData.loginPass
    );
    // console.log(userCredentials.user[operationType]);
    const uid = userCredentials.user.uid;
    delete hospitalData.loginPass;

    //adding Hospital to firestore
    const usersRef = doc(db, `hospitals/${uid}`);
    const basic_doc_details = {
      name: hospitalData.name,
      email: hospitalData.loginEmail,
      location: hospitalData.location,
    };
    await setDoc(usersRef, basic_doc_details);

    const floor_details = hospitalData.floors;
    const total_floors = Object.keys(floor_details).length;
    console.log(floor_details);
    console.log(total_floors);
    console.log(uid);

    for (let i = 1; i <= total_floors; i++) {
      const id = "F" + i.toString();
      const total_rooms = floor_details[id];
      const room_details = {};
      for (let j = 1; j <= total_rooms; j++) {
        room_details[i.toString() + get_room_number(j)] = false;
      }
      console.log(room_details);
      // const floorRef = collection(db, `hospitals/${uid}/Rooms`);
      const floor = doc(db, `hospitals/${uid}/Rooms/${id}`);
      await setDoc(floor, room_details);
    }
    //updatingID
    res.status(200).send(uid);
  } catch (err) {
    console.log(err.code?.split("/")[1]);
    res.status(500).send(err.code?.split("/")[1]);
  }
};
//       /////////////////////////////////

// users/getrooms
//COMPLETED////////////////////////////////
// ////////////////////////////////////////
//////////////////////////////////////////
const getRoom = async (req, res) => {
  try {
    console.log(req.body);
    const uid = req.body.hospId;
    const collectionRef = collection(db, `hospitals/${uid}/Rooms`);
    const userSnapshot = await getDocs(collectionRef);
    const rooms_details = userSnapshot.docs.map((doc) => doc.data());
    console.log(rooms_details);
    res.send(rooms_details);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
/////////////////////////////////////////

// users/gethospital
//Sends Basic Data
//COMPLETED////////////////////////////////
// ////////////////////////////////////////
//////////////////////////////////////////
const getUserDetails = async (req, res) => {
  try {
    console.log(req.body);
    const docRef = doc(db, "hospitals", req.body.docId);
    const userSnapshot = await getDoc(docRef);

    if (userSnapshot.exists()) {
      console.log("Document Data: ", userSnapshot.data());
      res.status(200).send(userSnapshot.data());
    } else {
      console.log("User Does Not exist");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
//////////////////////////////////////////

// /api/users/updateroomstatus
//COMPLETED////////////////////////////////
// ////////////////////////////////////////
//////////////////////////////////////////
const updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const hospId = req.body.hospId;
    const floorNumber = "F" + req.body.floor.toString();
    const roomNumber =
      req.body.floor.toString() + get_room_number(req.body.roomNumber);
    const documentRef = doc(db, `hospitals/${hospId}/Rooms/${floorNumber}`);
    const value = {};
    value[roomNumber] = req.body.bool;
    await updateDoc(documentRef, value);
    res.status(200).send("Updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};
//////////////////////////////////////////

// /api/addfloor
const addFloor = async (req, res) => {
  try {
    const hospitalData = req.body;
    console.log(hospitalData);
    const uid = hospitalData.hospId;
    const floor_details = hospitalData.floors;
    const total_floors = req.body["existing"] + Object.keys(req.body.floors).length;
    console.log("floor details ",floor_details);
    console.log("total_floors ",total_floors);
    console.log("uid",uid);

    const start = req.body["existing"] + 1;

    for (let i = start; i <= total_floors; i++) {
        // console.log(i);
      const id = "F" + i.toString();
      
      const total_rooms = floor_details[id];
      const room_details = {};
      for (let j = 1; j <= total_rooms; j++) {
        room_details[i.toString() + get_room_number(j)] = false;
      }
      console.log(id, room_details);
      const floor = doc(db, `hospitals/${uid}/Rooms/${id}`);
      await setDoc(floor, room_details);
    }
    res.status(200).send("Updated Successfully");
  } catch (err) {
    console.log(err.code?.split("/")[1]);
    res.status(500).send(err.code?.split("/")[1]);
  }
};

// /api/users/getAllUsers
const getAllUsers = async (req, res) => {
  try {
    const colref = collection(db, "hospitals");
    const userSnapshot = await getDocs(colref);
    const userList = userSnapshot.docs.map((doc) => doc.data());
    console.log(userList);
    res.send(userList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  user_register,
  user_login,
  getAllUsers,
  getUserDetails,
  updateUser,
  getRoom,
  addFloor,
};

//HELPER FUNCTIONS
function get_room_number(room) {
  if (room < 10) {
    room = "0" + room.toString();
  } else {
    room = room.toString();
  }
  return room;
}
