import bcrypt from "bcryptjs";

export async function comparePassword(password: string, pass_database: string) {
  let isCompare = await bcrypt.compare(password, pass_database);
  return isCompare;
}
