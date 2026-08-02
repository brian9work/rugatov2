import React from 'react'
import Layout from '../../components/Layout'
import Kitchen from '../../components/slider/Kitchen'
import HistorialOrders from '../../components/global/HistorialOrders'

export default function orders() {
    return (
        <div>
            <Layout>
                <Kitchen>
                    <HistorialOrders />
                </Kitchen>
            </Layout>
        </div>
    )
}
