export function createSlug(text:string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") 
        .replace(/(^-|-$)/g, "") 
}
