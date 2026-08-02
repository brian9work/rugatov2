
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Select, Textarea, Box, VStack, HStack, Heading, Checkbox, Icon, IconButton, Table, Thead, Tr, Th, Tbody, Td, Text, SwitchProps, Switch, Stack, Card, CardHeader, CardBody, Spinner, Flex } from '@chakra-ui/react';
import React from 'react'
import Colors from '../../../contants/Colors';
import Service from '../../../service/service';
import { useGet } from '../../../hooks/GetWithCallback';
import { ProductServer } from '../../../Types';
import categoriasData from '../../data/CategoriesData';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   productId: string;
}

const ViewProduct: React.FC<ModalProps> = ({ isOpen, onClose, productId }) => {
   if (!productId) return null;

   const {
      data,
      loading,
      error,
      refetch,
   } = useGet<ProductServer>(Service.menu.getById(productId));

   if (!data) return null;

   const categoryInfo = categoriasData.find(c => c.id.toString() === data.category_id.toString()) || { name: "Sin categoria", bg: "#fff", color: "#000" };

   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color={Colors.text} borderRadius="md">
            {
               loading ? (
                  <Flex justifyContent="center" alignItems="center" height="100px">
                     <Spinner size="xl" />
                  </Flex>
               ) : error ? (
                  <Text>Error al cargar los datos</Text>
               ) :
                  <>
                     <ModalHeader>
                        <HStack justifyContent="space-between" alignItems="center" w="100%">
                           <Text>
                              Detalle del producto
                           </Text>
                           <Box mr={0}>
                           </Box>
                        </HStack>
                     </ModalHeader>
                     <ModalBody>
                        <Card
                           bg={Colors.bg}
                           minWidth={"200px"}
                           maxWidth={{ base: "100%", md: "300px", lg: "350px" }}
                           color={Colors.text}
                           cursor={"pointer"}
                           onClick={() => {
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
                                 <Text fontSize="lg" fontWeight="bold">{data.name}</Text>

                                 <Text fontSize="md" color={Colors.green} fontWeight={"bold"} textAlign={"left"}>
                                    {data.price.toString() === "0" ?
                                       `$ ${data.price_ch}/${data.price_med}/${data.price_gde}` :
                                       "$ " + data.price
                                    }
                                 </Text>
                              </VStack>

                           </CardHeader>
                           <CardBody m={0} p={4} pt={0}>
                              <Text fontSize="sm">{data.description}</Text>
                              {
                                 (data.ingredients.length > 0) && (
                                    <>
                                       <Text fontSize="sm" mt={2} fontStyle={"italic"} fontWeight={"bold"}>Ingredientes:</Text>
                                       <HStack
                                          alignItems={"flex-start"}
                                          width={"100%"}
                                          flexWrap={"wrap"}
                                          mt={0}
                                          rowGap={1}
                                       >
                                          {data.ingredients.map((ingredient, i) => (
                                             <Text key={"ingredient-" + i} lineHeight={4} fontSize="sm"> {ingredient.name}{i < data.ingredients.length - 1 ? ", " : ""}</Text>
                                          ))}
                                       </HStack>
                                    </>
                                 )
                              }

                              {
                                 (data.extras.length > 0) && (
                                    <>
                                       <Text fontSize="sm" mt={2} fontStyle={"italic"} fontWeight={"bold"}>Extras:</Text>
                                       <HStack
                                          alignItems={"flex-start"}
                                          width={"100%"}
                                          flexWrap={"wrap"}
                                          mt={0}
                                          rowGap={1}
                                       >
                                          {data.extras.map((extra, i) => (
                                             <Text key={"extra-" + i} lineHeight={4} fontSize="sm"> {extra.name} {i < data.extras.length - 1 ? ", " : ""}</Text>
                                          ))}
                                       </HStack>
                                    </>
                                 )
                              }

                              {
                                 (data.builds.length > 0) && (
                                    <>
                                       <Text fontSize="sm" mt={2} fontStyle={"italic"} fontWeight={"bold"}>Construcciones:</Text>
                                       <HStack
                                          alignItems={"flex-start"}
                                          width={"100%"}
                                          flexWrap={"wrap"}
                                          mt={0}
                                          rowGap={1}
                                       >
                                          {data.extras.map((extra, i) => (
                                             <Text key={"extra-" + i} lineHeight={4} fontSize="sm"> {extra.name} {i < data.extras.length - 1 ? ", " : ""}</Text>
                                          ))}
                                       </HStack>
                                    </>
                                 )
                              }

                           </CardBody>
                        </Card>
                     </ModalBody>
                     <ModalFooter display={"flex"} gap={2}>
                        <Button
                           colorScheme="red"
                           onClick={onClose}
                        >
                           Cerrar
                        </Button>
                     </ModalFooter>
                  </>
            }
         </ModalContent>
      </Modal>
   )
}



export default ViewProduct
