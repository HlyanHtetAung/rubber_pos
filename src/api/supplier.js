exports.getSupplier = async () => {
  const response = await fetch("http://localhost:3001/supplier");
  const suppliers = await response.json();
  return suppliers;
};

exports.addSupplier = async (supplier) => {
  const response = await fetch("http://localhost:3001/supplier", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      supplier_name: supplier.supplier_name,
      address_id: supplier.address_id,
      ph_no: supplier.ph_no,
    }),
  });
  const addedPrice = await response.json();
  return addedPrice;
};

exports.updateSupplier = async (supplier) => {
  const response = await fetch("http://localhost:3001/supplier", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      supplier_id: supplier.supplier_id,
      supplier_name: supplier.supplier_name,
      address_id: supplier.address_id,
      ph_no: supplier.ph_no,
    }),
  });
  const addedPrice = await response.json();
  return addedPrice;
};
