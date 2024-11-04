import express from "express";
import { addToBasket, basketTotal } from "./basket.js";

const app = express();

app.post("/product/:id", async (req, res) => {
  const basketItem = await addToBasket(req.params.id);

  if (basketItem) {
    res.status(200).json({ newItem: basketItem, total: basketTotal });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
