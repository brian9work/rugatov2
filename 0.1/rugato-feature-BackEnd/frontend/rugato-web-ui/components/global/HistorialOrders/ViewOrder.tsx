
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Select, Textarea, Box, VStack, HStack, Heading, Checkbox, Icon, IconButton, Table, Thead, Tr, Th, Tbody, Td, Text, SwitchProps, Switch, Stack } from '@chakra-ui/react';
import React from 'react'
import Colors from '../../../contants/Colors';
import { Form, Formik } from 'formik';
import Estatus from './Estatus';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (values: any) => void;
   loading: boolean;
}

const ViewOrder: React.FC<ModalProps> = ({ isOpen, onClose, onSave, loading }) => {
   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color="white" borderRadius="md">
            <ModalHeader>
               <HStack justifyContent="space-between" alignItems="center" w="100%">
                  <Text>
                     Detalle de la orden #0001
                  </Text>
                  <Box mr={0}>
                     <Estatus estatus="preparando" />
                  </Box>
               </HStack>
            </ModalHeader>
            <ModalBody>

               <HStack spacing={4} alignItems="center" mb={3}>
                  <Stack spacing={0} p={3} px={10} bg={Colors.bgSecondary} rounded={"md"}>
                     <Text>Mesero:</Text>
                     <Text fontSize="lg" fontWeight="bold">Juan Perez</Text>
                  </Stack>
                  <Stack spacing={0} p={3} px={10} bg={Colors.bgSecondary} rounded={"md"}>
                     <Text>Cliente:</Text>
                     <Text fontSize="lg" fontWeight="bold">Juan Perez</Text>
                  </Stack>
                  <Stack spacing={0} p={3} px={10} bg={Colors.bgSecondary} rounded={"md"}>
                     <Text>Total:</Text>
                     <Text fontSize="lg" color={Colors.green} fontWeight="bold">$100.00</Text>
                  </Stack>
               </HStack>

               
               <HStack spacing={1} align="stretch" justifyContent={"flex-end"} mb={1}>
                  <Text>Hace:</Text>
                  <Text fontWeight="bold">10 minutos</Text>
               </HStack>

               <VStack spacing={4} align="stretch">
                  <Text>Detalles de la orden:</Text>
                  <VStack spacing={1} align="stretch" >

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>

                     <VStack bg={Colors.bgSecondary} align={"start"} spacing={0} rounded={"md"} p={4}>
                        <HStack>
                           <Text>2</Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                        <HStack opacity={0.6}>
                           <Text fontWeight="bold">Nota: </Text>
                           <Text>Hamburguesa</Text>
                        </HStack>
                     </VStack>


                  </VStack>
               </VStack>
            </ModalBody>
            <ModalFooter>
               <Button
                  colorScheme="gray"
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


export default ViewOrder;