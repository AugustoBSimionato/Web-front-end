window.onload = function checkStoredEmail() {
  const storedEmail = localStorage.getItem("name");
  if (storedEmail) {
    alert(
      `Olá, você já possui o seguinte e-mail já cadastrado: ${storedEmail}`
    );
  }
};

// Generate encryption key and store it
async function generateKey() {
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    const keyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
    localStorage.setItem("encryptionKey", keyString);
    return key;
}

async function encryptPassword(password) {
    let key = localStorage.getItem("encryptionKey");
    if (!key) {
        const newKey = await generateKey();
        key = newKey;
    } else {
        const keyBytes = Uint8Array.from(atob(key), c => c.charCodeAt(0));
        key = await window.crypto.subtle.importKey(
            "raw",
            keyBytes,
            "AES-GCM",
            true,
            ["encrypt", "decrypt"]
        );
    }
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedPassword = new TextEncoder().encode(password);
    
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedPassword
    );
    
    const encryptedArray = new Uint8Array(encryptedData);
    return {
        iv: Array.from(iv),
        data: Array.from(encryptedArray)
    };
}

async function store() {
  var name = document.getElementById("name");
  var pw = document.getElementById("pw");
  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var numbers = /[0-9]/g;
  var gmailRegex = /@gmail\.com$/;

  if (name.value.length == 0) {
    alert("Informe um email");
  } else if (pw.value.length == 0) {
    alert("Informe uma senha");
  } else if (name.value.length == 0 && pw.value.length == 0) {
    alert("Informe um e-mail e uma senha");
  } else if (pw.value.length > 8) {
    alert("Máximo de 8 caracteres");
  } else if (!pw.value.match(numbers)) {
    alert("Deve conter 1 numero");
  } else if (!pw.value.match(upperCaseLetters)) {
    alert("Deve conter uma letra maíuscula");
  } else if (!pw.value.match(lowerCaseLetters)) {
    alert("Deve conter uma letra minúscula");
  } else if (gmailRegex.test(name.value)) {
    localStorage.removeItem("name");
    localStorage.removeItem("pw");
    alert("Usuários do Gmail não são permitidos. Dados removidos.");
  } else {
    try {
        const encryptedPw = await encryptPassword(pw.value);
        localStorage.setItem("name", name.value);
        localStorage.setItem("pw", JSON.stringify(encryptedPw));
        alert("Dados salvos com sucesso!");
    } catch (error) {
        alert("Erro ao salvar senha de forma segura");
        console.error(error);
    }
  }
}

function check() {
  var storedName = localStorage.getItem("name");
  var storedPw = localStorage.getItem("pw");
  var userName = document.getElementById("userName");
  var userPw = document.getElementById("userPw");
  if (userName.value == storedName && userPw.value == storedPw) {
    alert("Login realizado.");
  } else {
    alert("Erro ao fazer login");
  }
}
