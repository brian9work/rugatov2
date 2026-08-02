import { ProductBuilds, ProductExtras, ProductIngredients } from "../../../../Types";

const initialValues = {
	name: '',
	category: '1',
	price: 0,
	price_ch: 0,
	price_med: 0,
	price_gde: 0,
	description: '',
	ingredients: [] as ProductIngredients[],
	extras: [] as ProductExtras[],
	builds: [] as ProductBuilds[],
};
export default initialValues;