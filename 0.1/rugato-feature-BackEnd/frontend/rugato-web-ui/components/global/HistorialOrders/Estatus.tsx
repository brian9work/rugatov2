import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'
import { EstatusType } from '../../../Types'


export default function Estatus({ estatus }: { estatus: EstatusType }) {
    const colorMap: Record<EstatusType, string> = {
        pendiente: Colors.estatus.pendiente,
        preparando: Colors.estatus.preparando,
        listo: Colors.estatus.listo,
        entregado: Colors.estatus.entregado,
        cancelado: Colors.estatus.cancelado,
    }

    const labelMap: Record<EstatusType, string> = {
        pendiente: "Pendiente",
        preparando: "Preparando",
        listo: "Listo",
        entregado: "Entregado",
        cancelado: "Cancelado",
    }

    return (
        // <Box w="100%" display="flex" justifyContent="center">
            <Box
                bg={colorMap[estatus]}
                p={1}
                px={3}
                rounded="md"
                display="inline-block"
                mx={"auto"}
            >
                <Text
                    fontWeight="bold"
                    fontSize="x-small"
                    textTransform="uppercase"
                >
                    {labelMap[estatus]}
                </Text>
            </Box>
        // </Box>

    )
}
