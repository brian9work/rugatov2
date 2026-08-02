import React from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/slider/Admin'
import Employes from '../../components/admin/Employes'

export default function employees() {
    return (
        <div>
            <Layout>
                <Admin>
                    <Employes />
                </Admin>
            </Layout>
        </div>
    )
}
