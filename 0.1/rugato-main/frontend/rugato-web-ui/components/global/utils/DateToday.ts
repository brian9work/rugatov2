const getDateToday = () => {
   const now = new Date();
   // Convierte la fecha actual a la zona de México
   const mxNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));

   // Crea inicio y fin del día en esa zona
   const startDate = new Date(mxNow);
   startDate.setHours(0, 0, 0, 0);

   const endDate = new Date(mxNow);
   endDate.setHours(23, 59, 59, 999);

   // Formatea manualmente a "YYYY-MM-DDTHH:mm:ss"
   const formatDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

   const startStr = formatDate(startDate);
   const endStr = formatDate(endDate);

   return { startStr, endStr };
};

const getDateTomorrow = () => {
   const now = new Date();
   const tomorrow = new Date(now);
   tomorrow.setDate(now.getDate() + 1);
   // Convierte la fecha actual a la zona de México
   const mxNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));

   // Crea inicio y fin del día en esa zona
   const startDate = new Date(mxNow);
   startDate.setHours(0, 0, 0, 0);

   // Formatea manualmente a "YYYY-MM-DDTHH:mm:ss"
   const formatDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

   const startStr = formatDate(startDate);
   const endStr = formatDate(tomorrow);
   return { startStr, endStr };
};
const formatDateRange = (startDateInput: string, endDateInput: string) => {
   // Convierte las fechas de input (YYYY-MM-DD) a objetos Date en zona de México
   const parseToMxDate = (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      return new Date(date.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
   };

   const startDate = parseToMxDate(startDateInput);
   startDate.setHours(0, 0, 0, 0);

   const endDate = parseToMxDate(endDateInput);
   endDate.setHours(23, 59, 59, 999);

   // Formatea manualmente a "YYYY-MM-DDTHH:mm:ss"
   const formatDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

   const startStr = formatDate(startDate);
   const endStr = formatDate(endDate);

   return { startStr, endStr };
};


const formatDate = (dateInput: string) => {
   // Convierte las fechas de input (YYYY-MM-DD) a objetos Date en zona de México
   const parseToMxDate = (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      return new Date(date.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
   };

   const fDate = parseToMxDate(dateInput);
   fDate.setHours(0, 0, 0, 0);

   // Formatea manualmente a "YYYY-MM-DDTHH:mm:ss"
   const formatDateInternal = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

   return formatDateInternal(fDate);
};

export { getDateToday, getDateTomorrow, formatDateRange, formatDate };