import { FormikValues } from "formik";
import Service from "../../../../service/service";
import { BuildsPropsRequest, ExtrasPropsRequest, IngredientsPropsRequest, MenuProps } from "../MenuTypes";

export const SavePlatillo = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    values: FormikValues,
    toast: any,
    platillo: any,
    ingredient: any,
    extras: any,
    builds: any,
) => {
      setLoading(true);
      const response = await platillo.post(
         Service.menu.AddPlatillo.add(),
         {
            category_id: values.category,
            name: values.name,
            price: values.price,
            price_ch: values.price_ch,
            price_med: values.price_med,
            price_gde: values.price_gde,
            description: values.description,
         } as MenuProps
      )

      if (!response?.success) {
         console.error('Error al guardar el platillo:', platillo.error);
         toast({
            title: 'Error al guardar el platillo.',
            status: 'error',
            duration: 3000,
            isClosable: true,
         });
         return;
      }

      const id = response?.response?.id;
      if (!id) {
         console.error('Error al obtener el ID del platillo guardado.');
         toast({
            title: 'Error al obtener el ID del platillo guardado.',
            status: 'error',
            duration: 3000,
            isClosable: true,
         });
         return;
      }

      for (const ingredientId of values.ingredients) {
         const ingredientResponse = await ingredient.post(
            Service.menu.AddPlatillo.ingredients(),
            {
               name: ingredientId.name,
               category_id: values.category,
               menu_id: id,
            } as IngredientsPropsRequest
         );
         if (!ingredientResponse?.success) {
            console.error('Error al guardar el ingrediente:', ingredient.error);
            toast({
               title: 'Error al guardar el ingrediente.',
               status: 'error',
               duration: 3000,
               isClosable: true,
            });
            return;
         }
      }

      for (const extra of values.extras) {
         const ingredientResponse = await extras.post(
            Service.menu.AddPlatillo.extras(),
            {
               name: extra.name,
               price: extra.price,
               menu_id: id,
            } as ExtrasPropsRequest
         );
         if (!ingredientResponse?.success) {
            console.error('Error al guardar el extra:', extras.error);
            toast({
               title: 'Error al guardar el extra.',
               status: 'error',
               duration: 3000,
               isClosable: true,
            });
            return;
         }
      }

      for (const build of values.builds) {
         const ingredientResponse = await builds.post(
            Service.menu.AddPlatillo.builds(),
            {
               menu_id: id,
               name: build.name,
               ingredientsList: build.ingredients.replaceAll(", ", " - "),
               maximo: build.maximo.toString(),
            } as BuildsPropsRequest
         );
         if (!ingredientResponse?.success) {
            console.error('Error al guardar el build:', builds.error);
            toast({
               title: 'Error al guardar el build.',
               status: 'error',
               duration: 3000,
               isClosable: true,
            });
            return;
         }
      }


      toast({
         title: 'Platillo guardado exitosamente.',
         status: 'success',
         duration: 1000,
         isClosable: true,
      });


      setLoading(false);
}