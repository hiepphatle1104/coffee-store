import { Admin, Coffee, Food, Home, Main, Tea, All, Orders, Items, Payments } from '@/layouts'
import { Error } from '@/components'
import { Route, Routes } from 'react-router'

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<Main />}>
          <Route path="/home/all" element={<All />} />
          <Route path="/home/food" element={<Food />} />
          <Route path="/home/coffee" element={<Coffee />} />
          <Route path="/home/tea" element={<Tea />} />
        </Route>

        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<Admin />}>
          <Route index path="orders" element={<Orders />} />
          <Route index path="items" element={<Items />} />
          <Route index path="payments" element={<Payments />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  )
}

export default App
