// /utils/tokenUtils.ts
export const isTokenExpired = (expiryDate: Date) => {
    return new Date() > new Date(expiryDate)
}
