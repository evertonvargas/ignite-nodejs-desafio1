export function formatDate() {
  const currentDate = new Date();
  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const formattedDate =
    currentDate.toLocaleDateString("pt-BR", dateOptions) +
    " " +
    currentDate.toLocaleTimeString("pt-BR", timeOptions);
  return formattedDate;
}
