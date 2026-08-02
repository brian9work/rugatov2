import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import Colors from "../../../contants/Colors";
import { FaMoneyBill1Wave } from "react-icons/fa6";

export const ExpenseResume = (
   { type, cant }: { type: "total" | "gasto" | "ingreso", cant: number }
) => {

   const ind = type === "total" ? 0 : type === "gasto" ? 1 : 2;

   const texts = [
      { label: "Total", color: Colors.green },
      { label: "Gastos", color: Colors.red },
      { label: "Ingresos", color: Colors.blue }
   ];

   return (
      <Stack
         bg={Colors.bgSecondary}
         p={2}
         borderRadius="md"
         w={"30%"}
         align={"center"}
         alignItems={"center"}
         flexWrap={"wrap"}
      >
         <Box m={"0 auto"}>
            <FaMoneyBill1Wave
               color={texts[ind].color}
               fontSize={"3rem"}
            />
         </Box>
         <Box m={"0 auto"}>
            <Text textAlign={"center"}>
               {texts[ind].label}
            </Text>
            <Text fontSize={"1.5rem"} fontWeight={"bold"} color={texts[ind].color}>
               $ {cant}
            </Text>
         </Box>
      </Stack>
   )
}