import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Grid, HStack, IconButton, Select, Spinner, Switch, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Colors from '../../../contants/Colors'
import AllMenuData from '../../data/AllMenuData';
import categoriasData from '../../data/CategoriesData';
import { useGet } from '../../../hooks/GetWithCallback';
import { mapProduct, Product, ProductServer, User } from '../../../Types';
import Service from '../../../service/service';

export default function TableComponent(
   { status, category, search, setSelectedItem, onOpenEdit }: 
   { status: string, category: string, search: string, setSelectedItem: React.Dispatch<React.SetStateAction<Product | null>>, onOpenEdit: () => void })
{
   const [menu, setMenu] = React.useState<Product[]>([]);
   const {
      data,
      loading: cargando,
      error: error,
      refetch: refetch,
   } = useGet<ProductServer[]>(Service.menu.getAll());

   useEffect(() => {
      if (cargando || error || !data) {
         setMenu([]);
      } else {
         setMenu(data.map(mapProduct));
      }
   }, [cargando]);

   const filtered = menu.filter(i => {
      const categoryMatch = category === "0" || i.category.toString() === category;
      const searchMatch = search ? i.name.toLowerCase().includes(search.toLowerCase()) : true;
      return categoryMatch && searchMatch;
   });

   return (
      <Box overflowX="auto">
         <Text>Busqueda por: <b>{search}</b></Text>
         <Box>
            {
               cargando ? (
                  <Flex
                     justifyContent="center"
                     alignItems="center"
                     minHeight="200px"
                  >
                     <Spinner size="xl" />
                  </Flex>
               ) : error ? (
                  <Text>Error al cargar los datos</Text>
               ) : menu.length === 0 ? (
                  <Text>No hay platillos.</Text>
               ) : (
                  <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={4} mt={4}>
                     {filtered.map(item => {
                        const categoryInfo = categoriasData.find(c => c.id.toString() === item.category.toString()) || { name: "Sin categoria", bg: "#fff", color: "#000" };
                        return (
                           <Card key={item.id}
                              bg={Colors.bg}
                              minWidth={"200px"}
                              maxWidth={{ base: "100%", md: "300px", lg: "350px" }}
                              color={Colors.text}
                              cursor={"pointer"}
                              onClick={() => {
                                 setSelectedItem(item);
                                 onOpenEdit();
                              }}
                           >
                              <CardHeader m={0} p={4} pb={0}>
                                 <Box bg={categoryInfo.bg} width={"fit-content"} px={2} py={1} mt={2} borderRadius={"md"}>
                                    <Text
                                       fontSize="small"
                                       fontWeight={"bold"}
                                       color={categoryInfo.color}
                                    >
                                       {categoryInfo.name}
                                    </Text>
                                 </Box>

                                 <VStack alignItems={"flex-start"} gap={0} mt={2}>
                                    <Text fontSize="lg" fontWeight="bold">{item.name}</Text>

                                    <Text fontSize="md" color={Colors.green} fontWeight={"bold"} textAlign={"left"}>
                                       {item.price.toString() === "0" ?
                                          `$ ${item.price_ch}/${item.price_med}/${item.price_gde}` :
                                          "$ " + item.price
                                       }
                                    </Text>
                                 </VStack>

                              </CardHeader>
                              <CardBody m={0} p={4} pt={0}>
                                 <Text fontSize="sm">{item.description}</Text>
                                 {/* {
                                    (item.ingredients.length > 0) && (
                                       <>
                                          <Text fontSize="sm" mt={2} fontStyle={"italic"} fontWeight={"bold"}>Ingredientes:</Text>
                                          <HStack
                                             alignItems={"flex-start"}
                                             width={"100%"}
                                             flexWrap={"wrap"}
                                             mt={0}
                                             rowGap={1}
                                          >
                                             {item.ingredients.map((ingredient, i) => (
                                                <Text key={"ingredient-" + i} lineHeight={4} fontSize="sm"> {ingredient.name}{i < item.ingredients.length - 1 ? ", " : ""}</Text>
                                             ))}
                                          </HStack>
                                       </>
                                    )
                                 } */}

                                 {/* {
                                    (item.extras.length > 0) && (
                                       <>
                                          <Text fontSize="sm" mt={2} fontStyle={"italic"} fontWeight={"bold"}>Extras:</Text>
                                          <HStack
                                             alignItems={"flex-start"}
                                             width={"100%"}
                                             flexWrap={"wrap"}
                                             mt={0}
                                             rowGap={1}
                                          >
                                             {item.extras.map((extra, i) => (
                                                <Text key={"extra-" + i} lineHeight={4} fontSize="sm"> {extra.name} {i < item.extras.length - 1 ? ", " : ""}</Text>
                                             ))}
                                          </HStack>
                                       </>
                                    )
                                 } */}

                                 {/* {
                                    (item.builds.length > 0) && (
                                       <>
                                          <Text fontSize="sm" mt={2} fontStyle={"italic"} fontWeight={"bold"}>Construcciones:</Text>
                                          <HStack
                                             alignItems={"flex-start"}
                                             width={"100%"}
                                             flexWrap={"wrap"}
                                             mt={0}
                                             rowGap={1}
                                          >
                                             {item.extras.map((extra, i) => (
                                                <Text key={"extra-" + i} lineHeight={4} fontSize="sm"> {extra.name} {i < item.extras.length - 1 ? ", " : ""}</Text>
                                             ))}
                                          </HStack>
                                       </>
                                    )
                                 } */}

                              </CardBody>
                           </Card>
                        )
                     })}
                  </Grid>
               )
            }
         </Box>
      </Box>
   )
}
