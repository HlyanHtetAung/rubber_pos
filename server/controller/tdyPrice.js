const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getTdyPrice = async (req, res, next) => {
  try {
    const latestPrice = await prisma.todayprice.findFirst({
      orderBy: {
        date: "desc",
      },
    });
    res.status(200).send(latestPrice);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postTdyPrice = async (req, res, next) => {
  const tdyPrice = req.body;
  try {
    const addTdyPrice = await prisma.todayprice.create({
      data: {
        tdy_price: parseFloat(tdyPrice.tdy_price),
        date: new Date().toISOString(),
      },
    });
    res.status(201).send(addTdyPrice);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
