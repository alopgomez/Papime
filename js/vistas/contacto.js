import { validarIdentificador, highlightErrors } from "./registro.js"
import { db } from "../firebase/firebaseConfig.js";
import { collection, addDoc, serverTimestamp, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getCurrentUser } from "../estado.js"

export function renderContacto(container) {
  const user = getCurrentUser();

  container.innerHTML = `
    <div class="form-container">
      
      <h2>Contáctanos</h2>
      <p class="contact-subtitle">
        Ayúdanos a mejorar la plataforma enviándonos un mensaje.
      </p>

      <p style="text-align: center; margin-bottom: 10px">Matrícula: ${user.identifier}</p>

      <form id="contactForm">

        <div class="form-group">
          <textarea 
            id="contactMessage" 
            rows="5"
            placeholder="Escribe tu mensaje aquí..."
            required
          ></textarea>
        </div>

        <button type="submit" style="margin-top: 7px" class="contact-btn" id="sendEmail">
          Enviar mensaje
        </button>

        <p id="authError" class="alert hidden"></p>

      </form>

    </div>
  `;

  const errorElement = document.getElementById("authError");

  document.getElementById("sendEmail").addEventListener("click", async (event) => {
    event.preventDefault();

    const messageData = {
      // contactIdentifier: document.getElementById("contactIdentifier").value.trim(),
      contactIdentifier: user.identifier,
      contactMessage: document.getElementById("contactMessage").value,
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
    
    const errores = validateFields(messageData);

    if (Object.keys(errores).length > 0) {
      highlightErrors(errores);
      errorElement.textContent = "Por favor, completa los campos requeridos";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-error");
      return;
    }
    
    if (!validarIdentificador(messageData.contactIdentifier)) {
      errorElement.textContent = "La matrícula debe tener exactamente 9 números.";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-warning");
      return;
    }

    const userRef = doc(db, "users", messageData.contactIdentifier);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      errorElement.textContent = "La matrícula no existe.";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-error");
      return;
    }

    const form = document.getElementById("contactForm");
    try {
      await addDoc(collection(db, "users", messageData.contactIdentifier, "contactMessages"), {
        //identifier: messageData.identifier,
        message: messageData.contactMessage,
        createdAt: serverTimestamp()
      });

      errorElement.textContent = "Mensaje enviado correctamente.";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-success");

      form.reset();

    } catch (error) {
      console.error(error);
      errorElement.textContent = "Error al enviar el mensaje.";
      errorElement.classList.remove("hidden");
      errorElement.classList.add("alert-error");
    }
  });
}

function validateFields({contactIdentifier, contactMessage}) {
  const errores = {};

  if (!contactIdentifier) {
    errores.contactIdentifier = "Matrícula es campo requerido.";
  }

  if (!contactMessage) {
    errores.contactMessage = "Mensaje es campo requerido.";
  }

  return errores;
}