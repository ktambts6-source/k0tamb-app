

const APP_VERSION = '3.2';

const CHANGES = [,
    '  ✅ Убрана чёрная линия под фото игрока на скачиваемой карточке статистики',
    '  📊 Уменьшен рандом при симуляции матчей — рейтинг и статистика игроков теперь влияют на исход значительно больше',
    '  🐛 Исправлены мелкие баги и улучшена общая стабильность приложения',
    '  ⚡ Улучшена производительность — страницы игроков загружаются быстрее',
    '  🗂️ Оптимизирована работа с хранилищем — меньше лишних записей в localStorage',
];  

function showChangelog() {

    const lastVersion = localStorage.getItem('appVersionShown');

    if (lastVersion === APP_VERSION) return;

    const modal = document.createElement('div');

    modal.className = 'changelog-modal';

    modal.innerHTML = `

        <div class="changelog-content">

            <div class="changelog-header">

                <h2>Что нового в версии ${APP_VERSION}</h2>

                <button class="changelog-close">&times;</button>

            </div>

            <div class="changelog-body">

                <ul>

                    ${CHANGES.map(change => `<li>${change}</li>`).join('')}

                </ul>

                <p style="margin-top: 20px; color: #aaa; font-size: 0.9rem;">

                    Спасибо, что пользуешься Standoff 2 k0tamb app!

                </p>

            </div>

            <div class="changelog-footer">

                <button class="btn btn-primary" id="changelogGotIt">Понятно</button>

            </div>

        </div>

    `;

    const style = document.createElement('style');

    style.textContent = `

        .changelog-modal {

            position: fixed;

            top: 0;

            left: 0;

            right: 0;

            bottom: 0;

            background: rgba(0, 0, 0, 0.6);

            display: flex;

            justify-content: center;

            align-items: center;

            z-index: 9999;

            font-family: 'Montserrat', sans-serif;

            backdrop-filter: blur(4px);

        }

        .changelog-content {

            background: rgba(26, 26, 46, 0.7);

            border-radius: 20px;

            max-width: 500px;

            width: 90%;

            max-height: 90vh;

            display: flex;

            flex-direction: column;

            border: 2px solid rgba(255, 107, 0, 0.5);

            color: white;

            box-shadow: 

                0 8px 32px rgba(0, 0, 0, 0.3),

                0 0 40px rgba(255, 107, 0, 0.15),

                inset 0 1px 2px rgba(255, 255, 255, 0.1),

                inset 0 -1px 2px rgba(0, 0, 0, 0.3);

            backdrop-filter: blur(10px) saturate(180%);

            -webkit-backdrop-filter: blur(10px) saturate(180%);

        }

        .changelog-header {

            flex-shrink: 0;

            display: flex;

            justify-content: space-between;

            align-items: center;

            padding: 20px;

            border-bottom: 1px solid rgba(255, 107, 0, 0.2);

            background: linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(255, 150, 0, 0.05));

        }

        .changelog-header h2 {

            background: linear-gradient(135deg, #ff6b00, #ff9500);

            -webkit-background-clip: text;

            -webkit-text-fill-color: transparent;

            background-clip: text;

            margin: 0;

            font-size: 1.5rem;

        }

        .changelog-close {

            background: rgba(255, 107, 0, 0.1);

            border: 1px solid rgba(255, 107, 0, 0.3);

            color: #ff6b00;

            font-size: 2rem;

            cursor: pointer;

            padding: 0;

            width: 40px;

            height: 40px;

            display: flex;

            align-items: center;

            justify-content: center;

            transition: all 0.3s ease;

            border-radius: 8px;

            backdrop-filter: blur(8px);

        }

        .changelog-close:hover {

            background: rgba(255, 107, 0, 0.2);

            border-color: rgba(255, 107, 0, 0.5);

            transform: scale(1.05);

        }

        .changelog-body {

            flex: 1;

            min-height: 0;

            overflow-y: auto;

            padding: 25px;

            line-height: 1.6;

        }

        .changelog-body ul {

            list-style: none;

            padding: 0;

            margin: 0;

        }

        .changelog-body li {

            padding: 12px 16px;

            border-left: 3px solid rgba(255, 107, 0, 0.4);

            display: flex;

            align-items: center;

            gap: 10px;

            margin: 8px 0;

            border-radius: 8px;

            background: rgba(255, 107, 0, 0.05);

            transition: all 0.3s ease;

        }

        .changelog-body li:hover {

            background: rgba(255, 107, 0, 0.1);

            border-left-color: rgba(255, 107, 0, 0.8);

            transform: translateX(4px);

        }

        .changelog-body li:last-child {

            margin-bottom: 0;

        }

        .changelog-footer {

            flex-shrink: 0;

            padding: 20px;

            border-top: 1px solid rgba(255, 107, 0, 0.2);

            text-align: right;

            background: linear-gradient(135deg, rgba(255, 107, 0, 0.05), rgba(255, 150, 0, 0.02));

        }

        .changelog-footer .btn {

            padding: 10px 25px;

            font-size: 1rem;

            background: linear-gradient(135deg, #ff6b00, #ff9500);

            border: 1px solid rgba(255, 107, 0, 0.5);

            box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);

            transition: all 0.3s ease;

        }

        .changelog-footer .btn:hover {

            box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);

            transform: translateY(-2px);

        }

    `;

    document.head.appendChild(style);

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.changelog-close');

    const gotItBtn = modal.querySelector('#changelogGotIt');

    function closeModal() {

        modal.remove();

        style.remove();

        localStorage.setItem('appVersionShown', APP_VERSION);

    }

    closeBtn.addEventListener('click', closeModal);

    gotItBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {

        if (e.target === modal) closeModal();

    });

}

window.addEventListener('load', showChangelog);