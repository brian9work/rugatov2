import { Box, IconButton } from "@chakra-ui/react";
import Colors from "../../contants/Colors";
import { FaClock, FaPrint } from "react-icons/fa";
import { GrMoney, GrRevert } from "react-icons/gr";
import { CheckCircleIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { GrEdit } from "react-icons/gr";
import { LuUserX } from "react-icons/lu";

interface ButtonProps {
  onClick: () => void;
  loading?: boolean | false;
}

const ButtonsComponents = {
  View: ({ onClick, loading }: ButtonProps) => (
    <Box bg={Colors.blue} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Ver"
        icon={<ViewIcon />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
  DesactivateUser: ({ onClick, loading }: ButtonProps) => (
    <Box bg={"#ff6600ff"} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Eliminar"
        icon={<LuUserX />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
  Delete: ({ onClick, loading }: ButtonProps) => (
    <Box bg={Colors.red} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Eliminar"
        icon={<DeleteIcon />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
  Complete: ({ onClick, loading }: ButtonProps) => (
    <Box bg={Colors.green} rounded={"md"} px={4}>
      <IconButton
        aria-label="Completar"
        icon={<CheckCircleIcon />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
  Pending: ({ onClick, loading }: ButtonProps) => (
    <Box bg={Colors.blue} rounded={"md"} px={4}>
      <IconButton
        aria-label="Pendiente"
        icon={<CheckCircleIcon />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
  Print: ({ onClick, loading }: ButtonProps) => (
    <Box bg={Colors.yellow} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Imprimir"
        icon={<FaPrint color='#000' />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
  Delivery: ({ onClick, loading }: ButtonProps) => (
    <Box bg={Colors.yellow} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Imprimir"
        icon={<GrMoney color='#000' />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
  Revert: ({ onClick, loading }: ButtonProps) => (
    <Box border={`1px solid ${Colors.red}`} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Revertir"
        icon={<GrRevert color={Colors.red} />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
  Edit: ({ onClick, loading }: ButtonProps) => (
    <Box bg={Colors.yellow} rounded={"md"} w={"40px"}>
      <IconButton
        aria-label="Editar"
        icon={<GrEdit />}
        colorScheme='#0000'
        onClick={onClick}
        isLoading={loading}
      />
    </Box>
  ),
}

export default ButtonsComponents;
