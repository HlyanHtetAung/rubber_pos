exports.getTdyPrice = async () => {
  const response = await fetch("http://localhost:3001/price");
  const tdy_price = await response.json();
  return tdy_price;
};

exports.addTdyPrice = async (tdy_price) => {
  const response = await fetch("http://localhost:3001/price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tdy_price: tdy_price,
    }),
  });
  const addedPrice = await response.json();
  return addedPrice;
};
