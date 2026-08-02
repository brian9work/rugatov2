import { Box, Text, Table, Tbody, Td, Th, Thead, Tr, HStack, Input, } from '@chakra-ui/react'
import React, { useEffect, useState, useMemo } from 'react'
import Colors from '../../../contants/Colors'
import { Expense, ExpenseBack, Revenue } from '../../../Types';
import Service from '../../../service/service';
import { useGet } from '../../../hooks/GetWithCallback';

const ExpensesReport = () => {
   const [HistorialList, setHistorialList] = React.useState<Expense[]>([]);
   const [selectedMonth, setSelectedMonth] = useState<string>(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
   });

   const startDate = useMemo(() => `${selectedMonth}-01`, [selectedMonth]);
   const endDate = useMemo(() => {
      const [year, month] = selectedMonth.split('-').map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      return `${selectedMonth}-${String(lastDay).padStart(2, '0')}`;
   }, [selectedMonth]);

   const getHistoryExpense = useGet<ExpenseBack[]>(Service.finances.getHistoryExpense(startDate, endDate));
   const getHistoryRevenue = useGet<Revenue[]>(Service.finances.getHistoryRevenue(startDate, endDate));

   console.log(getHistoryExpense.data)
   console.log(getHistoryRevenue.data)

   useEffect(() => {
      if (getHistoryExpense.data && getHistoryRevenue.data) {
         const newExpenses: Expense[] = getHistoryExpense.data.map(item => ({
            id: item.id,
            type: 'gasto',
            amount: parseFloat(item.quantity),
            reason: item.reason,
            date: item.createdAt,
         }));
         const newRevenues: Expense[] = getHistoryRevenue.data.map(item => ({
            id: item.id || 0,
            type: 'ingreso',
            amount: parseFloat(item.quantity),
            reason: item.reason,
            date: item.createdAt || '',
         }));
         const combinedList = [...newExpenses, ...newRevenues];
         combinedList.sort((a, b) => {
            if (!a.date) return -1;
            if (!b.date) return 1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
         });
         setHistorialList(combinedList)
      }
   }, [getHistoryExpense.data, getHistoryRevenue.data, startDate, endDate])

   return (
      <Box>
         <HStack spacing={5} justifyContent={"start"}>
            <Box>
               <Text>Seleccionar Mes</Text>
               <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
               />
            </Box>
         </HStack>
         <Box overflowX={"auto"} w={"100%"}>
            <Table
               mt={5}
               rounded={"md"}
               size="md"
               maxW={"100%"}
               overflowX={"auto"}
            >
               <Thead>
                  <Tr roundedTop={"md"} bg={Colors.table.header} color={Colors.table.text}>
                     <Td>Fecha</Td>
                     <Td>Tipo</Td>
                     <Td>Monto</Td>
                     <Td>Motivo</Td>
                  </Tr>
               </Thead>
               <Tbody>
                  {(getHistoryExpense.loading || getHistoryRevenue.loading) && (
                     <Tr><Td colSpan={5}>Cargando ...</Td></Tr>
                  )}
                  {HistorialList.map((item) => (
                     <Tr key={`${item.type}-${item.id}`} _hover={{ bg: Colors.bg }}>
                        <Td>{item.date.split("T")[0].replaceAll("-", "/")}</Td>
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
                  <Tr _hover={{ bg: Colors.bg }}>
                     <Td colSpan={4}>
                        <HStack width={"100%"} justifyContent={"space-between"}>
                           <HStack>
                              <Text>Ingresos: </Text>
                              <Text fontWeight={"bold"} color={Colors.green}>$ {
                                 HistorialList
                                    .filter(item => item.type === "ingreso")
                                    .reduce((acc, item) => acc + item.amount, 0)
                              }</Text>
                           </HStack>
                           <HStack>
                              <Text>Gastos: </Text>
                              <Text fontWeight={"bold"} color={Colors.red}>$ {
                                 HistorialList
                                    .filter(item => item.type === "gasto")
                                    .reduce((acc, item) => acc + item.amount, 0)
                              }</Text>
                           </HStack>
                        </HStack>
                     </Td>
                  </Tr>
               </Tbody>
            </Table>
         </Box>
      </Box>
   )
}

export default ExpensesReport;