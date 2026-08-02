import { Box, Text, Table, Tbody, Td, Th, Thead, Tr, HStack, Select, } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Colors from '../../../contants/Colors'
import Service from '../../../service/service';
import { useGet } from '../../../hooks/GetWithCallback';
import { SalesReportResponse } from '../../../TypesResponse';
import { SalesReport } from '../../../TypesBackend';
import { getDateTomorrow } from '../../global/utils/DateToday';

const SalesReportComponent = () => {
   const { startStr, endStr } = getDateTomorrow();

   const { data, loading, error, refetch } = useGet<SalesReportResponse>(
      Service.orders.getByReport(startStr, endStr)
   );

   const [salesList, setSalesList] = React.useState<SalesReport[]>([]);
   const [userFilter, setUserFilter] = React.useState<string[]>([]);
   const [allUsers, setAllUsers] = React.useState<string[]>([]);

   useEffect(() => {
      if (data) {
         setSalesList(data.content || []);
         const users = Array.from(new Set(data.content?.map(sale => sale.user) || []));
         setAllUsers(users);
      }
   }, [data]);

   const salesFiltered = salesList.filter(sale => {
      const userMatch = userFilter.length === 0 || userFilter.some(filter =>
         sale.user.toLowerCase().includes(filter.toLowerCase())
      );
      return userMatch;
   });

   return (
      <Box bg={Colors.bgSecondary} p={4} rounded={"lg"} overflowX="auto" maxWidth={"1200px"} >
         <Text fontSize={"lg"} fontWeight={"bold"} mb={4}>Reporte de ventas</Text>
         <Select mt={4} mb={4} bg={Colors.bgSecondary} width={"300px"}
            onChange={(e) => setUserFilter(e.target.value.split(","))}
         >
            <option style={{ background: Colors.table.header }} value={""}>Todos los usuarios</option>
            {allUsers.map((user, index) => (
               <option style={{ background: Colors.table.header }} key={index} value={user}>{user}</option>
            ))}
         </Select>

         <Table
            rounded={"md"}
            size="md"
         >
            <Thead>
               <Tr bg={Colors.table.header} color={Colors.table.text}>
                  <Td px={2} py={3} >ID</Td>
                  <Td px={2} py={3} >Usuario</Td>
                  <Td px={2} py={3} >Servicio</Td>
                  <Td px={2} py={3} >Pago</Td>
                  <Td px={2} py={3} >Total</Td>
               </Tr>
            </Thead>
            <Tbody>
               {loading && (
                  <Tr><Td colSpan={5}>Cargando...</Td></Tr>
               )}
               {salesFiltered.length === 0 && (
                  <Tr><Td colSpan={5}>No hay resultados</Td></Tr>
               )}
               {salesFiltered?.map((item) => (
                  <Tr key={item.orderId}>
                     <Td px={2} py={3}>{item.orderId}</Td>
                     <Td px={2} py={3}>{item.user}</Td>
                     <Td px={2} py={3}>{item.service}</Td>
                     <Td px={2} py={3}>{item.payment}</Td>
                     <Td px={2} py={3}>{item.total}</Td>
                  </Tr>
               ))}
            </Tbody>
         </Table>
         <Box>
            <HStack width={"100px"} justifyContent={"space-between"} ml={"auto"} mt={4} px={4}>
               <Text fontWeight={"semibold"}>Total:</Text>
               <Text fontWeight={"semibold"} color={Colors.green}>${salesFiltered.reduce((acc, item) => acc + parseInt(item.total + ""), 0)}</Text>
            </HStack>
         </Box>
      </Box>
   )
}

export default SalesReportComponent;