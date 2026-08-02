import { Box, IconButton } from "@chakra-ui/react";
import Colors from "../../contants/Colors";
import { FaPrint } from "react-icons/fa";
import { GrRevert } from "react-icons/gr";
import { CheckCircleIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { GrEdit } from "react-icons/gr";

const ButtonsComponents = {
  View: ({ onClick }: { onClick: () => void }) => (
    <Box bg={Colors.blue} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Ver"
        icon={<ViewIcon />}
        colorScheme='#0000'
        onClick={onClick}
      />
    </Box>
  ),
  Delete: ({ onClick }: { onClick: () => void }) => (
    <Box bg={Colors.red} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Eliminar"
        icon={<DeleteIcon />}
        colorScheme='#0000'
        onClick={onClick}
      />
    </Box>
  ),
  Complete: ({ onClick }: { onClick: () => void }) => (
    <Box bg={Colors.green} rounded={"md"} px={4}>
      <IconButton
        aria-label="Completar"
        icon={<CheckCircleIcon />}
        colorScheme='#0000'
        onClick={onClick}
      />
    </Box>
  ),
  Print: ({ onClick }: { onClick: () => void }) => (
    <Box bg={Colors.yellow} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Imprimir"
        icon={<FaPrint color='#000' />}
        colorScheme='#0000'
        onClick={onClick}
      />
    </Box>
  ),
  Revert: ({ onClick }: { onClick: () => void }) => (
    <Box border={`1px solid ${Colors.red}`} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Revertir"
        icon={<GrRevert color={Colors.red} />}
        colorScheme='#0000'
        onClick={onClick}
      />
    </Box>
  ),
  Edit: ({ onClick }: { onClick: () => void }) => (
    <Box bg={Colors.yellow} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Editar"
        icon={<GrEdit />}
        colorScheme='#0000'
        onClick={onClick}
      />
    </Box>
  ),
}

export default ButtonsComponents;
