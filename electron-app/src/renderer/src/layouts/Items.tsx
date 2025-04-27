import { Button, Text } from '@/components/ui'
import { useItemContext } from '@/hooks/ItemContext'
import { Link } from 'react-router'
import { ItemModel } from 'src/shared/model'

export const Items = () => {
  const { addItem } = useItemContext()

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

  return (
    <div className="h-full flex items-center justify-center">
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
    </div>
  )
}
