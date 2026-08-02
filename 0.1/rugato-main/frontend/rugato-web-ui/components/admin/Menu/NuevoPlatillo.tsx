import React from 'react'
import { Box, Button, Card, Divider, Flex, FormControl, FormErrorMessage, FormLabel, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, Spinner, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import { Formik, Form, Field, FormikValues } from 'formik';
import Colors from '../../../contants/Colors'
import initialValues from './utils/initialValues';
import ModalComponent from '../../global/components/ModalComponent';
import OptionCategoriesData from '../../global/data/OptionCategoriesData';
import ingredientesData from '../../global/data/IngredientesData';
import ButtonsComponents from '../../global/ButtonsComponents';
import SearchIngrediente from '../../global/data/SearchIngrediente';

export default function NuevoPlatillo(
   { isOpen, onClose, loading, onSave }:
      { isOpen: boolean; onClose: () => void; loading: boolean; onSave: (values: FormikValues) => void; }
) {

   return (
      <ModalComponent
         isOpen={isOpen}
         onClose={onClose}
         size='3xl'
         header="Nuevo Platillo"
      >
         {loading && (
            <Flex justifyContent="center" alignItems="center" height="100px">
               <Spinner size="xl" />
            </Flex>
         )}

         {!loading && (
            <Formik
               initialValues={initialValues}
               // validationSchema={validationSchema}
               onSubmit={(values) => {
                  onSave(values);
               }}
            >
               {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                     <VStack spacing={4} align="stretch" px={2}>
                        <VStack spacing={2}>
                           <FormControl>
                              <FormLabel>Nombre *</FormLabel>
                              <Field name="name" as={Input} />
                           </FormControl>
                           <FormControl>
                              <FormLabel>Categoria *</FormLabel>
                              <Field name="category" as={Select}>
                                 {<OptionCategoriesData />}
                              </Field>
                           </FormControl>
                           {["5", "6", "9", "10", "11", "14", "15"].includes(values.category) && (
                              <FormControl>
                                 <FormLabel>Precio *</FormLabel>
                                 <Field name="price" as={Input} type="number" />
                              </FormControl>
                           )}
                           <FormControl>
                              <FormLabel>Descripcion * </FormLabel>
                              <Field name="description" as={Input} type="text" />
                           </FormControl>
                           <Divider my={3} />
                           <IngredientesComponent values={values} setFieldValue={setFieldValue} />
                           {values.category !== "0" && (
                              <>
                                 {["1", "2", "3", "4", "7", "8", "12", "13"].includes(values.category) ? (
                                    <>
                                       <Divider my={3} />
                                       <HStack width={"100%"}>
                                          <FormControl>
                                             <FormLabel>Precio Chico</FormLabel>
                                             <Field name="price_ch" as={Input} type="number" />
                                          </FormControl>
                                          <FormControl>
                                             <FormLabel>Precio Mediano</FormLabel>
                                             <Field name="price_med" as={Input} type="number" />
                                          </FormControl>
                                          <FormControl>
                                             <FormLabel>Precio Grande</FormLabel>
                                             <Field name="price_gde" as={Input} type="number" />
                                          </FormControl>
                                       </HStack>
                                    </>
                                 ) : (
                                    <>
                                       {["9", "11"].includes(values.category) && (
                                          <VStack width={"100%"} spacing={4}>
                                             <Divider my={3} />
                                             <ArmadosComponent values={values} setFieldValue={setFieldValue} />
                                             <Divider my={3} />
                                          </VStack>
                                       )}
                                    </>
                                 )}
                              </>
                           )}

                           <ExtrasComponent values={values} setFieldValue={setFieldValue} />

                           {values.category !== "0" && (
                              <ModalFooter p={0} width={"100%"}>
                                 <HStack
                                    alignItems={"flex-end"}
                                    justifyContent={"flex-end"}
                                    width={"100%"}
                                 >
                                    <Button
                                       mt={3}
                                       type='submit'
                                       background={Colors.green}
                                       _hover={{ background: Colors.green, transform: "scale(1.05)" }}
                                    >
                                       Guardar
                                    </Button>
                                 </HStack>
                              </ModalFooter>
                           )}
                        </VStack>
                     </VStack>
                  </Form>
               )}
            </Formik>
         )}

      </ModalComponent>
   )
}


const ExtrasComponent = (
   { values, setFieldValue }:
      { values: FormikValues, setFieldValue: (field: string, value: any) => void }
) => {
   const [newExtraName, setNewExtraName] = React.useState("");
   const [newExtraPrice, setNewExtraPrice] = React.useState(1);

   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <Text fontWeight={"bold"}>Extras:</Text>
         <VStack alignItems={"stretch"} spacing={1} mb={4}>
            {values.extras.map((extra: any, index: number) => (
               <HStack key={index} justify="space-between">
                  <Text width={"100px"}>{extra.name}</Text>
                  <Text>${extra.price.toFixed(2)}</Text>
                  <ButtonsComponents.Delete onClick={() => {
                     setFieldValue("extras", values.extras.filter((_: any, i: number) => i !== index));
                  }} />
               </HStack>
            ))}
         </VStack>
         <HStack>
            <Input
               type="text"
               placeholder='Nombre del extra'
               width={"100%"}
               value={newExtraName}
               onChange={(e) => setNewExtraName(e.target.value)}
            />
            <Input
               type="number"
               placeholder='Precio'
               width={"100px"}
               value={newExtraPrice}
               onChange={(e) => setNewExtraPrice(Number(e.target.value))}
            />
            <Button
               border={"1px solid"}
               borderColor={Colors.green}
               background={"#0000"}
               _hover={{ transform: "scale(1.05)" }}
               textColor={Colors.green}
               px={8}
               onClick={() => {
                  if (newExtraName.trim() && newExtraPrice > 0) {
                     const newExtra = {
                        id: Date.now(),
                        name: newExtraName.trim(),
                        price: newExtraPrice
                     };
                     setFieldValue("extras", [...values.extras, newExtra]);
                     setNewExtraName("");
                     setNewExtraPrice(0);
                  }
               }}>
               Agregar
            </Button>
         </HStack>

      </VStack>
   )
}

const ArmadosComponent = (
   { values, setFieldValue }:
      { values: FormikValues, setFieldValue: (field: string, value: any) => void }
) => {
   const [name, setName] = React.useState("");
   const [maximo, setMaximo] = React.useState(1);
   const [selectedIngredient, setSelectedIngredient] = React.useState<any[]>([]);

   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <Text fontWeight={"bold"}>Armados:</Text>
         <VStack alignItems={"stretch"} spacing={1} mb={4}>
            {values.builds.map((build: any, index: number) => (
               <HStack key={index} justify="space-between">
                  <VStack align="start" spacing={1}>
                     <Text fontWeight="bold">{build.name}</Text>
                     <Text fontSize="sm" color="gray.500">
                        {build.ingredients}
                        {/* {build.ingredients.map((ing: any) => ing.name).join(", ")} */}
                     </Text>
                  </VStack>
                  <HStack spacing={2}>
                     <Text fontSize="sm">Max: {build.maximo}</Text>
                     <ButtonsComponents.Delete onClick={() => {
                        setFieldValue("builds", values.builds.filter((_: any, i: number) => i !== index));
                     }} />
                  </HStack>
               </HStack>
            ))}
         </VStack>
         <VStack alignItems={"stretch"} spacing={3} mb={4}>
            <FormControl>
               <FormLabel>Nombre / Categoria</FormLabel>
               <Input
                  placeholder='Nombre'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />
            </FormControl>
            <SearchIngrediente
               selectedIngredient={selectedIngredient}
               setSelectedIngredient={setSelectedIngredient}
            />
            {selectedIngredient.length > 0 && (
               <>
                  <HStack wrap={"wrap"} spacing={2}>
                     {selectedIngredient.map((ing, key) => (
                        <Text
                           cursor={"pointer"}
                           p={2}
                           background={Colors.bgSecondary}
                           width={"fit-content"}
                           key={"ing" + key}
                           rounded={"md"}
                           onClick={() => {
                              setSelectedIngredient(selectedIngredient.filter(i => i !== ing));
                           }}
                        >
                           {ing}
                        </Text>
                     ))}
                  </HStack>
               </>
               // <Text>Ingredientes seleccionados: {selectedIngredient.map(ing => ing.name).join(", ")}</Text>
            )}

            <FormControl>
               <FormLabel>Maximo</FormLabel>
               <Input
                  type='number'
                  placeholder='Máximo'
                  value={maximo}
                  onChange={(e) => setMaximo(Number(e.target.value))}
               />
            </FormControl>
            <HStack alignItems={"flex-end"} justifyContent={"flex-end"} width={"100%"}>
               <Button
                  border={"1px solid"}
                  borderColor={Colors.green}
                  background={"#0000"}
                  _hover={{ transform: "scale(1.05)" }}
                  textColor={Colors.green}
                  px={8}
                  onClick={() => {
                     console.log("Agregar build");
                     if (name.trim() && selectedIngredient.length > 0) {
                        const newBuild = {
                           id: Date.now(),
                           name: name.trim(),
                           // ingredients: selectedIngredient.map(ing => ({ id: ing.id, name: ing.name })),
                           ingredients: selectedIngredient.map(ing => ing).join(", "),
                           price: 1,
                           maximo: maximo
                        };
                        setFieldValue("builds", [...values.builds, newBuild]);
                        setName("");
                        setMaximo(1);
                        setSelectedIngredient([]);
                     }
                  }}>
                  Agregar
               </Button>
            </HStack>
         </VStack>
      </VStack>
   )
}

export const IngredientesComponent = (
   { values, setFieldValue }:
      { values: FormikValues, setFieldValue: (field: string, value: any) => void }
) => {

   const [newIngredientName, setNewIngredientName] = React.useState("");

   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <Text fontWeight={"bold"}>Ingredientes:</Text>
         <VStack alignItems={"stretch"} spacing={1} mb={0}>
            {values.ingredients.map((ingredient: any, index: number) => (
               <HStack key={index} justify="space-between">
                  <Text width={"100px"}>{ingredient.name}</Text>
                  <ButtonsComponents.Delete onClick={() => {
                     setFieldValue("ingredients", values.ingredients.filter((_: any, i: number) => i !== index));
                  }} />
               </HStack>
            ))}
         </VStack>
         <HStack>
            <Input
               type="text"
               placeholder='nombre'
               value={newIngredientName}
               onChange={(e) => setNewIngredientName(e.target.value)}
            />
            <Button
               border={"1px solid"}
               borderColor={Colors.green}
               background={"#0000"}
               _hover={{ transform: "scale(1.05)" }}
               textColor={Colors.green}
               px={8}
               onClick={() => {
                  if (newIngredientName.trim()) {
                     const newIngredient = {
                        id: Date.now(),
                        name: newIngredientName.trim()
                     };
                     setFieldValue("ingredients", [...values.ingredients, newIngredient]);
                     setNewIngredientName("");
                  }
               }}>
               Agregar
            </Button>
         </HStack>
      </VStack>
   );
}
