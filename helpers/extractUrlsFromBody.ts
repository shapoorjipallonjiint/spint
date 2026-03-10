export function extractUrlsFromBody(obj: any, urls: string[] = []) {

  if (Array.isArray(obj)) {
    obj.forEach(item => extractUrlsFromBody(item, urls));
  }

  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {

      const value = obj[key];

      if (typeof value === "string" && value.includes("dropboxusercontent")) {
        urls.push(value);
      }

      if (typeof value === "object") {
        extractUrlsFromBody(value, urls);
      }
    }
  }

  return urls;
}