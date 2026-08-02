import Colors from "../../contants/Colors";

const statusData = [
   { value: "1", label: "Pendiente", color: Colors.estatus.pendiente },
   { value: "2", label: "En Preparacion", color: Colors.estatus.preparando },
   { value: "3", label: "Cancelado", color: Colors.estatus.cancelado },
   { value: "4", label: "Completado", color: Colors.estatus.listo },
   { value: "5", label: "Entregado", color: Colors.estatus.entregado },
];

export const getEstatusLabelById = (value: string) => {
   const status = statusData.find(status => status.value === value);
   return status ? status : { value, label: "Desconocido", color: "#000" };
}
export const getEstatusLabelByName = (label: string) => {
   const status = statusData.find(status => status.label.toLowerCase() === label.toLowerCase());
   return status ? status : { value: "", label: "Desconocido", color: "#000" };
}


export default statusData;