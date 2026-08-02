import React from 'react'
import categoriasData from '../../data/CategoriesData'
import Colors from '../../../contants/Colors'

export default function OptionCategoriesData(
  { value }: { value?: string }
) {
  return (
    <>
      {
        value ?
          <option value={value}>{categoriasData.find(c => c.id.toString() === value)?.name}</option>
          :  <option value="0">Todos</option>
      }
      {
        categoriasData.map(categoria => (
          <option
            style={{ background: Colors.bg }}
            key={categoria.id}
            value={categoria.id}
          // onMouseEnter={(e: React.MouseEvent<HTMLOptionElement>) => {
          //   (e.currentTarget as HTMLOptionElement).style.backgroundColor = '#f5f5f5';
          // }}
          // onMouseLeave={(e: React.MouseEvent<HTMLOptionElement>) => {
          //   (e.currentTarget as HTMLOptionElement).style.backgroundColor = Colors.bg;
          // }}
          >
            {categoria.name}
          </option>
        ))
      }
    </>
  )
}
