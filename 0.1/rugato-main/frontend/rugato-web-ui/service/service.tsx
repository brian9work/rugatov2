const origin: string = "https://badai.xihmai.com"
// const origin: string = "http://localhost:8082"

const Service = {
    auth: {
        login: () => origin + '/auth/login',
    },
    user: {
        getActive: () => origin + '/user/get/all',
        getType: (type: "user" | "admin" | "cook") => origin + '/user/get/type/' + type,
        getById: (id: number) => origin + '/user/get/' + id,
        add: () => origin + '/user/add',
        update: (id: number) => origin + '/user/update/' + id,
        desactivate: (id: number) => origin + '/user/desactivate/' + id,
        activate: (id: number) => origin + '/user/activate/' + id,
        delete: (id: number) => origin + '/user/delete/' + id,
        getInactive: () => origin + '/user/get/all?active=0',
        getAll: () => origin + '/user/get/all?active=2',
    },
    orders: {
        add: () => origin + '/orders/add',
        getToday: () => origin + '/orders/today',
        getTodayByUser: (userId: string) => origin + '/orders/today/user/' + userId,
        getHistory: () => origin + '/orders/history',
        getAll: () => origin + '/orders/allOrders',
        getByReport: (dateStart?: string, dateEnd?: string, page?: number, size?: number) => origin + '/orders/report?' + (dateStart ? 'startDate=' + dateStart + '&' : '') + (dateEnd ? 'endDate=' + dateEnd + '&' : '') + 'page=' + (page || 0) + '&size=' + (size || 100),
        changeStatus: {
            inPreparation: (id: number) => origin + '/orders/status/in-preparation/' + id,
            canceled: (id: number) => origin + '/orders/status/canceled/' + id,
            completed: (id: number) => origin + '/orders/status/completed/' + id,
            delivered: (id: number) => origin + '/orders/status/delivered/' + id,
            revert: (id: number) => origin + '/orders/status/revert/' + id,
        }
    },
    menu: {
        add: () => origin + '/menu/add',
        getById: (id: string) => origin + '/menu/get/' + id,
        AddPlatillo: {
            add: () => origin + '/menu/add/menu',
            ingredients: () => origin + '/menu/add/ingredients',
            extras: () => origin + '/menu/add/extras',
            builds: () => origin + '/menu/add/builds',
        },
        UpdatePlatillo: {
            platillo: (id: string) => origin + '/menu/update/menu/' + id,
            ingredients: (id: string) => origin + '/menu/update/ingredients/' + id,
            extras: (id: string) => origin + '/menu/update/extras/' + id,
            builds: (id: string) => origin + '/menu/update/builds/' + id,
        },
        DeletePlatillo: {
            platillo: (id: string) => origin + '/menu/delete/menu/' + id,
            ingredients: (id: string) => origin + '/menu/delete/ingredient/' + id,
            extras: (id: string) => origin + '/menu/delete/extra/' + id,
            builds: (id: string) => origin + '/menu/delete/build/' + id,
        },
        getAll: () => origin + '/menu/get/all',
        getCategory: () => origin + '/menu/get/category/',
        getTest: () => origin + '/menu/get/test',
    },
    finances: {
        addCashbox: () => origin + '/financials/cashbox',
        getCashboxToday: () => origin + '/financials/cashbox',
        addExpense: () => origin + '/financials/expense',
        getHistoryExpense: (startDate: string, endDate: string) => origin + `/financials/history/expenses?startDate=${startDate}&endDate=${endDate}`,
        addRevenue: () => origin + '/financials/revenue',
        getHistoryRevenue: (startDate: string, endDate: string) => origin + `/financials/history/revenues?startDate=${startDate}&endDate=${endDate}`,
        getToday: () => origin + '/financials/today',
    },
    table: {
        all: () => origin + '/test/all',
    }
}
export default Service;

