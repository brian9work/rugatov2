import { Badge, Box, Text } from '@chakra-ui/react';
import React from 'react'
import Colors from '../../../contants/Colors';

export default function LongAgo({ time }: { time: string }) {
    const today = new Date();
    // const date = new Date(time);
    const date = new Date(time.replace(' ', 'T') + 'Z');
    const diff = Math.floor((today.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return (
        <Box
            width={"fit-content"}
            mx="auto"
            background={"gray.900"}
            py={1}
            px={2}
            rounded="md"
            textAlign="center"
            color={
                minutes <= 10 ? Colors.green :
                    minutes <= 20 ? Colors.yellow :
                        Colors.red
            }
        >
            <Text
                fontWeight={"bold"}
                fontSize={"lg"}
            >{minutes > 0 ? <span>{minutes}m. </span> : "0m."}</Text>
        </Box>
    )
}

