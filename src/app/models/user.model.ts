/**
 * User avatar interface
 * @description Kullanıcı avatar bilgisi
 */
export interface IUserAvatar {
 /** Kullanıcı ID */
 id: string;
 /** Avatar resim URL'i */
 image?: string;
 /** Kullanıcı adı (baş harfler için) */
 name?: string;
}

/**
 * Role interface
 * @description Kullanıcı rolü tanımı
 */
export interface IRole {
 /** Rol benzersiz kimliği */
 id: string;
 /** Rol adı */
 name: string;
 /** Rol açıklaması */
 description?: string;
 /** Rolün sahip olduğu izinler (permission ID'leri) */
 permissions: string[];
 /** Rol aktif mi? */
 isActive?: boolean;
 /** Rol oluşturulma tarihi */
 createdAt?: Date;
 /** Rol güncellenme tarihi */
 updatedAt?: Date;

 /** Rolün sahip olduğu kullanıcılar */
 users?: UserInfo[];

 /** Varsayılan rol mü? */
 isDefault?: boolean;
}

/**
 * User information interface
 * @description Kullanıcı bilgileri
 */
export interface UserInfo {
 /** Kullanıcı benzersiz kimliği */
 id: string;
 /** Kullanıcı adı */
 name: string;
 /** Kullanıcı soyadı */
 surname: string;
 /** Kullanıcı e-posta adresi */
 email: string;
 /** Kullanıcı şifresi (sadece kayıt/giriş için) */
 password?: string;
 /** Kullanıcının rolleri */
 roles?: IRole[];
 /** Kullanıcının doğrudan atanmış izinleri (rollerden bağımsız) */
 permissions?: string[];
 /** Kullanıcı aktif mi? */
 isActive?: boolean;
 /** Şube ID (branch scope için) */
 branchId?: string;
 /** Kullanıcı oluşturulma tarihi */
 createdAt?: Date;
 /** Kullanıcı güncellenme tarihi */
 updatedAt?: Date;
 /** Kullanıcı avatar resmi */
 image?: string;
}

/**
 * User token interface
 * @description JWT token ve kullanıcı bilgileri
 */
export interface UserToken {
 /** JWT access token */
 access_token: string;
 /** Kullanıcı bilgileri */
 user: UserInfo;
 /** Token süresi (opsiyonel) */
 expiresIn?: number;
 /** Refresh token (opsiyonel) */
 refresh_token?: string;
}
