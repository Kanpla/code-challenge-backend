export const basket: BasketItem[] = [];
export let basketTotal = 0;

type BasketItem = {
  id: string;
  name: string;
  price: number;
};

const TOKEN = "abcDEF123";

export async function addToBasket(
  productId: string
): Promise<BasketItem | null> {
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

  const product = products[productId];
  if (!product) {
    return null;
  }

  basket.push(product);
  basketTotal += product.price;
  return product;
}
