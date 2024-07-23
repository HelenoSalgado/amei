import { AmeiError } from "./Error";
import msg from '../constants'
import { TPost, TUser, TUserAuth } from "../types";
import { auth, getHashPassword } from "../utils/auth";
import { Repository } from "./repository";

const repo = Repository;

export async function authentication({ email, password: passwordInput }: TUserAuth){
   const user = await getUserAuth(email) as TUser;
   const userAuth = {
     id: user.id,
     firstName: user.firstName,
     password: user.password,
     passwordInput
   } as TUserAuth;
   return await auth(userAuth);
}

// Post/Likes
export async function getLikes(slug: string){
    return await repo.getLikes(slug);
}

export async function getManyLikes(){
   return await repo.getManyLikes();
}

export async function createLikes(domain: string, slug: string){
    const allowDomain = await repo.getAllowDomain(domain);
    if(!allowDomain) throw new AmeiError(msg.domainNotFound, 404);
    const likesExist = await repo.getLikes(slug);
    if(likesExist) throw new AmeiError(msg.slugExist, 409);
    const allowDomainId = (await repo.getAllowDomain(domain))?.id as number;
    await repo.createLikes(allowDomainId, slug);
    return await repo.getLikes(slug);
}

export async function updateLikes(slug: string){
    const post = await repo.getLikes(slug) as TPost;
    await repo.updateLikes(slug, post.likes + 1);
    return await repo.getLikes(slug);
}

export async function updateViews(slug: string){
    const post = await repo.getLikes(slug) as TPost;
    await repo.updateViews(slug, post.views + 1);
    return await repo.getLikes(slug);
}

export async function deleteLikes(slug: string){
    await repo.deleteLikes(slug);
    return { statusText: msg.slugDeleted, status: 202 }
}

// Users
export async function getUser(email: string) {
    const user = await repo.getUser(email);
    if(!user) throw new AmeiError(msg.userNotExist, 404);
    return user;
}

export async function getUserAuth(email: string) {
    const user = await repo.getUserAuth(email);
    if(!user) throw new AmeiError(msg.userNotExist, 404);
    return user;
}

export async function getManyUsers() {
    return repo.getManyUsers();
}

export async function createUser(user: TUser) {
    const userExist = await repo.getUser(user.email);
    if(userExist) throw new AmeiError(msg.userExist, 409);
    const domainExist = await repo.getAllowDomain(user.allowDomains.domain);
    if(domainExist) throw new AmeiError('Este domínio já está em uso.', 409);
    const passwordHash = (await getHashPassword(user.password)).password;
    await repo.createUser(user, passwordHash);
    // busca ID do usuário
    const getUser = await repo.getUser(user.email) as TUser;
    // create domain
    await repo.createAllowDomain(user.allowDomains.domain, getUser?.id as number);
    return getUser;
}

export async function updateUser(email: string, user: TUser){
    if(user?.password) user.password = (await getHashPassword(user.password)).password;
    await repo.updateUser(email, user);
    return await repo.getUser(email);
}

export async function deleteUser(email: string) {
    await repo.deleteUser(email);
    return { statusText: msg.userDeleted, status: 202 }
}

// Allow Domains
export async function getAllowDomain(domain: string) {
    return await repo.getAllowDomain(domain);
}

export async function getManyAllowDomain() {
    return await repo.getManyAllowDomain();
}

export async function createAllowDomain(domain: string, userId: number) {
    const domainExist = await repo.getAllowDomain(domain);
    if(domainExist) throw new AmeiError('Este domínio já está em uso.', 409);
    await repo.createAllowDomain(domain, userId);
    return await repo.getAllowDomain(domain);
}
