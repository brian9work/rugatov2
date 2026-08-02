import Service from "../../../../service/service";
import { FinancesRequest } from "../../../../TypesBackend";

const handleAddExpense = async (
    addfinance: FinancesRequest,
    type: "gasto" | "ingreso",
    toast: any,
    add: any,
    error: any,
    refetch: any,
    onClose: any
) => {
    const response = await add(
        type === "gasto" ?
            Service.finances.addExpense() :
            Service.finances.addRevenue(),
        addfinance
    )

    if (!response?.success) {
        console.error('Error al guardar:', error);
        toast({
            title: 'Error al guardar.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    toast({
        title: 'Nuevo usuario guardado.',
        status: 'success',
        duration: 3000,
        isClosable: true,
    });

    await refetch();
    onClose()
}


export default handleAddExpense;