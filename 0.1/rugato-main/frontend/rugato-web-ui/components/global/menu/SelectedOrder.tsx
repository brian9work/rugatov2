import React, { useEffect } from 'react'
import { Box, Button, Card, CardBody, CardHeader, Divider, Grid, HStack, IconButton, Input, Select, Stack, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import OptionCategoriesData from '../data/OptionCategoriesData'
import Colors from '../../../contants/Colors'
import ModalComponent from '../components/ModalComponent'
import { TiShoppingCart } from "react-icons/ti";
import { Carrito, Product } from '../../../Types'
import { LuNotebookPen } from "react-icons/lu";
import Cart from './Cart'
import ProductList from './ProductsList'
import SelectedProduct from './SelectedProduct'
import AllMenuData from '../../data/AllMenuData'


export default function SelectedOrder() {
   const [selectCategory, setSelectCategory] = React.useState("0")

   const [selectedItem, setSelectedItem] = React.useState<Product | null>(null)
   const [searchTerm, setSearchTerm] = React.useState("")

   const [cartItems, setCartItems] = React.useState<Carrito[] | []>([]);

   const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
   const { isOpen: isOpenCart, onOpen: onOpenCart, onClose: onCloseCart } = useDisclosure();


   return (
      <Box bg={Colors.bgSecondary} rounded={"2xl"} p={{ base: 2, md: 6 }} color={Colors.text} minH="20vh">
         <Stack
            // width={{ base: "100%", md: "auto" }}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={6}
            direction={{ base: "column", md: "row" }}
         >
            <VStack alignItems={"flex-start"} gap={0} pt={3}>
               <HStack spacing={4} alignItems={"center"} justifyItems={"center"} >
                  <LuNotebookPen size={26} color={Colors.green} />
                  <Text fontSize="2xl" fontWeight={"bold"}>Crear orden</Text>
               </HStack>
            </VStack>
            <Stack direction={{ base: "column", md: "row" }} spacing={4} alignItems={"center"} width={"100%"}>
               <VStack width={{ base: "100%", md: "400px" }}>
                  <Input
                     bg={Colors.bg}
                     placeholder="Buscar platillo..."
                     value={searchTerm}
                     onChange={(e) => {
                        setSearchTerm(e.target.value);
                     }}
                  />
               </VStack>
               <HStack alignItems={"center"} justifyContent={"space-between"} spacing={4} width={"100%"}>
                  <Select bg={Colors.bg} width={{ base: "210px", md: "230px" }} onChange={(e) => setSelectCategory(e.target.value)} value={selectCategory}>
                     <OptionCategoriesData />
                  </Select>
                  <HStack
                     spacing={2}
                     py={1}
                     px={4}
                     borderRadius={"md"}
                     cursor={"pointer"}
                     _hover={{ transform: "scale(1.05)" }}
                     onClick={onOpenCart}
                     border={`1px solid ${Colors.red}`}
                  >
                     <Text
                        color={Colors.red}
                        fontWeight={"bold"}
                        fontSize={"xl"}
                     >
                        {cartItems.length}
                     </Text>
                     <TiShoppingCart size={30} color={Colors.red} />
                  </HStack>
               </HStack>
            </Stack>
         </Stack>

         <ProductList
            selectCategory={selectCategory}
            searchTerm={searchTerm}
            setSelectedItem={setSelectedItem}
            onOpenAdd={onOpenAdd}
         />

         <ModalComponent
            isOpen={isOpenAdd}
            onClose={onCloseAdd}
            header="Agregar Producto"
            size="3xl"
            responsive={"sm"}
         >
            <SelectedProduct
               product={selectedItem}
               setCartItems={setCartItems}
               cartItems={cartItems}
               onCloseAdd={onCloseAdd}
            />
         </ModalComponent>

         {cartItems.length > 0 && (
            <ModalComponent
               isOpen={isOpenCart}
               onClose={onCloseCart}
               header="Carrito"
               size="3xl"
               responsive={"sm"}
            >
               <Cart
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  onCloseCart={onCloseCart}
               />
            </ModalComponent>

         )}
      </Box>

   )
}