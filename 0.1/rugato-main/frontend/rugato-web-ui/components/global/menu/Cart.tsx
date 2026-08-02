import React, { useEffect } from 'react'
import { Badge, Box, Button, Card, CardBody, CardHeader, Divider, Grid, HStack, IconButton, Input, Select, Stack, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import ButtonsComponents from '../ButtonsComponents'
import Colors from '../../../contants/Colors'
import { Carrito } from '../../../Types'
import { usePost } from '../../../hooks/Post'
import { CreateOrder } from '../../../TypesBackend'
import Service from '../../../service/service'
import { MyContext } from '../../../context/Context'


export default function Cart(
   { cartItems, setCartItems, onCloseCart }:
      { cartItems: Carrito[], setCartItems: React.Dispatch<React.SetStateAction<Array<Carrito>>>, onCloseCart: () => void }
) {
   const { post: createOrder, loading: loading, error: errorOfCreateOrder } = usePost<CreateOrder, any>()
   const toast = useToast();
   const { idUser } = MyContext();

   const handleNewOrder = async (nuevo: Carrito[]) => {

      nuevo.forEach(async (item, index) => {
         const newOrder = {
            status_id: 1,
            user_id: idUser,
            menu_id: item.productId,
            service: item.service,
            total: item.total.toString(),
            notes: item.notes.toString(),
            details: item.details.toString(),
            coustumer: item.coustumer,
         }

         const response = await createOrder(
            Service.orders.add(),
            newOrder
         )


         if (!response?.success) {
            console.error('Error al guardar:', errorOfCreateOrder);
            toast({
               title: 'Error al guardar.',
               status: 'error',
               duration: 3000,
               isClosable: true,
            });
            return;
         }

         toast({
            title: item.name?.toUpperCase() + ' enviado a cocina.',
            status: 'success',
            duration: 3000,
            isClosable: true,
         });
      });


   }

   useEffect(() => {
   }, [cartItems]);

   return (
      <VStack spacing={4} align={"stretch"}>
         {cartItems.map((i, index) => (
            <Box key={"cart-" + index}>
               <HStack width={"100%"} justifyContent={"space-between"} alignItems={"flex-start"}>
                  <VStack width={"100%"} alignItems={"flex-start"} spacing={0}>
                     <Box>
                        <Badge
                           color={Colors.text}
                           bg={Colors.bgSecondary}
                           px={2}
                           fontSize={"sm"}>
                           {i.categoryName}
                        </Badge>
                        <HStack>
                           <Badge
                              color={"#eee"}
                              bg={Colors.blue}
                              px={2}
                              fontSize={"x-small"}
                           >
                              $ {i.total}
                           </Badge>
                           <Badge
                              color={"#111"}
                              bg={Colors.green}
                              px={2}
                              fontSize={"x-small"}
                           >
                              {i.service}
                           </Badge>
                           <Badge
                              color={"#111"}
                              bg={Colors.green}
                              px={2}
                              fontSize={"x-small"}
                           >
                              Mesa: {i.coustumer}
                           </Badge>
                        </HStack>
                        <Text fontSize={"md"} fontWeight={"bold"}>{i.name}</Text>
                     </Box>
                     {i.notes.length > 0 && (
                        <VStack width={"100%"} alignItems={"flex-start"} spacing={0} m={0} p={0}>
                           <Text fontSize={"md"} fontWeight={"bold"}>Notas:</Text>
                           <Text>{i.notes}</Text>
                        </VStack>
                     )}
                     <DetailsOfOrder details={i.details} />
                  </VStack>
                  <ButtonsComponents.Delete onClick={() => {
                     setCartItems(cartItems.filter(item => item.id !== i.id));
                  }} />
               </HStack>
               <Divider mt={3} mb={0} />
            </Box>
         ))}

         <Box>
            <HStack justifyContent={"space-between"} width={"100%"}>
               <Text fontSize={"md"} fontWeight={"bold"}>Total:</Text>
               <Text fontSize={"md"} fontWeight={"bold"}>${cartItems.reduce((acc, item) => parseInt(acc + "") + parseInt(item.total + ""), 0)}</Text>
            </HStack>
         </Box>

         <Button
            _hover={{ transform: "scale(1.05)" }}
            background={Colors.green}
            onClick={() => {
               handleNewOrder(cartItems);
               setCartItems([]);
               onCloseCart();
            }}
         >
            Ordenar
         </Button>
      </VStack>
   )
}

export const DetailsOfOrder = ({ details }: { details: string }) => {
   if (!details || details === "undefined" || details === "{}") {
      return <></>;
   }

   const [parsedDetails, setParsedDetails] = React.useState(
      JSON.parse(details)
   );


   return (
      <>
         {parsedDetails?.ingredients != "" && (
            <VStack width={"100%"} alignItems={"flex-start"} spacing={0} m={0} p={0}>
               <Text fontSize={"md"} fontWeight={"bold"}>Ingredientes:</Text>
               <Box borderLeft={"3px solid"} borderColor={Colors.red} pl={4} ml={3}>
                  <Text>{parsedDetails?.ingredients}</Text>
               </Box>
            </VStack>
         )}
         {parsedDetails?.extras != "" && (
            <VStack width={"100%"} alignItems={"flex-start"} spacing={0} m={0} p={0}>
               <Text fontSize={"md"} fontWeight={"bold"}>Extras:</Text>
               <ExtrasDetailsOfOrder extras={parsedDetails?.extras} />
            </VStack>
         )}
         {parsedDetails?.build != "{}" && (
            <VStack width={"100%"} alignItems={"flex-start"} spacing={0} m={0} p={0}>
               <Text fontSize={"md"} fontWeight={"bold"}>Construccion:</Text>
               <BuildsDetailsOfOrder build={parsedDetails?.build} />
            </VStack>
         )}
      </>
   )
}

const ExtrasDetailsOfOrder = ({ extras }: { extras: string }) => {
   let array: string[] = [];
   try {
      array = extras.split(':')[1].split(',').map((item: string) => item.trim().replace(/[\[\]"]+/g, ''));
   } catch (error) {
      console.error("Error parsing extras:", error);
      return <Text fontSize={"md"}>" --- "</Text>;
   }
   return (
      <Box borderLeft={"3px solid"} borderColor={Colors.yellow} pl={4} ml={3}>
         {array.length > 0 ? array.map((extra, index) => (
            <Text key={index} fontSize={"md"}>{`- ${extra}`}</Text>
         )) : (
            <Text fontSize={"md"}>" --- "</Text>
         )}
      </Box>
   )
}

const BuildsDetailsOfOrder = ({ build }: { build: string }) => {
   const json = build ? JSON.parse(build) : null;

   return (
      <Box borderLeft={"3px solid"} borderColor={Colors.green} pl={4} ml={3}>
         {Object.entries(json || {}).map(([key, value]) => (
            <Box>
               <Text key={key} fontWeight={"700"} fontSize={"md"}>{`${key}`}</Text>
               <Box>
                  {Array.isArray(value) ? value.map((item, index) => (
                     <Text key={index} fontSize={"md"}>{`- ${item.name}`}</Text>
                  )) : (
                     <Text fontSize={"md"}>" --- "</Text>
                  )}
               </Box>
            </Box>
         ))}
      </Box>
   )
}
