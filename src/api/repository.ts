import { env } from "../config/env";
import { TUser } from "../types";

export class Repository {
    // Post/Likes
    static async getLikes(slug: string) {
        return await env.DB.prepare('SELECT id, likes, views FROM Post WHERE slug = ?').bind(slug).first();
    }

    static async getManyLikes() {
        return (await env.DB.prepare('SELECT id, likes, views, slug FROM Post').all()).results;
    }

    static async createLikes(allowDomainId: number, slug: string) {
        await env.DB.prepare('INSERT INTO Post (slug, allowDomainId, updatedAt) VALUES(?1, ?2, ?3)').bind(slug, allowDomainId, new Date().getTime()).run();
    }

    static async updateLikes(slug: string, likes: number) {
        await env.DB.prepare('UPDATE Post SET likes = ?1 WHERE slug = ?2').bind(likes, slug).run();
    }

    static async updateViews(slug: string, views: number) {
        await env.DB.prepare('UPDATE Post SET views = ?1 WHERE slug = ?2').bind(views, slug).run();
    }

    static async deleteLikes(slug: string) {
        await env.DB.prepare('DELETE FROM Post WHERE slug = ?').bind(slug).run();
    }

    // Users
    static async getUser(email: string) {
        return await env.DB.prepare('SELECT id, firstName, lastName, avatar, email FROM User WHERE email = ?').bind(email).first();
    }

    static async getUserAuth(email: string) {
        return await env.DB.prepare('SELECT id, firstName, lastName, password, role FROM User WHERE email = ?').bind(email).first();
    }

    static async getManyUsers() {
        return (await env.DB.prepare('SELECT id, firstName, avatar, email FROM User').all()).results;
    }

    static async createUser({ firstName, lastName, avatar, email, password, allowDomains }: TUser, passwordHash: string) {
        await env.DB.prepare('INSERT INTO User (firstName, lastName, avatar, email, password, role) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(firstName, lastName, avatar, email, passwordHash, 'ADMIN').run();
    }

    static async updateUser(email: string, { firstName, lastName, avatar, password }: TUser) {
        await env.DB.prepare('UPDATE User SET firstName = ?1, lastName = ?2, avatar = ?3, password = ?4 WHERE email = ?5').bind(firstName, lastName, avatar, password, email).run();
    }

    static async deleteUser(email: string) {
        await env.DB.prepare('DELETE FROM User WHERE email = ?').bind(email).run();
    }

    static async getAllowDomain(domain: string) {
        return await env.DB.prepare('SELECT id, domain, userId FROM AllowDomain WHERE domain = ?').bind(domain).first();
    }

    static async getManyAllowDomain() {
        return (await env.DB.prepare('SELECT id, domain, userId FROM AllowDomain').all()).results;
    }

    static async createAllowDomain(domain: string, userId: number) {
        return await env.DB.prepare(`INSERT INTO AllowDomain (domain, userId, updatedAt) VALUES (?1, ?2, ?3)`).bind(domain, userId, new Date().getDate()).run();
    }
}