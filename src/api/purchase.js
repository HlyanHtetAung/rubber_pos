import dayjs from "dayjs";

exports.getPurchase = async (
  year = "",
  month = "",
  supplier_id = "",
  address_id = ""
) => {
  const response = await fetch(
    `http://localhost:3001/purchase/?year=${year}&month=${month}&supplierId=${supplier_id}&addressId=${address_id}&date=`
  );
  const purchase = await response.json();
  return purchase;
};

exports.getPurchaseByDate = async (
  date = "",
  supplier_id = "",
  address_id = ""
) => {
  if (date) {
    date = dayjs(new Date(date)).format("MM/DD/YYYY");
  }
  console.log(date);
  const response = await fetch(
    `http://localhost:3001/purchase/?year=&month=&supplierId=${supplier_id}&addressId=${address_id}&date=${date}`
  );
  const purchase = await response.json();
  return purchase;
};

exports.addPurchase = async (purchaseInfo) => {
  const response = await fetch("http://localhost:3001/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      supplier_id: purchaseInfo.supplier_id,
      tdy_price_id: purchaseInfo.tdy_price_id,
      rubber_pound: purchaseInfo.rubber_pound,
      percentage: purchaseInfo.percentage,
      dry_rubber_pound: purchaseInfo.dry_rubber_pound,
      total_amount: purchaseInfo.total_amount,
      purchase_date: purchaseInfo.purchase_date,
      year: purchaseInfo.year,
      month: purchaseInfo.month,
    }),
  });
  const addedPurchase = await response.json();
  return addedPurchase;
};

exports.deletePurchase = async () => {
  const response = await fetch("http://localhost:3001/purchase", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const deletePurchase = await response.json();
  return deletePurchase;
};

exports.deletePurchaseById = async (id) => {
  const response = await fetch(`http://localhost:3001/purchase/id/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const deletePurchaseById = await response.json();
  return deletePurchaseById;
};
