import { NewOrder } from "../../../../Types";

const initialValues: NewOrder = {
   name: '',
   userId: 0,
   productId: 0,
   quantity: 1,
   categoryName: '',
   notes: '',
   details: '',
   size: 'Pieza', // Asigna uno de los valores permitidos por el tipo
   service: "Para llevar", // Asigna uno de los valores permitidos por el tipo
   total: 0,
   extras: [],
   extraprice: 0,
   table: 0
};

export default initialValues;