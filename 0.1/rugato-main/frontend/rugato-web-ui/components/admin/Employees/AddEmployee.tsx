
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, FormControl, FormLabel, Input, Select, VStack, HStack, Text } from '@chakra-ui/react';
import React from 'react'
import Colors from '../../../contants/Colors';
import { Field, Form, Formik } from 'formik';
import initialValuesAddEmployee from './controller/InitValues';

interface ModalProps {
   isOpen: boolean;
   loadingUser: boolean;
   onClose: () => void;
   onSave: (values: any) => void;
   loading: boolean;
}

const AddEmployee: React.FC<ModalProps> = ({ isOpen, loadingUser, onClose, onSave, loading }) => {

   return (
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color={Colors.text} borderRadius="md">
            <ModalHeader>
               <HStack justifyContent="space-between" alignItems="center" w="100%">
                  <Text>Agregar Usuario</Text>
               </HStack>
            </ModalHeader>
            <ModalBody>
               <Formik
                  initialValues={initialValuesAddEmployee}
                  onSubmit={(values) => {
                     if(values.password !== values.confirmPassword){
                        alert("Las contraseñas no coinciden");
                        return;
                     }
                     onSave(values);
                  }}
               >
                  {({ values, handleChange }) => (
                     <Form>
                        <VStack spacing={5} align="stretch">
                           <HStack spacing={5} align="stretch" w="100%">
                              <FormControl>
                                 <FormLabel>Nombre</FormLabel>
                                 <Field as={Input} name="name" color={Colors.text} bg={Colors.bgSecondary}>
                                 </Field>
                              </FormControl>
                              <FormControl>
                                 <FormLabel>Apellido</FormLabel>
                                 <Field as={Input} name="lastname" color={Colors.text} bg={Colors.bgSecondary}>
                                 </Field>
                              </FormControl>
                           </HStack>
                           <HStack spacing={5} align="stretch" w="100%">
                              <FormControl>
                                 <FormLabel>Telefono</FormLabel>
                                 <Field as={Input} name="phone" color={Colors.text} bg={Colors.bgSecondary}>
                                 </Field>
                              </FormControl>
                              <FormControl>
                                 <FormLabel>Nombre de usuario</FormLabel>
                                 <Field as={Input} name="user" color={Colors.text} bg={Colors.bgSecondary}>
                                 </Field>
                              </FormControl>
                              <FormControl>
                                 <FormLabel>Siglas</FormLabel>
                                 <Field as={Input} name="acronym" color={Colors.text} bg={Colors.bgSecondary} maxLength={3}>
                                 </Field>
                              </FormControl>
                           </HStack>
                           <HStack spacing={5} align="stretch" w="100%">
                              <FormControl>
                                 <FormLabel>Contraseña</FormLabel>
                                 <Field as={Input} name="password" color={Colors.text} bg={Colors.bgSecondary}>
                                 </Field>
                              </FormControl>
                              <FormControl>
                                 <FormLabel>Confirmar contraseña</FormLabel>
                                 <Field as={Input} name="confirmPassword" color={Colors.text} bg={Colors.bgSecondary}>
                                 </Field>
                              </FormControl>
                           </HStack>
                           <HStack spacing={5} align="stretch" w="100%">
                           <FormControl>
                              <FormLabel>Tipo</FormLabel>
                              <Field as={Select} name="type" color={Colors.text} bg={Colors.bgSecondary} >
                                 <option style={{ backgroundColor: Colors.bgSecondary }} value="1">Admin</option>
                                 <option style={{ backgroundColor: Colors.bgSecondary }} value="2">Usuario</option>
                                 <option style={{ backgroundColor: Colors.bgSecondary }} value="3">Cocina</option>
                              </Field>
                           </FormControl>
                           </HStack>
                        </VStack>
                        <ModalFooter gap={3} p={0} mt={6}>
                           <Button
                              colorScheme="red"
                              onClick={onClose}
                              isDisabled={loading}
                           >
                              Cancelar
                           </Button>
                           <Button
                              colorScheme="green"
                              type='submit'
                              isLoading={loadingUser}
                           >
                              Guardar
                           </Button>
                        </ModalFooter>
                     </Form>
                  )}
               </Formik>

            </ModalBody>


         </ModalContent>
      </Modal>
   )
}


export default AddEmployee;