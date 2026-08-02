import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'
import categoriasData from '../../data/CategoriesData';

export default function Categoria(
   {
      selectCategory,
      setSelectCategory
   }: {
      selectCategory: number;
      setSelectCategory: React.Dispatch<React.SetStateAction<number>>;
   }
) {
   // const [selectCategory, setSelectCategory] = React.useState(0)

   return (
      <Box bg={Colors.bgSecondary} rounded={"2xl"} p={6} color={Colors.text} minH="20vh">
         <VStack alignItems={"flex-start"} gap={0}>
            <Text fontSize="2xl" fontWeight={"bold"}>Categorias</Text>
         </VStack>

         <HStack
            mt={4}
            w={"full"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            wrap={'wrap'}
         >

            <Box
               bg={selectCategory === 0 ? Colors.green : Colors.table.header}
               color={selectCategory === 0 ? "#000" : "#fff"}
               fontWeight={selectCategory === 0 ? "bold" : "normal"}
               p={3}
               borderRadius={"lg"}
               textAlign={"center"}
               minW={"50px"}
               w={"fit-content"}
               onClick={() => setSelectCategory(0)}
               cursor={"pointer"}
            >
               <Text>Todas</Text>
            </Box>

            {categoriasData.map(categoria => (
               <Box
                  key={categoria.id}
                  bg={categoria.id === selectCategory ? Colors.green : Colors.table.header}
                  color={categoria.id === selectCategory ? "#000" : "#fff"}
                  fontWeight={categoria.id === selectCategory ? "bold" : "normal"}
                  p={3}
                  borderRadius={"lg"}
                  textAlign={"center"}
                  minW={"50px"}
                  w={"fit-content"}
                  onClick={() => setSelectCategory(categoria.id)}
                  cursor={"pointer"}
               >
                  <Text>{categoria.name}</Text>
               </Box>
            ))}
         </HStack>
      </Box>
   )
}
