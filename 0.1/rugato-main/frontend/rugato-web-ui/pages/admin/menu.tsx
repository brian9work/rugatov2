import React from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/slider/Admin'
import Menu from '../../components/admin/Menu/Menu'
import { Box } from '@chakra-ui/react'
import Nav from '../../components/global/components/Nav'
import { RiDrinksLine } from "react-icons/ri";

export default function menu() {
    return (
        <Box w="100%">
            <Layout>
                <Admin>
                    <Nav
                        icon={<RiDrinksLine />}
                        title="Menu"
                        subtitle="Administra los platillos del menu"
                    />
                    <Menu />
                </Admin>
            </Layout>
        </Box>
    )
}
