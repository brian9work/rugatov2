import { Box, Button, Input, Select, Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'
import { FaSearch } from 'react-icons/fa';
import OptionCategoriesData from '../../global/data/OptionCategoriesData';

export default function Filtros(
   { search, setSearch, setSelectCategory }: 
   { search: string; setSearch: React.Dispatch<React.SetStateAction<string>>; setSelectCategory: React.Dispatch<React.SetStateAction<number>>; }
) {
   return (
      <Box bg={Colors.bgSecondary} rounded={"2xl"} p={{ base: 2, md: 6 }} color={Colors.text} minH="20vh">
         <VStack alignItems={"flex-start"} gap={0}>
            <Text fontSize="2xl" fontWeight={"bold"}>Buscar</Text>
         </VStack>
         <Stack
            direction={{ base: "column", md: "row" }}
            mt={4}
            bg={Colors.table.header}
            w="full"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            borderRadius="lg"
            spacing={3}
         >
            <Box w={{ base: "100%", md: "67%" }}
               alignItems={"center"}
               display="flex"
               justifyContent="center"
               border={"1px solid"}
               rounded={"md"}
               order={{ base: 2, md: 1 }}
               px={{ base: 0, md: 2 }}
            >
               <Box display={{ base: "none", md: "block" }}>
                  <FaSearch fontSize="20px" />
               </Box>
               <Input 
                  type='text'
                  placeholder='Buscar...'
                  width={"100%"}
                  border={"none"}
                  outline={"none"}
                  _focus={{ boxShadow: "none" }} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </Box>
            <Box w={{ base: "100%", md: "20%" }} order={{ base: 3, md: 3 }}>
               <Select onChange={(e) => setSelectCategory(parseInt(e.target.value))}>
                  <OptionCategoriesData />
               </Select>
            </Box>
            <Box w={{ base: "100%", md: "10%" }} order={{ base: 4, md: 34 }}>
               <Button bg={Colors.green} w={"100%"}>Buscar</Button>
            </Box>
         </Stack>
      </Box>
   )
}
