let popupBg = document.querySelector('.popup__bg');
let popup = document.querySelector('.popup');

function showSummaryTable(e, category) {
    e.preventDefault();
    popupBg.classList.add('active');
    popup.classList.add('active');
    setCategory(category);
    showArchivedTasks(e, category);
}
function hideSummaryTable(e) {
    e.preventDefault();
    popupBg.classList.remove('active');
    popup.classList.remove('active');
}