import React from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/slider/Admin'
import { Box, Text, useBreakpointValue } from '@chakra-ui/react'
import Colors from '../../contants/Colors';

export default function clients() {
    const fontSize = useBreakpointValue({ base: "md", md: "lg" });
    
    return (
        <Box w="100%">
            <Layout>
                <Admin>
                    <Text fontSize={fontSize} color={Colors.text}>Clientes</Text>
                </Admin>
            </Layout>
        </Box>
    )
}
