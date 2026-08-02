import React from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/slider/Admin'
import { Box, } from '@chakra-ui/react'
import Expenses from '../../components/admin/Expenses/Expenses';
import Nav from '../../components/global/components/Nav';
import { GrMoney } from 'react-icons/gr';

export default function expenses() {
    return (
        <Box w="100%">
            <Layout>
                <Admin>
                    <Nav
                        icon={<GrMoney />}
                        title="Gastos de hoy"
                        subtitle="Administra los gastos y el dinero en caja"
                    />
                    <Expenses />
                </Admin>
            </Layout>
        </Box>
    )
}
