import { Box, Button, Card, HStack, IconButton, Select, Spacer, Stack, Table, Tbody, Td, useToast, Text, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'
import Filtros from './Filtros';
import TableComponent from './TableComponent';
import NuevoPlatillo from './NuevoPlatillo';
import { RiDrinksLine } from 'react-icons/ri';
import EditarPlatillo from './EditarPlatillo';
import { Product } from '../../../Types';
import { FormikValues } from 'formik/dist/types';
import { usePost } from '../../../hooks/Post';
import Service from '../../../service/service';
import { MenuProps, IngredientsPropsRequest, IngredientsPropsResponse, ExtrasPropsRequest, ExtrasPropsResponse, BuildsPropsRequest, BuildsPropsResponse, } from './MenuTypes';
import { SavePlatillo } from './utils/SavePlatillo';

export default function Menu() {
   const toast = useToast();
   const [status, setStatus] = React.useState("2")
   const { isOpen, onOpen, onClose } = useDisclosure();
   const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
   const [selectCategory, setSelectCategory] = React.useState(0)
   const [search, setSearch] = React.useState("");
   const [selectedItem, setSelectedItem] = React.useState<Product | null>(null);
   const [loading, setLoading] = React.useState(false);
   
   const platillo = usePost<Product, MenuProps>()
   const ingredient = usePost<IngredientsPropsResponse, IngredientsPropsRequest>()
   const extras = usePost<ExtrasPropsResponse, ExtrasPropsRequest>()
   const builds = usePost<BuildsPropsResponse, BuildsPropsRequest>()

   return (
      <>
         <Filtros
            search={search}
            setSearch={setSearch}
            setSelectCategory={setSelectCategory}
         />
         <Spacer h={4} />
         <Spacer h={4} />
         <Box bg={Colors.bgSecondary} rounded={"2xl"} p={6} color={Colors.text} minH="70vh">
            <HStack justifyContent={"space-between"} alignItems={"center"} mb={4} flexWrap={"wrap"}>
               <VStack alignItems={"flex-start"} gap={0}>
                  <HStack spacing={4} alignItems={"center"} justifyItems={"center"} >
                     <RiDrinksLine size={30} color={Colors.green} />
                     <Text fontSize="2xl" fontWeight={"bold"}>Menu</Text>
                  </HStack>
               </VStack>

               <Stack
                  direction={{ base: "column", md: "row" }}
                  justifyContent={"flex-end"}
                  spacing={4}
               >
                  <Box>
                  </Box>
                  <Box>
                     <Button
                        bg={Colors.green}
                        onClick={() => {
                           onOpen()
                        }}
                        _hover={{ transform: "scale(1.1)" }}>
                        Agregar nuevo platillo
                     </Button>
                  </Box>
               </Stack>
            </HStack>
            <TableComponent
               status={status}
               category={selectCategory.toString()}
               search={search}
               setSelectedItem={setSelectedItem}
               onOpenEdit={onOpenEdit}
            />
            <EditarPlatillo
               isOpen={isOpenEdit}
               onClose={onCloseEdit}
               platillo={selectedItem}
               onSave={(e) => {
                  console.log("Guardado", e);
               }}
            />
            <NuevoPlatillo
               isOpen={isOpen}
               onClose={onClose}
               loading={loading}
               onSave={(values) => {
                  console.log("Guardado", values);
                  SavePlatillo(
                     setLoading,
                     values,
                     toast,
                     platillo,
                     ingredient,
                     extras,
                     builds
                  );
               }}
            />
         </Box>
      </>

   )
}
