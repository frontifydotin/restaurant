"use client"
import { useRestaurant } from "@/contexts/CommonContext";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import Accordion from "@/components/Accordion";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

export default function RestaurantApp() {
  const { menu, cart, addToCart, totalAmount, isPacked, setIsPacked,
    placeOrder, orderSuccess, setOrderSuccess, loading,
    removeFromCart,
    increaseQuantity,  // ✅ Add these functions
    decreaseQuantity,  // ✅ Add these functions
  } = useRestaurant();
  console.log("first placeorder", cart)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Restaurant Menu</h1>
      {loading ? (
        <Loader />
      ) : (
        Object.entries(menu).map(([category, items]) => (
          <Accordion key={category} title={category}>
            {items.map((item, index) => (
              <Card key={index} className="mb-4">
                <CardContent>
                  <span>{item.name}</span>
                  <div className="flex justify-between mt-2">
                    {item.full && <Button onClick={() => addToCart(item, 'full')}>Full - ₹{item.full}</Button>}
                    {item.half && <Button onClick={() => addToCart(item, 'half')}>Half - ₹{item.half}</Button>}
                    {item.quarter && <Button onClick={() => addToCart(item, 'quarter')}>Quarter - ₹{item.quarter}</Button>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </Accordion>
        ))
      )}

      <h2 className="text-xl font-bold mt-6">Cart</h2>
      {cart.length === 0 && <p>No items in cart</p>}
      {cart.map((item, index) => (
        <Card key={index} className="mb-2">
          <CardContent>
            <p>{item.name} ({item.size}) - ₹{item.price} x {item.quantity}</p>
            <Button className="bg-red-500 text-white px-3 py-1" onClick={() => removeFromCart(item)}>Remove</Button>
            <div className="flex items-center space-x-2">
              <Button className="bg-gray-300 text-black px-2 py-1" onClick={() => decreaseQuantity(item)}>-</Button>
              <span>{item.quantity}</span>
              <Button className="bg-blue-500 text-white px-2 py-1" onClick={() => increaseQuantity(item)}>+</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {cart.length > 0 && (
        <>
          <h3 className="text-lg font-bold mt-4">Subtotal: ₹{totalAmount.subtotal.toFixed(2)}</h3>
          {isPacked && <p>Packing Charge: ₹{totalAmount.PACKING_CHARGE}</p>}

          <label className="flex items-center mt-2">
            <input type="checkbox" checked={isPacked} onChange={() => setIsPacked(!isPacked)} className="mr-2" />
            Add Packing Charge (₹20)
          </label>
          <Button className="mt-4" onClick={placeOrder}>Place Order</Button>
        </>
      )}

      <Modal
        show={orderSuccess}
        onClose={() => setOrderSuccess(false)}
        orderDetails={{
          items: cart,
          subtotal: totalAmount.subtotal,
          total: totalAmount.total,
          isPacked,
          gst: totalAmount.gst,
          SERVICE_CHARGE: totalAmount.SERVICE_CHARGE,
          DELIVERY_CHARGE: totalAmount.DELIVERY_CHARGE,
          PACKING_CHARGE: totalAmount.PACKING_CHARGE
        }}
      />


    </div>
  );
}
