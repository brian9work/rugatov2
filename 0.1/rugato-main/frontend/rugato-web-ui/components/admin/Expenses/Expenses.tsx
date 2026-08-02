import React, { useEffect } from 'react'
import { Box } from '@chakra-ui/react/box'
import { Button, HStack, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, Input, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast, Stack, } from '@chakra-ui/react'
import Colors from '../../../contants/Colors'
import { Expense, Revenue, ExpenseBack } from '../../../Types'
import { FinancesResponse } from '../../../TypesBackend'
import { useGet } from '../../../hooks/GetWithCallback'
import Service from '../../../service/service'
import { ModalAddExpense } from './ModalAddExpense'
import { ExpenseResume } from './ExpenseResume'
import { TbPigMoney } from "react-icons/tb";
import { usePost } from '../../../hooks/Post'

export default function Expenses() {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure()
   const {
      data,
      loading: cargandoFinances,
      error: error,
      refetch: refetchFinances,
   } = useGet<FinancesResponse>(Service.finances.getToday());

   const {
      data: cashbox,
      loading: cargandoCashbox,
      error: errorCashbox,
      refetch: refetchCashbox,
   } = useGet<number>(Service.finances.getCashboxToday());

   const [tipo, setTipo] = React.useState<"gasto" | "ingreso">("gasto");
   const [HistorialList, setHistorialList] = React.useState<Expense[]>([]);

   // Calculate totals efficiently in a single pass
   const { ingresosTotal, gastosTotal } = React.useMemo(() => {
      return HistorialList.reduce(
         (acc, item) => {
            if (item.type === "ingreso") acc.ingresosTotal += item.amount;
            else if (item.type === "gasto") acc.gastosTotal += item.amount;
            return acc;
         },
         { ingresosTotal: 0, gastosTotal: 0 }
      );
   }, [HistorialList]);

   const total = (cashbox || 0) + ingresosTotal - gastosTotal;

   const transformRevenue = (revenue: Revenue[]): Expense[] => {
      return revenue.map((item) => ({
         id: item.id || 0,
         type: "ingreso",
         amount: Number(item.quantity),
         reason: item.reason,
         date: item.createdAt || "",
      }))
   }

   const transformExpense = (expense: ExpenseBack[]): Expense[] => {
      return expense.map((item) => ({
         id: item.id || 0,
         type: "gasto",
         amount: Number(item.quantity),
         reason: item.reason,
         date: item.createdAt || "",
      }))
   }

   useEffect(() => {
      if (data) {
         const expenses = transformExpense(data.expenses);
         const revenues = transformRevenue(data.revenues);
         const history = [...expenses, ...revenues];
         history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
         setHistorialList(history);
      }
   }, [data]);

   return (
      <Box>
         <HStack
            bg={Colors.bgSecondary}
            width={"250"}
            p={3}
            mb={3}
            rounded={"md"}
         >
            <Text><TbPigMoney color={Colors.green} size={"22px"} /></Text>
            <Text>Dinero en caja:</Text>
            <Text color={Colors.green} fontWeight={"bold"}>$ {cashbox || "..."}</Text>
         </HStack>
         <HStack justifyContent={"space-between"} mb={5} spacing={5}>
            <ExpenseResume
               type="total"
               cant={total}
            />
            <ExpenseResume
               type="ingreso"
               cant={ingresosTotal}
            />
            <ExpenseResume
               type="gasto"
               cant={gastosTotal}
            />
         </HStack>
         <Stack
            direction={{ base: 'column', md: 'row' }}
            width={"100%"}
            spacing={3}
         >
            <Button
               colorScheme='green'
               variant='solid'
               onClick={() => { onAlertOpen(); }}>
               Agregar dinero en caja
            </Button>
            <Button
               colorScheme='blue'
               variant='solid'
               onClick={() => { setTipo("ingreso"); onOpen(); }}>
               Agregar ingreso
            </Button>
            <Button
               colorScheme='red'
               variant='solid'
               onClick={() => { setTipo("gasto"); onOpen(); }}>
               Agregar gasto
            </Button>
         </Stack>
         <Box mt={5} mb={5} bg={Colors.bgSecondary} p={5} borderRadius="md"
            overflow={"auto"}>
            <Text fontSize={"2xl"} fontWeight={"bold"}>Historial</Text>
            <Table
               mt={5}
               rounded={"md"}
               size="md"
            >
               <Thead>
                  <Tr roundedTop={"md"} bg={Colors.table.header} color={Colors.table.text}>
                     {/* <Td>Fecha</Td> */}
                     <Td>Tipo</Td>
                     <Td>Monto</Td>
                     <Td>Motivo</Td>
                  </Tr>
               </Thead>
               <Tbody>
                  {HistorialList.map((item) => (
                     <Tr key={item.id} _hover={{ bg: Colors.bg }}>
                        {/* <Td>{item.date.split("T")[0].replaceAll("-", "/")}</Td> */}
                        <Td>{
                           item.type === "gasto" ?
                              <Text color={Colors.red} fontWeight={"bold"}>{item.type.toUpperCase()}</Text>
                              :
                              <Text color={Colors.blue} fontWeight={"bold"}>{item.type.toUpperCase()}</Text>
                        }</Td>
                        <Td>${item.amount}</Td>
                        <Td>{item.reason}</Td>
                     </Tr>
                  ))}
               </Tbody>

            </Table>
         </Box>

         <ModalAddExpense
            tipo={tipo}
            isOpen={isOpen}
            onClose={onClose}
            onSave={(values) => {
               const newEntry: Expense = {
                  ...values,
                  date: new Date().toISOString().split('T')[0]
               };
               setHistorialList([newEntry, ...HistorialList]);
            }}
            refetchFinances={refetchFinances}
         />

         <AlertChangeTotal
            isOpen={isAlertOpen}
            onClose={onAlertClose}
            refetch={refetchCashbox}
         />

      </Box>
   )
}

function AlertChangeTotal(
   { isOpen,
      onClose,
      refetch
   }:
      {
         isOpen: boolean,
         onClose: () => void,
         refetch: any
      }
) {
   const cancelRef = React.useRef<HTMLButtonElement>(null)
   const [newTotal, setNewTotal] = React.useState<number>(0);
   const toast = useToast();

   const changeCashBox =
      usePost<
         { id: number, amount: number, },
         { amount: number, reason: string }
      >()

   const addCashbox = async () => {
      if (newTotal <= 0) {
         toast({
            title: 'Error al guardar.',
            description: "El total debe ser mayor a 0",
            status: 'error',
            duration: 3000,
            isClosable: true,
         });
         return;
      }

      const response = await changeCashBox.post(Service.finances.addCashbox(), {
         amount: newTotal,
         reason: "caja"
      })


      if (!response?.success) {
         console.error('Error al guardar:', changeCashBox.error);
         toast({
            title: 'Error al guardar.',
            status: 'error',
            duration: 3000,
            isClosable: true,
         });
         return;
      }

      toast({
         title: 'Guardado.',
         status: 'success',
         duration: 3000,
         isClosable: true,
      });

      await refetch();
   }

   return (
      <AlertDialog
         leastDestructiveRef={cancelRef}
         isOpen={isOpen} onClose={onClose}>
         <AlertDialogOverlay>
            <AlertDialogContent
               bg={Colors.bgSecondary}
               color={Colors.text}
               borderRadius="md"
            >
               <AlertDialogHeader>Cambiar total</AlertDialogHeader>
               <AlertDialogBody>
                  <Text mb={3}>Ingrese el nuevo total en caja:</Text>
                  <Input
                     type="number"
                     placeholder="Nuevo total"
                     onChange={(e) => setNewTotal(Number(e.target.value))}
                  />
               </AlertDialogBody>
               <AlertDialogFooter>
                  <Button onClick={onClose}>Cancelar</Button>
                  <Button
                     colorScheme='green'
                     onClick={() => {
                        addCashbox()
                        onClose();
                     }}
                     ml={3}
                  >
                     Confirmar
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialogOverlay>
      </AlertDialog>
   )
}