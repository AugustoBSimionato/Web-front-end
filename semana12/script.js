// Exemplo de uso do localStorage com os métodos setItem, push, stringify, parse e filter para cadastro de pacientes

// Criar uma lista vazia de pacientes
var patientList = []; //Comando que cria uma variável patientList e a inicializa como um array vazio. Essa variável é usada para armazenar a lista de pacientes cadastrados.
var count = 1;

// Função para adicionar um novo paciente
function addPatient(name, age) {
  var newPatient = { id: count++, name: name, age: age }; //cria um novo objetivo de paciente (newPatient), com as propriedades id, name e age
  patientList.push(newPatient); //comando que adiciona o novo paciente ao final da lista de pacientes
  localStorage.setItem('patientList', JSON.stringify(patientList)); //o JSON.stringfy converte o objeto JavaScript em uma string JSON
  renderPatientList();
}

// Função para excluir um paciente
function deletePatient(patientId) {
  var updatedPatientList = patientList.filter(function (patient) {
    return patient.id !== patientId; //retorna todos os elementos que não sejam no ID selecionado
  });

  if (updatedPatientList.length < patientList.length) { //verifica se a lista atualizada é diferente da lista original
    patientList = updatedPatientList;
    localStorage.setItem('patientList', JSON.stringify(patientList)); 
    renderPatientList();
  } else {
    alert('Paciente não encontrado.');
  }
}

// Função para recuperar a lista de pacientes do localStorage
function getPatientList() {
  var storedList = JSON.parse(localStorage.getItem('patientList')); //converte a string JSON para objeto JavaScript
  patientList = storedList || []; //se storedList for um valor válido (não seja nulo ou indefinido). é atribuido a patientList. Caso contrário, patientList recebe um array vazio
}

// Função para renderizar a lista de pacientes no HTML
function renderPatientList() {
  var patientListElement = document.getElementById('patientList');
  patientListElement.innerHTML = ''; //limpa o conteúdo HTML do elemento patientListElement

  patientList.forEach(function (patient) {
    var listItem = document.createElement('li');
    //renderiza a lista de pacientes. Itera sobre cada paciente na lista encontrada e cria um <li> para cada paciente
    listItem.innerHTML = '<span class="patient-name">' + patient.name + '</span> (Idade: ' + patient.age + ') <button class="delete-button" onclick="deletePatient(' + patient.id + ')">Excluir</button>';
    patientListElement.appendChild(listItem);
  });
}

// Recuperar a lista de pacientes do localStorage
getPatientList();

// Renderizar a lista de pacientes no HTML
renderPatientList();

// Event listener para o formulário de cadastro de pacientes
document.getElementById('patientForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var nameInput = document.getElementById('nameInput');
  var ageInput = document.getElementById('ageInput');
  addPatient(nameInput.value, parseInt(ageInput.value));
  nameInput.value = '';
  ageInput.value = '';
});
