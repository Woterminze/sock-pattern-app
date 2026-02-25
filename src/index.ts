// Глобальные переменные
let selectedColor = '#ff0000'; // цвет по умолчанию в выборе цветов

// Размеры раппорта
let patternWidth = 10;   // ширина в клетках
let patternHeight = 10;  // высота в клетках

// Размер носка (из выпадающего списка)
let sockStitches = 60;   // всего петель
let sockRows = 45;       // всего рядов (пока не работает)

// Функция для создания таблицы-раппорта
function createGrid(): void {
    const container = document.getElementById('gridContainer');
    if (!container) {
        console.error('Контейнер не найден!');
        return;
    }
    
    const width = patternWidth;
    const height = patternHeight;
    
    console.log(`Создаю схему для раппорта ${width}×${height}`);
    
    const table = document.createElement('table');
    
    for (let r = 0; r < height; r++) {
        const tr = document.createElement('tr');

        for (let s = 0; s < width; s++) {
            const td = document.createElement('td');
            td.className = 'grid-cell';
            
            td.addEventListener('click', function() {
                this.style.backgroundColor = selectedColor;
                console.log(`Клик на клетке раппорта [${r}, ${s}]`);
            });
            
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }
    
    container.innerHTML = '';
    container.appendChild(table);
    
    console.log(`Раппорт создан`);
}

// Следим за изменениями полей ввода
function setupSizeControls(): void {
    // Поле ширины раппорта
    const widthInput = document.getElementById('patternWidth') as HTMLInputElement;
    if (widthInput) {
        widthInput.addEventListener('input', () => {
            const newWidth = parseInt(widthInput.value);
            if (newWidth > 0) {
                patternWidth = newWidth;
                console.log(`Ширина раппорта изменена на ${patternWidth}`);
                createGrid(); // пересоздание таблицы
            }
        });
    }
    
    // Поле высоты раппорта
    const heightInput = document.getElementById('patternHeight') as HTMLInputElement;
    if (heightInput) {
        heightInput.addEventListener('input', () => {
            const newHeight = parseInt(heightInput.value);
            if (newHeight > 0) {
                patternHeight = newHeight;
                console.log(`Высота раппорта изменена на ${patternHeight}`);
                createGrid(); // пересоздание таблицы 
            }
        });
    }
    
    // Выбор размера носка
    const sizeSelect = document.getElementById('sizeSelect') as HTMLSelectElement;
    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            sockStitches = parseInt(sizeSelect.value);
            console.log(`Размер носка: ${sockStitches} петель`);
            // TODO: обновлять превью
        });
    }
}

// Выбор цвета из палитры
function setupPalette(): void {
    const colorItems = document.querySelectorAll('.color-item');
    
    colorItems.forEach(item => {
        item.addEventListener('click', (e) => {
            colorItems.forEach(c => c.classList.remove('selected'));
            
            const target = e.target as HTMLElement;
            target.classList.add('selected');
            
            const color = target.getAttribute('data-color');
            if (color) {
                selectedColor = color;
                console.log('Выбран цвет:', selectedColor);
            }
        });
    });
}

// Ждем загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');
    
    createGrid();           // создаем таблицу
    setupPalette();         // настраиваем палитру
    setupSizeControls();    // настраиваем поля ввода
    
    console.log('Все готово! Можно рисовать раппорт');
});

console.log('Скрипт загружен');