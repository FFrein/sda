# sda

Steam desctop auth

## Libraries

### Frontend

[tanstack router](https://tanstack.com/router/latest/docs/framework/react/quick-start)
[Zustand](https://zustand-demo.pmnd.rs/)
[mui](https://mui.com/)
[react-toastify](https://www.npmjs.com/package/react-toastify)
[react-hook-forms](https://react-hook-form.com/)
[yup](https://www.npmjs.com/package/yup)

### Backend

[steam-user](https://github.com/DoctorMcKay/node-steam-session)
[steam-totp](https://github.com/DoctorMcKay/node-steam-totp)
[steamcommunity](https://github.com/DoctorMcKay/node-steamcommunity)
[steam-tradeoffer-manager](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager)
[electron-store](https://www.npmjs.com/package/electron-store/v/5.2.0)

## Architecture

[Architecture](https://habr.com/ru/companies/doubletapp/articles/870236/)

# TODO

- (Важно) настроить electronUpdater
- (Важно) автоматическая авторизация аккаунтов, при выборе определённого аккаунта приоритет его авторизации выше
  Сейчас делаю это
  Добавляю стор на фронте
  Потом логику авторизации на бэке
  Потом отправка уведа о успешном или нет auth
  Изменение стора на фронте в зависимости от результата

- (Важно) настроить конфигурационный файл для обработки ошибок
- Сделать кнопку активации автоавторизации аккаунтов
  и кнопку ручной авторизации после нажатии на которую будет таймер.
- (Важно) создание маФайла (подключение двухфакторки)
- сделать вывод списка с пагинацией универсальным компонентом
- логирование в файл
- на фронте страница с логирование
- протестировать работу с файлами и сохранением. Мне кажется может быть проблема с записью. Можно какой-нибудь тротлер
- кнопка со списком уведов и подтверждений на каждый аккаунт
- исправить синхронизацию времени со стим для получения нормального offset
- удалить комментарии
- типизировать библиотеки и получаемые результаты
- компонент со списком мобильных пожтверждений
- компонент с настройками прилаги
