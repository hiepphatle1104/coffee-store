import { Content, Card, Notfound } from '@/components'
import { useItemContext } from '@/hooks/ItemContext'
import { ItemModel } from 'src/shared/model'
export const All = () => {
  const { items } = useItemContext()
  if (!items) return <Notfound />

  return (
    <Content>
      {items.map((item: ItemModel) => (
        <Card key={item.id} item={item} />
      ))}
    </Content>
  )
}
