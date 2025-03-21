"use client"
import { useEffect } from "react";
import { useRestaurant } from "@/contexts/CommonContext";

import React from "react";
import Button from "./Button";

interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
}
interface ModalProps {
  show: boolean;
  onClose: () => void;
  orderDetails: {
    items: OrderItem[];
    subtotal: number;
    total: number;
    isPacked: boolean;
    gst: number;
    SERVICE_CHARGE: number;
    DELIVERY_CHARGE: number;
    PACKING_CHARGE: number;
  };
}

const Modal: React.FC<ModalProps> = ({ show, onClose }) => {
   const { menu, cart, addToCart, totalAmount, isPacked, setIsPacked, 
      placeOrder, orderSuccess, setOrderSuccess, loading, orderData
      
     } = useRestaurant();

  // useEffect(() => {
  //   if (show) {
  //     console.log("Order Details in Modal:", orderDetails);
  //   }
  // }, [show], orderDetails.items);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,_0,_0,_0.5)] bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3 relative">
        <button className="absolute top-2 right-2" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4">Order Success</h2>
        <p>You have ordered these items:</p>
        {/* <p>{orderDetails}</p> */}
        <ul className="mt-2">
          {orderData.items.length > 0 ? (
            orderData.items.map((item, index) => (
              <li key={index}>
                {item.name} ({item.size}) - ₹{item.price} x {item.quantity}
              </li>
            ))
            
          ) : (
            <p>No items found.</p>
          )}
        </ul>

        <div className="mt-4 border-t pt-2">
          <p><strong>Subtotal:</strong> ₹{orderData.subtotal.toFixed(2)}</p>
          <p><strong>GST (5%):</strong> ₹{orderData.gst.toFixed(2)}</p>
          <p><strong>Service Charge:</strong> ₹{orderData.SERVICE_CHARGE}</p>
          <p><strong>Delivery Charge:</strong> ₹{orderData.DELIVERY_CHARGE}</p>
          {isPacked && <p><strong>Packing Charge:</strong> ₹{orderData.PACKING_CHARGE}</p>}
          <h3 className="text-lg font-bold mt-2">Total: ₹{orderData.total.toFixed(2)}</h3>
        </div>

        <Button className="mt-4" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default Modal;
