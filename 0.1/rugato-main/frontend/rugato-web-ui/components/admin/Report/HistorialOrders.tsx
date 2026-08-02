import { Box, Text, Table, Tbody, Td, Th, Thead, Tr, HStack, Select, Input, VStack, } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Colors from '../../../contants/Colors'
import Service from '../../../service/service';
import { useGet } from '../../../hooks/GetWithCallback';
import { SalesReportResponse } from '../../../TypesResponse';
import { SalesReport } from '../../../TypesBackend';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export default function HistorialOrders() {
   const [selectedMonth, setSelectedMonth] = React.useState<string>(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
   });

   const dateRange = React.useMemo(() => {
      const [year, month] = selectedMonth.split('-').map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      return {
         start: `${selectedMonth}-01T00:00:00`,
         end: `${selectedMonth}-${String(lastDay).padStart(2, '0')}T23:59:59`
      };
   }, [selectedMonth]);
   const [salesList, setSalesList] = React.useState<SalesReport[]>([]);
   const [userFilter, setUserFilter] = React.useState<string[]>([]);
   const [allUsers, setAllUsers] = React.useState<string[]>([]);
   const [page, setPage] = React.useState<number>(0);
   const [size, setSize] = React.useState<number>(10);
   const [maxPages, setMaxPages] = React.useState<number>(0);

   const { data, loading, error, refetch } = useGet<SalesReportResponse>(
      Service.orders.getByReport(dateRange.start, dateRange.end, page, size)
   );

   useEffect(() => {
      console.log("**********************")
      console.log(data?.content)
      if (data) {
         setMaxPages(data.totalPages || 1);
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

   // Función para convertir de formato "YYYY-MM-DDTHH:mm:ss" a "YYYY-MM-DD"
   const extractDateOnly = (datetime: string) => {
      return datetime.split('T')[0];
   };

   return (
      <Box bg={Colors.bgSecondary} p={4} rounded={"lg"} overflowX="auto" maxWidth={"1200px"}>
         <Text fontSize={"lg"} fontWeight={"bold"} mb={4}>Reporte de ventas</Text>
         <VStack justifyContent={"space-between"} alignItems={"center"} mb={4} direction={{ base: "column", md: "row" }} spacing={{ base: 4, md: 6 }}>
            <Select mt={4} mb={1} bg={Colors.bgSecondary} width={"300px"}
               onChange={(e) => setUserFilter(e.target.value ? [e.target.value] : [])}
            >
               <option style={{ background: Colors.table.header }} value={""}>Todos los usuarios</option>
               {allUsers.map((user, index) => (
                  <option style={{ background: Colors.table.header }} key={index} value={user}>{user}</option>
               ))}
            </Select>
            <MonthFilter selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
         </VStack>
         <Pagination
            page={page}
            setPage={setPage}
            maxPages={maxPages}
            size={size}
            setSize={setSize}
         >
            <Table rounded={"md"} size="md" mt={5}
               overflowX={"auto"}>
               <Thead>
                  <Tr bg={Colors.table.header} color={Colors.table.text}>
                     <Td px={2} py={3}>ID</Td>
                     <Td px={2} py={3}>Usuario</Td>
                     <Td px={2} py={3}>Servicio</Td>
                     <Td px={2} py={3}>Pago</Td>
                     <Td px={2} py={3}>Total</Td>
                     <Td px={2} py={3}>Fecha</Td>
                  </Tr>
               </Thead>
               <Tbody>
                  {loading && (
                     <Tr><Td colSpan={6}>Cargando...</Td></Tr>
                  )}
                  {salesFiltered.length === 0 && (
                     <Tr><Td colSpan={6}>No hay resultados</Td></Tr>
                  )}
                  {salesFiltered?.map((item) => (
                     <Tr key={item.orderId}>
                        <Td px={2} py={3}>{item.orderId}</Td>
                        <Td px={2} py={3}>{item.user}</Td>
                        <Td px={2} py={3}>{item.service}</Td>
                        <Td px={2} py={3}>{item.payment}</Td>
                        <Td px={2} py={3}>{item.total}</Td>
                        <Td px={2} py={3}>{item.createdAt.split(' ')[0]}</Td>
                     </Tr>
                  ))}
               </Tbody>
            </Table>
         </Pagination>
         <Box>
            <HStack width={"100px"} justifyContent={"space-between"} ml={"auto"} mt={4} px={4}>
               <Text fontWeight={"semibold"}>Total:</Text>
               <Text fontWeight={"semibold"} color={Colors.green}>${salesFiltered.reduce((acc, item) => acc + parseInt(item.total + ""), 0)}</Text>
            </HStack>
         </Box>
      </Box>
   )
}

const MonthFilter = (
   { selectedMonth, setSelectedMonth }:
      {
         selectedMonth: string;
         setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
      }) => {
   return (
      <Box width={"300px"}>
         <Text fontSize="sm" mb={1}>Seleccionar Mes</Text>
         <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
         />
      </Box>
   )
}

const Pagination = (
   { page, setPage, maxPages, size, setSize, children }:
      {
         page: number;
         setPage: React.Dispatch<React.SetStateAction<number>>;
         maxPages: number;
         size: number;
         setSize: React.Dispatch<React.SetStateAction<number>>;
         children: React.ReactNode;
      }) => {

   const sizeList = [5, 10, 50, 100];

   return (
      <Box>
         <HStack>
            <Box
               bg={Colors.green}
               rounded={"md"}
               p={2}
               width={"40px"}
               cursor={page === 0 ? "not-allowed" : "pointer"}
               opacity={page === 0 ? 0.5 : 1}
               onClick={() => setPage(prev => prev > 0 ? prev - 1 : 0)}
            >
               <ChevronLeftIcon color={"#111"} fontSize={"2xl"} />
            </Box>
            <Box bg={Colors.bg} rounded={"md"} p={2} width={"120px"} >
               <Text fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
                  {page + 1} de {maxPages}
               </Text>
            </Box>
            <Box
               bg={Colors.green}
               rounded={"md"}
               p={2}
               width={"40px"}
               cursor={page >= maxPages - 1 ? "not-allowed" : "pointer"}
               onClick={() => setPage(prev => prev < maxPages - 1 ? prev + 1 : maxPages - 1)}
               opacity={page >= maxPages - 1 ? 0.5 : 1}
            >
               <ChevronRightIcon color={"#111"} fontSize={"2xl"} />
            </Box>
         </HStack>
         {children}
         <HStack mt={5} width={"fit-content"} spacing={2} ml={"auto"}>
            {sizeList.map((s) => (
               <Box
                  key={s}
                  bg={s === size ? Colors.green : Colors.bg}
                  rounded={"md"}
                  p={2}
                  width={"50px"}
                  onClick={() => setSize(s)}
                  cursor={"pointer"}
               >
                  <Text
                     fontSize={"lg"}
                     fontWeight={"bold"}
                     textAlign={"center"}
                  >
                     {s}
                  </Text>
               </Box>
            ))}
         </HStack>
      </Box>
   )
}