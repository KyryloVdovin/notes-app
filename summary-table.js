let popupBg = document.querySelector('.popup__bg');
let popup = document.querySelector('.popup');

function showSummaryTable(e, category) {
    e.preventDefault(); // Предотвращаем дефолтное поведение браузера
    popupBg.classList.add('active'); // Добавляем класс 'active' для фона
    popup.classList.add('active'); // И для самого окна
    setCategory(category);
    showArchivedTasks(e, category);
}
function hideSummaryTable(e) {
    e.preventDefault();
    popupBg.classList.remove('active');
    popup.classList.remove('active');
}