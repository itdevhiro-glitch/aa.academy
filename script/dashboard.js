import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvL7vHx8cXGbBIpUOIF9cbLSNMeSO9cdo",
  authDomain: "aquaacademy-ae7a5.firebaseapp.com",
  databaseURL: "https://aquaacademy-ae7a5-default-rtdb.firebaseio.com",
  projectId: "aquaacademy-ae7a5",
  storageBucket: "aquaacademy-ae7a5.firebasestorage.app",
  messagingSenderId: "851048143100",
  appId: "1:851048143100:web:52fb802804f9fda9e65f79",
  measurementId: "G-4LVK266PY2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Proteksi Halaman
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.email.endsWith('@admin.service')) {
      window.location.href = 'admin.html'; // Admin tidak boleh di dashboard user
    }
    
    // Ambil data dari RTDB
    const userRef = ref(db, 'users/' + user.uid);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        document.getElementById('userName').innerText = snapshot.val().username;
        document.getElementById('userStatus').innerText = snapshot.val().role;
      } else {
        document.getElementById('userName').innerText = user.displayName || "Scholar";
      }
    });
  } else {
    window.location.href = 'login.html';
  }
});

// Logout
document.getElementById('btnLogout').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'login.html';
  });
});