const YANDEX_KEYWORDS = ['яндекс', 'yandex'];

function filterYandexVacancies() {
    const checkbox = document.getElementById('hideYandexCheckbox');
    if (!checkbox) return;

    const shouldHide = checkbox.checked;
    const vacancies = document.querySelectorAll('app-vacancy-card');

    vacancies.forEach(vacancy => {
        const vacancyText = vacancy.innerText.toLowerCase();
        const isYandexVacancy = YANDEX_KEYWORDS.some(keyword => vacancyText.includes(keyword));

        if (isYandexVacancy) {
            vacancy.style.display = shouldHide ? 'none' : 'block';
        }
    });
}

function addCheckbox() {
    const filtersContainer = document.querySelector('.b-vacancies-list-filters');
    if (!filtersContainer || document.getElementById('hideYandexCheckbox')) {
        return;
    }

    const newFilterBlock = document.createElement('div');
    newFilterBlock.className = 'b-vacancies-list-filters__block';
    newFilterBlock.innerHTML = `
        <h5 style="color: #205aed;">Фильтр расширения</h5>
        <div class="g-checkbox">
            <label for="hideYandexCheckbox" style="cursor: pointer;">
                <input type="checkbox" id="hideYandexCheckbox">
                <span>Скрыть Яндекс</span>
            </label>
        </div>
    `;

    filtersContainer.appendChild(newFilterBlock);

    const checkbox = document.getElementById('hideYandexCheckbox');

    chrome.storage.local.get(['hideYandex'], (result) => {
        if (result.hideYandex) {
            checkbox.checked = true;
        }
        filterYandexVacancies();
    });

    checkbox.addEventListener('change', (event) => {
        chrome.storage.local.set({ hideYandex: event.target.checked });
        filterYandexVacancies();
    });
}

const observer = new MutationObserver((mutations) => {
    addCheckbox();
    filterYandexVacancies();
});

const interval = setInterval(() => {
    const vacancyListContainer = document.querySelector('.col-md-8.col-sm-12');
    if (vacancyListContainer) {
        clearInterval(interval);
        observer.observe(vacancyListContainer, { childList: true, subtree: true });
        
        addCheckbox();
        filterYandexVacancies();
    }
}, 500);