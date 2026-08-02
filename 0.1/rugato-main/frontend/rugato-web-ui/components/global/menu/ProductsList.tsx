import React, { useEffect } from 'react'
import { Box, Button, Card, CardBody, CardHeader, Divider, Flex, Grid, HStack, IconButton, Input, Select, Spinner, Stack, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import Colors from '../../../contants/Colors'
import { mapProduct, Product, ProductServer } from '../../../Types'
import AllMenuData from '../../data/AllMenuData'
import categoriasData from '../../data/CategoriesData'
import Service from '../../../service/service'
import { useGet } from '../../../hooks/GetWithCallback'


export default function ProductList(
   { selectCategory, searchTerm, setSelectedItem, onOpenAdd }:
      { selectCategory: string, searchTerm: string, setSelectedItem: React.Dispatch<React.SetStateAction<Product | null>>, onOpenAdd: () => void }
) {
   const [menu, setMenu] = React.useState<Product[]>(AllMenuData)

   const {
      data,
      loading: cargando,
      error: error,
      refetch: refetch,
   } = useGet<ProductServer[]>(Service.menu.getAll());

   const filtered = menu.filter(i => {
      const categoryMatch = selectCategory === "0" || i.category.toString() === selectCategory;
      const searchMatch = searchTerm ? i.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return categoryMatch && searchMatch;
   });

   useEffect(() => {
      if (cargando || error || !data) {
         setMenu([]);
      } else {
         setMenu(data.map(mapProduct));
      }
   }, [cargando]);

   return (
      <Box mt={0}>
         {searchTerm !== "" && (
            <Text mb={2}>Resultados para: <b>{searchTerm}</b></Text>
         )}

         {cargando && <Flex justifyContent="center"><Spinner /></Flex>}

         <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }} gap={4} width={"100%"}>
            {filtered.map(i => (
               <Card
                  key={i.id}
                  bg={Colors.bgSecondary}
                  color={Colors.text}
                  width={"100%"}
                  cursor={"pointer"}
                  p={2}
                  m={0}
                  border={"1px solid"}
                  borderColor={Colors.blue}
                  shadow={"xl"}
                  rounded={"md"}
                  onClick={() => {
                     setSelectedItem(i);
                     onOpenAdd();
                  }}
               >
                  <CardHeader p={0} m={0}>
                     <HStack justifyContent={"space-between"} alignItems={"center"}>
                        <VStack justifyContent={"flex-start"} alignItems={"flex-start"} spacing={0}>
                           <Text fontSize={"lg"} fontWeight={"bold"}>{i.name}</Text>
                           <Box
                              width={"fit-content"}
                              textAlign={"center"}
                              py={0.5}
                              px={2}
                              bg={categoriasData.filter(c => c.id + "" === i.category)[0]?.bg}
                              rounded={"md"}
                              fontWeight={"bold"}
                              color={categoriasData.filter(c => c.id + "" === i.category)[0]?.color}
                           >
                              <Text>{categoriasData.filter(c => c.id + "" === i.category)[0]?.name}</Text>
                           </Box>
                        </VStack>
                        <Box
                           width={"fit-content"}
                           textAlign={"center"}
                           py={0.5}
                           px={2}
                           bg={Colors.blue}
                           rounded={"md"}
                           fontWeight={"bold"}
                        >
                           <Text>${i.price === 0 ? `${i.price_ch}` : i.price}</Text>
                        </Box>
                     </HStack>
                  </CardHeader>
                  <CardBody p={0} mt={1}>
                     <Text noOfLines={3} textOverflow={"ellipsis"} whiteSpace={"nowrap"} overflow={"hidden"}>{i.description}</Text>
                  </CardBody>
               </Card>
            ))}
         </Grid>
      </Box>
   )
}