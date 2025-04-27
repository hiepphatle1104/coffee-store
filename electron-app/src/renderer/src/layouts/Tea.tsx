import { Card, Content } from '@/components'
import { useItemContext } from '@/hooks/ItemContext'
import { ItemModel } from 'src/shared/model'

export const Tea = () => {
  const { tagsFilter } = useItemContext()
  const items = tagsFilter('tea')

  if (!items) return null

  return (
    <Content>
      {items.map((item: ItemModel) => (
        <Card key={item.id} item={item} />
      ))}
    </Content>
  )
}
