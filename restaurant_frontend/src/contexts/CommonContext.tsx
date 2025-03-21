"use client"
import { createContext, useContext, useState, useEffect } from "react";

interface MenuItem {
  name: string;
  full?: number;
  half?: number;
  quarter?: number;
  size?: string;
  price?: number;
  quantity?: number;
}

interface CartItem extends MenuItem {
  size: string;
  price: number;
  quantity: number;
}
interface TotalAmount {
  subtotal: number;
  gst: number;
  SERVICE_CHARGE: number;
  DELIVERY_CHARGE: number;
  PACKING_CHARGE: number;
  total: number;
}
interface RestaurantContextProps {
  menu: Record<string, MenuItem[]>;
  cart: CartItem[];
  addToCart: (item: MenuItem, size: string) => void;
  removeFromCart: (item: CartItem) => void;
  totalAmount: TotalAmount;
  isPacked: boolean;
  setIsPacked: React.Dispatch<React.SetStateAction<boolean>>;
  placeOrder: () => void;
  orderSuccess: boolean;
  setOrderSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  increaseQuantity: (item: CartItem) => void;  // ✅ Added
  decreaseQuantity: (item: CartItem) => void;  // ✅ Added 
  orderData: { // ✅ Add this
    items: CartItem[];
    total: number;
    isPacked: boolean;
    subtotal: number;
    gst: number;
    DELIVERY_CHARGE: number;
    PACKING_CHARGE: number;
    SERVICE_CHARGE: number;
  };
}
const RestaurantContext = createContext<RestaurantContextProps | null>(null);
//const RestaurantContext = createContext(null);

// export const useRestaurant = () => useContext(RestaurantContext);

//export const RestaurantContextProvider = ({ children }) => {
export const RestaurantContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //const [menu, setMenu] = useState({});
  const [menu, setMenu] = useState<Record<string, MenuItem[]>>({});
  //const [cart, setCart] = useState([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isPacked, setIsPacked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<RestaurantContextProps["orderData"]>({
    items: [],
    total: 0,
    isPacked: false,
    subtotal: 0,
    gst: 0,
    DELIVERY_CHARGE: 0,
    PACKING_CHARGE: 0,
    SERVICE_CHARGE: 0,
  });



  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((response) => response.json())
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (item: MenuItem, size: string) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.name === item.name && cartItem.size === size
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      const price = typeof item[size as keyof MenuItem] === "number" ? (item[size as keyof MenuItem] as number) : 0;

      setCart([...cart, { ...item, price, size, quantity: 1 }]);

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


  const removeFromCart = (itemToRemove: CartItem) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.name === itemToRemove.name && item.size === itemToRemove.size)
      )
    );
  };



  const increaseQuantity = (itemToUpdate: CartItem) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemToUpdate.name && item.size === itemToUpdate.size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };


  const decreaseQuantity = (itemToUpdate: CartItem) => {
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
  //const totalAmount = subtotal + gst + SERVICE_CHARGE + DELIVERY_CHARGE + PACKING_CHARGE;
  const totalAmount: TotalAmount = {
    subtotal,
    gst,
    SERVICE_CHARGE,
    DELIVERY_CHARGE,
    PACKING_CHARGE,
    total: subtotal + gst + SERVICE_CHARGE + DELIVERY_CHARGE + PACKING_CHARGE,
  };

  const placeOrder = async () => {
    const orderData = {
      items: cart, total: totalAmount.total, isPacked, subtotal: totalAmount.subtotal, gst: totalAmount.gst,
      DELIVERY_CHARGE: totalAmount.DELIVERY_CHARGE, PACKING_CHARGE: totalAmount.PACKING_CHARGE, SERVICE_CHARGE: totalAmount.SERVICE_CHARGE
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
        // orderData,
        removeFromCart,
        increaseQuantity,  // ✅ Add these functions
        decreaseQuantity,  // ✅ Add these functions
        orderData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a CommonProvider");
  }
  return context;
};