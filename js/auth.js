/**
 * AI Technologies - Authentication Logic
 * Integrated with Firebase Authentication (CDN version)
 */

// ==============================================
// 1. นำการตั้งค่า Firebase มาใส่ตรงนี้ (Firebase Config)
// ==============================================
// TODO: แทนที่ object ด้านล่างนี้ด้วย Config ที่ได้จาก Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDoV64BEXQJXxHOjKvqGFgKyr9ZqqA4Rsg",
  authDomain: "ai-robot-1d04b.firebaseapp.com",
  projectId: "ai-robot-1d04b",
  storageBucket: "ai-robot-1d04b.firebasestorage.app",
  messagingSenderId: "669513154208",
  appId: "1:669513154208:web:84a88fb8ce615837c593c5",
  measurementId: "G-SV8QZ9315R"
};

// Initialize Firebase (Check if not already initialized)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {

  // Element References
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const navLinks = document.getElementById('navLinks');
  
  // Create an alert element
  const alertBox = document.createElement('div');
  alertBox.className = 'auth-alert';
  
  // Insert alert box before the form if form exists
  if (loginForm) loginForm.parentNode.insertBefore(alertBox, loginForm);
  if (registerForm) registerForm.parentNode.insertBefore(alertBox, registerForm);
  
  function showAlert(msg, isSuccess = false) {
    alertBox.textContent = msg;
    alertBox.className = `auth-alert show ${isSuccess ? 'success' : 'error'}`;
    setTimeout(() => {
      alertBox.className = 'auth-alert';
    }, 4000);
  }

  // --- REGISTRATION LOGIC ---
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;
      
      if (password !== confirmPassword) {
        showAlert('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
        return;
      }
      
      if (password.length < 8) {
        showAlert('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
        return;
      }
      
      // Firebase Sign Up
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Update display name
          return userCredential.user.updateProfile({
            displayName: name
          });
        })
        .then(() => {
          showAlert('สมัครสมาชิกสำเร็จ! กำลังพากลับไปหน้าเข้าสู่ระบบ...', true);
          // Sign out the user immediately after sign up if you want them to manually log in
          auth.signOut().then(() => {
            setTimeout(() => {
              window.location.href = 'login.html';
            }, 1500);
          });
        })
        .catch((error) => {
          let errorMsg = 'เกิดข้อผิดพลาด: ' + error.message;
          if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น';
          }
          showAlert(errorMsg);
          console.error('[Firebase Register Error]', error);
        });
    });
  }
  
  // --- LOGIN LOGIC ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      
      // Firebase Sign In
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const displayName = user.displayName || 'User';
          showAlert(`ยินดีต้อนรับคุณ ${displayName}! เข้าสู่ระบบสำเร็จ...`, true);
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        })
        .catch((error) => {
          showAlert('เข้าสู่ระบบล้มเหลว: ' + error.message);
          console.error('[Firebase Login Error]', error);
        });
    });
  }

  // --- NAVBAR AUTH STATE OBSERVER ---
  auth.onAuthStateChanged((user) => {
    if (!navLinks) return;
    
    // First, find the auth link or user container
    let authLi = document.getElementById('navAuthItem');

    if (user) {
      // User is logged in
      const displayName = user.displayName || user.email.split('@')[0];
      const initial = displayName.charAt(0).toUpperCase();

      if (!authLi) {
        // Find position to insert (after Contact or Login)
        const lis = navLinks.querySelectorAll('li');
        const lastLi = lis[lis.length - 1];
        
        if (lastLi && lastLi.textContent.includes('Contact')) {
           authLi = document.createElement('li');
           authLi.id = 'navAuthItem';
           navLinks.appendChild(authLi);
        } else if (lastLi && lastLi.textContent.includes('เข้าสู่ระบบ')) {
           authLi = lastLi;
           authLi.id = 'navAuthItem';
        } else {
           authLi = document.createElement('li');
           authLi.id = 'navAuthItem';
           navLinks.appendChild(authLi);
        }
      }
      
      if (authLi) {
        authLi.innerHTML = `
          <div class="nav-auth">
            <div class="user-profile" title="${displayName} (${user.email})">
              <div class="user-avatar">${initial}</div>
              <span class="user-name">${displayName.split(' ')[0]}</span>
            </div>
            <a href="#" id="logoutBtn" class="logout-btn">ออกจากระบบ</a>
          </div>
        `;
        
        // Add logout listener
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
          e.preventDefault();
          auth.signOut().then(() => {
            window.location.reload();
          });
        });
      }
      
    } else {
      // User is not logged in
      const currentUrl = window.location.pathname.split('/').pop() || 'index.html';
      const isActive = currentUrl === 'login.html' || currentUrl === 'register.html' ? 'active' : '';
      
      if (authLi) {
        // If it was injected by JS
        authLi.innerHTML = `<a href="login.html" class="btn btn-outline ${isActive}" style="padding: 0.4rem 1.2rem; margin-top: -0.4rem;">เข้าสู่ระบบ</a>`;
      } else {
        // Find if we already have it in HTML
        const lis = Array.from(navLinks.querySelectorAll('li'));
        const loginExisting = lis.find(li => li.textContent.includes('เข้าสู่ระบบ'));
        
        if (!loginExisting) {
          const newLi = document.createElement('li');
          newLi.id = 'navAuthItem';
          newLi.innerHTML = `<a href="login.html" class="btn btn-outline ${isActive}" style="padding: 0.4rem 1.2rem; margin-top: -0.4rem;">เข้าสู่ระบบ</a>`;
          navLinks.appendChild(newLi);
        }
      }
    }
  });
});
