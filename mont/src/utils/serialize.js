// BigInt를 문자열로 변환하는 재귀 함수
export function serializeBigIntDeep(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigIntDeep);
  }

  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = serializeBigIntDeep(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}
