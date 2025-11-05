export interface UserInfo {
 id: string;
 name: string;
 surname: string;
 email: string;
 password: string;
}

export interface UserToken {
 access_token: string;
 user: UserInfo;
}
