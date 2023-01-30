export default {
  startOption: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "З чого почати?🤔", callback_data: "/info" },
          { text: "«Freelance Academy UA»", callback_data: "/academy" },
        ],
      ],
    }),
  },
  infoOption: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "«Storiesmaker»", callback_data: "storiesmaker" },
          { text: "Продажі без реклами", callback_data: "sales_not_adv" },
        ],
        [
          {
            text: "Базовий курс по візуалу",
            callback_data: "base_course_visual",
          },
          { text: "Stories - інструмент продажі", callback_data: "stories" },
        ],
        [
          { text: "Контент мейкер", callback_data: "content_maker" },
          { text: "Мобільний відеомонтаж", callback_data: "mobile_video" },
        ],
        [{ text: "Інтернет магазин від А до Я", callback_data: "online_shop" }],
      ],
    }),
  },
  academyOption: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "1 тариф - 800грн", callback_data: "1" },
          { text: "2 тариф - 1200грн", callback_data: "2" },
        ],
        [
          { text: "3 тариф - 2000грн", callback_data: "3" },
          { text: "4 тариф - 2800грн", callback_data: "4" },
        ],
      ],
    }),
  },
  academyTarifsOptons: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Зробити замовлення ☑️", callback_data: "order" }],
        [{ text: "Повернутись до тарифів ↩️", callback_data: "/academy" }],
      ],
    }),
  },
  infoTarifsOptons: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Зробити замовлення ☑️", callback_data: "order" }],
        [{ text: "Повернутись до списку ↩️", callback_data: "/info" }],
      ],
    }),
  },
};
