// script.js
const diaryKey = "moonDiary";

window.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".emoji-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const emoji = btn.textContent.trim();
      const now = new Date();
const isoDate = now.getFullYear() + "-" +
                String(now.getMonth() + 1).padStart(2, "0") + "-" +
                String(now.getDate()).padStart(2, "0");

      const diary = JSON.parse(localStorage.getItem(diaryKey)) || {};
      diary[isoDate] = emoji;
      localStorage.setItem(diaryKey, JSON.stringify(diary));

      
      window.location.href = "calendar.html";
    });
  });
});