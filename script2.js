
const diaryKey = "moonDiary";

const state = {
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth(),
};

window.addEventListener("DOMContentLoaded", () => {

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
      if (date > daysInMonth) break;
    }
  }

  function paintDiary() {
    const diary = JSON.parse(localStorage.getItem(diaryKey)) || {};
    Object.entries(diary).forEach(([iso, data]) => {
      const cell = document.querySelector(`[data-date='${iso}']`);
      if (cell) {
        const emoji = typeof data === "string" ? data : data.mood || "😊";
        cell.textContent = emoji;
        cell.classList.add("has-emoji");
      }
    });
  }

  // ==== ДОДАТКОВА ЛОГІКА ДЛЯ КОМЕНТАРІВ ==== //

  const modal = document.getElementById("comment-modal");
  const closeModal = document.getElementById("close-modal");
  const saveCommentBtn = document.getElementById("save-comment-btn");
  const commentText = document.getElementById("comment-text");
  const dateLabel = document.getElementById("modal-date-label");

  let selectedDate = "";

  // Відкриття модалки по кліку на клітинку
  tbody.addEventListener("click", (e) => {
    const cell = e.target.closest("td");
    if (!cell || !cell.dataset.date) return;

    selectedDate = cell.dataset.date;
    const diary = JSON.parse(localStorage.getItem(diaryKey)) || {};
    const entry = diary[selectedDate] || "";

    commentText.value = typeof entry === "object" ? entry.comment || "" : ""; // Якщо зберігатимеш mood+comment
    dateLabel.textContent = `Дата: ${selectedDate}`;
    modal.style.display = "block";
  });

  // Закриття модалки
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Збереження коментаря
  saveCommentBtn.addEventListener("click", () => {
    const comment = commentText.value;
    const diary = JSON.parse(localStorage.getItem(diaryKey)) || {};

    if (!diary[selectedDate]) diary[selectedDate] = {};
    if (typeof diary[selectedDate] === "string") diary[selectedDate] = { mood: diary[selectedDate] }; // якщо там емодзі

    diary[selectedDate].comment = comment;
    localStorage.setItem(diaryKey, JSON.stringify(diary));
    modal.style.display = "none";
  });

});

