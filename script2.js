
const diaryKey = "moonDiary";

const state = {
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth(), // 0‑11
};

window.addEventListener("DOMContentLoaded", () => {
  // Элементы управления
  const tbody = document.getElementById("calendar-body");
  const monthLabel = document.getElementById("month-label");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  prevBtn.addEventListener("click", () => {
    state.viewMonth -= 1;
    if (state.viewMonth < 0) {
      state.viewMonth = 11;
      state.viewYear -= 1;
    }
    render();
  });

  nextBtn.addEventListener("click", () => {
    state.viewMonth += 1;
    if (state.viewMonth > 11) {
      state.viewMonth = 0;
      state.viewYear += 1;
    }
    render();
  });

  render();

  // ====== functions ======
  function render() {
    buildCalendar(state.viewYear, state.viewMonth);
    paintDiary();
    monthLabel.textContent = new Date(state.viewYear, state.viewMonth).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
    });
  }

  function buildCalendar(y, m) {
    tbody.innerHTML = "";

    const firstDay = new Date(y, m, 1);
    let startWeekday = firstDay.getDay();
    // Перенос воскресенья (0) в конец, делаем Пн=0, Вс=6
    startWeekday = (startWeekday + 6) % 7;

    const daysInMonth = new Date(y, m + 1, 0).getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");

        if (i === 0 && j < startWeekday) {
          cell.classList.add("empty");
        } else if (date > daysInMonth) {
          cell.classList.add("empty");
        } else {
          const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
          cell.dataset.date = iso;
          cell.textContent = date;
          date += 1;
        }
        row.appendChild(cell);
      }

      tbody.appendChild(row);
      if (date > daysInMonth) break; // лишние строки не нужны
    }
  }

  function paintDiary() {
    const diary = JSON.parse(localStorage.getItem(diaryKey)) || {};
    Object.entries(diary).forEach(([iso, emoji]) => {
      const cell = document.querySelector(`[data-date='${iso}']`);
      if (cell) {
        cell.textContent = emoji;
        cell.classList.add("has-emoji");
      }
    });
  }
});