import React, { useEffect } from 'react'
import ingredientesData from './IngredientesData'
import { Box, Button, HStack, Input, List, ListItem, Text, } from '@chakra-ui/react'
import Colors from '../../../contants/Colors';

export default function SearchIngrediente(
   { selectedIngredient, setSelectedIngredient }:
      { selectedIngredient: any[]; setSelectedIngredient: (ingredientes: any[]) => void }
) {
   const [ingredient, setIngredient] = React.useState("");

   return (
      <Box>
         <Text fontWeight={"600"}>Agregar Ingrediente</Text>
         <HStack mt={2}>
            <Input
               placeholder='Agregar ingrediente'
               onChange={(e) => setIngredient(e.target.value)}
               value={ingredient}
            />
            <Button
               border={"1px solid"}
               borderColor={Colors.yellow}
               background={"#0000"}
               _hover={{ transform: "scale(1.05)" }}
               textColor={Colors.yellow}
               px={8}
               onClick={() => {
                  setSelectedIngredient([...selectedIngredient, ingredient]);
                  setIngredient("");
               }}>
               Agregar
            </Button>
         </HStack>
      </Box>
   )
}
