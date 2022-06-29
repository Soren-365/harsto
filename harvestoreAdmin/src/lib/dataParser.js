import { Retailer } from "../lib/retailers.service";

export function parseRetailer(data) {
  let retailer = new Retailer();

  //define cookies size to prefill the retailer.config.cookies array with cookie object
  let cookiesTab = [];
  for (let attr in data) {
    cookiesTab.push(attr);
  }
  const cookiesOnly = cookiesTab.filter((item) => item.includes("cookie"));
  const cookie = { name: "", value: "", domain: "" };
  for (let i = 0; i < cookiesOnly.length / 3; i++) {
    retailer.config.cookies.push(cookie);
  }

  for (let property in data) {
    const splitProperties = property.split(".");

    //name, hostname, discovery and extraction

    console.log('splitProperties[2] : ', splitProperties[2])
    console.log(data[property])

    if (
      splitProperties[2] === "name" ||
      splitProperties[2] === "hostname" ||
      splitProperties[2] === "discovery" ||
      splitProperties[2] === "extraction"
    ) {
      retailer.config[splitProperties[2]] = data[property];
    }

    //selectors part
    if (splitProperties[2] === "selectors") {
      if (splitProperties[4] != "regex") {
        retailer.config.selectors[splitProperties[3]][splitProperties[4]] =
          data[property];
      } else {
        retailer.config.selectors[splitProperties[3]].regex[
          splitProperties[5]
        ] = data[property];
      }
    }

    //cookies part
    if (splitProperties[0] === "cookie") {
      retailer.config.cookies[parseInt(splitProperties[1] - 1)][
        splitProperties[2]
      ] = data[property];
    }

    break;
  }

  return retailer;
}