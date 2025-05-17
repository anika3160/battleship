export interface User {
  name: string
  password: string
  id: number
}

const users: User[] = []

export function createUser(name: string, password: string): User {
  const id = users.length + 1
  const user: User = { name, password, id }
  users.push(user)
  return user
}

export function getUserByName(name: string): User | undefined {
  return users.find((u) => u.name === name)
}
