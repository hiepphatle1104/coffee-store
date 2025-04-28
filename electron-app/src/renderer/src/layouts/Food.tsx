import { Card, Content, Notfound } from '@/components'
import { useItemContext } from '@/hooks/ItemContext'
import { ItemModel } from 'src/shared/model'

export const Food = () => {
  const { tagsFilter } = useItemContext()
  const items = tagsFilter('food')

  if (!items || items.length === 0) return <Notfound />

  return (
    <Content>
      {items.map((item: ItemModel) => (
        <Card key={item.id} item={item} />
      ))}
    </Content>
  )
}
