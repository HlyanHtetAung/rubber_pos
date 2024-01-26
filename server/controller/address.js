const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAddress = async (req, res, next) => {
  try {
    const address = await prisma.address.findMany({});
    res.status(200).send(address);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postAddress = async (req, res, next) => {
  const address = req.body;
  try {
    const findAddress = await prisma.address.findFirst({
      where: {
        address: address.address,
      },
    });
    if (findAddress) {
      res.status(200).json({
        message: "ရှိပြီးသားဖြစ်၍ထက်ထည့်မရပါ။",
      });
      return;
    }
    const newAddress = await prisma.address.create({
      data: {
        address: address.address,
      },
    });
    res.status(201).send(newAddress);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  const address = req.body;
  try {
    const updateAddress = await prisma.address.update({
      where: {
        address_id: +address.address_id,
      },
      data: {
        address: address.address,
      },
    });
    res.status(200).send(updateAddress);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  const addressId = req.body;
  try {
    const deletedAddress = await prisma.address.delete({
      where: {
        address_id: addressId.address_id,
      },
    });
    res.status(200).send(deletedAddress);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
