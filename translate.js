const categories = [
    { "name": "Тибби умумӣ", "ru": "Общая медицина", "en": "General Medicine", "subcategories": [
        { "tj": "Терапевт", "ru": "Терапевт", "en": "Therapist" },
        { "tj": "Духтури оилавӣ", "ru": "Семейный врач", "en": "Family Doctor" },
        { "tj": "Духтури умумӣ", "ru": "Врач общей практики", "en": "General Practitioner" }
    ]},
    { "name": "Бемориҳои дохилӣ", "ru": "Внутренние болезни", "en": "Internal Diseases", "subcategories": [
        { "tj": "Кардиолог", "ru": "Кардиолог", "en": "Cardiologist" },
        { "tj": "Эндокринолог", "ru": "Эндокринолог", "en": "Endocrinologist" },
        { "tj": "Гастроэнтеролог", "ru": "Гастроэнтеролог", "en": "Gastroenterologist" },
        { "tj": "Нефролог", "ru": "Нефролог", "en": "Nephrologist" },
        { "tj": "Пулмонолог", "ru": "Пульмонолог", "en": "Pulmonologist" },
        { "tj": "Ревматолог", "ru": "Ревматолог", "en": "Rheumatologist" },
        { "tj": "Гематолог", "ru": "Гематолог", "en": "Hematologist" },
        { "tj": "Гепатолог", "ru": "Гепатолог", "en": "Hepatologist" }
    ]},
    { "name": "Асаб ва рӯҳӣ", "ru": "Неврология и психиатрия", "en": "Neurology & Psychiatry", "subcategories": [
        { "tj": "Невролог", "ru": "Невролог", "en": "Neurologist" },
        { "tj": "Нейрохирург", "ru": "Нейрохирург", "en": "Neurosurgeon" },
        { "tj": "Психиатр", "ru": "Психиатр", "en": "Psychiatrist" },
        { "tj": "Психотерапевт", "ru": "Психотерапевт", "en": "Psychotherapist" },
        { "tj": "Нарколог", "ru": "Нарколог", "en": "Narcologist" },
        { "tj": "Нейропсихолог", "ru": "Нейропсихолог", "en": "Neuropsychologist" }
    ]},
    { "name": "Ҷарроҳӣ", "ru": "Хирургия", "en": "Surgery", "subcategories": [
        { "tj": "Ҷарроҳи умумӣ", "ru": "Общий хирург", "en": "General Surgeon" },
        { "tj": "Кардиохирург", "ru": "Кардиохирург", "en": "Cardiac Surgeon" },
        { "tj": "Ҷарроҳи шикам", "ru": "Абдоминальный хирург", "en": "Abdominal Surgeon" },
        { "tj": "Ҷарроҳи пластикӣ", "ru": "Пластический хирург", "en": "Plastic Surgeon" },
        { "tj": "Ҷарроҳи рагҳо", "ru": "Сосудистый хирург", "en": "Vascular Surgeon" }
    ]},
    { "name": "Устухон ва ҳаракат", "ru": "Ортопедия", "en": "Orthopedics", "subcategories": [
        { "tj": "Травматолог", "ru": "Травматолог", "en": "Traumatologist" },
        { "tj": "Ортопед", "ru": "Ортопед", "en": "Orthopedist" },
        { "tj": "Вертебролог", "ru": "Вертебролог", "en": "Vertebrologist" },
        { "tj": "Подолог", "ru": "Подолог", "en": "Podiatrist" }
    ]},
    { "name": "Кӯдакон", "ru": "Педиатрия", "en": "Pediatrics", "subcategories": [
        { "tj": "Педиатр", "ru": "Педиатр", "en": "Pediatrician" },
        { "tj": "Неонатолог", "ru": "Неонатолог", "en": "Neonatologist" },
        { "tj": "Ҷарроҳи кӯдакона", "ru": "Детский хирург", "en": "Pediatric Surgeon" },
        { "tj": "Неврологи кӯдакона", "ru": "Детский невролог", "en": "Pediatric Neurologist" },
        { "tj": "Стоматологи кӯдакона", "ru": "Детский стоматолог", "en": "Pediatric Dentist" }
    ]},
    { "name": "Саломатии занон", "ru": "Женское здоровье", "en": "Women's Health", "subcategories": [
        { "tj": "Гинеколог", "ru": "Гинеколог", "en": "Gynecologist" },
        { "tj": "Акушер-гинеколог", "ru": "Акушер-гинеколог", "en": "Obstetrician-Gynecologist" },
        { "tj": "Репродуктолог", "ru": "Репродуктолог", "en": "Reproductologist" },
        { "tj": "Гинеколог-эндокринолог", "ru": "Гинеколог-эндокринолог", "en": "Gynecologist-Endocrinologist" },
        { "tj": "Маммолог", "ru": "Маммолог", "en": "Mammologist" }
    ]},
    { "name": "Саломатии мардон", "ru": "Мужское здоровье", "en": "Men's Health", "subcategories": [
        { "tj": "Уролог", "ru": "Уролог", "en": "Urologist" },
        { "tj": "Андролог", "ru": "Андролог", "en": "Andrologist" }
    ]},
    { "name": "Аъзои ҳис", "ru": "Органы чувств", "en": "Sensory Organs", "subcategories": [
        { "tj": "Офтальмолог", "ru": "Офтальмолог", "en": "Ophthalmologist" },
        { "tj": "Сурдолог", "ru": "Сурдолог", "en": "Audiologist" },
        { "tj": "Аудиолог", "ru": "Аудиолог", "en": "Audiologist" },
        { "tj": "Фониатр", "ru": "Фониатр", "en": "Phoniatrist" }
    ]},
    { "name": "ЛОР", "ru": "ЛОР", "en": "ENT", "subcategories": [
        { "tj": "Отоларинголог (ЛОР)", "ru": "Отоларинголог (ЛОР)", "en": "Otolaryngologist (ENT)" }
    ]},
    { "name": "Дандон", "ru": "Стоматология", "en": "Dentistry", "subcategories": [
        { "tj": "Стоматолог", "ru": "Стоматолог", "en": "Dentist" },
        { "tj": "Стоматолог-терапевт", "ru": "Стоматолог-терапевт", "en": "Therapeutic Dentist" },
        { "tj": "Стоматолог-ортопед", "ru": "Стоматолог-ортопед", "en": "Prosthodontist" },
        { "tj": "Ҷарроҳи ҷоғ", "ru": "Челюстно-лицевой хирург", "en": "Maxillofacial Surgeon" }
    ]},
    { "name": "Пӯст ва зебоӣ", "ru": "Дерматология и косметология", "en": "Dermatology & Beauty", "subcategories": [
        { "tj": "Дерматолог", "ru": "Дерматолог", "en": "Dermatologist" },
        { "tj": "Дерматовенеролог", "ru": "Дерматовенеролог", "en": "Dermatovenereologist" },
        { "tj": "Косметолог", "ru": "Косметолог", "en": "Cosmetologist" },
        { "tj": "Трихолог", "ru": "Трихолог", "en": "Trichologist" }
    ]},
    { "name": "Сироят ва иммунитет", "ru": "Инфекции и иммунитет", "en": "Infections & Immunity", "subcategories": [
        { "tj": "Инфексионист", "ru": "Инфекционист", "en": "Infectious Disease Specialist" },
        { "tj": "Иммунолог", "ru": "Иммунолог", "en": "Immunologist" },
        { "tj": "Аллерголог", "ru": "Аллерголог", "en": "Allergist" },
        { "tj": "Эпидемиолог", "ru": "Эпидемиолог", "en": "Epidemiologist" },
        { "tj": "Паразитолог", "ru": "Паразитолог", "en": "Parasitologist" }
    ]},
    { "name": "Ташхис", "ru": "Диагностика", "en": "Diagnostics", "subcategories": [
        { "tj": "Духтури УЗИ", "ru": "Врач УЗИ", "en": "Ultrasound Doctor" },
        { "tj": "Рентгенолог", "ru": "Рентгенолог", "en": "Radiologist" },
        { "tj": "Радиолог", "ru": "Радиолог", "en": "Radiologist" },
        { "tj": "Лаборант", "ru": "Лаборант", "en": "Laboratory Technician" },
        { "tj": "Эндоскопист", "ru": "Эндоскопист", "en": "Endoscopist" }
    ]},
    { "name": "Ёрии таъҷилӣ", "ru": "Скорая помощь", "en": "Emergency", "subcategories": [
        { "tj": "Анестезиолог", "ru": "Анестезиолог", "en": "Anesthesiologist" },
        { "tj": "Реаниматолог", "ru": "Реаниматолог", "en": "Resuscitator" },
        { "tj": "Духтури ёрии таъҷилӣ", "ru": "Врач скорой помощи", "en": "Emergency Doctor" }
    ]},
    { "name": "Барқарорсозӣ", "ru": "Реабилитация", "en": "Rehabilitation", "subcategories": [
        { "tj": "Физиотерапевт", "ru": "Физиотерапевт", "en": "Physiotherapist" },
        { "tj": "Реабилитолог", "ru": "Реабилитолог", "en": "Rehabilitologist" },
        { "tj": "ЛФК", "ru": "Врач ЛФК", "en": "Physical Therapist" },
        { "tj": "Массажист", "ru": "Массажист", "en": "Masseur" },
        { "tj": "Остеопат", "ru": "Остеопат", "en": "Osteopath" }
    ]},
    { "name": "Онкология", "ru": "Онкология", "en": "Oncology", "subcategories": [
        { "tj": "Онколог", "ru": "Онколог", "en": "Oncologist" },
        { "tj": "Онкоҷарроҳ", "ru": "Онкохирург", "en": "Oncosurgeon" },
        { "tj": "Радиотерапевт", "ru": "Радиотерапевт", "en": "Radiotherapist" },
        { "tj": "Фтизиатр", "ru": "Фтизиатр", "en": "Phthisiatrician" }
    ]},
    { "name": "Ғизо ва варзиш", "ru": "Питание и спорт", "en": "Nutrition & Sports", "subcategories": [
        { "tj": "Диетолог", "ru": "Диетолог", "en": "Dietitian" },
        { "tj": "Духтури варзишӣ", "ru": "Спортивный врач", "en": "Sports Doctor" }
    ]},
    { "name": "Соҳаҳои махсус", "ru": "Специальные области", "en": "Specialties", "subcategories": [
        { "tj": "Генетик", "ru": "Генетик", "en": "Geneticist" },
        { "tj": "Фармакологи клиникӣ", "ru": "Клинический фармаколог", "en": "Clinical Pharmacologist" },
        { "tj": "Судмедэксперт", "ru": "Судмедэксперт", "en": "Forensic Medical Expert" }
    ]}
];

let tj = "";
let ru = "";
let en = "";

categories.forEach(c => {
    tj += `    "${c.name}": "${c.name}",\n`;
    ru += `    "${c.name}": "${c.ru}",\n`;
    en += `    "${c.name}": "${c.en}",\n`;
    c.subcategories.forEach(s => {
        tj += `    "${s.tj}": "${s.tj}",\n`;
        ru += `    "${s.tj}": "${s.ru}",\n`;
        en += `    "${s.tj}": "${s.en}",\n`;
    });
});

console.log("=== TJ ===");
console.log(tj);
console.log("=== RU ===");
console.log(ru);
console.log("=== EN ===");
console.log(en);
