const calendarBody = document.getElementById("calendar-body");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const emojiPicker = document.getElementById("emoji-picker");

let currentDate = new Date();
let moodData = {}; // moodData['2025-05-25'] = "😊"

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // Нд = 0
  const adjustedFirstDay = (firstDay + 6) % 7; // Перетворюємо так, щоб Пн = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarBody.innerHTML = "";
  monthYear.textContent = `${getMonthName(month)} ${year}`;

  let row = document.createElement("tr");
  let dayCount = 1;

  // Заповнюємо 6 тижнів максимум
  for (let i = 0; i < 6; i++) {
    for (let d = 0; d < 7; d++) {
      const cell = document.createElement("td");

      if (i === 0 && d < adjustedFirstDay) {
        cell.innerHTML = "";
      } else if (dayCount > daysInMonth) {
        cell.innerHTML = "";
      } else {
        const dateKey = `${year}-${month + 1}-${dayCount}`;
        const emoji = moodData[dateKey] || "";
        const isToday =
          dayCount === new Date().getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear();

        cell.innerHTML = `${dayCount}<span class="emoji">${emoji}</span>`;
        if (isToday) cell.classList.add("today");
        cell.dataset.date = dateKey;

        cell.addEventListener("click", (e) => {
          showEmojiPicker(e.target, dateKey);
        });

        dayCount++;
      }

      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
    row = document.createElement("tr");
  }
}

function getMonthName(monthIndex) {
  const names = [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
  ];
  return names[monthIndex];
}

function showEmojiPicker(targetCell, dateKey) {
  const rect = targetCell.getBoundingClientRect();
  emojiPicker.style.left = `${rect.left + window.scrollX}px`;
  emojiPicker.style.top = `${rect.bottom + window.scrollY}px`;
  emojiPicker.style.display = "flex";
  emojiPicker.dataset.date = dateKey;
}

emojiPicker.querySelectorAll("span").forEach(span => {
  span.addEventListener("click", () => {
    const date = emojiPicker.dataset.date;
    moodData[date] = span.dataset.emoji;
    emojiPicker.style.display = "none";
    renderCalendar();
  });
});

document.addEventListener("click", (e) => {
  if (!emojiPicker.contains(e.target) && !e.target.closest("td")) {
    emojiPicker.style.display = "none";
  }
});

prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
