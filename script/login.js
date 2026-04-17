import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Konfigurasi Firebase Anda
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- DOM ELEMENTS ---
const tabSignIn = document.getElementById('tab-signin');
const tabSignUp = document.getElementById('tab-signup');
const formSignIn = document.getElementById('form-signin');
const formSignUp = document.getElementById('form-signup');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// --- FUNGSI GANTI FORM ---
function showForm(mode) {
  tabSignIn.classList.remove('active');
  tabSignUp.classList.remove('active');
  formSignIn.classList.remove('active');
  formSignUp.classList.remove('active');

  if (mode === 'signup') {
    tabSignUp.classList.add('active');
    formSignUp.classList.add('active');
  } else {
    tabSignIn.classList.add('active');
    formSignIn.classList.add('active');
  }
}

// Event Listeners untuk Tab
tabSignIn.addEventListener('click', () => showForm('signin'));
tabSignUp.addEventListener('click', () => showForm('signup'));

// --- LOGIKA REGISTRASI ---
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  // Aturan: Hanya boleh @aquaacademy.community
  if (!email.endsWith('@aquaacademy.community')) {
    alert("Akses Ditolak! Registrasi hanya diperbolehkan untuk domain @aquaacademy.community");
    return;
  }

  // Aturan Tambahan: Tidak boleh pakai domain admin di form registrasi
  if (email.endsWith('@admin.service')) {
    alert("Email administratif tidak dapat didaftarkan melalui jalur publik.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return updateProfile(userCredential.user, { displayName: name });
    })
    .then(() => {
      alert("Enrolment Berhasil! Silahkan login ke sistem.");
      showForm('signin');
    })
    .catch((error) => {
      alert("Gagal mendaftar: " + error.message);
    });
});

// --- LOGIKA LOGIN ---
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Multi-Level Redirect
      if (user.email.endsWith('@admin.service')) {
        console.log("Admin detected. Redirecting...");
        window.location.href = 'admin.html';
      } else {
        console.log("Scholar detected. Redirecting...");
        window.location.href = 'dashboard.html';
      }
    })
    .catch((error) => {
      alert("Autentikasi Gagal: Periksa kembali kredensial Anda.");
      console.error(error.code, error.message);
    });
});

// Cek status URL saat load pertama kali
const params = new URLSearchParams(window.location.search);
if (params.get('mode') === 'signup') showForm('signup');
else showForm('signin');