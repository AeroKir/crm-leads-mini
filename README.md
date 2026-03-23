# CRM Leads Mini (MVP)

Міні CRM-модуль для роботи з лідами, реалізований як тестове завдання на Vue 3.

## 🧩 Стек

- Vue 3 (Composition API)
- TypeScript
- Vite
- Vuetify
- Pinia
- Vue Router

---

## 🚀 Функціонал

### Список лідів (`/leads`)
- таблиця лідів
- пошук (debounce 300ms)
- фільтри:
  - статус (multi-select)
  - owner
  - source
  - createdAt (від / до)
- сортування по колонках
- пагінація (10 / 20 / 50)
- bulk action (масова зміна статусу)
- клік по рядку → сторінка деталей

### Деталі ліда (`/leads/:id`)
- повна інформація по ліду
- зміна статусу
- нотатки / активність
- додавання нотатки
- оновлення `lastActivityAt`
- обробка `Lead not found`

### Додатково
- створення ліда (діалог)
- валідація:
  - телефон
  - порожня нотатка
- loading overlay при збереженні (імітація API)

---

## 🔗 Query params

Стан списку синхронізується з URL:

- `search`
- `status`
- `owner`
- `page`
- `sort`

Додатково:
- `source`
- `createdFrom`
- `createdTo`
- `perPage`

👉 При відкритті посилання стан списку повністю відновлюється.

---

## 📊 Data generation

Дані згенеровані через кастомний генератор для імітації реального середовища.

```bash
npm run generate:leads
````

Попередньо згенерований JSON вже включений у проєкт.

---

## 📁 Структура

```bash
src/
 ├── components/leads/
 │   ├── LeadCreateDialog.vue
 │   ├── LeadsFilters.vue
 │   └── LeadsTable.vue
 ├── composables/
 │   ├── useCreateLeadDialog.ts
 │   ├── useLeadDetails.ts
 │   ├── useLeads.ts
 │   ├── useLeadsListPage.ts
 │   └── useDebounce.ts
 ├── data/
 │   └── leads.json
 ├── pages/
 │   ├── LeadsListPage.vue
 │   └── LeadDetailsPage.vue
 ├── stores/
 │   └── useLeadsStore.ts
 ├── types/
 │   └── lead.ts
 └── utils/
     └── generateLeads.ts

scripts/
 └── generate.ts
```

---

## 🧠 Архітектура

* **Pinia store** — єдине джерело стану:

  * leads
  * filters
  * search
  * sort
  * pagination
  * notes

* **Composables** — винесення бізнес-логіки з компонентів:

  * `useLeads` — доступ до store
  * `useLeadsListPage` — логіка списку + query params
  * `useLeadDetails` — логіка сторінки деталей
  * `useCreateLeadDialog` — форма створення ліда

* **Query params як state**
  URL повністю відображає стан таблиці

* **Локальні дані**
  Робота без бекенду через JSON + генератор

👉 Компоненти залишаються максимально “тупими” (UI only)

---

## ⚙️ Запуск

```bash
npm install
npm run dev
```

(опціонально)

```bash
npm run generate:leads
```

---

## 📌 Примітка

Проєкт реалізовано без бекенду. Всі дані обробляються локально з імітацією асинхронних операцій.
