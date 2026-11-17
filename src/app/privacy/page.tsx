"use client";

import { useTranslation, type Lang } from "@/lib/i18n";

// TEMPLATE: have a lawyer review this text against the Law of the Republic of Tajikistan
// "On Personal Data Protection" and fill in the operator's legal details before going live.
type Section = { title: string; body: string[] };

const content: Record<Lang, { title: string; updated: string; sections: Section[] }> = {
  tj: {
    title: "Сиёсати махфият ва коркарди маълумоти шахсӣ",
    updated: "Нашри амалкунанда",
    sections: [
      {
        title: "1. Кӣ маълумотро коркард мекунад",
        body: [
          "Оператори маълумот — ташкилоте, ки платформаи DARMON-ро идора мекунад (номи ҳуқуқӣ, РМА ва суроға дар ин ҷо нишон дода мешаванд). Клиникаҳое, ки дар платформа кор мекунанд, барои маълумоти беморони худ масъуланд.",
        ],
      },
      {
        title: "2. Кадом маълумотро ҷамъ мекунем",
        body: [
          "Ному насаб, рақами телефон, email, шаҳр ва сурат (агар илова кунед).",
          "Маълумот дар бораи навбатҳо: духтур, сана, вақт, шикоятҳое, ки худатон менависед.",
          "Сабтҳои тиббӣ (протоколи қабул), ки духтури шумо месозад.",
          "Паёмҳо бо духтур ва пайвасти Telegram (агар фаъол кунед).",
        ],
      },
      {
        title: "3. Барои чӣ",
        body: [
          "Барои сабт ба қабул, огоҳ кардан дар бораи навбат (Telegram ё SMS), нигоҳ доштани корти тиббӣ ва алоқа бо духтур. Мо маълумотро намефурӯшем ва барои реклама истифода намебарем.",
        ],
      },
      {
        title: "4. Кӣ дастрасӣ дорад",
        body: [
          "Корти тиббиро танҳо худи шумо ва духтуроне, ки шумо ба онҳо сабт шудаед, мебинанд. Ҳар як кушодан ва тағйири корт сабт мешавад — шумо онро дар саҳифаи «Корти тиббӣ» мебинед.",
          "Регистратураи клиника танҳо навбатҳоро мебинад, на сабтҳои тиббиро.",
        ],
      },
      {
        title: "5. Нигоҳдорӣ ва ҳифз",
        body: [
          "Маълумот дар сервери ҳифзшуда нигоҳ дошта мешавад, паролҳо рамзгузорӣ шудаанд, нусхаи эҳтиётӣ ҳар рӯз гирифта мешавад.",
        ],
      },
      {
        title: "6. Ҳуқуқҳои шумо",
        body: [
          "Шумо метавонед маълумоти худро бинед, ислоҳ кунед, нусхаи онро талаб кунед ё розигиатонро бозпас гиред ва аккаунтро нест кунед. Барои ин ба дастгирӣ муроҷиат кунед.",
        ],
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности и обработки персональных данных",
    updated: "Действующая редакция",
    sections: [
      {
        title: "1. Кто обрабатывает данные",
        body: [
          "Оператор данных — организация, управляющая платформой DARMON (наименование, ИНН и адрес указываются здесь). Клиники, работающие на платформе, отвечают за данные своих пациентов.",
        ],
      },
      {
        title: "2. Какие данные мы собираем",
        body: [
          "ФИО, номер телефона, email, город и фото (если вы его добавили).",
          "Данные о записях: врач, дата, время, жалобы, которые вы указали.",
          "Медицинские записи (протокол приёма), которые составляет ваш врач.",
          "Сообщения с врачом и подключение Telegram (если вы его включили).",
        ],
      },
      {
        title: "3. Зачем",
        body: [
          "Для записи на приём, напоминаний о визите (Telegram или SMS), ведения медицинской карты и связи с врачом. Мы не продаём данные и не используем их для рекламы.",
        ],
      },
      {
        title: "4. Кто имеет доступ",
        body: [
          "Медицинскую карту видите только вы и врачи, к которым вы записывались. Каждый просмотр и изменение карты фиксируется — журнал доступен на странице «Медицинская карта».",
          "Регистратура клиники видит только записи на приём, но не медицинские данные.",
        ],
      },
      {
        title: "5. Хранение и защита",
        body: ["Данные хранятся на защищённом сервере, пароли хранятся в зашифрованном виде, резервные копии создаются ежедневно."],
      },
      {
        title: "6. Ваши права",
        body: [
          "Вы можете просмотреть и исправить свои данные, запросить их копию, отозвать согласие и удалить аккаунт. Для этого обратитесь в поддержку.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy and personal data policy",
    updated: "Current version",
    sections: [
      {
        title: "1. Who processes the data",
        body: [
          "The data operator is the organisation that runs the DARMON platform (legal name, tax ID and address go here). Clinics working on the platform are responsible for their patients' data.",
        ],
      },
      {
        title: "2. What we collect",
        body: [
          "Name, phone number, email, city and photo (if you add one).",
          "Appointment details: doctor, date, time and the symptoms you describe.",
          "Medical records (visit notes) written by your doctor.",
          "Messages with your doctor and your Telegram link (if you enable it).",
        ],
      },
      {
        title: "3. Why",
        body: [
          "To book visits, send reminders (Telegram or SMS), keep your medical card and let you talk to your doctor. We do not sell data or use it for advertising.",
        ],
      },
      {
        title: "4. Who can see it",
        body: [
          "Only you and the doctors you booked can see your medical card. Every view and change is logged, and you can see the log on the Medical card page.",
          "The clinic front desk sees appointments only, not medical records.",
        ],
      },
      {
        title: "5. Storage and security",
        body: ["Data is kept on a protected server, passwords are stored hashed and backups are made daily."],
      },
      {
        title: "6. Your rights",
        body: ["You can view, correct or export your data, withdraw consent and delete your account by contacting support."],
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useTranslation();
  const page = content[lang] ?? content.tj;

  return (
    <div className="pt-28 pb-20 px-6">
      <article className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl tracking-tight text-md-on-surface">{page.title}</h1>
          <p className="text-sm text-md-on-surface-variant">{page.updated}</p>
        </header>
        {page.sections.map((s) => (
          <section key={s.title} className="space-y-3">
            <h2 className="font-headline font-bold text-xl text-md-on-surface">{s.title}</h2>
            {s.body.length > 1 ? (
              <ul className="list-disc pl-6 space-y-1.5 text-md-on-surface-variant leading-relaxed">
                {s.body.map((p) => <li key={p}>{p}</li>)}
              </ul>
            ) : (
              <p className="text-md-on-surface-variant leading-relaxed">{s.body[0]}</p>
            )}
          </section>
        ))}
      </article>
    </div>
  );
}
