#### Node.js chat
test
Стек технологий node.js + websockets + clientside js

#### Правила работы с репой
* Вся работа через Pull Request.
* Сделали ветку, закоммитили в нее, пушнули, сделали pull request. После обсуждения и ревью кода - вливаем в мастер

#### Запуск проекта
* В консоли выполняем
```
node server.js && node web.js
```

либо если стоит ruby и gem foreman

```
foreman start
```

В config/local.json оверрайдим настройки порта для веб-интерфейса
