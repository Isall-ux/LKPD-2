class Student {
  constructor(id, name, score) {
    this.id = id;
    this.name = name;
    this.score = score;
  }

  getStatus() {
    return this.score >= 75 ? "Lulus" : "Tidak Lulus";
  }
  getPredikat() {
    if (this.score >= 90) return "Sangat Baik";
    if (this.score >= 80) return "Baik";
    if (this.score >= 70) return "Cukup";
    return "Kurang";
  }
}

class StudentTable {
  constructor(tableSelector, filterSelector, leaderboardSelector) {
    this.table = document.querySelector(tableSelector);
    this.filterInput = document.querySelector(filterSelector);
    this.leaderboardContainer = document.querySelector(leaderboardSelector);
    this.tbody = this.table.querySelector("tbody");

    const savedData = JSON.parse(localStorage.getItem("students")) || [];
    this.students = savedData.map(
      s => new Student(s.id, s.name, s.score)
    );

    this.renderTable();
    this.renderLeaderboard();
    this.attachFilterHandler();
  }

  saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(this.students));
  }

  addStudent(name, score) {
    const id = this.students.length ? this.students[this.students.length - 1].id + 1 : 1;
    const newStudent = new Student(id, name, Number(score));
    this.students.push(newStudent);
    this.saveToLocalStorage();
    this.renderTable();
    this.renderLeaderboard();
  }

  renderTable(filteredStudents = this.students) {
    this.tbody.innerHTML = "";

    filteredStudents.forEach(student => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td class="nilai">${student.score}</td>
        <td class="kelulusan">${student.getStatus()}</td>
        <td class="predikat">${student.getPredikat()}</td>
      `;
      this.tbody.appendChild(tr);
    });
  }

  renderLeaderboard() {
    const topStudents = [...this.students]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    this.leaderboardContainer.innerHTML = `
      <h5 class="text-center">Ranking Siswa</h5>
      <ol class="list-group list-group-numbered">
        ${topStudents
          .map(
            s => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>${s.name}</span>
              <span class="badge bg-primary rounded-pill">${s.score}</span> 
            </li>
          `
          )
          .join("")}
      </ol>
    `;
  }

  attachFilterHandler() {
    this.filterInput.addEventListener("input", () => {
      const keyword = this.filterInput.value.toLowerCase();
      const filtered = this.students.filter(student =>
        student.name.toLowerCase().includes(keyword)
      );
      this.renderTable(filtered);
      this.renderLeaderboard();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const studentTable = new StudentTable(".table", "#filter", "#leaderboard");

  const nameInput = document.querySelector('input[placeholder="Nama"]');
  const scoreInput = document.querySelector('input[placeholder="Nilai"]');
  const addButton = document.getElementById("button-addon2");

  addButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const score = scoreInput.value.trim();

    if (!name || !score) {
      alert("Nama dan Nilai harus diisi!");
      return;
    }

    if (isNaN(score) || score < 0 || score > 100) {
      alert("Nilai harus berupa angka antara 0 - 100!");
      return;
    }

    studentTable.addStudent(name, score);
    nameInput.value = "";
    scoreInput.value = "";
  });
});
