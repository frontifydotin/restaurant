"use client"
import { createContext, useContext, useState, useEffect } from "react";

const RestaurantContext = createContext(null);

export const useRestaurant = () => useContext(RestaurantContext);

export const RestaurantContextProvider = ({ children }) => {
  const [menu, setMenu] = useState({});
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isPacked, setIsPacked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({})

  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((response) => response.json())
      .then((data) => {
        setMenu(data);
        setLoading(false);
      });
  }, []);

  const addToCart = (item, size) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.name === item.name && cartItem.size === size
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, price: item[size], size, quantity: 1 }]);
    }
  };

  // const removeFromCart = (itemToRemove) => {
  //   setCart((prevCart) => {
  //     const updatedCart = prevCart
  //       .map((item) =>
  //         item.name === itemToRemove.name && item.size === itemToRemove.size
  //           ? { ...item, quantity: item.quantity - 1 }
  //           : item
  //       )
  //       .filter((item) => item.quantity > 0); // Remove item if quantity reaches 0

  //     return updatedCart;
  //   });
  // };
  const removeFromCart = (itemToRemove) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.name === itemToRemove.name && item.size === itemToRemove.size)
      )
    );
  };
  

  const increaseQuantity = (itemToUpdate) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemToUpdate.name && item.size === itemToUpdate.size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemToUpdate) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.name === itemToUpdate.name && item.size === itemToUpdate.size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove item if quantity reaches 0
    );
  };


  const GST_RATE = 0.05;
  const SERVICE_CHARGE = 30;
  const DELIVERY_CHARGE = 40;
  const PACKING_CHARGE = isPacked ? 20 : 0;

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const gst = subtotal * GST_RATE;
  const totalAmount = subtotal + gst + SERVICE_CHARGE + DELIVERY_CHARGE + PACKING_CHARGE;

  const placeOrder = async () => {
    const orderData = {
      items: cart, total: totalAmount, isPacked, subtotal: subtotal, gst: gst,
      DELIVERY_CHARGE: DELIVERY_CHARGE, PACKING_CHARGE: PACKING_CHARGE, SERVICE_CHARGE: SERVICE_CHARGE
    };

    try {
      const response = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderSuccess(true);
        setCart([]);
        setOrderData(orderData);
        console.log("order data", orderData)
      } else {
        console.error("Order failed");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };


  return (
    <RestaurantContext.Provider
      value={{
        menu,
        cart,
        addToCart,
        totalAmount,
        isPacked,
        setIsPacked,
        placeOrder,
        orderSuccess,
        setOrderSuccess,
        loading,
        subtotal,
        gst,
        SERVICE_CHARGE,
        DELIVERY_CHARGE,
        PACKING_CHARGE,
        orderData,
        removeFromCart,
        increaseQuantity,  // ✅ Add these functions
        decreaseQuantity,  // ✅ Add these functions
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
