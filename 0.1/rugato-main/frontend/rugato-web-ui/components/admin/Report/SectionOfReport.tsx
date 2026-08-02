import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'
import ExpensesReport from './Expenses';
import HistorySales from './HistorySales';
import HistorialOrders from './HistorialOrders';

export default function SectionOfReport({ section }: { section: string }) {
   return (
      <Box
         w="100%"
         mt={10}
         borderTop={"2px solid"}
         borderColor={Colors.green}
         pt={4}
      >
         {section === "" &&
            <Text>Selecciona un reporte para visualizar</Text>
         }
         {section === "expenses" && <ExpensesReport />}
         {/* {section === "sales" && <SalesReport /> } */}
         {section === "historialSales" && <HistorySales />}
         {section === "historialOrders" && <HistorialOrders />}
      </Box>
   )
}


