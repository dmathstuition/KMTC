const students = [
  "Aisha", "Ben", "Charlie", "Dani", "Evan", "Fatima",
  "Grace", "Hugo", "Isaac", "Jade", "Kai", "Luca",
  "Mia", "Nora", "Omar", "Priya", "Quinn", "Rosa",
  "Sam", "Talia", "Uma", "Vik", "Will", "Xena",
  "Yara", "Zane", "Aria", "Noah", "Leah", "Miles"
];

const seatGrid = document.getElementById("seatGrid");
const shuffleButton = document.getElementById("shuffleSeats");

function renderSeats(list) {
  seatGrid.innerHTML = "";
  list.forEach((name, i) => {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.textContent = `Seat ${i + 1}: ${name}`;
    seatGrid.appendChild(seat);
  });
}

function shuffleSeats() {
  const shuffled = [...students].sort(() => Math.random() - 0.5);
  renderSeats(shuffled);
}

shuffleButton.addEventListener("click", shuffleSeats);
renderSeats(students);
