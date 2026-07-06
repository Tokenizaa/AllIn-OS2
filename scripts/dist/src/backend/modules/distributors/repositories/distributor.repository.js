import { BaseRepository } from "../../../infra/database/base.repository";
export class DistribuidorRepository extends BaseRepository {
    constructor() {
        super("mlm.distribuidores");
    }
    async findByAllinId(allinId) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("allin_id", allinId)
            .single();
        if (error)
            throw error;
        return data;
    }
    async findByUsuario(usuario) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("usuario", usuario)
            .single();
        if (error)
            throw error;
        return data;
    }
    async findByEmail(email) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("email", email)
            .single();
        if (error)
            throw error;
        return data;
    }
}
