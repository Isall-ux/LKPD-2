class Student {
  constructor(id, name, score) {
    this.id = id;
    this.name = name;
    this.score = score;
  }

  getStatus() {
    return this.score >= 75 ? "Lulus" : "Tidak Lulus";
  }
}

class StudentTable {
  constructor(tableSelector, filterSelector, studentsData, leaderboardSelector) {
    this.table = document.querySelector(tableSelector);
    this.filterInput = document.querySelector(filterSelector);
    this.leaderboardContainer = document.querySelector(leaderboardSelector);
    this.students = studentsData.map(
      s => new Student(s.id, s.name, s.score)
    );
    this.tbody = this.table.querySelector("tbody");

    this.renderTable();
    this.renderLeaderboard();
    this.attachFilterHandler();
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
  const studentsData = [
    { id: 1, name: "Reisya Mutiara Ramadani", score: 100 },
    { id: 2, name: "Raissa Adhi Pratama", score: 60 },
    { id: 3, name: "Farhan Alfarizi", score: 87 },
    { id: 4, name: "Hanif Syahril", score: 88 },
    { id: 5, name: "Pramudya Wira", score: 90 },
    { id: 6, name: "aselole", score: 90 },
  ];

  new StudentTable(".table", "#filter", studentsData, "#leaderboard");
});