const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const corsConfig = {
  origin: ["https://restaurant-seven-weld.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}

app.options("", cors(corsConfig));
app.use(cors(corsConfig));

const menu = {
  "Non Veg Starters": [
    { name: "Butter Chicken (Boneless)", full: 550, half: 330, quarter: 220 },
    { name: "Butter Chicken", full: 500, half: 300, quarter: 200 }
  ],
  "Pure Veg": [
    { name: "Dal Makhani", full: 160 },
    { name: "Shahi Paneer", full: 199 }
  ],
  "Breads": [
    { name: "Butter Naan", full: 40 },
    { name: "Missi Roti", full: 40 }
  ]
};

app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// Order submission endpoint
app.post("/api/order", (req, res) => {
  const { items, total, isPacked, DELIVERY_CHARGE, PACKING_CHARGE, SERVICE_CHARGE } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  console.log("Order Received:", req.body);

  res.status(201).json({
    message: "Order placed successfully",
    orderDetails: { items, total, isPacked, DELIVERY_CHARGE, PACKING_CHARGE, SERVICE_CHARGE }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
