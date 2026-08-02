
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Select, Textarea, Box, VStack, HStack, Heading, Checkbox, Icon, IconButton, Table, Thead, Tr, Th, Tbody, Td, Text, SwitchProps, Switch, Stack } from '@chakra-ui/react';
import React from 'react'
import Colors from '../../../contants/Colors';
import { Field, Form, Formik } from 'formik';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (values: any) => void;
   loading: boolean;
}

const AddEmployee: React.FC<ModalProps> = ({ isOpen, onClose, onSave, loading }) => {
   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color="white" borderRadius="md">
            <ModalHeader>
               <HStack justifyContent="space-between" alignItems="center" w="100%">
                  <Text>Agregar Usuario</Text>
               </HStack>
            </ModalHeader>
            <ModalBody>
               <Formik
                  initialValues={{
                     name: '',
                     phone: '',
                     user: '',
                     password: '',
                     confirmPassword: '',
                  }}
                  onSubmit={onSave}
               >
                  {({ values, handleChange }) => (
                     <Form>
                        <VStack spacing={3} align="stretch">
                           <FormControl>
                              <FormLabel>Nombre</FormLabel>
                              <Field as={Input} name="name" color="white" bg={Colors.bgSecondary}>
                              </Field>
                           </FormControl>
                           <FormControl>
                              <FormLabel>Telefono</FormLabel>
                              <Field as={Input} name="phone" color="white" bg={Colors.bgSecondary}>
                              </Field>
                           </FormControl>
                           <FormControl>
                              <FormLabel>Usuario</FormLabel>
                              <Field as={Input} name="user" color="white" bg={Colors.bgSecondary}>
                              </Field>
                           </FormControl>
                           <FormControl>
                              <FormLabel>Contraseña</FormLabel>
                              <Field as={Input} name="password" color="white" bg={Colors.bgSecondary}>
                              </Field>
                           </FormControl>
                           <FormControl>
                              <FormLabel>Confirmar contraseña</FormLabel>
                              <Field as={Input} name="confirmPassword" color="white" bg={Colors.bgSecondary}>
                              </Field>
                           </FormControl>
                           <FormControl>
                              <FormLabel>Estatus</FormLabel>
                              <Field as={Select} name="status" color="white" bg={Colors.bgSecondary} isDisabled={true}>
                                 <option style={{ backgroundColor: Colors.bgSecondary }} value="1">Activo</option>
                                 <option style={{ backgroundColor: Colors.bgSecondary }} value="0">Inactivo</option>
                              </Field>
                           </FormControl>
                        </VStack>
                     </Form>
                  )}
               </Formik>

            </ModalBody>

            <ModalFooter gap={3}>
               <Button
                  colorScheme="red"
                  onClick={onClose}
                  isDisabled={loading}
               >
                  Cancelar
               </Button>
               <Button
                  colorScheme="green"
                  onClick={() => { }}
                  isLoading={loading}
               >
                  Guardar
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
}


export default AddEmployee;