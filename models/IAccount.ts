export interface IChangeStatus{
    id: number,
    status: boolean
}

export interface IRegisterAccount {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    roleId: number
}