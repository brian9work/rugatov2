
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Select, Textarea, Box, VStack, HStack, Heading, Checkbox, Icon, IconButton, Table, Thead, Tr, Th, Tbody, Td, Text, SwitchProps, Switch, Stack } from '@chakra-ui/react';
import React from 'react'
import Colors from '../../../contants/Colors';
import { CreateOrder } from '../../../TypesBackend';
import GetEstatus from '../components/GetEstatus';
import LongAgo from '../components/LongAgo';
import { DetailsOfOrder } from '../menu/Cart';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   loading: boolean;
   selectedOrder: CreateOrder | null;
   setSelectProductId: (id: string) => void,
   onViewProductOpen: () => void,
}

const ViewOrder: React.FC<ModalProps> = ({ isOpen, onClose, setSelectProductId, onViewProductOpen, loading, selectedOrder }) => {
   if (!selectedOrder) return null;

   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color={Colors.text} borderRadius="md">
            <ModalHeader>
               <HStack justifyContent="space-between" alignItems="center" w="100%">
                  <Text>
                     Detalle de la orden
                  </Text>
                  <Box mr={0}>
                     <GetEstatus value={selectedOrder.statusName} />
                  </Box>
               </HStack>
            </ModalHeader>
            <ModalBody>
               <HStack spacing={1} align="center" justifyContent={"flex-end"} mb={1}>
                  <Text>Hace:</Text>
                  <Text fontWeight="bold"><LongAgo time={selectedOrder.createdAt || ""} /></Text>
               </HStack>
               <HStack spacing={4} alignItems="center" justifyContent={"space-between"} mb={0}>
                  <HStack spacing={2}>
                     <Text>Ordenado por:</Text>
                     <Text fontSize="lg" fontWeight="bold">{selectedOrder.userName}</Text>
                  </HStack>
                  <Stack spacing={0} rounded={"md"}>
                     <Text fontSize="lg" color={Colors.green} fontWeight="bold">${selectedOrder.total}</Text>
                  </Stack>
               </HStack>
               <VStack spacing={0} align="stretch" mb={4}>
                  <HStack spacing={2}>
                     <Text>Servicio:</Text>
                     <Text fontSize="lg" fontWeight="bold">{selectedOrder.service}</Text>
                  </HStack>
                  <HStack spacing={2}>
                     <Text>Categoria:</Text>
                     <Text fontSize="lg" fontWeight="bold">{selectedOrder.categoryName}</Text>
                  </HStack>
                  <HStack spacing={2}>
                     <Text>Mesa:</Text>
                     <Text fontSize="lg" fontWeight="bold">{selectedOrder.coustumer}</Text>
                  </HStack>
                  <HStack spacing={2}>
                     <Text>Producto:</Text>
                     <Text fontSize="lg" fontWeight="bold">{selectedOrder.dishName}</Text>
                  </HStack>
                  <HStack spacing={2}>
                     <Text>Tamaño:</Text>
                     <Text fontSize="lg" fontWeight="bold">
                        <GetSize
                           total={selectedOrder.total}
                           price={selectedOrder.price}
                           price_ch={selectedOrder.price_ch}
                           price_med={selectedOrder.price_med}
                           price_gde={selectedOrder.price_gde}
                        />
                     </Text>
                  </HStack>
               </VStack>

               <VStack spacing={4} align="stretch">
                  <Box>
                     <VStack width={"100%"} alignItems={"flex-start"} spacing={0} m={0} p={0}>
                        <Text fontSize={"md"} fontWeight={"bold"}>Notas:</Text>
                        <Box borderLeft={"3px solid"} borderColor={Colors.blue} pl={4} ml={3}>
                           <Text fontSize={"md"}>{selectedOrder.notes || "Sin notas"}</Text>
                        </Box>
                     </VStack>
                     <DetailsOfOrder details={selectedOrder.details} />
                  </Box>
               </VStack>
            </ModalBody>
            <ModalFooter display={"flex"} gap={2}>
               <Button
                  colorScheme="blue"
                  onClick={() => {
                     setSelectProductId(selectedOrder.menuId + "");
                     onViewProductOpen();
                  }}
                  isLoading={loading}
               >
                  Ver Producto
               </Button>
               <Button
                  colorScheme="red"
                  onClick={onClose}
                  isLoading={loading}
               >
                  Cerrar
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
}

const GetSize = (
   { total, price, price_ch, price_med, price_gde }:
      { total: string, price?: string, price_ch?: string, price_med?: string, price_gde?: string }
) => {

   if (price && price === total) {
      return (
         <>Pieza</>
      )
   }

   if (price_ch && price_ch === total) {
      return (
         <>Chico</>
      )
   }
   if (price_med && price_med === total) {
      return (
         <>Mediano</>
      )
   }
   if (price_gde && price_gde === total) {
      return (
         <>Grande</>
      )
   }
}


export default ViewOrder;