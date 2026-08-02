import React from 'react'
import Colors from '../../../contants/Colors';

export default function ExtraPricesList() {
   const extraPrices = [0, 5, 10, 15, 20, 25];
   return (
      <>
         {extraPrices.map((price) => (
            <option
               style={{ backgroundColor: Colors.bgSecondary }}
               key={"extra-price-" + price}
               value={price}
            >
               $ {price}
            </option>
         ))}
      </>
   )
}

