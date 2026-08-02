
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Select, Textarea, Box, VStack, HStack, Heading, Checkbox, Icon, IconButton, Table, Thead, Tr, Th, Tbody, Td, Text, SwitchProps, Switch, Stack } from '@chakra-ui/react';
import React from 'react'
import Colors from '../../../contants/Colors';
import { Field, Form, Formik } from 'formik';
import Estatus from './Estatus';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (values: any) => void;
   loading: boolean;
}

const AcceptOrder: React.FC<ModalProps> = ({ isOpen, onClose, onSave, loading }) => {
   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color="white" borderRadius="md">
            <ModalHeader>
               <HStack justifyContent="space-between" alignItems="center" w="100%">
                  <Text>
                     Completar orden #0001
                  </Text>
                  <Box mr={0}>
                     <Estatus estatus="preparando" />
                  </Box>
               </HStack>
            </ModalHeader>
            <ModalBody>

               <Formik
                  initialValues={{
                     metodo_pago: '',
                  }}
                  onSubmit={onSave}
               >
                  {({ values, handleChange }) => (
                     <Form>
                        <VStack spacing={4} align="stretch">
                           <FormControl>
                              <FormLabel>Método de pago</FormLabel>
                              <Field as={Select} name="metodo_pago" color="white" bg={Colors.bgSecondary} onChange={handleChange}>
                                 <option style={{ backgroundColor: Colors.bgSecondary }} value="1">Efectivo</option>
                                 <option style={{ backgroundColor: Colors.bgSecondary }} value="2">Tarjeta de crédito</option>
                                 <option style={{ backgroundColor: Colors.bgSecondary }} value="3">Transferencia</option>
                              </Field>
                           </FormControl>
                        </VStack>
                     </Form>
                  )}
               </Formik>

            </ModalBody>

            <ModalFooter gap={3}>
               <Button
                  colorScheme="green"
                  onClick={() => { }}
                  isLoading={loading}
               >
                  Marcar como listo
               </Button>
               <Button
                  colorScheme="gray"
                  onClick={onClose}
                  isDisabled={loading}
               >
                  Cerrar
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
}


export default AcceptOrder;