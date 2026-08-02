export const isToday = (dateString: string): boolean => {
  // Si no hay fecha, no es hoy.
  if (!dateString) {
    return false;
  }

  // 1. Obtenemos la fecha actual.
  const today = new Date();

  // 2. Descomponemos el string 'DD/MM/YYYY' en partes numéricas.
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // 3. Comparamos los valores.
  // Ojo: getMonth() devuelve el mes de 0 a 11, por eso le sumamos 1.
  const isSameDay = day === today.getDate();
  const isSameMonth = month === today.getMonth() + 1;
  const isSameYear = year === today.getFullYear();

  return isSameDay && isSameMonth && isSameYear;
}