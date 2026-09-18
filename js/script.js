(() => {
  "use strict";

  const MS_PER_DAY = 86_400_000;
  const form = document.querySelector("#age-form");
  const birthDateInput = document.querySelector("#birth-date");
  const clearButton = document.querySelector("#clear-button");
  const errorMessage = document.querySelector("#date-error");
  const results = document.querySelector("#results");
  const birthdayBanner = document.querySelector("#birthday-banner");

  const output = {
    exactAge: document.querySelector("#exact-age"),
    totalMonths: document.querySelector("#total-months"),
    totalDays: document.querySelector("#total-days"),
    nextBirthday: document.querySelector("#next-birthday"),
    daysUntil: document.querySelector("#days-until"),
    birthWeekday: document.querySelector("#birth-weekday"),
    zodiacSign: document.querySelector("#zodiac-sign")
  };

  const numberFormatter = new Intl.NumberFormat("es-ES");
  const longDateFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric", month: "long", year: "numeric"
  });
  const weekdayFormatter = new Intl.DateTimeFormat("es-ES", { weekday: "long" });

  function startOfLocalDay(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function parseLocalDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
    return date;
  }

  function toUtcDayNumber(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY;
  }

  function daysBetween(start, end) {
    return Math.round(toUtcDayNumber(end) - toUtcDayNumber(start));
  }

  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  function birthdayInYear(birthDate, year) {
    const month = birthDate.getMonth();
    const day = birthDate.getDate();
    if (month === 1 && day === 29 && !isLeapYear(year)) return new Date(year, 1, 28);
    return new Date(year, month, day);
  }

  function lastBirthdayOnOrBefore(birthDate, today) {
    let birthday = birthdayInYear(birthDate, today.getFullYear());
    if (birthday > today) birthday = birthdayInYear(birthDate, today.getFullYear() - 1);
    return birthday;
  }

  function calculateExactAge(birthDate, today) {
    let years = today.getFullYear() - birthDate.getFullYear();
    const anniversary = birthdayInYear(birthDate, today.getFullYear());
    if (today < anniversary) years -= 1;

    const lastBirthday = birthdayInYear(birthDate, birthDate.getFullYear() + years);
    let months = 0;
    let cursor = new Date(lastBirthday);

    while (true) {
      const candidate = addCalendarMonthsClamped(lastBirthday, months + 1);
      if (candidate > today) break;
      cursor = candidate;
      months += 1;
    }
    return { years, months, days: daysBetween(cursor, today) };
  }

  function addCalendarMonthsClamped(date, monthsToAdd) {
    const targetFirst = new Date(date.getFullYear(), date.getMonth() + monthsToAdd, 1);
    const lastDay = new Date(targetFirst.getFullYear(), targetFirst.getMonth() + 1, 0).getDate();
    return new Date(targetFirst.getFullYear(), targetFirst.getMonth(), Math.min(date.getDate(), lastDay));
  }

  function getNextBirthday(birthDate, today) {
    let next = birthdayInYear(birthDate, today.getFullYear());
    if (next < today) next = birthdayInYear(birthDate, today.getFullYear() + 1);
    return next;
  }

  function getZodiacSign(date) {
    const monthDay = (date.getMonth() + 1) * 100 + date.getDate();
    const signs = [
      [120, "Capricornio"], [219, "Acuario"], [321, "Piscis"], [420, "Aries"],
      [521, "Tauro"], [621, "Géminis"], [723, "Cáncer"], [823, "Leo"],
      [923, "Virgo"], [1023, "Libra"], [1122, "Escorpio"], [1222, "Sagitario"],
      [1232, "Capricornio"]
    ];
    return signs.find(([limit]) => monthDay < limit)[1];
  }

  function pluralize(value, singular, plural) {
    return `${numberFormatter.format(value)} ${value === 1 ? singular : plural}`;
  }

  function validate(value) {
    if (!value) return { error: "Selecciona una fecha de nacimiento para continuar" };
    const birthDate = parseLocalDate(value);
    if (!birthDate) return { error: "No fue posible interpretar la fecha seleccionada" };
    if (birthDate > startOfLocalDay()) return { error: "La fecha de nacimiento no puede estar en el futuro" };
    return { birthDate };
  }

  function setValidationState(error = "") {
    errorMessage.textContent = error;
    birthDateInput.setAttribute("aria-invalid", String(Boolean(error)));
    birthDateInput.classList.toggle("is-invalid", Boolean(error));
    birthDateInput.classList.toggle("is-valid", !error && Boolean(birthDateInput.value));
  }

  function renderResults(birthDate) {
    const today = startOfLocalDay();
    const age = calculateExactAge(birthDate, today);
    const totalDays = daysBetween(birthDate, today);
    const lastBirthday = lastBirthdayOnOrBefore(birthDate, today);
    const totalMonths = age.years * 12 + Math.max(0, Math.floor(
      (lastBirthday.getMonth() - birthDate.getMonth()) + 12 * (lastBirthday.getFullYear() - birthDate.getFullYear() - age.years)
    )) + age.months;
    const nextBirthday = getNextBirthday(birthDate, today);
    const remainingDays = daysBetween(today, nextBirthday);
    const isBirthday = remainingDays === 0;

    output.exactAge.textContent = `Tienes ${pluralize(age.years, "año", "años")}, ${pluralize(age.months, "mes", "meses")} y ${pluralize(age.days, "día", "días")}.`;
    output.totalMonths.textContent = `Han transcurrido ${numberFormatter.format(totalMonths)} meses completos.`;
    output.totalDays.textContent = `Has vivido aproximadamente ${numberFormatter.format(totalDays)} días.`;
    output.nextBirthday.textContent = isBirthday
      ? "¡Tu cumpleaños es hoy!"
      : `Será el ${longDateFormatter.format(nextBirthday)}.`;
    output.daysUntil.textContent = isBirthday
      ? "No falta ningún día: ¡a celebrar!"
      : `Faltan ${pluralize(remainingDays, "día", "días")} para tu próximo cumpleaños.`;
    output.birthWeekday.textContent = `Naciste un ${weekdayFormatter.format(birthDate)}.`;
    output.zodiacSign.textContent = getZodiacSign(birthDate);
    birthdayBanner.hidden = !isBirthday;
    results.hidden = false;
    results.classList.remove("is-refreshing");
    void results.offsetWidth;
    results.classList.add("is-refreshing");
  }

  function calculateAndRender() {
    const validation = validate(birthDateInput.value);
    if (validation.error) {
      setValidationState(validation.error);
      results.hidden = true;
      return;
    }
    setValidationState();
    renderResults(validation.birthDate);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateAndRender();
  });

  birthDateInput.addEventListener("change", calculateAndRender);
  birthDateInput.addEventListener("input", () => {
    if (!birthDateInput.value) {
      setValidationState();
      results.hidden = true;
    }
  });

  clearButton.addEventListener("click", () => {
    form.reset();
    setValidationState();
    results.hidden = true;
    birthdayBanner.hidden = true;
    birthDateInput.focus();
  });

  birthDateInput.max = [
    new Date().getFullYear(),
    String(new Date().getMonth() + 1).padStart(2, "0"),
    String(new Date().getDate()).padStart(2, "0")
  ].join("-");
})();
