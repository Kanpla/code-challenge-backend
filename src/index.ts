import express from "express";

type BasketItem = {
  id: string;
  name: string;
  price: number;
};

const basket: BasketItem[] = [];
let basketTotal = 0;

const TOKEN = "abcDEF123";

const app = express();

app.get("/total", (req, res) => {
  console.log(basket);
  res.status(200).json({ total: basketTotal });
});

app.post("/product/:id", async (req, res) => {
  console.log("fetching");
  const response = await fetch(
    `https://kanpla-code-challenge.up.railway.app/products/`,
    {
      headers: {
        "X-Auth-User": TOKEN,
      },
    }
  );

  const data = (await response.json()) as {
    id: string;
    name: string;
    vat_rate: number;
    price_unit: number;
  }[];

  const products = data.reduce((acc, item) => {
    function calculatePriceWithVat(price: number, vatRate: number) {
      return 0; //TODO implement
    }
    const itemid = item.id;
    acc[itemid] = {
      id: item.id,
      name: item.name,
      price: calculatePriceWithVat(item.price_unit, item.vat_rate),
    };
    return acc;
  }, {} as Record<string, BasketItem>);
  console.log(products);

  const product = products[req.url.split("/")[2] || "noProduct"] || "noProduct"; // no id will be "noProduct", so it's fine to do this

  if (product !== "noProduct") {
    basket.push(product);
    basketTotal += product.price;
    res.status(200).json({ product, total: basketTotal });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
