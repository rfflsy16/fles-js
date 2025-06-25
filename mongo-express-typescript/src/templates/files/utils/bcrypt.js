export default `import bcrypt from "bcryptjs"

export const hash = async (
    password: string,
    saltRounds: number = 10
): Promise<string> => {
    return await bcrypt.hash(password, saltRounds)
}

export const compare = async (
    password: string, 
    hash: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}` 