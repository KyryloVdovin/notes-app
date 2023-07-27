let popupBg = document.querySelector('.popup__bg');
let popup = document.querySelector('.popup');

function showSummaryTable(e) {
    e.preventDefault(); // Предотвращаем дефолтное поведение браузера
    popupBg.classList.add('active'); // Добавляем класс 'active' для фона
    popup.classList.add('active'); // И для самого окна
    showArchivedTasks(e);
}
function hideSummaryTable(e) {
    e.preventDefault();
    popupBg.classList.remove('active');
    popup.classList.remove('active');
}