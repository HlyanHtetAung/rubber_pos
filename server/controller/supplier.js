const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getSupplier = async (req, res, next) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        address: true,
      },
    });
    res.status(200).send(suppliers);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSupplier = async (req, res, next) => {
  const supplier = req.body;
  try {
    const findSupplier = await prisma.supplier.findFirst({
      where: {
        supplier_name: supplier.supplier_name,
      },
    });
    if (findSupplier) {
      res.status(200).json({
        message: "ရှိပြီးသားဖြစ်၍ထက်ထည့်မရပါ။",
      });
      return;
    }
    const createdSupplier = await prisma.supplier.create({
      data: {
        supplier_name: supplier.supplier_name,
        ph_no: supplier.ph_no,
        address_id: +supplier.address_id,
      },
    });
    const newSupplier = await prisma.supplier.findUnique({
      where: {
        supplier_id: createdSupplier.supplier_id,
      },
      include: {
        address: true,
      },
    });
    res.status(201).send(newSupplier);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.updateSupplier = async (req, res, next) => {
  const supplier = req.body;
  try {
    const updatedSupplier = await prisma.supplier.update({
      where: {
        supplier_id: supplier.supplier_id,
      },
      data: {
        supplier_name: supplier.supplier_name,
        ph_no: supplier.ph_no,
        address_id: +supplier.address_id,
      },
    });
    res.status(200).send(updatedSupplier);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
