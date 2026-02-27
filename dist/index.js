"use strict";
// Глобальные переменные
let selectedColor = '#ff0000'; // цвет по умолчанию в выборе цветов
// Размеры раппорта
let patternWidth = 10; // ширина в клетках
let patternHeight = 10; // высота в клетках
// Размер носка (из выпадающего списка)
let sockStitches = 60; // всего петель
let sockRows = 45; // всего рядов (пока не работает)
// Функция для создания таблицы-раппорта
function createGrid() {
    const container = document.getElementById('gridContainer');
    if (!container) {
        console.error('Контейнер не найден!');
        return;
    }
    const width = patternWidth;
    const height = patternHeight;
    console.log(`Создаем схему для раппорта ${width}×${height}`);
    const table = document.createElement('table');
    for (let r = 0; r < height; r++) {
        const tr = document.createElement('tr');
        for (let s = 0; s < width; s++) {
            const td = document.createElement('td');
            td.className = 'grid-cell';
            td.addEventListener('click', function () {
                this.style.backgroundColor = selectedColor;
                console.log(`Клик на клетке раппорта [${r}, ${s}]`);
                updatePreview();
            });
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.innerHTML = '';
    container.appendChild(table);
    console.log(`Раппорт создан`);
}
// Новая функция для получения цветов из таблицы
function getPatternColors() {
    const table = document.querySelector('#gridContainer table');
    if (!table)
        return [];
    const patternColors = [];
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, r) => {
        patternColors[r] = [];
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, c) => {
            const color = window.getComputedStyle(cell).backgroundColor;
            patternColors[r][c] = color;
        });
    });
    return patternColors;
}
// Новая функция для рисования узора в заданной области
function drawPattern(ctx, colors, x, y, width, height) {
    if (!colors.length || !colors[0].length)
        return;
    const patternWidth = colors[0].length;
    const patternHeight = colors.length;
    const cellWidth = width / sockStitches;
    const cellHeight = height / patternHeight;
    const repeats = Math.floor(sockStitches / patternWidth);
    const remainder = sockStitches % patternWidth;
    for (let repeat = 0; repeat < repeats; repeat++) {
        for (let r = 0; r < patternHeight; r++) {
            for (let c = 0; c < patternWidth; c++) {
                const cellX = x + (repeat * patternWidth + c) * cellWidth;
                const cellY = y + r * cellHeight;
                ctx.fillStyle = colors[r]?.[c] || '#ffffff';
                ctx.fillRect(cellX, cellY, cellWidth - 1, cellHeight - 1);
            }
        }
    }
    if (remainder > 0) {
        for (let r = 0; r < patternHeight; r++) {
            for (let c = 0; c < remainder; c++) {
                const cellX = x + (repeats * patternWidth + c) * cellWidth;
                const cellY = y + r * cellHeight;
                ctx.fillStyle = colors[r]?.[c] || '#ffffff';
                ctx.fillRect(cellX, cellY, cellWidth - 1, cellHeight - 1);
            }
        }
    }
}
// ОБНОВЛЕННАЯ функция для обновления превью с зонами носка
function updatePreview() {
    console.log('updatePreview вызвана!');
    const canvas = document.getElementById('previewCanvas');
    if (!canvas) {
        console.error('Canvas не найден!');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Получаем настройки
    const patternOnLeg = document.getElementById('patternOnLeg')?.checked || false;
    const patternOnFoot = document.getElementById('patternOnFoot')?.checked || false;
    const heelColor = document.getElementById('heelColor')?.value || '#cccccc';
    // Получаем цвета из таблицы-раппорта
    const patternColors = getPatternColors();
    // Размеры зон носка (в пикселях)
    const zones = {
        cuff: 50, // резинка
        leg: 120, // паголенок
        heel: 40, // пятка
        foot: 120, // стопа
        toe: 40 // мысок
    };
    let y = 10; // начальная позиция по Y
    // 1. Рисуем резинку
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(50, y, 200, zones.cuff);
    ctx.strokeStyle = '#999';
    ctx.strokeRect(50, y, 200, zones.cuff);
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Резинка', 120, y + 25);
    y += zones.cuff;
    // 2. Рисуем паголенок
    ctx.strokeStyle = '#999';
    ctx.strokeRect(50, y, 200, zones.leg);
    if (patternOnLeg && patternColors.length > 0) {
        // Рисуем узор на паголенке
        drawPattern(ctx, patternColors, 50, y, 200, zones.leg);
    }
    else {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(51, y + 1, 199, zones.leg - 1);
    }
    ctx.fillStyle = '#333';
    ctx.fillText('Паголенок', 120, y + 25);
    y += zones.leg;
    // 3. Рисуем пятку
    ctx.fillStyle = heelColor;
    ctx.fillRect(50, y, 200, zones.heel);
    ctx.strokeStyle = '#999';
    ctx.strokeRect(50, y, 200, zones.heel);
    ctx.fillStyle = '#333';
    ctx.fillText('Пятка', 130, y + 25);
    y += zones.heel;
    // 4. Рисуем стопу
    ctx.strokeStyle = '#999';
    ctx.strokeRect(50, y, 200, zones.foot);
    if (patternOnFoot && patternColors.length > 0) {
        // Рисуем узор на стопе
        drawPattern(ctx, patternColors, 50, y, 200, zones.foot);
    }
    else {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(51, y + 1, 199, zones.foot - 1);
    }
    ctx.fillStyle = '#333';
    ctx.fillText('Стопа', 130, y + 25);
    y += zones.foot;
    // 5. Рисуем мысок
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(50, y, 200, zones.toe);
    ctx.strokeStyle = '#999';
    ctx.strokeRect(50, y, 200, zones.toe);
    ctx.fillStyle = '#333';
    ctx.fillText('Мысок', 130, y + 25);
    // Показываем количество повторов
    const repeats = Math.floor(sockStitches / patternWidth);
    const repeatsSpan = document.getElementById('repeatsCount');
    if (repeatsSpan) {
        repeatsSpan.textContent = repeats.toString();
    }
}
// Следим за изменениями полей ввода
function setupSizeControls() {
    // Поле ширины раппорта
    const widthInput = document.getElementById('patternWidth');
    if (widthInput) {
        widthInput.addEventListener('input', () => {
            const newWidth = parseInt(widthInput.value);
            if (newWidth > 0) {
                patternWidth = newWidth;
                console.log(`Ширина раппорта изменена на ${patternWidth}`);
                createGrid();
                updatePreview();
            }
        });
    }
    // Поле высоты раппорта
    const heightInput = document.getElementById('patternHeight');
    if (heightInput) {
        heightInput.addEventListener('input', () => {
            const newHeight = parseInt(heightInput.value);
            if (newHeight > 0) {
                patternHeight = newHeight;
                console.log(`Высота раппорта изменена на ${patternHeight}`);
                createGrid();
                updatePreview();
            }
        });
    }
    // Выбор размера носка
    const sizeSelect = document.getElementById('sizeSelect');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            sockStitches = parseInt(sizeSelect.value);
            console.log(`Размер носка: ${sockStitches} петель`);
            updatePreview();
        });
    }
}
// Выбор цвета из палитры
function setupPalette() {
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach(item => {
        item.addEventListener('click', (e) => {
            colorItems.forEach(c => c.classList.remove('selected'));
            const target = e.target;
            target.classList.add('selected');
            const color = target.getAttribute('data-color');
            if (color) {
                selectedColor = color;
                console.log('Выбран цвет:', selectedColor);
            }
        });
    });
}
// НОВАЯ функция для настроек носка
function setupSockSettings() {
    const patternOnLeg = document.getElementById('patternOnLeg');
    const patternOnFoot = document.getElementById('patternOnFoot');
    const heelColor = document.getElementById('heelColor');
    if (patternOnLeg) {
        patternOnLeg.addEventListener('change', updatePreview);
    }
    if (patternOnFoot) {
        patternOnFoot.addEventListener('change', updatePreview);
    }
    if (heelColor) {
        heelColor.addEventListener('input', updatePreview);
    }
}
// Ждем загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');
    createGrid();
    updatePreview();
    setupPalette();
    setupSizeControls();
    setupSockSettings();
    console.log('Все готово! Можно рисовать раппорт');
});
console.log('Скрипт загружен');
//# sourceMappingURL=index.js.map