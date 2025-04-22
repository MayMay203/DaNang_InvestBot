export interface ILogin {
  email: string;
  password: string;
}

export interface IOTP {
  email: string;
  otp: string;
}

export interface IUser {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  roleId?: number;
}

export interface IChangePass {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IResetPass{
  newPassword: string;
  confirmPassword: string
}


