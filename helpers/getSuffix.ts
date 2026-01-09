export const getSuffix = (value:string) => {
    const str = String(value);
    const match = str.match(/^\d+(.*)$/);
    return match ? match[1] : "";
  };
  