let goal = 0;
let totalCollected = 0;
let records = [];

// Carregar dados do LocalStorage
function loadData() {
    const savedGoal = localStorage.getItem("goal");
    const savedRecords = localStorage.getItem("records");

    if (savedGoal) goal = parseFloat(savedGoal);
    if (savedRecords) records = JSON.parse(savedRecords);

    totalCollected = records.reduce((sum, record) => sum + record.value, 0);
    document.getElementById("goal").value = goal || "";
    updateProgress();
    updateTable();
}

// Salvar dados no LocalStorage
function saveData() {
    localStorage.setItem("goal", goal);
    localStorage.setItem("records", JSON.stringify(records));
}

// Atualizar progresso
function updateProgress() {
    const progressBar = document.getElementById("progress");
    const status = document.getElementById("status");

    if (goal > 0) {
        const percentage = Math.min((totalCollected / goal) * 100, 100);
        progressBar.style.width = percentage + "%";
        status.textContent = `Progresso: ${percentage.toFixed(2)}%`;
    } else {
        status.textContent = "Defina uma meta para começar.";
        progressBar.style.width = "0%";
    }
}

// Adicionar valor arrecadado
function addCollected() {
    const goalInput = document.getElementById("goal");
    const collectedInput = document.getElementById("collected");

    goal = parseFloat(goalInput.value) || 0;
    const collectedValue = parseFloat(collectedInput.value) || 0;

    if (collectedValue > 0) {
        totalCollected += collectedValue;
        const date = new Date().toLocaleString();
        records.push({ value: collectedValue, date });

        saveData();
        updateTable();
        collectedInput.value = "";
    }

    updateProgress();
}

// Atualizar tabela
function updateTable() {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    records.forEach((record, index) => {
        const row = document.createElement("tr");

        const valueCell = document.createElement("td");
        valueCell.textContent = `R$ ${record.value.toFixed(2)}`;

        const dateCell = document.createElement("td");
        dateCell.textContent = record.date;

        const actionCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";
        removeButton.classList.add("remove-button");
        removeButton.onclick = () => removeRecord(index);

        actionCell.appendChild(removeButton);

        row.appendChild(valueCell);
        row.appendChild(dateCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

// Remover registro
function removeRecord(index) {
    totalCollected -= records[index].value;
    records.splice(index, 1);

    saveData();
    updateTable();
    updateProgress();
}

// Inicializar
loadData();
