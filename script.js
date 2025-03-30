const firebaseConfig = {
    apiKey: "AIzaSyCfo6J0kruHlTZ2VvwnXnA8znjbXz7Nqvg",
    authDomain: "passwordmanager-5797f.firebaseapp.com",
    projectId: "passwordmanager-5797f",
    storageBucket: "passwordmanager-5797f.firebasestorage.app",
    messagingSenderId: "955647267312",
    appId: "1:955647267312:web:6de032ac75adcf0b04cd35",
    measurementId: "G-BFEF32V0EZ"
};

// 🔹 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentUser = null;

// 🧑 Select User
function selectUser() {
    let username = prompt("Enter your username:");
    if (username) {
        currentUser = username;
        document.getElementById("currentUserDisplay").innerText = `User: ${currentUser}`;
        loadPasswords();
    }
}

// 💾 Save Password
function savePassword() {
    let appName = document.getElementById("appName").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let category = document.getElementById("category").value;

    if (!currentUser) {
        alert("Please select a user first!");
        return;
    }

    db.collection("passwords").add({
        user: currentUser,
        appName: appName,
        username: username,
        password: password,
        category: category,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("✅ Password saved successfully!");
        loadPasswords();
    }).catch(error => {
        console.error("❌ Error saving password:", error);
    });
}

// 🔍 Load Passwords
function loadPasswords() {
    if (!currentUser) return;

    db.collection("passwords")
        .where("user", "==", currentUser)
        .orderBy("timestamp", "desc")
        .get()
        .then(snapshot => {
            let passwordList = document.getElementById("passwordList");
            passwordList.innerHTML = "";

            snapshot.forEach(doc => {
                let data = doc.data();
                let li = document.createElement("li");
                li.innerHTML = `
                    <strong>${data.appName}</strong> (${data.category}) <br>
                    Username: ${data.username} <br>
                    Password: ${data.password} <br>
                    <button onclick="deletePassword('${doc.id}')">Delete</button>
                `;
                passwordList.appendChild(li);
            });
        }).catch(error => {
            console.error("❌ Error loading passwords:", error);
        });
}

// ❌ Delete Password
function deletePassword(id) {
    db.collection("passwords").doc(id).delete()
        .then(() => {
            console.log("✅ Password deleted!");
            loadPasswords();
        })
        .catch(error => console.error("❌ Error deleting password:", error));
}

// Auto-select user on load
window.onload = selectUser;
