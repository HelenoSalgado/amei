export class AmeiError extends Error{
    public status!: number;
    public statusText!: string;

    constructor(statusText: string, status: number){
        super()
        this.statusText = statusText
        this.status = status
    }

    static exception(statusText: string = "Internal Worker Error", status: number = 500){
        return Response.json({ statusText, status }, { statusText, status });
    }

    
}