import { Carrito, NewOrder } from "../../../../Types";

const handleAddProduct = (
   values: NewOrder,
   setCartItems: React.Dispatch<React.SetStateAction<Carrito[]>>,
   cartItems: Carrito[],
   onCloseAdd: () => void
) => {
   const quantity = values.quantity ?? 1;

   const baseTotal =
      Number(values.total) + Number(values.extraprice || 0);

   const newItems: Carrito[] = Array.from({ length: quantity }).map((_, i) => ({
      id: Date.now() + i,
      userId: 1,
      productId: values.productId,
      name: values.name,
      categoryName: values.categoryName,
      service: values.service,
      statusId: 1,
      details: values.details,
      notes: values.notes,
      coustumer: values.table,
      total: baseTotal,
   }));

   setCartItems([...cartItems, ...newItems]);
   onCloseAdd();
};

export default handleAddProduct;
