
export type UserRole = "admin" | "editor" | "reader"

export interface CurrentUser {
  name: string
  role: UserRole
}

export const currentUser: CurrentUser = {
  name: "James",
  role: "admin",
}

export const isAdmin = () => currentUser.role === "admin"
