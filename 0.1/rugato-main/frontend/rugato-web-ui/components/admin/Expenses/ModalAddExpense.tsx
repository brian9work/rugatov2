import { Form, Formik } from "formik";
import { FinancesExpensesRevenueResponse, FinancesRequest } from "../../../TypesBackend";
import { usePost } from "../../../hooks/Post";
import { Button, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, FormControl, FormLabel, Input, VStack, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, useToast, } from '@chakra-ui/react'
import Colors from "../../../contants/Colors";
import handleAddExpense from "./controller/handleAddExpense";

export function ModalAddExpense(
   { onSave, isOpen, onClose, tipo, refetchFinances }:
      { onSave: (values: any) => void, isOpen: boolean, onClose: () => void, tipo: "gasto" | "ingreso", refetchFinances: () => void }
) {
   const toast = useToast();
   const initialValuesAddEmployee = {
      id: 0,
      type: tipo,
      amount: "",
      reason: "",
      date: new Date().toISOString().split('T')[0], 
   }

   const { post, loading, error } =
      usePost<FinancesExpensesRevenueResponse, FinancesRequest>()

   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color={Colors.text} borderRadius="md">
            <ModalHeader>
               <HStack justifyContent="space-between" alignItems="center" w="100%">
                  <Text>
                     {tipo === "gasto" ? "Agregar gasto" : "Agregar Dinero"}
                  </Text>
               </HStack>
            </ModalHeader>
            <ModalBody>
               <Formik
                  initialValues={initialValuesAddEmployee}
                  onSubmit={(values) => {
                     handleAddExpense(
                        {
                           quantity: values.amount+"",
                           reason: values.reason,
                           categoryName: values.reason,
                           userId: 24
                        },
                        values.type,
                        toast,
                        post,
                        error,
                        refetchFinances,
                        onClose
                     )
                  }}
               >
                  {({ values, handleChange }) => (
                     <Form>
                        <VStack spacing={5} align="stretch" w="100%">
                           {/* <FormControl m={0} p={0} h={0} overflow={"hidden"} bg={"#f00"}> */}
                              <Input
                                 type="text"
                                 disabled
                                 value={values.type}
                                 hidden
                              />
                           {/* </FormControl> */}
                           <FormControl>
                              <FormLabel>Monto</FormLabel>
                              <Input
                                 type="number"
                                 value={values.amount}
                                 onChange={handleChange}
                                 name="amount"
                                 placeholder="Ingrese el monto"
                              />
                           </FormControl>
                           <FormControl>
                              <FormLabel>Motivo</FormLabel>
                              <Input
                                 type="text"
                                 value={values.reason}
                                 onChange={handleChange}
                                 name="reason"
                                 placeholder="Ingrese el motivo"
                              />
                           </FormControl>
                        </VStack>
                        <ModalFooter p={0} mt={5} pb={10}>
                           <Button colorScheme='green' type="submit">
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