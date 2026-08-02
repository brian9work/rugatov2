import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { GrMoney } from 'react-icons/gr';
import Colors from '../../../contants/Colors';
import { MdAttachMoney } from "react-icons/md";
import SectionOfReport from './SectionOfReport';
import { TiMediaEject } from 'react-icons/ti';

export default function Report() {
   const [section, setSection] = React.useState<string>("");

   const sections = [
      { name: 'expenses', title: 'Reporte de gastos', icon: <GrMoney /> },
      // { name: 'sales', title: 'Ventas de hoy', icon: <MdAttachMoney /> },
      { name: 'historialSales', title: 'Historial de ventas', icon: <MdAttachMoney /> },
      { name: 'historialOrders', title: 'Historial de órdenes', icon: <TiMediaEject /> },
   ]

   return (
      <Box w="100%">
         <Flex direction={{ base: "column", md: "row" }} gap={4}>
            {sections.map((s) => (
               <Card
                  key={s.name}
                  name={s.name}
                  icon={s.icon}
                  title={s.title}
                  section={section}
                  setSection={setSection}
               />
            ))}
         </Flex>
         <SectionOfReport section={section} />
      </Box>
   )
}

const Card = (
   { name, icon, title, section, setSection }:
      { name: string, icon: ReactNode, title: string, section: string, setSection: React.Dispatch<React.SetStateAction<string>> }
) => {
   return (
      <HStack
         w={{ base: "100%", md: "auto" }}
         background={
            section === name ? Colors.green : Colors.bgSecondary
         }
         p={4}
         borderRadius="8px"
         spacing={2}
         color={section === name ? "#000" : Colors.text}
         cursor={"pointer"}
         onClick={() => setSection(name)}
      >
         <Box fontSize={"1.5rem"} >
            {icon}
         </Box>
         <Text fontWeight={section === name ? "semibold" : "normal"}>{title}</Text>
      </HStack>
   )
}