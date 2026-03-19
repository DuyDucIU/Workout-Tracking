export type UnitPreference = 'KG' | 'LBS'

export interface UserDto {
  id: number
  email: string
  username: string
  unitPref: UnitPreference
  createdAt: string
}

export interface UpdateUserRequest {
  username?: string
  unitPref?: UnitPreference
}
