export const matricNumberPattern = /^UG\d{2}\/OHEKURU\/\d{4}$/i

export function normalizeMatricNo(matricNo: string) {
  return matricNo.trim().toUpperCase()
}

export function isValidMatricNo(matricNo: string) {
  return matricNumberPattern.test(normalizeMatricNo(matricNo))
}
