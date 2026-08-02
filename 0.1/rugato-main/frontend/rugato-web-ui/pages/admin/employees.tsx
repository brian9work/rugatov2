import React from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/slider/Admin'
import Employees from '../../components/admin/Employees/Employes'
import { Box } from '@chakra-ui/react'
import Nav from '../../components/global/components/Nav'
import { FiUsers } from 'react-icons/fi'

export default function employees() {
    return (
        <Box w="100%">
            <Layout>
                <Admin>
                    <Nav
                        icon={<FiUsers />}
                        title="Gestion de empleados"
                        subtitle="Administra los empleados y sus permisos"
                    />
                    <Employees />
                </Admin>
            </Layout>
        </Box>
    )
}
