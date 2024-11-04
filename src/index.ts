import http from "http";

type BasketItem = {
  id: string;
  name: string;
  price: number;
};

const basket: BasketItem[] = [];
let basketTotal = 0;

const server = http.createServer(async (req, res) => {
  let requestBody = "";

  const TOKEN = "abcDEF123";

  const sendResponse = (statusCode: number, data: any) => {
    res.writeHead(statusCode);
    res.end(JSON.stringify(data));
  };

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  if (req.url === "/total") {
    console.log(basket);
    sendResponse(200, { total: basketTotal });
  }
  if (req.url?.startsWith("/product")) {
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

    const product =
      products[req.url.split("/")[2] || "noProduct"] || "noProduct"; // no id will be "noProduct", so it's fine to do this

    if (product !== "noProduct") {
      basket.push(product);
      basketTotal += product.price;
      sendResponse(200, { product, total: basketTotal });
    } else {
      sendResponse(404, { message: "Product not found" });
    }
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
