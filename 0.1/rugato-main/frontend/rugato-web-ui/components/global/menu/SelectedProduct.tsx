import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardBody, CardHeader, Badge, Divider, FormControl, FormLabel, Grid, HStack, IconButton, Input, Select, Stack, Table, Tbody, Td, Text, Textarea, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import { Carrito, OrderDetails, Product, ProductExtras, ProductIngredients } from '../../../Types'
import { Formik, Form, Field } from 'formik'
import initialValues from './controller/initialValues'
import Colors from '../../../contants/Colors'
import categoriasData from '../../data/CategoriesData'
import handleAddProduct from './controller/handleAddProduct'
import ingredientesData from '../data/IngredientesData'
import { parse } from 'path'
import ExtraPricesList from '../data/ExtraPricesList'

type GlobalBuildState = Record<string, Ingredient[]>;

export default function SelectedProduct(
   { product, setCartItems, cartItems, onCloseAdd }:
      { product: Product | null, setCartItems: React.Dispatch<React.SetStateAction<Carrito[]>>, cartItems: Carrito[], onCloseAdd: () => void }
) {
   const [ingredients, setIngredients] = React.useState<number[]>([]);
   const [extras, setExtras] = React.useState<ProductExtras[]>([]);
   const [buildState, setBuildState] = useState<GlobalBuildState>({});
   const [tmpTotal, setTmpTotal] = React.useState<number>(product?.price || 0);
   const [ingredientesList, setIngredientesList] = React.useState<ProductIngredients[]>(product?.ingredients || []);

   const details: OrderDetails = {
      ingredients: ingredients.length === 0 ? "" :
         "Sin: " +
         ingredients.map((id: number) => {
            const ingrediente = ingredientesList.find(ing => ing.id === id);
            return ingrediente ? ingrediente.name : '';
         }).filter((name: string) => name !== '').join(", "),
      extras: extras.length === 0 ? "" :
         "Con: " + extras.map((e) => {
            const extra = extras.find(ing => ing.id === e.id);
            return extra ? extra.name + ' $' + extra.price : ' ';
         }).filter((name: string) => name !== '').join(", "),
      build: JSON.stringify(buildState),
   }

   if (!product) return <></>

   return (
      <>
         <Box p={{ base: 3, md: 2 }} rounded={"2xl"} userSelect={"none"} color={Colors.text} width={"100%"}>
            <Formik
               initialValues={initialValues}
               // validationSchema={validationSchema}
               onSubmit={(values) => {
                  handleAddProduct(values, setCartItems, cartItems, onCloseAdd);
               }}
            >
               {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                     <VStack spacing={4} align="stretch" width={"100%"}>
                        <VStack spacing={1} align="start" width={"100%"}>
                           <Badge
                              color={Colors.text}
                              bg={categoriasData.filter(cat => cat.id.toString() === product.category)[0]?.bg}
                              fontSize={"sm"}>
                              {categoriasData.filter(cat => cat.id.toString() === product.category)[0]?.name}
                           </Badge>
                           <Text fontSize={"lg"} fontWeight={"bold"}>
                              {product.name}
                           </Text>
                        </VStack>

                        <Divider mt={2} mb={3} />
                        <ServiceType values={values} setFieldValue={setFieldValue} product={product} />
                        <Divider mt={2} mb={3} />
                        {
                           ["1", "2", "3", "7", "8", "12", "13"].includes(product.category) &&
                           <>
                              <Drink3Prices values={values} setFieldValue={setFieldValue} product={product} />
                           </>
                        } {
                           ["4"].includes(product.category) && (
                              <Drink1Price values={values} setFieldValue={setFieldValue} product={product} />
                           )
                        } {
                           ingredientesList.length > 0 &&
                           <Ingredients
                              product={product}
                              ingredients={ingredients}
                              setIngredients={setIngredients}
                              ingredientesList={ingredientesList}
                           />
                        } {
                           ["9", "11"].includes(product.category) && (
                              <>
                                 <Builds
                                    product={product}
                                    setFieldValue={setFieldValue}
                                    // build={build}
                                    // setBuild={setBuild}
                                    build={buildState}
                                    setBuild={setBuildState}
                                 />
                              </>
                           )
                        }{
                           product.extras.length > 0 && (
                              <VStack spacing={2} align="stretch" width={"100%"}>
                                 <Divider mt={2} mb={3} />
                                 <Extras
                                    product={product}
                                    extras={extras}
                                    setExtras={setExtras}
                                 />
                              </VStack>
                           )
                        }{
                           ["15"].includes(product.category) && (
                              <>
                                 <Customization
                                    value={values}
                                    setFieldValue={setFieldValue}
                                 />
                                 <Divider mt={2} mb={5} />
                              </>
                           )
                        }
                        <VStack spacing={2} align="stretch" width={"100%"} mt={5}>
                           <FormControl>
                              <FormLabel>Notas: *</FormLabel>
                              <Field
                                 name="notes"
                                 as={Textarea}
                                 height={"200px"}
                                 placeholder="Escribe los detalles aquí..."
                                 p={3}
                              />
                           </FormControl>
                        </VStack>
                        {
                           ["9", "11"].includes(product.category) &&
                           <VStack spacing={2} align="stretch" width={"100%"}>
                              <Box>
                                 <Text fontWeight={"bold"}>Detalles: *</Text>
                                 {/* <Text>Sin: {details.ingredients}</Text> */}
                                 <Text>Extras: {details.extras}</Text>
                              </Box>
                           </VStack>
                        }

                        <Divider mt={2} mb={5} />
                        <FormControl >
                           <Box justifyContent={"space-between"} width={"100%"}>
                              <FormLabel minW={"120px"} width={"100%"}>Cantidad:</FormLabel>
                              <Field
                                 p={3}
                                 as={Input}
                                 type="number"
                                 color={Colors.text}
                                 bg={Colors.bgSecondary}
                                 name="quantity"
                                 min={1}
                                 defaultValue={1}
                              >
                              </Field>
                           </Box>
                        </FormControl>
                        <FormControl >
                           <Box justifyContent={"space-between"} width={"100%"}>
                              <FormLabel minW={"120px"} width={"100%"}>Costo Extra:</FormLabel>
                              <Field
                                 p={3}
                                 as={Input}
                                 color={Colors.text}
                                 bg={Colors.bgSecondary}
                                 type="number"
                                 name="extraprice"
                              >
                              </Field>
                           </Box>
                        </FormControl>
                        <FormControl >
                           <Box justifyContent={"space-between"} width={"100%"}>
                              <FormLabel minW={"120px"} width={"100%"}>Mesa:</FormLabel>
                              <Field
                                 p={3}
                                 as={Input}
                                 color={Colors.text}
                                 bg={Colors.bgSecondary}
                                 type="number"
                                 name="table"
                              >
                              </Field>
                           </Box>
                        </FormControl>

                        <Divider mt={2} mb={5} />
                        <VStack width={"100%"} gap={0}>
                           <HStack width={"100%"} align="space-between" justifyContent={"space-between"}>
                              <Text fontWeight={"bold"} >Total de c/u:</Text>
                              <Text fontWeight={"bold"} color={Colors.green} >
                                 $ {tmpTotal === 0 ? values.total : tmpTotal + (product.extras.length > 0 ? extras.reduce((acc, curr) => parseInt(acc.toString()) + parseInt(curr.price.toString()), 0) : 0)}
                              </Text>
                           </HStack>
                           {
                              values.extraprice > 0 &&
                              <HStack width={"100%"} align="space-between" justifyContent={"space-between"}>
                                 <Text fontWeight={"bold"} >Precio extra:</Text>
                                 <Text fontWeight={"bold"} color={Colors.green} >
                                    $ {values.extraprice}
                                 </Text>
                              </HStack>
                           }
                        </VStack>
                        <Divider mt={2} mb={5} />
                        <HStack align="space-between" justifyContent={"flex-end"} width={"100%"}>
                           <Button
                              type='submit'
                              bg={Colors.green}
                              onClick={() => {
                                 setFieldValue("name", product.name);
                                 setFieldValue("productId", product.id);
                                 setFieldValue("details", JSON.stringify(details));
                                 setFieldValue("categoryName", categoriasData.filter(cat => cat.id.toString() === product.category)[0]?.name);
                                 if (tmpTotal !== 0) {
                                    setFieldValue("total", product.price + (product.extras.length > 0 ? extras.reduce((acc, curr) => parseInt(acc + "") + parseInt(curr.price + ""), 0) : 0));
                                 }
                              }}
                           // color={Colors.textLight}
                           >
                              <Text fontWeight={"bold"} >Ordenar</Text>
                           </Button>
                        </HStack>
                     </VStack>
                  </Form>
               )}
            </Formik>
         </Box>
      </>
   )
}

const Drink3Prices = (
   { values, setFieldValue, product }:
      { values: any, setFieldValue: (field: string, value: any) => void, product: any }
) => {
   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <VStack width={"100%"} align={"space-between"} spacing={2}>
            <Text fontWeight={"bold"} alignSelf={"flex-start"}>Tamaño</Text>
            <HStack width={"100%"} spacing={2} color={Colors.text} justifyContent={"space-between"}>
               <Button
                  bg={values.size === "Pequeño" ? Colors.green : Colors.bgSecondary}
                  color={values.size === "Pequeño" ? "#000" : Colors.text}
                  px={10}
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => {
                     setFieldValue("total", product.price_ch);
                     setFieldValue("size", "Pequeño");
                  }}
               >
                  Pequeño
               </Button>
               <Button
                  bg={values.size === "Mediano" ? Colors.green : Colors.bgSecondary}
                  color={values.size === "Mediano" ? "#000" : Colors.text}
                  px={10}
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => {
                     setFieldValue("total", product.price_med);
                     setFieldValue("size", "Mediano");
                  }}
               >
                  Mediano
               </Button>
               <Button
                  bg={values.size === "Grande" ? Colors.green : Colors.bgSecondary}
                  color={values.size === "Grande" ? "#000" : Colors.text}
                  px={10}
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => {
                     setFieldValue("total", product.price_gde);
                     setFieldValue("size", "Grande");
                  }}
               >
                  Grande
               </Button>
            </HStack>
         </VStack>
      </VStack>
   )
}

const ServiceType = (
   { values, setFieldValue, product }:
      { values: any, setFieldValue: (field: string, value: any) => void, product: any }
) => {
   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <VStack width={"100%"} align={"space-between"} spacing={2}>
            {/* <Text fontWeight={"bold"} alignSelf={"flex-start"}>Tipo</Text> */}
            <HStack width={"100%"} spacing={2} color={Colors.text} justifyContent={"space-between"}>
               <Button
                  bg={values.service === "comer aquí" ? Colors.green : Colors.bgSecondary}
                  color={values.service === "comer aquí" ? "#000" : Colors.text}
                  px={10}
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => {
                     setFieldValue("service", "comer aquí");
                  }}
               >
                  Para comer aquí
               </Button>
               <Button
                  bg={values.service === "llevar" ? Colors.green : Colors.bgSecondary}
                  color={values.service === "llevar" ? "#000" : Colors.text}
                  px={10}
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => {
                     setFieldValue("service", "llevar");
                  }}
               >
                  Para llevar
               </Button>
            </HStack>
         </VStack>
      </VStack>
   )
}

const Drink1Price = (
   { values, setFieldValue, product }:
      { values: any, setFieldValue: (field: string, value: any) => void, product: any }
) => {
   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <VStack width={"100%"} align={"space-between"} spacing={2}>
            <Text fontWeight={"bold"} alignSelf={"flex-start"}>Tamaño</Text>
            <HStack width={"100%"} spacing={2} color={Colors.text} justifyContent={"space-between"}>
               <Button
                  bg={values.size === "Pieza" ? Colors.green : Colors.bgSecondary}
                  color={values.size === "Pieza" ? "#000" : Colors.text}
                  px={10}
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => {
                     setFieldValue("total", product.price);
                     setFieldValue("size", "Pieza");
                  }}
               >
                  Normal
               </Button>
            </HStack>
         </VStack>
      </VStack>
   )
}

const Ingredients = (
   { product, ingredients, setIngredients, ingredientesList }:
      { product: Product, ingredients: any[], setIngredients: any, ingredientesList: ProductIngredients[] }
) => {
   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <VStack spacing={2} align="stretch" width={"100%"}>
            <Text fontWeight={"semibold"}>Eliminar ingredientes:</Text>
            <HStack wrap={"wrap"} spacing={4}>
               {ingredientesList.map(ing => (
                  <Box
                     key={ing.id}
                     background={ingredients.includes(ing.id) ? Colors.red : Colors.bgSecondary}
                     p={2}
                     borderRadius={"md"}
                     border={"1px solid"}
                     borderColor={Colors.table.header}
                     color={ingredients.includes(ing.id) ? "#000" : "#fff"}
                     cursor={"pointer"}
                     onClick={() => {
                        if (ingredients.includes(ing.id)) {
                           setIngredients(ingredients.filter((id: number) => id !== ing.id));
                        } else {
                           setIngredients([...ingredients, ing.id]);
                        }
                     }}
                  >
                     <Text>{ing.name.charAt(0).toUpperCase() + ing.name.slice(1).toLowerCase()}</Text>
                  </Box>
               ))}
            </HStack>
            {/* {ingredients.length === 0 &&
               <Text fontWeight={"bold"}>Con todo</Text>
            } */}

            {ingredients.length > 0 &&
               <Text fontWeight={"bold"}>
                  Sin: {ingredients.map((id: number) => {
                     const ingrediente = ingredientesList.find(ing => ing.id === id);
                     return ingrediente ? ingrediente.name : '';
                  }).filter((name: string) => name !== '').join(", ")}
               </Text>
            }
         </VStack>
      </VStack>
   )
}

const Customization = ({ value, setFieldValue }: { value: any, setFieldValue: (field: string, value: any) => void }) => {
   return (
      <Box>
         <Text fontWeight={"bold"} mb={2}>Personalización de precio:</Text>
         <Input
            type='number'
            value={value.total}
            onChange={(e) => setFieldValue("total", e.target.value)}
         />
      </Box>
   )
}

const Extras = (
   { product, extras, setExtras }:
      { product: Product, extras: ProductExtras[], setExtras: any }
) => {
   const extrasIds = extras.map(e => {
      return e.id;
   });
   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <VStack spacing={2} align="stretch" width={"100%"}>
            <Text fontWeight={"semibold"}>Seleccione extras:</Text>
            <HStack wrap={"wrap"} spacing={4}>
               {product.extras.map(ext => (
                  <Box
                     key={ext.id}
                     background={extrasIds.includes(ext.id) ? Colors.green : Colors.bgSecondary}
                     p={2}
                     borderRadius={"md"}
                     border={"1px solid"}
                     borderColor={Colors.table.header}
                     color={extrasIds.includes(ext.id) ? "#000" : "#fff"}
                     cursor={"pointer"}
                     onClick={() => {
                        if (extrasIds.includes(ext.id)) {
                           setExtras(extras.filter(({ id }) => id !== ext.id));
                        } else {
                           setExtras([...extras, ext]);
                        }
                     }}
                  >
                     <Text>{ext.name}</Text>
                  </Box>
               ))}
            </HStack>
            {extras.length === 0 &&
               <Text fontWeight={"bold"}></Text>
            }
            {extras.length > 0 &&
               <Text>
                  Extras: {extras.map((e) => {
                     const extra = extras.find(ing => ing.id === e.id);
                     return extra ? extra.name + ' $' + extra.price : ' ';
                  }).filter((name: string) => name !== '').join(", ")}
               </Text>
            }
         </VStack>
      </VStack>
   )
}
interface Ingredient {
   id: string;
   name: string;
}

const Builds = (
   { product, setBuild }:
      { product: Product, setFieldValue: (field: string, value: any) => void, build: any, setBuild: (value: GlobalBuildState) => void }
) => {
   const [selectedIngredients, setSelectedIngredients] = useState<GlobalBuildState>({});

   const handleSelectionChange = (category: string, newIngredients: Ingredient[]) => {
      setSelectedIngredients(prev => ({
         ...prev,
         [category]: newIngredients,
      }));
   };

   useEffect(() => {
      setBuild(selectedIngredients);
   }, [selectedIngredients, setBuild]);

   return (
      <VStack spacing={2} align="stretch" width={"100%"}>
         <Text fontSize={"lg"} fontWeight={"bold"} color={Colors.green}>Arme su producto</Text>
         <Box>
            {product.builds.map((b) => {
               const newIngredients = b.ingredients.split("-").map(ing => {
                  const name = ing.trim().charAt(0).toUpperCase() + ing.trim().slice(1).toLowerCase();
                  return {
                     id: `${Math.random().toFixed(4).replace(".", "")}-${Date.now()}-${name.toLowerCase()}`,
                     name,
                  };
               });

               const currentSelected = selectedIngredients[b.name] || [];

               return (
                  <Box key={b.name} mb={10}>
                     <HStack spacing={1} mb={0} borderBottomWidth={1} borderColor={Colors.bg}>
                        <Text fontWeight={"bold"}>Agregue {b.name}</Text>
                        <Box bg={"blue.500"} color={"white"} borderRadius={"md"} px={2} py={0.5} fontSize={"xs"} fontWeight={"semibold"}>
                           <Text>Máximo: {b.maximo}</Text>
                        </Box>
                     </HStack>
                     <Box mt={2} mb={1}>
                        <BuildOptions
                           ingredientes={newIngredients}
                           max={b.maximo}
                           categoryName={b.name}
                           onSelectionChange={handleSelectionChange}
                           selected={currentSelected}
                        />
                     </Box>
                     <Box>
                        <Text textColor={Colors.green} fontWeight={"bold"} mt={2}>
                           {currentSelected.map(ing => ing.name).join(", ")}
                        </Text>
                        <Button
                           mt={2}
                           onClick={() => handleSelectionChange(b.name, [])}
                           bg={Colors.red}
                           color={"#fff"}
                           _hover={{ bg: Colors.red }}
                        >Limpiar</Button>
                     </Box>
                  </Box>
               );
            })}
         </Box>
      </VStack>
   );
};

// --- Componente BuildOptions refactorizado a Tailwind CSS ---
const BuildOptions = (
   { ingredientes, max, categoryName, onSelectionChange, selected }:
      { ingredientes: Ingredient[], max: number, categoryName: string, onSelectionChange: (category: string, newIngredients: Ingredient[]) => void, selected: Ingredient[] }
) => {
   const handleToggle = (ingredient: Ingredient) => {
      const isSelected = selected.some(ing => ing.id === ingredient.id);

      if (isSelected) {
         const newSelected = selected.filter(ing => ing.id !== ingredient.id);
         onSelectionChange(categoryName, newSelected);
      } else {
         if (selected.length < max) {
            const newSelected = [...selected, ingredient];
            onSelectionChange(categoryName, newSelected);
         }
      }
   };

   return (
      <HStack wrap={"wrap"} spacing={2} cursor={"pointer"}>
         {ingredientes.map((ing) => {
            const isSelected = selected.some(s => s.id === ing.id);
            const bgColor = isSelected ? Colors.green : Colors.bgSecondary;
            const textColor = isSelected ? "black" : "white";
            return (
               <Box
                  key={ing.id}
                  bg={bgColor}
                  color={textColor}
                  border={`1px solid ${Colors.bg}`}
                  p={2}
                  borderRadius={"md"}
                  cursor={"pointer"}
                  // className="p-2 rounded-md cursor-pointer transition-colors duration-200"
                  onClick={() => handleToggle(ing)}
               >
                  <Text fontSize={"md"}>{ing.name}</Text>
               </Box>
            );
         })}
      </HStack>
   );
};

