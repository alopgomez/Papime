import { getCurrentUser, setCurrentUser } from "../estado.js";
import { navigate } from "../enrutador.js";
import { highlightErrors } from "./registro.js"
import { updateUserInitial } from "./navbar.js"
import { setupPasswordToggles, eyeClosedIcon } from "./registro.js"
import { db } from "../firebase/firebaseConfig.js";
import { updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function renderVistaPerfil(container) {

  const user = getCurrentUser();

  if (!user) {
    container.innerHTML = "<p>Debes iniciar sesión.</p>";
    return;
  }

  container.innerHTML = `
    <section class="profile">
      <h2>Perfil de Usuario</h2>

      <div style="width: 100%">

        <div class="profile-row">
          <div class="profile-label">Nombre</div>
          <div class="profile-value" id="usernameValue">${user.username}</div>
          <div class="profile-change-username" id="toggleUsername">
            <button class="edit-username-btn" id="changeUsername">Cambiar</button> 
          </div>
        </div>

        <div class="profile-row">
          <div class="profile-label">Matrícula</div>
          <div class="profile-value">${user.identifier}</div>
        </div>

        <div class="profile-row">
          <div class="profile-label">Miembro desde:</div>
          <div class="profile-value">${formatDate(user.createdAt)}</div>
        </div>

        <div class="profile-row">
          <div></div>
          <div id="newPassword" class="profile-value" style="margin-top: 15px">
            <button class="edit-username-btn" id="changePassBtn">
              Cambiar contraseña
            </button> 
          </div>
        </div>

      </div>
      <button id="backHomeBtn" class="btn-gold" style="margin-top: 15px">Volver</button>
    </section>
  `;

  document.getElementById("backHomeBtn")
    .addEventListener("click", () => navigate("home"));
  
  document.getElementById("changeUsername")
    .addEventListener("click", startEdit);

  document.getElementById("changePassBtn")
    .addEventListener("click", changeNewPassword);
}

function startEdit() {

  const originalUsername = getCurrentUser();

  usernameValue.innerHTML = `
    <div class="username-toggle">
      <input type="text" id="usernameInput" value="${originalUsername.username}" />
    </div>
  `;

  toggleUsername.innerHTML = `
    <button id="confirmBtn" class="edit-username-btn">Confirmar</button>
    <button id="cancelBtn" class="edit-username-btn">Cancelar</button>
  `;

  document.getElementById("cancelBtn")
    .addEventListener("click", cancelEdit);

  document.getElementById("confirmBtn")
    .addEventListener("click", (e) => {
      e.preventDefault();
      confirmEdit()
  });
}

function cancelEdit() {
  usernameValue.textContent = getCurrentUser().username;

  toggleUsername.innerHTML = `
    <button class="edit-username-btn" id="changeUsername">Cambiar</button>
  `;

  document.getElementById("changeUsername")
    .addEventListener("click", startEdit);
}

async function confirmEdit() {
  const newUsername = document.getElementById("usernameInput").value.trim();
  const user = getCurrentUser();
  usernameValue.textContent = newUsername;

  if (newUsername !== user.username) {
    await updateDoc(doc(db, "users", user.identifier), {
      username: newUsername
    });

    const nuser = await getDoc(doc(db, "users", user.identifier));
    setCurrentUser(nuser.data());
    updateUserHome(nuser.data());
    updateUserInitial(nuser.data());
  }

  toggleUsername.innerHTML = `
    <button class="edit-username-btn" id="changeUsername">Cambiar</button>
  `;

  document.getElementById("changeUsername")
    .addEventListener("click", startEdit);
}

function changeNewPassword () {
  newPassword.innerHTML = `
    <button id="hideChangePass" class="btn-gold">Ocultar</button>
    <div class="username-toggle-changepass">
      <div class="input-wrapper-changepass">
        <input type="password" id="oldPasswordInput" placeholder="Contraseña anterior" style="margin-top: 15px" required />
        <span class="toggle-password-changepass" data-target="oldPasswordInput">
          ${eyeClosedIcon()}
        </span>
      </div>

      <div class="input-wrapper-changepass">
        <input type="password" id="newPasswordInput" placeholder="Contraseña nueva" required />
        <span class="toggle-password-changepass" data-target="newPasswordInput">
          ${eyeClosedIcon()}
        </span>
      </div>

      <div class="input-wrapper-changepass">
        <input type="password" id="confirmNewPasswordInput" placeholder="Confirmar contraseña nueva" required />
        <span class="toggle-password-changepass" data-target="confirmNewPasswordInput">
          ${eyeClosedIcon()}
        </span>
      </div>
    </div>
    
    <button id="confirmPasswordBtn" class="edit-username-btn" style="margin-top: 15px">Confirmar</button>

    <p id="authError" class="alert hidden"></p>
  `

  document.getElementById("hideChangePass")
    .addEventListener("click", cancelNewPass);
  
  document.getElementById("confirmPasswordBtn")
    .addEventListener("click", (e) => {
      e.preventDefault();
      confirmNewPass()
    });
  
    setupPasswordToggles();
}

function cancelNewPass() {
  newPassword.innerHTML = `
    <button class="edit-username-btn" id="changePassBtn">Cambiar contraseña</button>
  `;

  document.getElementById("changePassBtn")
    .addEventListener("click", changeNewPassword);
}

async function confirmNewPass() {
  const user = getAuth().currentUser;

  const errorElement = document.getElementById("authError");

  const passData = {
    oldpass: document.getElementById("oldPasswordInput").value,
    newpass: document.getElementById("newPasswordInput").value,
    confirmpass: document.getElementById("confirmNewPasswordInput").value
  };

  document.querySelectorAll(".input-error-auth")
    .forEach(el => el.classList.remove("input-error-auth"));
  
  document.querySelectorAll(".alert")
    .forEach(el => {
      el.classList.add("hidden");
      el.classList.remove("alert-error");
      el.classList.remove("alert-warning");
      el.classList.remove("alert-success");
    });

  const errores = validateFields(passData);

  if (Object.keys(errores).length > 0) {
    highlightErrors(errores);
    errorElement.textContent = "Por favor, completa los campos requeridos.";
    errorElement.classList.remove("hidden");
    errorElement.classList.add("alert-error");
    return;
  }

  if(passData.newpass !== passData.confirmpass){
    errorElement.textContent = "Las contraseñas no coinciden.";
    errorElement.classList.remove("hidden");
    errorElement.classList.add("alert-warning");
    return;
  }

  try{
    const credential = EmailAuthProvider.credential(
      user.email,
      passData.oldpass
    );

    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, passData.newpass);

    errorElement.classList.remove("hidden");
    errorElement.textContent = "Contraseña actualizada correctamente";
    errorElement.classList.add("alert-success");
  } catch(error){
    if(error.code === "auth/invalid-credential") {
      errorElement.textContent = "La contraseña actual es incorrecta";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-error");
    }
    else if(error.code === "auth/weak-password") {
      errorElement.textContent = "Usa al menos 6 caracteres en la contraseña.";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-warning");
    }
    else {
      errorElement.textContent = "Error al cambiar contraseña";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-error");
    }
  }
}

function validateFields({oldpass, newpass, confirmpass}) {
  const errores = {};

  if (!oldpass) {
    errores.oldPasswordInput = "Contraseña Anterior es campo requerido.";
  }

  if (!newpass) {
    errores.newPasswordInput = "Nueva Contraseña es campo requerido.";
  }

  if (!confirmpass) {
    errores.confirmNewPasswordInput = "Confirmar Contraseña es campo requerido.";
  }

  return errores;
}

function formatDate(timestamp) {
  if (!timestamp) return "—";

  const date = timestamp.toDate
    ? timestamp.toDate()
    : new Date(timestamp);

  return date.toLocaleDateString();
}

function updateUserHome(user) {
  const userElement = document.getElementById("greetUser");
  if (userElement !== null) {
    userElement.textContent = `¡Hola! ${user.username}`;
  }
}