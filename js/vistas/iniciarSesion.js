// js/vistas/loginView.js

import { login } from "../autenticacion.js";
import { navigate } from "../enrutador.js";
import { highlightErrors, eyeClosedIcon, setupPasswordToggles } from "./registro.js";

export function renderIniciarSesion(container) {
  container.innerHTML = `
    <div class="form-container">
      <h2>Iniciar Sesión</h2>
      <form>
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

        <button id="loginBtn" class="contact-btn">Entrar</button>

        <p style="text-align: center">
          ¿No tienes cuenta? 
          <a href="#" id="goSignup" class="solo-links">
            Regístrate
          </a>
        </p>

        <p id="authError" class="alert hidden"></p>
      </form>
    </div>
  `;

  const errorElement = document.getElementById("authError");
  const identifierInput = document.getElementById("identifier");

  // Solo números
  identifierInput.addEventListener("input", () => {
    identifierInput.value = identifierInput.value.replace(/\D/g, "");
  });

  document.getElementById("loginBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const regData = {
      identifier: identifierInput.value.trim(),
      password: document.getElementById("password").value,
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
      errorElement.textContent = "Por favor, completa los campos requeridos";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-error");
      return;
    }

    const regex = /^[0-9]{9}$/;
    if (!regex.test(regData.identifier)) {
      errorElement.textContent = "La matrícula debe tener 9 números.";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-warning");
      return;
    }

    const success = await login(regData.identifier, regData.password);
    if (success) {
      navigate("home");
    } else {
      errorElement.textContent = "Credenciales incorrectas.";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-error");
      return;
    }
  });

  document.getElementById("goSignup").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("signup");
  });

  setupPasswordToggles();
}

function validateFields({identifier, password}) {
  const errores = {};

  if (!identifier) {
    errores.identifier = "Matrícula es campo requerido.";
  }

  if (!password) {
    errores.password = "Contraseña es campo requerido.";
  }

  return errores;
}