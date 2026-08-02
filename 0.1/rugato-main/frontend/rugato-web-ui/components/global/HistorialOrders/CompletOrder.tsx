
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Select, Textarea, Box, VStack, HStack, Heading, Checkbox, Icon, IconButton, Table, Thead, Tr, Th, Tbody, Td, Text, SwitchProps, Switch, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import Colors from '../../../contants/Colors';
import { Field, Form, Formik } from 'formik';
import Estatus from './Estatus';
import Service from '../../../service/service';
import { useGet } from '../../../hooks/GetWithCallback';
import { User } from '../../../Types';
import { CreateOrder } from '../../../TypesBackend';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (values: any) => void;
   loading: boolean;
   order: CreateOrder | null;
}

const CompletOrder: React.FC<ModalProps> = ({ isOpen, onClose, onSave, loading, order }) => {
   const [loadingButton, setLoadingButton] = React.useState(false);


   useEffect(() => {
      setLoadingButton(false);
   }, [order]);

   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color={Colors.text} borderRadius="md">
            <ModalHeader>
               <HStack justifyContent="space-between" alignItems="center" w="100%">
                  <Text>
                     Completar orden #{order?.orderId}
                  </Text>
               </HStack>
            </ModalHeader>
            <ModalBody>
               <Formik
                  initialValues={{
                     payment: 'efectivo',
                     user: '',
                  }}
                  onSubmit={
                     (values) => {
                        if (!order) return;
                        if (values.user === "" || values.user === null) {
                           alert("Debe seleccionar un usuario");
                           return;
                        }
                        if (values.payment === "" || values.payment === null) {
                           alert("Debe seleccionar un método de pago");
                           return;
                        }

                        onSave(values);
                     }
                  }
               >
                  {({ values, handleChange }) => (
                     <Form>
                        <VStack spacing={4} align="stretch">
                           <VStack>
                              <FormControl>
                                 <FormLabel>Usuario</FormLabel>
                                 <Field
                                    as={Select}
                                    name="user"
                                    color={Colors.text}
                                    bg={Colors.bgSecondary}
                                 >
                                    <UserList />
                                 </Field>
                              </FormControl>
                              <FormControl>
                                 <FormLabel>Método de pago</FormLabel>
                                 <Field as={Select} name="payment" color={Colors.text} bg={Colors.bgSecondary} >
                                    <option style={{ backgroundColor: Colors.bgSecondary }} value="efectivo">Efectivo</option>
                                    <option style={{ backgroundColor: Colors.bgSecondary }} value="tarjeta_credito">Tarjeta de crédito</option>
                                    <option style={{ backgroundColor: Colors.bgSecondary }} value="transferencia">Transferencia</option>
                                 </Field>
                              </FormControl>
                           </VStack>
                        </VStack>
                        <ModalFooter gap={3} p={0} mt={6}>
                           <Button
                              colorScheme="green"
                              type='submit'
                              // isLoading={loadingButton}
                              onClick={() => setLoadingButton(true)}
                           >
                              {
                                 loadingButton ? 'Guardando...' : 'Guardar'
                              }
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

export default CompletOrder;

const UserList = () => {
   const { data, loading, error } = useGet<User[]>(Service.user.getAll());
   return (
      <>
         {loading && <option value="">Cargando usuarios</option>}
         {error && <option value="">Error al cargar los usuarios</option>}
         <option style={{ backgroundColor: Colors.bgSecondary }} value="">Seleccionar usuario</option>
         {data?.map((usuario) => (
            <option style={{ backgroundColor: Colors.bgSecondary }} key={usuario.id} value={`${usuario.name} ${usuario.lastname}`}>
               {usuario.name} {usuario.lastname} ({usuario.acronym.toUpperCase()})
            </option>
         ))}
      </>
   )
}