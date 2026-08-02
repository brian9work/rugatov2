import React from 'react'
import Layout from '../../components/Layout'
import User from '../../components/slider/User'
import SelectedOrder from '../../components/global/menu/SelectedOrder'
import { Box } from '@chakra-ui/react'

export default function menu() {
    return (
        <Box w="100%">
            <Layout>
                <User>
                    <SelectedOrder />
                </User>
            </Layout>
        </Box>
    )
}
