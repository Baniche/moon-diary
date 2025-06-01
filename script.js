/* Логіка сторінки */

let start_screen = document.querySelector('.start-scr')
let start_btn = document.querySelector('.start-btn')

start_btn.addEventListener('click', function() {
    start_screen.style.display = 'none'
})


let selectedEmoji = null;

document.querySelectorAll('.emoji').forEach((emoji, index) => {
    emoji.addEventListener('click', () => {
        selectedEmoji = `emoji-${index + 1}`;
        
       
        document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
        emoji.classList.add('selected');
    });
});

document.querySelector('.sumbit-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const comment = document.querySelector('.input-comment').value;

    const data = {
        emoji: selectedEmoji,
        comment: comment
    };
   
    localStorage.setItem('moodEntry', JSON.stringify(data));
  
    console.log("Збережено:", JSON.stringify(data, null, 2));
});
