const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();
const uuidv1 = require("uuid").v1;

exports.getVoucher = async (req, res, next) => {
  const supplier_id = req.query.supplierId;
  const voucher_date = req.query.date;

  try {
    if (supplier_id && voucher_date) {
      const voucherDetail = await prisma.voucher.findMany({
        orderBy: [
          {
            voucher_date: "desc",
          },
        ],
        where: {
          voucher_date: {
            gte: new Date(voucher_date),
          },
          purchase_voucher: {
            every: {
              purchase: {
                supplier_id: +supplier_id,
              },
            },
          },
        },

        include: {
          purchase_voucher: {
            orderBy: {
              purchase: {
                purchase_date: "asc",
              },
            },
            include: {
              purchase: {
                include: {
                  supplier: {},
                  todayprice: {},
                },
              },
            },
          },
        },
      });
      res.status(200).send(voucherDetail);
      return;
    }
    if (voucher_date) {
      const voucherDetail = await prisma.voucher.findMany({
        orderBy: [
          {
            voucher_date: "desc",
          },
        ],
        where: {
          voucher_date: {
            gte: new Date(voucher_date),
          },
        },

        include: {
          purchase_voucher: {
            orderBy: {
              purchase: {
                purchase_date: "asc",
              },
            },
            include: {
              purchase: {
                include: {
                  supplier: {},
                  todayprice: {},
                },
              },
            },
          },
        },
      });
      res.status(200).send(voucherDetail);
      return;
    }
    if (supplier_id) {
      const voucherDetail = await prisma.voucher.findMany({
        orderBy: [
          {
            voucher_date: "desc",
          },
        ],
        where: {
          purchase_voucher: {
            every: {
              purchase: {
                supplier_id: +supplier_id,
              },
            },
          },
        },

        include: {
          purchase_voucher: {
            orderBy: {
              purchase: {
                purchase_date: "asc",
              },
            },
            include: {
              purchase: {
                include: {
                  supplier: {},
                  todayprice: {},
                },
              },
            },
          },
        },
      });
      res.status(200).send(voucherDetail);
      return;
    }
    const voucherDetail = await prisma.voucher.findMany({
      orderBy: [
        {
          voucher_date: "desc",
        },
      ],
      include: {
        purchase_voucher: {
          orderBy: {
            purchase: {
              purchase_date: "asc",
            },
          },
          include: {
            purchase: {
              include: {
                supplier: {},
                todayprice: {},
              },
            },
          },
        },
      },
    });
    res.status(200).send(voucherDetail);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postVoucher = async (req, res, next) => {
  const purchaseList = req.body;
  const voucherID = uuidv1();
  const purchaseVoucher = purchaseList.purchaseIdList.map((el) => ({
    ...el,
  }));
  try {
    const newVoucher = await prisma.voucher.create({
      data: {
        voucher_id: voucherID,
        voucher_date: new Date(purchaseList.voucher_date),
        total_amount: parseFloat(purchaseList.total_amount),
        loan: parseFloat(purchaseList.loan),
        paid_amount: parseFloat(purchaseList.paid_amount),
        purchase_voucher: {
          create: purchaseVoucher,
        },
      },
    });
    res.status(201).send(newVoucher);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
