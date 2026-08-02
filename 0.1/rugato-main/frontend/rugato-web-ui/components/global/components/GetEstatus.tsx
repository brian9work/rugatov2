import React from 'react'
import { getEstatusLabelByName } from '../../data/EstatusData'
import { Box, Text } from '@chakra-ui/react';

export default function GetEstatus({ value }: { value: string }) {
    const status = getEstatusLabelByName(value);

    if (!status) return null;

    if (value === "") return null;

    return (
        <Box
            bg={status.color}
            p={1}
            px={3}
            rounded="md"
            display="inline-block"
            mx={"auto"}
            width={"fit-content"}
        >
            <Text
                fontWeight="bold"
                fontSize="x-small"
                width={"fit-content"}
                textTransform="uppercase"
            >
                {status.label.replace(" ","_")}
            </Text>
        </Box>
    )
}
