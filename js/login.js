const firebaseConfig = {
  apiKey: "AIzaSyBe2yH6rpU5fiM3CBMslHeP1otzQj8zLs4",
  authDomain: "kheti-bank.firebaseapp.com",
  projectId: "kheti-bank",
  storageBucket: "kheti-bank.firebasestorage.app",
  messagingSenderId: "466075795176",
  appId: "1:466075795176:web:9e4cb14f564fb48dab535d",
  measurementId: "G-VL63QEH2YJ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      db.collection("users").doc(uid).get().then((doc) => {
        if (doc.exists) {
          const role = doc.data().role;
          logAudit(uid, role, "login");

          if (role === "admin") {
            window.location.href = "admin-dashboard.html";
          } else if (role === "officer") {
            window.location.href = "officer-dashboard.html";
          } else {
            window.location.href = "user-dashboard.html";
          }
        } else {
          errorMsg.textContent = "User profile not found.";
        }
      });
    })
    .catch((error) => {
      errorMsg.textContent = error.message;
    });
}

function logAudit(uid, role, action) {
  db.collection("auditLogs").add({
    uid: uid,
    role: role,
    action: action,
    ticketId: null,
    performedBy: "self",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}
