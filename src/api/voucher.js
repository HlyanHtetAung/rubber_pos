exports.getVoucher = async (date = "", supplier_id = "") => {
  const response = await fetch(
    `http://localhost:3001/voucher/?date=${date}&supplierId=${supplier_id}`
  );
  const voucher = await response.json();
  return voucher;
};

exports.postVoucher = async (voucher) => {
  const response = await fetch("http://localhost:3001/voucher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      voucher_date: voucher.voucher_date,
      total_amount: voucher.total_amount,
      loan: voucher.loan || 0,
      paid_amount: voucher.paid_amount,
      purchaseIdList: voucher.purchaseIdList,
    }),
  });
  const voucherList = await response.json();
  if (voucherList) {
    const updateIsPrint = async () => {
      const response = await fetch("http://localhost:3001/purchase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseIdList: voucher.purchaseIdList,
        }),
      });
    };
    updateIsPrint();
  }
  return voucherList;
};
