import { Button, Text } from '@/components/ui'
import { useItemContext } from '@/hooks/ItemContext'
import { useState } from 'react'
import { Link } from 'react-router'
import { ItemModel } from 'src/shared/model'

export const DeleteItem = ({ item, onDelete }: { item: ItemModel; onDelete: () => void }) => {
  const { deleteItem } = useItemContext()
  return (
    <section className="w-full flex items-center justify-between border rounded border-neutral-300 px-2 py-1">
      <Text size="sm" className="font-medium">
        {item?.name} - {item?.price}
      </Text>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          deleteItem(item)
          onDelete()
        }}
        className="transition-all duration-200 ease-in-out cursor-pointer bg-neutral-900 hover:bg-neutral-700 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </section>
  )
}

export const Items = () => {
  const { addItem, items } = useItemContext()
  const [deleteItems, setDeleteItems] = useState<ItemModel[]>([])

  const handleSubmit = async () => {
    const formData = new FormData(document.querySelector('form') as HTMLFormElement)
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const tags = formData.get('tags') as string
    const imageUrl = formData.get('image_url') as string
    console.log(tags)

    const itemData: ItemModel = {
      name,
      price: parseFloat(price),
      tags: tags.split(' ').map((tag) => tag.trim()),
      image: imageUrl
    }

    await addItem(itemData)
  }

  const handleFind = () => {
    const formData = new FormData(document.querySelector('#delete-item-form') as HTMLFormElement)
    const name = formData.get('delete-item-name') as string

    const item = items.filter(
      (item: ItemModel) => item.name.toLowerCase() === name.trim().toLowerCase()
    )

    if (!item || item.length === 0) alert('Item not found')
    setDeleteItems(item)
  }

  return (
    <div className="h-full flex items-center justify-center gap-10">
      <div className="h-fit w-96 bg-white rounded shadow border border-neutral-200 p-3">
        <Text size="lg" className="font-medium">
          New Item
        </Text>

        <div className="border border-neutral-200" />

        <form className="flex flex-col gap-2 mt-3" action={handleSubmit}>
          <section className="w-full">
            <Text size="sm" className="font-medium">
              Name
            </Text>
            <input
              name="name"
              id="name"
              type="text"
              className="border border-neutral-200 rounded p-2 w-full mt-1"
              placeholder="Enter item name"
            />
          </section>

          <section className="w-full">
            <Text size="sm" className="font-medium">
              Price
            </Text>
            <input
              name="price"
              id="price"
              type="text"
              className="border border-neutral-200 w-full mt-1 rounded p-2"
              placeholder="Enter item name"
            />
          </section>

          <section className="w-full">
            <Text size="sm" className="font-medium">
              Tags
            </Text>
            <input
              name="tags"
              id="tags"
              type="text"
              className="border border-neutral-200 w-full mt-1 rounded p-2"
              placeholder="Enter item name"
            />
          </section>

          <section className="w-full">
            <Text size="sm" className="font-medium">
              Image Url
            </Text>
            <input
              name="image_url"
              id="image_url"
              type="text"
              className="border border-neutral-200 w-full mt-1 rounded p-2"
              placeholder="Enter item name"
            />
          </section>

          <div className="flex w-full gap-2 mt-2">
            <Link to="/admin/orders" className="w-full">
              <Button className="w-full">Back</Button>
            </Link>
            <div className="w-full">
              <Button className="w-full" type="submit">
                New
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white w-96 p-3 rounded h-fit">
        <Text size="lg" className="font-medium">
          Delete Item
        </Text>

        <div className="border border-neutral-200" />

        <form action={handleFind} id="delete-item-form">
          <Text size="sm" className="font-medium">
            Name
          </Text>

          <section className="flex gap-2">
            <input
              name="delete-item-name"
              id="delete-item-name"
              type="text"
              className="border border-neutral-200 rounded p-2 w-full mt-1"
              placeholder="Enter item name"
            />

            <Button type="submit">Find</Button>
          </section>
        </form>

        <div className="space-y-2 mt-3">
          {deleteItems?.map((item: ItemModel) => (
            <DeleteItem
              key={item.id}
              item={item}
              onDelete={() => {
                setDeleteItems((prev) => prev.filter((i) => i.id !== item.id))
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
