exports.getAddress = async () => {
  const response = await fetch("http://localhost:3001/address");
  const address = await response.json();
  return address;
};

exports.addressName = async (addressName) => {
  const response = await fetch("http://localhost:3001/address", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: addressName,
    }),
  });
  const addedPrice = await response.json();
  return addedPrice;
};

exports.updateAddress = async (addressID, address) => {
  const response = await fetch("http://localhost:3001/address", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address_id: addressID,
      address: address,
    }),
  });
  const addedPrice = await response.json();
  return addedPrice;
};
