export interface AuthUser {
  apikey?: string;
  appName?: string;
  createdAt?: string;
  email: string;
  emailVerified: boolean;
  isAnonymous?: boolean;
  lastLoginAt?: string;
  providerDate?: Array<any>;
  stsTokenManager?:any;
  uid: any;
  photoURL?:string;
  displayName:string;
}

export interface AuthOfUser {
  operationType:string
  providerId:any
  user:AuthOfUser
  _tokenResponse?:any
}