// Route Names
const PURCHASE_PAGE_ROUTE = "purchase";
const REPORT_PAGE_ROUTE = "/report";
const SELLER_ROUTE = "/sellers";
const ADDRESS_ROUTE = "/address";
const PRINT_ROUTE = "/print";
const VOUCHER_ROUTE = "/voucher";
const PREVIEW_VOUCHER_ROUTE = "/previewVoucher";

// Navbar options name
const PURCHASE = "အဝယ်";
const REPORT = "အဝယ်စာရင်း";
const SELLER = "ရောင်းသူစာရင်း";
const ADDRESS = "လိပ်စာစာရင်း";
const VOUCHER = "ဘောင်ချာ";

// for navbar options
const PAGES = [PURCHASE, REPORT, SELLER, ADDRESS, VOUCHER];

// Routing functions
const handleRouting = (pageName) => {
  if (pageName == PURCHASE) {
    return "/";
  }
  if (pageName == REPORT) {
    return REPORT_PAGE_ROUTE;
  }
  if (pageName == SELLER) {
    return SELLER_ROUTE;
  }
  if (pageName == ADDRESS) {
    return ADDRESS_ROUTE;
  }
  if (pageName == VOUCHER) {
    return VOUCHER_ROUTE;
  }
};

export {
  // Routes
  PURCHASE_PAGE_ROUTE,
  REPORT_PAGE_ROUTE,
  SELLER_ROUTE,
  ADDRESS_ROUTE,
  PRINT_ROUTE,
  VOUCHER_ROUTE,
  PREVIEW_VOUCHER_ROUTE,

  // Navbar Options
  PURCHASE,
  REPORT,
  SELLER,
  ADDRESS,
  PAGES,
  VOUCHER,

  // functions
  handleRouting,
};
