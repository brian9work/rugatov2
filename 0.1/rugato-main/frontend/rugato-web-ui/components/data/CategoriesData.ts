const categoriasData = [
    { id: 1, name: "Licuados combinados", acronym: "Lic. Com.", bg: "#4CAF50", color: "#222222" }, // *
    { id: 2, name: "Licuados sencillos", acronym: "Lic. Sen.", bg: "#FF9800", color: "#222222" }, // *
    { id: 3, name: "Esquimos", acronym: "Esq.", bg: "#03A9F4", color: "#fff" }, // *
    { id: 4, name: "Bebidas Calientes", acronym: "Beb. Cal.", bg: "#795548", color: "#fff" }, // *
    { id: 5, name: "Bocadillos", acronym: "Boc.", bg: "#9C27B0", color: "#fff" }, // *
    { id: 6, name: "Cocteles", acronym: "Coct.", bg: "#F44336", color: "#fff" }, // *
    { id: 7, name: "Jugos Sencillos", acronym: "Jug. Sen.", bg: "#009688", color: "#fff" }, // *
    { id: 8, name: "Jugos Combinados", acronym: "Jug. Com.", bg: "#CDDC39", color: "#222222" }, // *
    { id: 9, name: "Baguete Especial", acronym: "Bag. Esp.", bg: "#607D8B", color: "#fff" },
    { id: 10, name: "Ensaladas", acronym: "Ens.", bg: "#E91E63", color: "#fff" }, // *
    { id: 11, name: "Ensaladas al gusto", acronym: "Ens. Gusto", bg: "#3F51B5", color: "#fff" },
    { id: 12, name: "Aguas sencillas", acronym: "Aguas Sen.", bg: "#00BCD4", color: "#fff" }, // *
    { id: 13, name: "Aguas combinadas", acronym: "Aguas Com.", bg: "#8BC34A", color: "#222222" }, // *
    { id: 14, name: "Sandwiches especiales", acronym: "Sand. Esp.", bg: "#FF5722", color: "#fff" },
    { id: 15, name: "Al gusto", acronym: "Al Gusto", bg: "#111111", color: "#fff" },
]

export const getCategoriaById = (id: number) => {
    const categoria = categoriasData.find(categoria => categoria.id === id);
    return categoria ? categoria : { id, name: "Desconocido", acronym: "Des", bg: "#000", color: "#fff" };
}

export const getCategoriaByName = (name: string) => {
    const categoria = categoriasData.find(categoria => categoria.name.toLowerCase() === name.toLowerCase());
    return categoria ? categoria : { id: 0, name: "Desconocido", acronym: "Des", bg: "#000", color: "#fff" };
}

export default categoriasData;
