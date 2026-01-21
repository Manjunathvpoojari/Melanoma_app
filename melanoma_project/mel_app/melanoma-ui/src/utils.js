export function createPageUrl(page) {
  switch (page) {
    case "Dashboard":
      return "/";
    case "Scanner":
      return "/scanner";
    case "Patients":
      return "/patients";
    case "Reports":
      return "/reports";
    case "History":
      return "/history";
    default:
      return "/";
  }
}
