const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getPurchase = async (req, res, next) => {
  const year = req.query.year;
  const month = req.query.month;
  const address_id = req.query.addressId;
  const supplier_id = req.query.supplierId;
  const date = req.query.date;

  try {
    const purchases =
      await prisma.$queryRawUnsafe(`SELECT p.purchase_id, s.supplier_id, s.supplier_name, p.rubber_pound, p.percentage, p.dry_rubber_pound, p.total_amount, tdyPric.tdy_price , DATE_FORMAT(p.purchase_date, "%m/%d/%Y") as purchase_date, p.month, a.address, a.address_id, p.is_print
      FROM purchase as p
      INNER JOIN supplier as s ON s.supplier_id = p.supplier_id 
      INNER JOIN address as a ON s.address_id = a.address_id
      INNER JOIN todayprice as tdyPric ON tdyPric.tdy_price_id = p.tdy_price_id
      WHERE p.year LIKE '%${year}%' 
      AND p.month LIKE '%${month}%' 
      AND DATE_FORMAT(p.purchase_date, "%m/%d/%Y") = COALESCE(NULLIF('${date}', ''), DATE_FORMAT(p.purchase_date, "%m/%d/%Y")) 
      AND s.supplier_id = COALESCE(NULLIF('${supplier_id}', ''), s.supplier_id)   
      AND a.address_id = COALESCE(NULLIF('${address_id}', ''), a.address_id)
      ORDER BY p.purchase_date desc`);
    res.status(200).send(purchases);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postPurchase = async (req, res, next) => {
  const purchase = req.body;
  try {
    const createdPurchase = await prisma.purchase.create({
      data: {
        supplier_id: +purchase.supplier_id,
        tdy_price_id: +purchase.tdy_price_id,
        rubber_pound: parseFloat(purchase.rubber_pound),
        percentage: parseFloat(purchase.percentage),
        dry_rubber_pound: parseFloat(purchase.dry_rubber_pound),
        total_amount: parseFloat(Math.trunc(purchase.total_amount)),
        purchase_date: new Date(purchase.purchase_date),
        year: purchase.year,
        month: purchase.month,
        is_print: 0,
      },
    });
    res.status(201).send(createdPurchase);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.updatePurchase = async (req, res, next) => {
  const purchseList = req.body;
  const purchaseIdList = purchseList.purchaseIdList;
  const updatePurchase = [];
  try {
    purchaseIdList.map(async (purchase) => {
      updatePurchase.push(
        await prisma.purchase.update({
          where: {
            purchase_id: +purchase.purchase_id,
          },
          data: {
            is_print: 1,
          },
        })
      );
    });
    res.status(200).send(updatePurchase);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deletePurchase = async (req, res, next) => {
  try {
    truncateTables();
    res.status(200).send({ message: "deleted successfully" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deletePurchaseById = async (req, res, next) => {
  let id = req.params.id;
  try {
    const deletePurchase = await prisma.purchase.delete({
      where: {
        purchase_id: +id,
      },
    });
    res.status(200).send(deletePurchase);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

async function truncateTables() {
  try {
    // Disable foreign key checks
    await prisma.$executeRaw`SET foreign_key_checks = 0;`;

    // Truncate the tables
    await prisma.$executeRaw`TRUNCATE TABLE purchase_voucher;`;
    await prisma.$executeRaw`TRUNCATE TABLE voucher;`;
    await prisma.$executeRaw`TRUNCATE TABLE purchase;`;
    await prisma.$executeRaw`TRUNCATE TABLE todayprice;`;

    // Enable foreign key checks
    await prisma.$executeRaw`SET foreign_key_checks = 1;`;
  } catch (error) {
    console.error("Error truncating tables:", error);
  } finally {
    // Close Prisma client
    await prisma.$disconnect();
  }
}
