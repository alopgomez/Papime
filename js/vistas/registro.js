// js/vistas/authView.js
import { signup } from "../autenticacion.js";
import { navigate } from "../enrutador.js";
import { renderNavbar } from "./navbar.js";

const passlen = 6;

export function renderRegistro(container) {
  container.innerHTML = `
    <div class="form-container">
      <h2>Cuenta de Usuario</h2>

      <div class="form-group">
        <input type="text" id="username" placeholder="Nombre de usuario">
      </div>

      <div class="form-group">
        <input 
          type="text" 
          id="identifier" 
          placeholder="Matrícula (9 números)"
          maxlength="9"
          inputmode="numeric"
        >
      </div>

      <div class="input-wrapper form-group">
        <input type="password" id="password" placeholder="Contraseña" />
        <span class="toggle-password" data-target="password">
          ${eyeClosedIcon()}
        </span>
      </div>

      <div class="input-wrapper form-group">
        <input type="password" id="confirmPassword" placeholder="Confirmar contraseña" />
        <span class="toggle-password" data-target="confirmPassword">
          ${eyeClosedIcon()}
        </span>
      </div>

      <button id="signupBtn" class="contact-btn" style="margin-top: 5px">Registrarse</button>

      <p id="authError" class="alert hidden"></p>
    </div>
  `;

  const errorElement = document.getElementById("authError");

  const identifierInput = document.getElementById("identifier");
  identifierInput.addEventListener("input", () => {
    identifierInput.value = identifierInput.value.replace(/\D/g, "");
  });

  document.getElementById("signupBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const regData = {
      username: document.getElementById("username").value.trim(),
      identifier: document.getElementById("identifier").value.trim(),
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value,
    }

    document.querySelectorAll(".input-error-auth")
      .forEach(el => el.classList.remove("input-error-auth"));

    document.querySelectorAll(".alert")
      .forEach(el => {
        el.classList.add("hidden");
        el.classList.remove("alert-error");
        el.classList.remove("alert-warning");
        el.classList.remove("alert-success");
      });
    
    const errores = validateFields(regData);

    if (Object.keys(errores).length > 0) {
      highlightErrors(errores);
      errorElement.classList.remove("hidden");
      errorElement.textContent = "Por favor, completa los campos requeridos";
      errorElement.classList.add("alert-error");
      return;
    }
    
    if (!validarIdentificador(regData.identifier)) {
      errorElement.classList.remove("hidden");
      errorElement.textContent = "La matrícula debe tener exactamente 9 números.";
      errorElement.classList.add("alert-warning");
      return;
    }

    if (regData.password.length < passlen) {
      errorElement.classList.remove("hidden");
      errorElement.textContent = `La contraseña debe tener al menos ${passlen} caracteres.`;
      errorElement.classList.add("alert-warning");
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      errorElement.classList.remove("hidden");
      errorElement.textContent = "Las contraseñas no coinciden.";
      errorElement.classList.add("alert-warning");
      return;
    }

    const success = await signup(regData.username, regData.identifier, regData.password);
    if (success) {
      // renderNavbar();
      navigate("home");
    } else {
      errorElement.classList.remove("hidden");
      errorElement.textContent = "Error al registrarse.";
      errorElement.classList.add("alert-error");
      return;
    }
  });

  setupPasswordToggles();
}

export function validarIdentificador(id) {
  const regex = /^[0-9]{9}$/;
  return regex.test(id);
}

function validateFields({username, identifier, password, confirmPassword}) {
  const errores = {};

  if (!username) {
    errores.username = "Nombre de usuario es campo requerido.";
  }

  if (!identifier) {
    errores.identifier = "Matrícula es campo requerido.";
  }

  if (!password) {
    errores.password = "Contraseña es campo requerido.";
  }

  if (!confirmPassword) {
    errores.confirmPassword = "Es necesario confirmar contraseña.";
  }

  return errores;
}

export function highlightErrors(errors) {
  Object.keys(errors).forEach(field => {
    document.getElementById(field).classList.add("input-error-auth");
  });
}

function eyeOpenIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="20" height="20"
         position="absolute"
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="currentColor" 
         stroke-width="2" 
         stroke-linecap="round" 
         stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `;
}

export function eyeClosedIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="20" height="20"
         position="absolute"
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="currentColor" 
         stroke-width="2" 
         stroke-linecap="round" 
         stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  `;
}

export function setupPasswordToggles() {

  let toggles = document.querySelectorAll(".toggle-password");
  if (!toggles.length) {
    toggles = document.querySelectorAll(".toggle-password-changepass");
  }
  toggles.forEach(toggle => {

    toggle.addEventListener("click", () => {

      const targetId = toggle.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (input.type === "password") {
        input.type = "text";
        toggle.innerHTML = eyeOpenIcon();
      } else {
        input.type = "password";
        toggle.innerHTML = eyeClosedIcon();
      }

    });

  });
}